import { GoogleGenerativeAI } from "@google/generative-ai";

export type AgentResult =
  | { type: "command"; action: "add"|"update"|"delete"|"activate"|"deactivate";
      entity: string; payload: Record<string, unknown>; }
  | { type: "chat"; message: string };

const TARIFF: Record<string, string> = {
  "стандарт":"Стандарт","комфорт":"Комфорт","вечерний":"Вечерний","vip":"VIP",
};
const MONTHS: Record<string, number> = {
  "январ":1,"феврал":2,"март":3,"апрел":4,"май":5,"июн":6,
  "июл":7,"август":8,"сентябр":9,"октябр":10,"ноябр":11,"декабр":12,
};

function n(s: string) { return s.toLowerCase().replace(/ё/g,"е").trim(); }

export function tryRegex(text: string): AgentResult | null {
  const t = n(text);

  // Pricing price
  for (const [key, name] of Object.entries(TARIFF)) {
    const m = t.match(new RegExp(`${key}[^0-9]{0,40}(\\d{3,6})`));
    if (m && /цен|измен|поставь|установ|обнов|стоим/.test(t))
      return { type:"command", action:"update", entity:"pricing", payload:{ name, price:parseInt(m[1]) } };
  }
  // Add game
  const ag1 = text.match(/добавь\s+игр[ую]\s+(.+?)\s+жанр\s+(\S+)/i);
  if (ag1) return { type:"command", action:"add", entity:"game",
    payload:{ title:ag1[1].trim(), genre:ag1[2].trim(), active:true } };
  const ag2 = text.match(/добавь\s+игр[ую]\s+(.+)/i);
  if (ag2) return { type:"command", action:"add", entity:"game",
    payload:{ title:ag2[1].trim(), genre:"Другое", active:true } };
  // Remove game
  const dg = text.match(/(?:удали|убери|отключи)\s+игр[ую]\s+(.+)/i);
  if (dg) return { type:"command", action:"update", entity:"game",
    payload:{ title:dg[1].trim(), active:false } };
  // Phone
  const ph = text.match(/(?:телефон|whatsapp|вотсап|номер).*?(\+?[0-9][\d\s\-()]{8,})/i);
  if (ph && /измен|обнов|поставь/.test(t)) return { type:"command", action:"update",
    entity:"contact", payload:{ type:"phone", value:ph[1].trim() } };
  // Hours
  const hm = text.match(/(?:час|врем|режим).*?(\d{1,2}:\d{2}.{0,30}\d{1,2}:\d{2})/i);
  if (hm && /измен|обнов|поставь/.test(t)) return { type:"command", action:"update",
    entity:"contact", payload:{ type:"hours", value:hm[1].trim() } };
  // Add promotion
  const pm = text.match(/добавь\s+(?:акцию|скидку|промо)\s+"?([^"]+?)"?\s*(.*)/i);
  if (pm) {
    const disc = pm[2].match(/(\d+)\s*(?:%|тенге|₸)/i);
    return { type:"command", action:"add", entity:"promotion",
      payload:{ title:pm[1].trim(), description:pm[2].trim()||pm[1].trim(),
        discount:disc?disc[0]:null, active:true } };
  }
  // Add event
  const ev = text.match(/добавь\s+(?:турнир|мероприяти|ивент)\s+(?:по\s+)?(.+?)\s+(?:на|в)\s+(\d{1,2})\s+([\w]+)/i);
  if (ev) {
    const day=parseInt(ev[2]); const ms=n(ev[3]).slice(0,6);
    const month=Object.entries(MONTHS).find(([k])=>ms.startsWith(k))?.[1]??1;
    const prm=text.match(/приз\s+([\d]+)/i);
    return { type:"command", action:"add", entity:"event",
      payload:{ title:`Турнир: ${ev[1].trim()}`,description:text,
        event_date:new Date(new Date().getFullYear(),month-1,day,18,0,0).toISOString(),
        prize:prm?`${prm[1]} ₸`:null, active:true } };
  }
  // Add menu item
  const mi = text.match(/добавь\s+(?:в меню|блюдо|позицию)\s+["«]?([^"»]+?)["»]?\s+(?:цена|за|по)\s+([\d\s]+(?:тенге|₸|тг)?)/i);
  if (mi) {
    const cat = /пицц/i.test(mi[1])?"pizza":/завтрак/i.test(mi[1])?"breakfast":
      /суп/i.test(mi[1])?"soups":/салат/i.test(mi[1])?"salads":"hot";
    return { type:"command", action:"add", entity:"menu_item",
      payload:{ name:mi[1].trim(), price:mi[2].trim(), category_key:cat, active:true } };
  }
  // FAQ answers
  if (/тариф|цена|стоим/.test(t)) return { type:"chat",
    message:"💰 Тарифы:\n• Стандарт — 2 000 ₸/час\n• Комфорт — 3 500 ₸/2ч\n• Вечерний — 5 000 ₸/3ч\n• VIP — 8 000 ₸/4ч" };
  if (/адрес|где/.test(t)) return { type:"chat", message:"📍 г. Кокшетау, ул. Уалиханова 212/2" };
  if (/час|время|работает|открыт/.test(t)) return { type:"chat", message:"🕙 Ежедневно 10:00–02:00" };
  if (/телефон|контакт|whatsapp|вотсап/.test(t)) return { type:"chat", message:"📞 +7 707 032 70 00\n📸 @love.in.game1" };
  if (/ланч|обед/.test(t)) return { type:"chat", message:"🍽 Бизнес-ланч 2 290 ₸. Ежедневно 12:00–16:00." };

  return null;
}

