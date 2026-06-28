"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

const INTERIOR = "https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos/interior.jpg";
const LOGO_CARD = "https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos/logo-card.jpg";

const PERKS = [
  { icon: "🎮", text: "PlayStation 5 нового поколения" },
  { icon: "🛋️", text: "Уютные VIP-зоны" },
  { icon: "🍽️", text: "Полноценное меню кухни" },
  { icon: "🏆", text: "Турниры с призами" },
];

export function About() {
  return (
    <section id="about" className="py-28 bg-[#EFE3D8]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-16 items-center">
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
            Love in Game — это премиальный игровой зал в сердце Кокшетау,
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

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#B7774E]/10 shadow-2xl">
            <Image
              src={INTERIOR}
              alt="Интерьер Love in Game"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              style={{ filter: "brightness(1.03) contrast(1.06) saturate(1.12)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D1B19]/25 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 -left-4 w-32 h-32 rounded-2xl overflow-hidden shadow-xl border border-[#B7774E]/20">
            <Image
              src={LOGO_CARD}
              alt="Love in Game логотип"
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
          <div className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-3 shadow-lg">
            <div className="font-display text-2xl font-semibold text-[#B7774E]">5★</div>
            <div className="text-xs text-[#55504C] mt-0.5">Рейтинг гостей</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}