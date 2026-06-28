import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type AgentAction = {
  action: "add" | "update" | "delete" | "activate" | "deactivate";
  entity: "game" | "pricing" | "promotion" | "gallery" | "contact" | "event" | "setting";
  payload: Record<string, unknown>;
};

const SYSTEM_PROMPT = `You are an AI admin for "Love in Game" — a PlayStation 5 gaming café in Kazakhstan.
Parse admin commands in Russian and return structured JSON.

Available entities and their fields:
- game: { title, genre, cover_url?, active? }
- pricing: { name, duration, players, price (number in KZT), features (array), popular?, active? }
- promotion: { title, description, discount?, expires_at? (ISO date), active? }
- gallery: { url, caption?, sort_order? }
- contact: { type (whatsapp/phone/instagram/address/hours), value }
- event: { title, description, event_date (ISO datetime), prize?, active? }
- setting: { key, value } — keys: whatsapp_number, phone, address, hours, instagram

Return JSON only: { "action": "add|update|delete|activate|deactivate", "entity": "...", "payload": {...} }`;

export async function parseAdminCommand(text: string): Promise<AgentAction | null> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: text },
    ],
    response_format: { type: "json_object" },
    temperature: 0,
    max_tokens: 256,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AgentAction;
  } catch {
    return null;
  }
}
