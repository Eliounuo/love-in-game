export type AgentResult =
  | {
      type: "command";
      action: "add" | "update" | "delete" | "activate" | "deactivate";
      entity: "game" | "pricing" | "promotion" | "gallery" | "contact" | "event" | "setting";
      payload: Record<string, unknown>;
    }
  | { type: "chat"; message: string };

const TARIFF: Record<string, string> = {
  "стандарт": "Стандарт", "standard": "Стандарт",
  "комфорт":  "Комфорт",  "comfort":  "Комфорт",
  "вечерний": "Вечерний", "evening":  "Вечерний",
  "vip":      "VIP",
};

const GENRES: Record<string, string> = {
  "спорт": "Спорт", "sport": "Спорт",
  "экшен": "Экшен", "экшн": "Экшен", "action": "Экшен",
  "файтинг": "Файтинг", "fighting": "Файтинг",
  "шутер": "Шутер", "shooter": "Шутер",
  "гонки": "Гонки", "racing": "Гонки",
  "rpg": "RPG", "рпг": "RPG",
  "другое": "Другое",
};

function n(s: string) { return s.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim(); }

export function tryRegex(text: string): AgentResult | null {
  const t = n(text);

  // ─── PRICING PRICE UPDATE ─────────────────────────────────────────────────
  // "измени цену тарифа стандарт на 2500"
  // "поставь стандарт 2500 тенге"
  // "стандарт цена 2500"
  for (const [key, name] of Object.entries(TARIFF)) {
    const re = new RegExp(`${key}[^0-9]{0,40}(\\d{3,6})`);
    const m = t.match(re);
    if (m && (t.includes("цен") || t.includes("измен") || t.includes("поставь") || t.includes("установ") || t.includes("обнов") || t.includes("стоим"))) {
      return { type: "command", action: "update", entity: "pricing", payload: { name, price: parseInt(m[1]) } };
    }
  }

  // ─── ADD GAME ──────────────────────────────────────────────────────────────
  // "добавь игру Elden Ring жанр RPG"
  const addGameRe = /добавь\s+игр[ую]\s+(.+?)\s+жанр\s+(\S+)/i;
  const agm = text.match(addGameRe);
  if (agm) {
    const genre = GENRES[n(agm[2])] ?? agm[2].trim();
    return { type: "command", action: "add", entity: "game",
      payload: { title: agm[1].trim(), genre, active: true } };
  }

  // "добавь игру Elden Ring" (без жанра → Другое)
  const addGame2Re = /добавь\s+игр[ую]\s+(.+)/i;
  const ag2 = text.match(addGame2Re);
  if (ag2 && !t.includes("жанр")) {
    return { type: "command", action: "add", entity: "game",
      payload: { title: ag2[1].trim(), genre: "Другое", active: true } };
  }

  // ─── REMOVE / DEACTIVATE GAME ──────────────────────────────────────────────
  // "удали игру FIFA 25" / "убери игру FIFA 25"
  const delGameRe = /(?:удали|убери|отключи)\s+игр[ую]\s+(.+)/i;
  const dgm = text.match(delGameRe);
  if (dgm) {
    return { type: "command", action: "update", entity: "game",
      payload: { title: dgm[1].trim(), active: false } };
  }

  // ─── CONTACTS ──────────────────────────────────────────────────────────────
  // Phone / WhatsApp
  const phoneRe = /(?:телефон|whatsapp|вотсап|номер).*?(\+?[0-9][\d\s\-()]{8,})/i;
  const phm = text.match(phoneRe);
  if (phm && (t.includes("измен") || t.includes("обнов") || t.includes("поставь") || t.includes("укажи"))) {
    return { type: "command", action: "update", entity: "contact",
      payload: { type: "phone", value: phm[1].trim() } };
  }

  // Address
  const addrRe = /(?:адрес|улиц).*?((?:ул|пр|пер|бул)\.?\s*.{5,})/i;
  const adm = text.match(addrRe);
  if (adm && (t.includes("измен") || t.includes("обнов") || t.includes("поставь"))) {
    return { type: "command", action: "update", entity: "contact",
      payload: { type: "address", value: adm[1].trim() } };
  }

  // Hours
  const hoursRe = /(?:час|врем|режим|расписани).*?(\d{1,2}:\d{2}.{0,30}\d{1,2}:\d{2})/i;
  const hm = text.match(hoursRe);
  if (hm && (t.includes("измен") || t.includes("обнов") || t.includes("поставь"))) {
    return { type: "command", action: "update", entity: "contact",
      payload: { type: "hours", value: hm[1].trim() } };
  }

  // Instagram
  const igRe = /instagram.*?(@[\w.]+)/i;
  const igm = text.match(igRe);
  if (igm) {
    return { type: "command", action: "update", entity: "contact",
      payload: { type: "instagram", value: igm[1] } };
  }

  // ─── ADD PROMOTION ─────────────────────────────────────────────────────────
  // "добавь акцию/скидку "Название" X% / минус X тенге"
  const promoRe = /добавь\s+(?:акцию|акция|скидку|скидка|промо)\s+"?([^"]+?)"?\s*(.{0,80})/i;
  const pm = text.match(promoRe);
  if (pm) {
    const discRe = /(\d+)\s*(?:%|процент|тенге|₸)/i;
    const disc = pm[2].match(discRe);
    return { type: "command", action: "add", entity: "promotion",
      payload: { title: pm[1].trim(), description: pm[2].trim() || pm[1].trim(),
        discount: disc ? disc[0] : null, active: true } };
  }

  // ─── ADD EVENT / TOURNAMENT ────────────────────────────────────────────────
  // "добавь турнир по FIFA 25 на 15 июля, приз 10000 тенге"
  const MONTHS: Record<string, number> = {
    "январ": 1, "феврал": 2, "март": 3, "апрел": 4, "май": 5, "июн": 6,
    "июл": 7, "август": 8, "сентябр": 9, "октябр": 10, "ноябр": 11, "декабр": 12,
  };
  const eventRe = /добавь\s+(?:турнир|мероприяти|ивент)\s+(?:по\s+)?(.+?)\s+(?:на|в)\s+(\d{1,2})\s+([\w]+)/i;
  const evm = text.match(eventRe);
  if (evm) {
    const day = parseInt(evm[2]);
    const monthStr = n(evm[3]).slice(0, 6);
    const month = Object.entries(MONTHS).find(([k]) => monthStr.startsWith(k))?.[1] ?? 1;
    const year = new Date().getFullYear();
    const event_date = new Date(year, month - 1, day, 18, 0, 0).toISOString();
    const prizeRe = /приз\s+([\d]+)/i;
    const prm = text.match(prizeRe);
    return { type: "command", action: "add", entity: "event",
      payload: {
        title: `Турнир: ${evm[1].trim()}`,
        description: text,
        event_date,
        prize: prm ? `${prm[1]} ₸` : null,
        active: true,
      } };
  }

  // ─── CHAT: Common questions ────────────────────────────────────────────────
  if (t.includes("тариф") || t.includes("цена") || t.includes("стоим") || t.includes("сколько стоит")) {
    return { type: "chat", message: "💰 Тарифы:\n• Стандарт — 2 000 ₸/час\n• Комфорт — 3 500 ₸/2ч\n• Вечерний — 5 000 ₸/3ч\n• VIP — 8 000 ₸/4ч" };
  }
  if (t.includes("адрес") || t.includes("где") || t.includes("находится") || t.includes("локац")) {
    return { type: "chat", message: "📍 г. Кокшетау, ул. Уалиханова 212/2" };
  }
  if (t.includes("часы") || t.includes("время") || t.includes("режим") || t.includes("работаете") || t.includes("открыт")) {
    return { type: "chat", message: "🕙 Работаем ежедневно 10:00 – 02:00" };
  }
  if (t.includes("телефон") || t.includes("позвон") || t.includes("контакт") || t.includes("whatsapp") || t.includes("вотсап")) {
    return { type: "chat", message: "📞 +7 707 032 70 00 (WhatsApp)\n📸 Instagram: @love.in.game1" };
  }
  if (t.includes("ланч") || t.includes("обед")) {
    return { type: "chat", message: "🍽 Бизнес-ланч 2 290 ₸. Ежедневно 12:00–16:00. Суп + горячее + салат + булочка + напиток." };
  }

  return null;
}

export const parseAdminMessage = tryRegex;
export const parseAdminCommand = tryRegex;