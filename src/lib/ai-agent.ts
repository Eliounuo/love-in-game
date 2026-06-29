import { GoogleGenerativeAI } from "@google/generative-ai";

export type AgentResult =
  | {
      type: "command";
      action: "add" | "update" | "delete" | "activate" | "deactivate";
      entity: "game" | "pricing" | "promotion" | "gallery" | "contact" | "event" | "setting";
      payload: Record<string, unknown>;
    }
  | { type: "chat"; message: string };

// ─── Regex fast-path ──────────────────────────────────────────────────────────

const TARIFF: Record<string, string> = {
  "стандарт": "Стандарт", "комфорт": "Комфорт",
  "вечерний": "Вечерний", "vip": "VIP",
};
const GENRES: Record<string, string> = {
  "спорт": "Спорт", "экшен": "Экшен", "экшн": "Экшен", "action": "Экшен",
  "файтинг": "Файтинг", "шутер": "Шутер", "гонки": "Гонки",
  "rpg": "RPG", "рпг": "RPG", "другое": "Другое",
};
const MONTHS: Record<string, number> = {
  "январ": 1, "феврал": 2, "март": 3, "апрел": 4, "май": 5, "июн": 6,
  "июл": 7, "август": 8, "сентябр": 9, "октябр": 10, "ноябр": 11, "декабр": 12,
};

function norm(s: string) { return s.toLowerCase().replace(/ё/g, "е").trim(); }

export function tryRegex(text: string): AgentResult | null {
  const t = norm(text);

  // Pricing price update
  for (const [key, name] of Object.entries(TARIFF)) {
    const re = new RegExp(`${key}[^0-9]{0,40}(\\d{3,6})`);
    const m = t.match(re);
    if (m && /цен|измен|поставь|установ|обнов|стоим/.test(t))
      return { type: "command", action: "update", entity: "pricing", payload: { name, price: parseInt(m[1]) } };
  }

  // Add game
  const agm = text.match(/добавь\s+игр[ую]\s+(.+?)\s+жанр\s+(\S+)/i);
  if (agm) return { type: "command", action: "add", entity: "game",
    payload: { title: agm[1].trim(), genre: GENRES[norm(agm[2])] ?? agm[2].trim(), active: true } };
  const ag2 = text.match(/добавь\s+игр[ую]\s+(.+)/i);
  if (ag2) return { type: "command", action: "add", entity: "game",
    payload: { title: ag2[1].trim(), genre: "Другое", active: true } };

  // Remove game
  const dgm = text.match(/(?:удали|убери|отключи)\s+игр[ую]\s+(.+)/i);
  if (dgm) return { type: "command", action: "update", entity: "game",
    payload: { title: dgm[1].trim(), active: false } };

  // Phone
  const phm = text.match(/(?:телефон|whatsapp|вотсап|номер).*?(\+?[0-9][\d\s\-()]{8,})/i);
  if (phm && /измен|обнов|поставь|укажи/.test(t)) return { type: "command", action: "update",
    entity: "contact", payload: { type: "phone", value: phm[1].trim() } };

  // Hours
  const hm = text.match(/(?:час|врем|режим|расписани).*?(\d{1,2}:\d{2}.{0,30}\d{1,2}:\d{2})/i);
  if (hm && /измен|обнов|поставь/.test(t)) return { type: "command", action: "update",
    entity: "contact", payload: { type: "hours", value: hm[1].trim() } };

  // Add promotion
  const pm = text.match(/добавь\s+(?:акцию|скидку|промо)\s+"?([^"]+?)"?\s*(.*)/i);
  if (pm) {
    const disc = pm[2].match(/(\d+)\s*(?:%|процент|тенге|₸)/i);
    return { type: "command", action: "add", entity: "promotion",
      payload: { title: pm[1].trim(), description: pm[2].trim() || pm[1].trim(),
        discount: disc ? disc[0] : null, active: true } };
  }

  // Add event/tournament
  const evm = text.match(/добавь\s+(?:турнир|мероприяти|ивент)\s+(?:по\s+)?(.+?)\s+(?:на|в)\s+(\d{1,2})\s+([\w]+)/i);
  if (evm) {
    const day = parseInt(evm[2]);
    const ms = norm(evm[3]).slice(0, 6);
    const month = Object.entries(MONTHS).find(([k]) => ms.startsWith(k))?.[1] ?? 1;
    const event_date = new Date(new Date().getFullYear(), month - 1, day, 18, 0, 0).toISOString();
    const prm = text.match(/приз\s+([\d]+)/i);
    return { type: "command", action: "add", entity: "event",
      payload: { title: `Турнир: ${evm[1].trim()}`, description: text,
        event_date, prize: prm ? `${prm[1]} ₸` : null, active: true } };
  }

  // FAQ chat
  if (/тариф|цена|стоим/.test(t)) return { type: "chat",
    message: "💰 Тарифы:\n• Стандарт — 2 000 ₸/час\n• Комфорт — 3 500 ₸/2ч\n• Вечерний — 5 000 ₸/3ч\n• VIP — 8 000 ₸/4ч" };
  if (/адрес|где нах|улиц/.test(t)) return { type: "chat", message: "📍 г. Кокшетау, ул. Уалиханова 212/2" };
  if (/часы|время|режим|работает|открыт/.test(t)) return { type: "chat", message: "🕙 Ежедневно 10:00 – 02:00" };
  if (/телефон|номер|контакт|whatsapp|вотсап/.test(t)) return { type: "chat",
    message: "📞 +7 707 032 70 00 (WhatsApp)\n📸 @love.in.game1" };
  if (/ланч|обед/.test(t)) return { type: "chat",
    message: "🍽 Бизнес-ланч 2 290 ₸. Ежедневно 12:00–16:00.\nСуп + горячее + салат + булочка + напиток." };

  return null;
}

