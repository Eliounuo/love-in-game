"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

const LUNCH_PHOTO = "https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos/lunch-1.jpg";
const LUNCH_PHOTO_2 = "https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos/lunch-2.jpg";

const INCLUDED = [
  "Суп на выбор",
  "Горячее блюдо",
  "Салат",
  "Свежая булочка",
  "Напиток",
];

export function BusinessLunch() {
  return (
    <section id="business-lunch" className="py-28 bg-[#1D1B19] relative overflow-hidden">
      {/* Warm accent glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B7774E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#C99268]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs tracking-[0.3em] text-[#C99268] uppercase font-semibold">
              Ежедневно с 12:00 до 16:00
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mt-3 mb-4 leading-tight">
              Бизнес-ланч
              <br />
              <span className="italic text-[#C99268]">всего за 2 290 ₸</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Комплексный обед с первым, вторым, салатом и напитком.
              Сытно, вкусно и быстро — идеально для обеденного перерыва.
            </p>

            <div className="space-y-3 mb-10">
              {INCLUDED.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C99268] shrink-0" />
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <WhatsAppButton
              text="Забронировать место"
              size="md"
              message="Хочу забронировать бизнес-ланч в Love in Game"
              className="bg-[#C99268] hover:bg-[#B7774E]"
            />
          </motion.div>

          {/* Photos */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden col-span-1">
              <Image
                src={LUNCH_PHOTO}
                alt="Бизнес-ланч в Love in Game"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center"
                style={{ filter: "brightness(1.05) contrast(1.08) saturate(1.12)" }}
              />
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden col-span-1 mt-8">
              <Image
                src={LUNCH_PHOTO_2}
                alt="Комплексный обед"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center"
                style={{ filter: "brightness(1.05) contrast(1.08) saturate(1.12)" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
