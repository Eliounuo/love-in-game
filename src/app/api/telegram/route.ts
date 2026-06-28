import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { parseAdminCommand } from "@/lib/ai-agent";

const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function sendTelegramMessage(chatId: number | string, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const message = (body.message ?? body.edited_message) as {
    chat?: { id?: number };
    text?: string;
    from?: { id?: number };
  } | undefined;

  if (!message?.text || !message?.chat?.id) {
    return new Response("OK");
  }

  const chatId = message.chat.id;

  // Auth: only allow the admin
  if (ADMIN_CHAT_ID && String(chatId) !== ADMIN_CHAT_ID) {
    await sendTelegramMessage(chatId, "⛔ Нет доступа.");
    return new Response("OK");
  }

  const text = message.text.trim();

  if (text === "/start" || text === "/help") {
    await sendTelegramMessage(
      chatId,
      `🎮 <b>Love in Game — AI Admin</b>\n\nПиши команды на русском:\n\n` +
        `• Добавь игру FIFA 26 жанр Спорт\n` +
        `• Измени цену VIP на 9000 тенге\n` +
        `• Добавь акцию "Скидка 20% в будни"\n` +
        `• Добавь фото в галерею [URL]\n` +
        `• Обнови телефон на +7 701 234 56 78\n` +
        `• Добавь турнир по FIFA 25 на 15 июля, приз 10000 тенге`
    );
    return new Response("OK");
  }

  await sendTelegramMessage(chatId, "⏳ Обрабатываю команду...");

  const action = await parseAdminCommand(text);

  if (!action) {
    await sendTelegramMessage(chatId, "❌ Не смог распарсить команду. Попробуй ещё раз.");
    return new Response("OK");
  }

  const db = createServerClient();
  let success = false;
  let resultText = "";

  try {
    const { entity, payload } = action;

    const actualTable =
      entity === "contact" ? "contacts"
      : entity === "setting" ? "settings"
      : entity === "event" ? "events"
      : entity === "gallery" ? "gallery"
      : entity === "game" ? "games"
      : entity === "promotion" ? "promotions"
      : "pricing";

    if (action.action === "add") {
      const { error } = await db.from(actualTable).insert(payload);
      success = !error;
      resultText = error ? `Ошибка: ${error.message}` : `✅ ${entity} добавлен(а)`;
    } else if (action.action === "update") {
      if (actualTable === "settings" && payload.key) {
        const { error } = await db.from("settings").upsert({
          key: payload.key as string,
          value: payload.value as string,
          updated_at: new Date().toISOString(),
        });
        success = !error;
        resultText = error ? `Ошибка: ${error.message}` : `✅ Настройка обновлена`;
      } else if (actualTable === "contacts" && payload.type) {
        const { error } = await db.from("contacts").upsert({
          type: payload.type as string,
          value: payload.value as string,
          updated_at: new Date().toISOString(),
        });
        success = !error;
        resultText = error ? `Ошибка: ${error.message}` : `✅ Контакт обновлён`;
      } else {
        const { id, ...rest } = payload as { id?: string } & Record<string, unknown>;
        if (id) {
          const { error } = await db.from(actualTable).update(rest).eq("id", id);
          success = !error;
          resultText = error ? `Ошибка: ${error.message}` : `✅ ${entity} обновлён(а)`;
        } else {
          resultText = "❌ Не указан id для обновления";
        }
      }
    } else if (action.action === "delete") {
      const { id } = payload as { id: string };
      const { error } = await db.from(actualTable).delete().eq("id", id);
      success = !error;
      resultText = error ? `Ошибка: ${error.message}` : `✅ ${entity} удалён(а)`;
    } else if (action.action === "activate" || action.action === "deactivate") {
      const { id } = payload as { id: string };
      const { error } = await db.from(actualTable).update({ active: action.action === "activate" }).eq("id", id);
      success = !error;
      resultText = error ? `Ошибка: ${error.message}` : `✅ ${entity} ${action.action === "activate" ? "активирован(а)" : "деактивирован(а)"}`;
    }

    if (success) {
      revalidatePath("/");
    }
  } catch (err) {
    resultText = `❌ Ошибка: ${String(err)}`;
  }

  await sendTelegramMessage(chatId, resultText || "❌ Неизвестная ошибка");
  return new Response("OK");
}
