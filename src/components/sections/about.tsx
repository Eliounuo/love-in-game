"use client";

import { motion } from "framer-motion";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

const PERKS = [
  { icon: "🎮", text: "PlayStation 5 нового поколения" },
  { icon: "🛋️", text: "Уютные VIP-зоны" },
  { icon: "🍔", text: "Своя кухня и бар" },
  { icon: "🏆", text: "Турниры с призами" },
];

export function About() {
  return (
    <section id="about" className="py-28 bg-[#EFE3D8]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-xs tracking-[0.3em] text-[#B7774E] uppercase font-semibold">О нас</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#1D1B19] mt-3 mb-6 leading-tight">
            Место, где игры
            <br />
            <span className="italic text-[#B7774E]">становятся впечатлениями</span>
          </h2>
          <p className="text-[#55504C] text-lg leading-relaxed mb-6">
            Love in Game — это премиальный игровой зал в сердце Алматы,
            созданный для тех, кто ценит комфорт и качество. Мы объединили
            лучшие консоли PlayStation 5, стильный интерьер и атмосферу
            настоящего лаунжа.
          </p>
          <p className="text-[#55504C] text-lg leading-relaxed mb-10">
            Здесь проводят время пары на свидании, друзья после работы
            и геймеры, которые хотят играть на топовом оборудовании.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {PERKS.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-[#55504C]">
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>

          <WhatsAppButton
            text="Забронировать"
            size="md"
            message="Хочу забронировать столик в Love in Game"
          />
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-3xl bg-[#E7D8CC] border border-[#B7774E]/10 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🎮</div>
                <div className="font-display text-2xl text-[#B7774E]">Love in Game</div>
                <div className="text-[#55504C] text-sm mt-2">Gaming Café · Алматы</div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#B7774E]/10 rounded-tl-3xl" />
            <div className="absolute top-0 left-0 w-20 h-20 bg-[#C99268]/10 rounded-br-3xl" />
          </div>
          <div className="absolute -bottom-5 -left-5 glass rounded-2xl px-5 py-4 shadow-lg">
            <div className="font-display text-2xl font-semibold text-[#B7774E]">5★</div>
            <div className="text-xs text-[#55504C] mt-0.5">Рейтинг гостей</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
