import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { parseAdminMessage, tryRegex } from "@/lib/ai-agent";
import type { AgentResult } from "@/lib/ai-agent";

const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function sendTG(chatId: number | string, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

const NATURAL_KEY: Record<string, string> = {
  pricing: "name", games: "title", events: "title",
  promotions: "title", contacts: "type", settings: "key",
};

async function executeResult(result: AgentResult, db: ReturnType<typeof createServerClient>): Promise<string> {
  if (result.type === "chat") return result.message;

  const { entity, payload } = result;
  const table =
    entity === "contact" ? "contacts" : entity === "setting" ? "settings"
    : entity === "event" ? "events" : entity === "gallery" ? "gallery"
    : entity === "game" ? "games" : entity === "promotion" ? "promotions"
    : "pricing";

  if (result.action === "add") {
    const { error } = await db.from(table).insert(payload);
    if (!error) revalidatePath("/");
    return error ? `Ошибка: ${error.message}` : `✅ ${entity} добавлен(а)`;
  }

  if (result.action === "update") {
    const raw = payload as Record<string, unknown>;
    const { id, ...rest } = raw as { id?: string } & Record<string, unknown>;
    if (id) {
      const { error } = await db.from(table).update(rest).eq("id", id);
      if (!error) revalidatePath("/");
      return error ? `Ошибка: ${error.message}` : `✅ ${entity} обновлён(а)`;
    }
    const naturalCol = NATURAL_KEY[table];
    const naturalVal = naturalCol ? (rest[naturalCol] as string | undefined) : undefined;
    if (naturalCol && naturalVal) {
      const { [naturalCol]: _k, ...updateData } = rest as Record<string, unknown>;
      if (Object.keys(updateData).length === 0) return "❌ Нечего обновлять";
      const { data: updated, error } = await db.from(table).update(updateData).eq(naturalCol, naturalVal).select();
      if (error) return `Ошибка: ${error.message}`;
      if (!updated || updated.length === 0) return `⚠️ Не найдено: "${naturalVal}" в ${table}. Проверь название.`;
      revalidatePath("/");
      return `✅ ${entity} "${naturalVal}" обновлён(а)`;
    }
    return "❌ Укажи название тарифа, игры или другого объекта";
  }

  if (result.action === "delete") {
    const { id } = payload as { id: string };
    const { error } = await db.from(table).delete().eq("id", id);
    if (!error) revalidatePath("/");
    return error ? `Ошибка: ${error.message}` : `✅ ${entity} удалён(а)`;
  }

  if (result.action === "activate" || result.action === "deactivate") {
    const { id } = payload as { id: string };
    const { error } = await db.from(table).update({ active: result.action === "activate" }).eq("id", id);
    if (!error) revalidatePath("/");
    return error ? `Ошибка: ${error.message}` : `✅ ${entity} обновлён(а)`;
  }

  return "❌ Неизвестное действие";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return new Response("Bad request", { status: 400 }); }

  const message = (body.message ?? body.edited_message) as
    { chat?: { id?: number }; text?: string } | undefined;
  if (!message?.text || !message?.chat?.id) return new Response("OK");

  const chatId = message.chat.id;
  if (ADMIN_CHAT_ID && String(chatId) !== ADMIN_CHAT_ID) {
    await sendTG(chatId, "⛔ Нет доступа.");
    return new Response("OK");
  }

  const text = message.text.trim();

  if (text === "/start" || text === "/help") {
    await sendTG(chatId,
      `🎮 <b>Love in Game — AI Ассистент</b>\n\n` +
      `<b>📋 Команды (мгновенно):</b>\n` +
      `• Измени цену тарифа Стандарт на 2500\n` +
      `• Добавь игру Elden Ring жанр RPG\n` +
      `• Добавь акцию "Скидка 20% в будни"\n` +
      `• Добавь турнир по FIFA на 15 июля, приз 10000\n\n` +
      `<b>💬 Свободные вопросы (через AI):</b>\n` +
      `• Какие у нас тарифы?\n` +
      `• Сколько стоит аренда на 3 часа?\n` +
      `• Напиши пост для Instagram про акцию`
    );
    return new Response("OK");
  }

  const db = createServerClient();

  await sendTG(chatId, "⏳ Думаю...");

  // 1. Gemini AI first (understands any phrasing)
  let result: AgentResult | null = null;
  try {
    result = await parseAdminMessage(text);
  } catch (err) {
    const errMsg = String(err).slice(0, 200);
    if (errMsg.includes("GEMINI_API_KEY")) {
      await sendTG(chatId,
        `⚠️ GEMINI_API_KEY не установлен.\n\nПолучи бесплатный ключ: aistudio.google.com\nДобавь в Vercel → Settings → Environment Variables`);
      return new Response("OK");
    }
    // 2. Regex fallback if Gemini failed (quota/network error)
    result = tryRegex(text);
    if (!result) {
      await sendTG(chatId, `❌ AI недоступен: ${errMsg}\n\nПопробуй /help для быстрых команд.`);
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
    await sendTG(chatId, `❌ Ошибка выполнения: ${String(err).slice(0, 200)}`);
  }

  return new Response("OK");
}