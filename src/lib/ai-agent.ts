import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type AgentResult =
  | {
      type: "command";
      action: "add" | "update" | "delete" | "activate" | "deactivate";
      entity: "game" | "pricing" | "promotion" | "gallery" | "contact" | "event" | "setting";
      payload: Record<string, unknown>;
    }
  | { type: "chat"; message: string };

const TARIFF_MAP: Record<string, string> = {
  "стандарт": "Стандарт", "standard": "Стандарт",
  "комфорт": "Комфорт",   "comfort":  "Комфорт",
  "вечерний": "Вечерний", "evening":  "Вечерний",
  "vip": "VIP",
};

// Regex fallback for the most common admin commands
function tryRegex(text: string): AgentResult | null {
  const t = text.toLowerCase().replace(/ё/g, "е");

  // Update pricing price: "измени цену тарифа стандарт на 2500" / "стандарт поставь 2500"
  const priceRe = /(?:цену?\s+)?(?:тарифа?\s+)?(стандарт|комфорт|вечерний|vip).*?(\d{3,6})/i;
  const pm = t.match(priceRe);
  if (pm && (t.includes("цен") || t.includes("измен") || t.includes("поставь") || t.includes("установ") || t.includes("обнов"))) {
    const name = TARIFF_MAP[pm[1].toLowerCase()];
    const price = parseInt(pm[2]);
    if (name && price >= 100) {
      return { type: "command", action: "update", entity: "pricing", payload: { name, price } };
    }
  }

  // Add game: "добавь игру Elden Ring жанр RPG"
  const addGameRe = /добавь\s+игр[ую]\s+(.+?)\s+жанр\s+(\S+)/i;
  const agm = text.match(addGameRe);
  if (agm) {
    return { type: "command", action: "add", entity: "game",
      payload: { title: agm[1].trim(), genre: agm[2].trim(), active: true } };
  }

  // Update phone/whatsapp
  const phoneRe = /(?:телефон|whatsapp|вотсап).*?(\+?[0-9][\d\s\-]{9,})/i;
  const phm = text.match(phoneRe);
  if (phm && (t.includes("измен") || t.includes("обнов") || t.includes("поставь"))) {
    return { type: "command", action: "update", entity: "contact",
      payload: { type: "phone", value: phm[1].trim() } };
  }

  return null;
}

const SYSTEM_PROMPT = `You are an AI admin assistant for "Love in Game" — a PlayStation 5 gaming cafe in Кокшетау, Kazakhstan.

You handle TWO types of messages:
1. ADMIN COMMANDS — to add/update/delete/activate/deactivate business data
2. QUESTIONS/CHAT — questions about the business

Business info:
- Tariffs: Стандарт 2000тг/1ч, Комфорт 3500тг/2ч, Вечерний 5000тг/3ч, VIP 8000тг/4ч
- Business lunch: 2290тг, daily 12:00-16:00
- Address: г. Кокшетау, ул. Уалиханова 212/2, Hours: 10:00-02:00
- Phone: +7 707 032 70 00, Instagram: @love.in.game1

Entities:
- game: { title, genre, cover_url?, active? }
- pricing: { name, duration, players, price (number KZT), features (string[]), popular?, active? }
- promotion: { title, description, discount?, expires_at?, active? }
- gallery: { url, caption?, sort_order? }
- contact: { type: "whatsapp"|"phone"|"instagram"|"address"|"hours", value }
- event: { title, description, event_date (ISO datetime), prize?, active? }
- setting: { key: "whatsapp_number"|"phone"|"address"|"hours"|"instagram", value }

RULES FOR UPDATE:
- pricing: include "name" (Стандарт/Комфорт/Вечерний/VIP) + changed fields only
- games: include "title" + changed fields only
- events/promotions: include "title" + changed fields only
- contacts: include "type" + "value"
- price is always a NUMBER

Examples:
"измени цену тарифа стандарт на 2500" -> {"type":"command","action":"update","entity":"pricing","payload":{"name":"Стандарт","price":2500}}
"добавь игру Elden Ring жанр RPG" -> {"type":"command","action":"add","entity":"game","payload":{"title":"Elden Ring","genre":"RPG","active":true}}

For COMMANDS: { "type": "command", "action": "...", "entity": "...", "payload": {...} }
For CHAT: { "type": "chat", "message": "ответ на русском, до 300 символов" }

Return valid JSON only.`;

export async function parseAdminMessage(text: string): Promise<AgentResult> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: text },
    ],
    response_format: { type: "json_object" },
    temperature: 0,
    max_tokens: 512,
  });
  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("OpenAI вернул пустой ответ");
  return JSON.parse(raw) as AgentResult;
}

export { tryRegex };
export const parseAdminCommand = parseAdminMessage;