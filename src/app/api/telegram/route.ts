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

// Natural identifier columns per table (used when no id in payload)
const NATURAL_KEY: Record<string, string> = {
  pricing: "name",
  games: "title",
  events: "title",
  promotions: "title",
  contacts: "type",
  settings: "key",
};

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
      `• Измени цену тарифа Стандарт на 2500 тенге\n` +
      `• Добавь игру FIFA 26 жанр Спорт\n` +
      `• Добавь акцию "Скидка 20% в будни"\n` +
      `• Добавь турнир по FIFA на 15 июля, приз 10000 тенге\n\n` +
      `<b>💬 Ответить на вопросы:</b>\n` +
      `• Какие тарифы у нас?\n` +
      `• Как связаться с гостями?\n\n` +
      `Пиши свободно на русском!`
    );
    return new Response("OK");
  }

  await sendTG(chatId, "⏳ Думаю...");

  const result = await parseAdminMessage(text);

  if (!result) {
    await sendTG(chatId, "❌ Не понял. Попробуй /help");
    return new Response("OK");
  }

  // Chat mode
  if (result.type === "chat") {
    await sendTG(chatId, result.message);
    return new Response("OK");
  }

  // Command mode
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
      const raw = payload as Record<string, unknown>;
      const { id, ...rest } = raw as { id?: string } & Record<string, unknown>;

      if (id) {
        // Update by explicit UUID
        const { error } = await db.from(table).update(rest).eq("id", id);
        resultText = error ? `Ошибка: ${error.message}` : `✅ ${entity} обновлён(а)`;
        if (!error) revalidatePath("/");
      } else {
        // Update by natural key (name/title/type/key)
        const naturalCol = NATURAL_KEY[table];
        const naturalVal = naturalCol ? (rest[naturalCol] as string | undefined) : undefined;

        if (naturalCol && naturalVal) {
          // Remove the key field from the data being SET
          const { [naturalCol]: _key, ...updateData } = rest as Record<string, unknown>;
          if (Object.keys(updateData).length === 0) {
            resultText = "❌ Нечего обновлять — укажи новое значение";
          } else {
            const { error } = await db.from(table).update(updateData).eq(naturalCol, naturalVal);
            resultText = error
              ? `Ошибка: ${error.message}`
              : `✅ ${entity} "${naturalVal}" обновлён(а)`;
            if (!error) revalidatePath("/");
          }
        } else {
          resultText = `❌ Не хватает идентификатора. Укажи название/имя тарифа, игры и т.д.`;
        }
      }

    } else if (result.action === "delete") {
      const { id } = payload as { id: string };
      const { error } = await db.from(table).delete().eq("id", id);
      resultText = error ? `Ошибка: ${error.message}` : `✅ ${entity} удалён(а)`;
      if (!error) revalidatePath("/");

    } else if (result.action === "activate" || result.action === "deactivate") {
      const { id } = payload as { id: string };
      const active = result.action === "activate";
      const { error } = await db.from(table).update({ active }).eq("id", id);
      resultText = error ? `Ошибка: ${error.message}` : `✅ ${entity} ${active ? "активирован(а)" : "деактивирован(а)"}`;
      if (!error) revalidatePath("/");
    }

  } catch (err) {
    resultText = `❌ Ошибка: ${String(err)}`;
  }

  await sendTG(chatId, resultText || "❌ Неизвестная ошибка");
  return new Response("OK");
}