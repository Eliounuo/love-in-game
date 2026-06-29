import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { parseAdminMessage } from "@/lib/ai-agent";

const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function sendTG(chatId: number | string, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return new Response("Bad request", { status: 400 }); }

  const message = (body.message ?? body.edited_message) as {
    chat?: { id?: number };
    text?: string;
  } | undefined;

  if (!message?.text || !message?.chat?.id) return new Response("OK");

  const chatId = message.chat.id;

  if (ADMIN_CHAT_ID && String(chatId) !== ADMIN_CHAT_ID) {
    await sendTG(chatId, "⛔ Нет доступа.");
    return new Response("OK");
  }

  const text = message.text.trim();

  if (text === "/start" || text === "/help") {
    await sendTG(
      chatId,
      `🎮 <b>Love in Game — AI Ассистент</b>\n\n` +
      `Привет! Я умею:\n\n` +
      `<b>📋 Управлять данными:</b>\n` +
      `• Добавь игру FIFA 26 жанр Спорт\n` +
      `• Измени цену VIP на 9000 тенге\n` +
      `• Добавь акцию "Скидка 20% в будни"\n` +
      `• Добавь турнир по FIFA 25 на 15 июля\n\n` +
      `<b>💬 Отвечать на вопросы:</b>\n` +
      `• Какие тарифы?\n` +
      `• Как связаться с гостями?\n` +
      `• Расскажи о кафе\n\n` +
      `Пиши свободно на русском!`
    );
    return new Response("OK");
  }

  await sendTG(chatId, "⏳ Думаю...");

  const result = await parseAdminMessage(text);

  if (!result) {
    await sendTG(chatId, "❌ Не понял команду. Попробуй /help");
    return new Response("OK");
  }

  // Chat mode — just reply
  if (result.type === "chat") {
    await sendTG(chatId, result.message);
    return new Response("OK");
  }

  // Command mode — execute
  const db = createServerClient();
  let resultText = "";

  try {
    const { entity, payload } = result;
    const table =
      entity === "contact" ? "contacts"
      : entity === "setting" ? "settings"
      : entity === "event" ? "events"
      : entity === "gallery" ? "gallery"
      : entity === "game" ? "games"
      : entity === "promotion" ? "promotions"
      : "pricing";

    if (result.action === "add") {
      const { error } = await db.from(table).insert(payload);
      resultText = error ? `Ошибка: ${error.message}` : `✅ ${entity} добавлен(а)`;
      if (!error) revalidatePath("/");
    } else if (result.action === "update") {
      if (table === "settings" && payload.key) {
        const { error } = await db.from("settings").upsert({
          key: payload.key as string, value: payload.value as string, updated_at: new Date().toISOString(),
        });
        resultText = error ? `Ошибка: ${error.message}` : `✅ Настройка обновлена`;
        if (!error) revalidatePath("/");
      } else if (table === "contacts" && payload.type) {
        const { error } = await db.from("contacts").upsert({
          type: payload.type as string, value: payload.value as string, updated_at: new Date().toISOString(),
        });
        resultText = error ? `Ошибка: ${error.message}` : `✅ Контакт обновлён`;
        if (!error) revalidatePath("/");
      } else {
        const { id, ...rest } = payload as { id?: string } & Record<string, unknown>;
        if (id) {
          const { error } = await db.from(table).update(rest).eq("id", id);
          resultText = error ? `Ошибка: ${error.message}` : `✅ ${entity} обновлён(а)`;
          if (!error) revalidatePath("/");
        } else {
          resultText = "❌ Не указан id для обновления";
        }
      }
    } else if (result.action === "delete") {
      const { id } = payload as { id: string };
      const { error } = await db.from(table).delete().eq("id", id);
      resultText = error ? `Ошибка: ${error.message}` : `✅ ${entity} удалён(а)`;
      if (!error) revalidatePath("/");
    } else if (result.action === "activate" || result.action === "deactivate") {
      const { id } = payload as { id: string };
      const { error } = await db.from(table).update({ active: result.action === "activate" }).eq("id", id);
      resultText = error ? `Ошибка: ${error.message}` : `✅ ${entity} ${result.action === "activate" ? "активирован(а)" : "деактивирован(а)"}`;
      if (!error) revalidatePath("/");
    }
  } catch (err) {
    resultText = `❌ Ошибка: ${String(err)}`;
  }

  await sendTG(chatId, resultText || "❌ Неизвестная ошибка");
  return new Response("OK");
}