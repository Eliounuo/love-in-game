"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

const BASE = "https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos";

const REAL_PHOTOS = [
  { src: `${BASE}/interior.jpg`, alt: "Уютный интерьер Love in Game", span: "md:col-span-2" },
  { src: `${BASE}/menu-pizza.jpg`, alt: "Пицца", span: "" },
  { src: `${BASE}/menu-breakfast.jpg`, alt: "Завтраки", span: "" },
  { src: `${BASE}/lunch-1.jpg`, alt: "Бизнес-ланч", span: "" },
  { src: `${BASE}/menu-soups.jpg`, alt: "Супы", span: "" },
  { src: `${BASE}/lunch-2.jpg`, alt: "Блюда кухни", span: "" },
];

export function GallerySection() {
  return (
    <section id="gallery" className="py-28 bg-[#EFE3D8]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.3em] text-[#B7774E] uppercase font-semibold">Галерея</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#1D1B19] mt-3 leading-tight">
            Атмосфера <span className="italic text-[#B7774E]">Love in Game</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {REAL_PHOTOS.map(({ src, alt, span }, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={["relative overflow-hidden rounded-2xl group", span, i === 0 ? "h-72" : "h-52"].join(" ")}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                style={{ filter: "brightness(1.02) contrast(1.06) saturate(1.1)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D1B19]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <WhatsAppButton
            text="Хочу увидеть вживую"
            size="md"
            message="Хочу посетить Love in Game и увидеть всё вживую"
          />
        </motion.div>
      </div>
    </section>
  );
}
