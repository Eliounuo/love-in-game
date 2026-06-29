import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { parseAdminMessage, tryRegex } from "@/lib/ai-agent";
import type { AgentResult } from "@/lib/ai-agent";

const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

async function sendTG(chatId: number | string, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

const ENTITY_TABLE: Record<string, string> = {
  pricing: "pricing", game: "games", games: "games",
  promotion: "promotions", promotions: "promotions",
  event: "events", events: "events",
  contact: "contacts", contacts: "contacts",
  gallery: "gallery",
  setting: "settings", settings: "settings",
  menu_item: "menu_items", menu_items: "menu_items",
  menu_category: "menu_categories", menu_categories: "menu_categories",
  faq_item: "faq_items", faq: "faq_items",
};

const NATURAL_KEY: Record<string, string> = {
  pricing: "name", games: "title", events: "title",
  promotions: "title", contacts: "type", settings: "key",
  menu_items: "name", menu_categories: "key", faq_items: "question",
};

async function uploadTelegramPhoto(
  fileId: string,
  db: ReturnType<typeof createServerClient>
): Promise<string | null> {
  const getFileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
  const fileData = await getFileRes.json();
  if (!fileData.ok) return null;
  const filePath: string = fileData.result.file_path;

  const fileRes = await fetch(`https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`);
  const buffer = await fileRes.arrayBuffer();
  const ext = filePath.split(".").pop() ?? "jpg";
  const name = `uploads/${Date.now()}.${ext}`;

  const { error } = await db.storage.from("photos").upload(name, buffer, {
    contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
  });
  if (error) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/photos/${name}`;
}

async function executeResult(
  result: AgentResult,
  db: ReturnType<typeof createServerClient>
): Promise<string> {
  if (result.type === "chat") return result.message;

  const table = ENTITY_TABLE[result.entity] ?? result.entity;
  const { payload } = result;

  if (result.action === "add") {
    const { error } = await db.from(table).insert(payload);
    if (!error) revalidatePath("/");
    return error ? `❌ ${error.message}` : `✅ Добавлено`;
  }

  if (result.action === "update") {
    const raw = payload as Record<string, unknown>;
    const { id, ...rest } = raw as { id?: string } & Record<string, unknown>;

    if (id) {
      const { error } = await db.from(table).update(rest).eq("id", id);
      if (!error) revalidatePath("/");
      return error ? `❌ ${error.message}` : `✅ Обновлено`;
    }

    const naturalCol = NATURAL_KEY[table];
    const naturalVal = naturalCol ? ((rest[naturalCol] as string | undefined)?.trim()) : undefined;

    if (naturalCol && naturalVal) {
      const { [naturalCol]: _k, ...updateData } = rest as Record<string, unknown>;
      if (Object.keys(updateData).length === 0) return "❌ Нечего обновлять";

      const { data: updated, error } = await db.from(table)
        .update(updateData)
        .ilike(naturalCol, naturalVal)
        .select();

      if (error) return `❌ ${error.message}`;
      if (!updated || updated.length === 0) {
        const { data: rows } = await db.from(table).select(naturalCol).limit(10);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const available = rows?.map((r: any) => r[naturalCol]).join(", ") ?? "—";
        return `⚠️ "${naturalVal}" не найдено.\nЕсть: ${available}`;
      }
      revalidatePath("/");
      return `✅ Обновлено`;
    }
    return "❌ Укажи название";
  }

  if (result.action === "delete") {
    const { id } = payload as { id: string };
    const { error } = await db.from(table).delete().eq("id", id);
    if (!error) revalidatePath("/");
    return error ? `❌ ${error.message}` : `✅ Удалено`;
  }

  if (result.action === "activate" || result.action === "deactivate") {
    const raw = payload as Record<string, unknown>;
    const active = result.action === "activate";
    const { id, ...rest } = raw as { id?: string } & Record<string, unknown>;
    if (id) {
      const { error } = await db.from(table).update({ active }).eq("id", id);
      if (!error) revalidatePath("/");
      return error ? `❌ ${error.message}` : `✅ ${active ? "Активировано" : "Деактивировано"}`;
    }
    const naturalCol = NATURAL_KEY[table];
    const naturalVal = naturalCol ? ((rest[naturalCol] as string | undefined)?.trim()) : undefined;
    if (naturalCol && naturalVal) {
      const { error } = await db.from(table).update({ active }).ilike(naturalCol, naturalVal);
      if (!error) revalidatePath("/");
      return error ? `❌ ${error.message}` : `✅ ${active ? "Активировано" : "Деактивировано"}`;
    }
    return "❌ Укажи название";
  }

  return "❌ Неизвестное действие";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return new Response("Bad request", { status: 400 }); }

  const message = (body.message ?? body.edited_message) as {
    chat?: { id?: number };
    text?: string;
    caption?: string;
    photo?: { file_id: string; width: number; height: number }[];
  } | undefined;

  if (!message?.chat?.id) return new Response("OK");

  const chatId = message.chat.id;
  if (ADMIN_CHAT_ID && String(chatId) !== ADMIN_CHAT_ID) {
    await sendTG(chatId, "⛔ Нет доступа.");
    return new Response("OK");
  }

  const db = createServerClient();

  // ── Photo upload ───────────────────────────────────────────────────────────
  if (message.photo && message.photo.length > 0) {
    await sendTG(chatId, "⏳ Загружаю фото...");
    const largest = message.photo[message.photo.length - 1];
    const url = await uploadTelegramPhoto(largest.file_id, db);

    if (!url) {
      await sendTG(chatId, "❌ Не удалось загрузить фото");
      return new Response("OK");
    }

    const caption = (message.caption ?? "").trim();

    if (caption) {
      try {
        const result = await parseAdminMessage(`${caption} url: ${url}`);
        if (result && result.type === "command") {
          const reply = await executeResult(result, db);
          await sendTG(chatId, `${reply}\n📷 ${url}`);
          return new Response("OK");
        }
      } catch { /* fall through */ }
    }

    await sendTG(chatId,
      `✅ Фото загружено!\n\n📷 URL:\n<code>${url}</code>\n\n` +
      `Скажи что обновить:\n` +
      `• <i>обложка игры Elden Ring</i>\n` +
      `• <i>фото категории пицца</i>\n` +
      `• <i>добавь в галерею</i>`
    );
    return new Response("OK");
  }

  const text = message.text?.trim();
  if (!text) return new Response("OK");

  if (text === "/start" || text === "/help") {
    await sendTG(chatId,
      `🎮 <b>Love in Game — AI Администратор</b>\n\n` +
      `Я понимаю свободные команды на русском:\n\n` +
      `<b>💰 Тарифы:</b>\n• Измени цену Стандарт на 2500\n• Сделай Вечерний популярным\n\n` +
      `<b>🎮 Игры:</b>\n• Добавь игру Elden Ring жанр RPG\n• Убери игру GTA V\n\n` +
      `<b>🍕 Меню:</b>\n• Измени цену Маргариты на 2390\n• Добавь блюдо Карбонара цена 2490\n• Убери Борщ из меню\n\n` +
      `<b>❓ FAQ:</b>\n• Добавь вопрос про Wi-Fi скорость\n• Измени ответ про бронирование\n\n` +
      `<b>📞 Контакты:</b>\n• Измени телефон на +7 701...\n• Измени часы работы на 9:00-3:00\n\n` +
      `<b>📸 Фото:</b>\nОтправь фото с подписью:\n<i>"обложка игры FIFA 26"</i>\n<i>"фото категории пицца"</i>\n<i>"добавь в галерею"</i>`
    );
    return new Response("OK");
  }

  await sendTG(chatId, "⏳ Думаю...");

  // 1. Gemini first
  let result: AgentResult | null = null;
  try {
    result = await parseAdminMessage(text);
  } catch (err) {
    const errMsg = String(err);
    if (errMsg.includes("GEMINI_API_KEY")) {
      await sendTG(chatId, "⚠️ GEMINI_API_KEY не установлен.\n\naistudio.google.com → Get API Key");
      return new Response("OK");
    }
    // 2. Regex fallback
    result = tryRegex(text);
    if (!result) {
      await sendTG(chatId, `❌ AI недоступен: ${errMsg.slice(0, 150)}`);
      return new Response("OK");
    }
  }

  if (!result) {
    await sendTG(chatId, "❌ Не понял. Попробуй /help");
    return new Response("OK");
  }

  try {
    const reply = await executeResult(result, db);
    await sendTG(chatId, reply);
  } catch (err) {
    await sendTG(chatId, `❌ Ошибка: ${String(err).slice(0, 200)}`);
  }

  return new Response("OK");
}