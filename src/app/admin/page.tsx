import { getPricing, getGames, getContacts, getEvents, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [pricing, games, contacts, events, settings] = await Promise.all([
    getPricing(),
    getGames(),
    getContacts(),
    getEvents(),
    getSettings(),
  ]);

  return (
    <div className="min-h-screen bg-[#E7D8CC] p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display text-4xl text-[#1D1B19] font-semibold">Love in Game</h1>
          <p className="text-[#B7774E] mt-1 text-sm tracking-wide">AI Smart Admin · Read-only view</p>
        </div>

        <Section title="⚙️ Настройки">
          <Table
            headers={["Ключ", "Значение"]}
            rows={Object.entries(settings).map(([k, v]) => [k, v])}
          />
        </Section>

        <Section title="💰 Тарифы">
          <Table
            headers={["Название", "Длительность", "Игроки", "Цена", "Популярный", "Активен"]}
            rows={pricing.map((p) => [
              p.name, p.duration, p.players,
              `${p.price.toLocaleString("ru-KZ")} ₸`,
              p.popular ? "✅" : "—",
              p.active ? "✅" : "❌",
            ])}
          />
        </Section>

        <Section title="🎮 Игры">
          <Table
            headers={["Название", "Жанр", "Активна"]}
            rows={games.map((g) => [g.title, g.genre, g.active ? "✅" : "❌"])}
          />
        </Section>

        <Section title="📞 Контакты">
          <Table
            headers={["Тип", "Значение"]}
            rows={contacts.map((c) => [c.type, c.value])}
          />
        </Section>

        <Section title="🏆 Турниры">
          {events.length === 0 ? (
            <p className="text-[#55504C] text-sm italic p-4">Нет предстоящих турниров</p>
          ) : (
            <Table
              headers={["Название", "Дата", "Приз", "Активен"]}
              rows={events.map((e) => [
                e.title,
                new Date(e.event_date).toLocaleDateString("ru-RU"),
                e.prize ?? "—",
                e.active ? "✅" : "❌",
              ])}
            />
          )}
        </Section>

        <div className="mt-12 p-5 glass rounded-xl text-sm text-[#55504C] space-y-1">
          <p className="font-semibold text-[#1D1B19]">Как управлять данными:</p>
          <p>Напишите боту в Telegram на русском языке:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Добавь игру FIFA 26 жанр Спорт</li>
            <li>Измени цену VIP на 9000 тенге</li>
            <li>Добавь акцию «Скидка 20% в будни» до 31 июля</li>
            <li>Обнови телефон на +7 701 234 56 78</li>
            <li>Добавь турнир по Tekken 8 на 20 июля, приз 15000 тенге</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-[#1D1B19] mb-3">{title}</h2>
      <div className="glass rounded-xl overflow-hidden">{children}</div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#B7774E]/10">
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#B7774E] uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#B7774E]/5 hover:bg-[#B7774E]/5 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-[#1D1B19]">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