// ─── Gemini AI (free tier, 1500 req/day) ─────────────────────────────────────

const SYSTEM_PROMPT = `Ты AI ассистент для "Love in Game" — PlayStation 5 кафе в Кокшетау, Казахстан.

Информация о кафе:
- Адрес: г. Кокшетау, ул. Уалиханова 212/2
- Часы: Ежедневно 10:00–02:00
- Телефон: +7 707 032 70 00
- Instagram: @love.in.game1
- Тарифы: Стандарт 2000тг/1ч, Комфорт 3500тг/2ч, Вечерний 5000тг/3ч, VIP 8000тг/4ч
- Бизнес-ланч: 2290тг, ежедневно 12:00–16:00

Сущности для управления:
- game: { title, genre (Спорт/Экшен/Файтинг/Шутер/Гонки/RPG/Другое), cover_url?, active? }
- pricing: { name (Стандарт/Комфорт/Вечерний/VIP), price (число), duration, players, features?, popular?, active? }
- promotion: { title, description, discount?, expires_at?, active? }
- contact: { type (whatsapp/phone/instagram/address/hours), value }
- event: { title, description, event_date (ISO datetime), prize?, active? }

Правила для UPDATE: всегда включай name/title как идентификатор + только изменяемые поля. price — число.

Примеры:
"измени цену стандарт на 2500" -> {"type":"command","action":"update","entity":"pricing","payload":{"name":"Стандарт","price":2500}}
"добавь игру Elden Ring жанр RPG" -> {"type":"command","action":"add","entity":"game","payload":{"title":"Elden Ring","genre":"RPG","active":true}}
"какой у нас wifi?" -> {"type":"chat","message":"Информация о WiFi не указана в данных кафе."}

Отвечай ТОЛЬКО валидным JSON:
- Для команд: {"type":"command","action":"add|update|delete","entity":"...","payload":{...}}
- Для чата/вопросов: {"type":"chat","message":"ответ на русском"}`;

export async function parseAdminMessage(text: string): Promise<AgentResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY не установлен");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(text);
  const raw = result.response.text();
  if (!raw) throw new Error("Gemini вернул пустой ответ");
  return JSON.parse(raw) as AgentResult;
}

export const parseAdminCommand = parseAdminMessage;