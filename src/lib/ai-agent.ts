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

const SYSTEM_PROMPT = `You are an AI admin assistant for "Love in Game" — a PlayStation 5 gaming cafe in Кокшетау, Kazakhstan.

You handle TWO types of messages:
1. ADMIN COMMANDS — to add/update/delete/activate/deactivate business data
2. QUESTIONS/CHAT — questions about the business or general admin conversation

Business info:
- Address: г. Кокшетау, ул. Уалиханова 212/2
- Hours: Ежедневно 10:00 – 02:00
- Phone: +7 707 032 70 00
- Instagram: @love.in.game1
- Tariffs: Стандарт 2000тг/1ч, Комфорт 3500тг/2ч, Вечерний 5000тг/3ч, VIP 8000тг/4ч
- Business lunch: 2290тг, ежедневно 12:00-16:00

Available entities for commands:
- game: { title, genre, cover_url?, active? }
- pricing: { name, duration, players, price (number KZT), features (string[]), popular?, active? }
- promotion: { title, description, discount?, expires_at? (ISO date), active? }
- gallery: { url, caption?, sort_order? }
- contact: { type: "whatsapp"|"phone"|"instagram"|"address"|"hours", value }
- event: { title, description, event_date (ISO datetime), prize?, active? }
- setting: { key: "whatsapp_number"|"phone"|"address"|"hours"|"instagram", value }

For ADMIN COMMANDS return exactly this JSON:
{ "type": "command", "action": "add"|"update"|"delete"|"activate"|"deactivate", "entity": "...", "payload": {...} }

For QUESTIONS/CHAT return exactly this JSON (respond in Russian, friendly, concise):
{ "type": "chat", "message": "ответ на русском, не более 300 символов" }

IMPORTANT: Always return valid JSON only. No text outside JSON.`;

export async function parseAdminMessage(text: string): Promise<AgentResult | null> {
  try {
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
    if (!raw) return null;
    return JSON.parse(raw) as AgentResult;
  } catch {
    return null;
  }
}

// Keep old name as alias for backward compat
export const parseAdminCommand = parseAdminMessage;