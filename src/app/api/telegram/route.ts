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
  pricing: "name",
  games: "title",
  events: "title",
  promotions: "title",
  contacts: "type",
  settings: "key",
};

async function executeResult(result: AgentResult, db: ReturnType<typeof createServerClient>): Promise<string> {
  if (result.type === "chat") return result.message;

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
      const { error } = await db.from(table).update(updateData).eq(naturalCol, naturalVal);
      if (!error) revalidatePath("/");
      return error ? `Ошибка: ${error.message}` : `✅ ${entity} "${naturalVal}" обновлён(а)`;
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
    const active = result.action === "activate";
    const { error } = await db.from(table).update({ active }).eq("id", id);
    if (!error) revalidatePath("/");
    return error ? `Ошибка: ${error.message}` : `✅ ${entity} ${active ? "активирован(а)" : "деактивирован(а)"}`;
  }

  return "❌ Неизвестное действие";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return new Response("Bad request", { status: 400 }); }

  const message = (body.message ?? body.edited_message) as {
    chat?: { id?: number }; text?: string;
  } | undefined;

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
      `<b>📋 Команды:</b>\n` +
      `• Измени цену тарифа Стандарт на 2500\n` +
      `• Добавь игру Elden Ring жанр RPG\n` +
      `• Добавь акцию "Скидка 20% в будни"\n` +
      `• Добавь турнир по FIFA на 15 июля, приз 10000\n\n` +
      `<b>💬 Вопросы:</b>\n` +
      `• Какие тарифы?\n` +
      `• Расскажи о кафе`
    );
    return new Response("OK");
  }

  await sendTG(chatId, "⏳ Думаю...");

  const db = createServerClient();

  // 1. Try OpenAI
  let result: AgentResult | null = null;
  let aiError = "";
  try {
    result = await parseAdminMessage(text);
  } catch (err) {
    aiError = String(err);
    // 2. Fallback: regex parser
    result = tryRegex(text);
  }

  if (!result) {
    const hint = aiError ? `\n\n🔧 Ошибка AI: ${aiError.slice(0, 150)}` : "";
    await sendTG(chatId, `❌ Не понял команду. Попробуй /help${hint}`);
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