const SYSTEM_PROMPT = `Ты AI ассистент-администратор "Love in Game" — PlayStation 5 кафе в Кокшетау, Казахстан.

Управляй ВСЕМ контентом сайта через JSON команды.

СУЩНОСТИ И ПОЛЯ:

pricing: name (Стандарт/Комфорт/Вечерний/VIP), price (число ₸), duration, players, features (массив строк), popular, active
game: title, genre (Спорт/Экшен/Файтинг/Шутер/Гонки/RPG/Другое), cover_url, active
promotion: title, description, discount, expires_at (ISO date), active
event: title, description, event_date (ISO datetime), prize, active
contact: type (phone/whatsapp/instagram/address/hours), value
gallery: url, caption, sort_order
menu_category: key, label, photo_url, sort_order, active
menu_item: category_key (pizza/breakfast/soups/salads/hot), name, price (строка "2 190 ₸"), active
faq_item: question, answer, sort_order, active

ПРАВИЛА UPDATE:
- pricing: используй name как ключ + только изменяемые поля
- game: используй title как ключ
- menu_item: используй name как ключ
- faq_item: используй question как ключ (можно часть)
- contact: используй type как ключ
- price всегда ЧИСЛО для pricing, СТРОКА "2 190 ₸" для menu_item

ПРИМЕРЫ:
"измени цену пиццы Маргарита на 2390" → {"type":"command","action":"update","entity":"menu_item","payload":{"name":"Маргарита","price":"2 390 ₸"}}
"добавь вопрос в FAQ про парковку" → {"type":"command","action":"add","entity":"faq_item","payload":{"question":"Есть ли парковка?","answer":"Рядом бесплатная парковка.","sort_order":9,"active":true}}
"убери Борщ из меню" → {"type":"command","action":"update","entity":"menu_item","payload":{"name":"Борщ","active":false}}
"измени цену стандарт на 2500" → {"type":"command","action":"update","entity":"pricing","payload":{"name":"Стандарт","price":2500}}
"добавь игру Elden Ring жанр RPG" → {"type":"command","action":"add","entity":"game","payload":{"title":"Elden Ring","genre":"RPG","active":true}}

ЕСЛИ получена ссылка на фото (https://...) в тексте команды — используй её как cover_url или url.

Для CHAT вопросов: {"type":"chat","message":"ответ на русском до 400 символов"}
Отвечай ТОЛЬКО валидным JSON без markdown.`;

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