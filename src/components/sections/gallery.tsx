"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

const BASE = "https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos";

const PHOTOS = [
  { src: `${BASE}/interior.jpg`,       alt: "Интерьер Love in Game",    span: "md:col-span-2", pos: "object-center", wide: true },
  { src: `${BASE}/menu-pizza.jpg`,     alt: "Пицца",                    span: "",              pos: "object-top",    wide: false },
  { src: `${BASE}/menu-breakfast.jpg`, alt: "Завтраки",                 span: "",              pos: "object-top",    wide: false },
  { src: `${BASE}/lunch-1.jpg`,        alt: "Бизнес-ланч",              span: "",              pos: "object-top",    wide: false },
  { src: `${BASE}/menu-soups.jpg`,     alt: "Супы",                     span: "",              pos: "object-top",    wide: false },
  { src: `${BASE}/lunch-2.jpg`,        alt: "Блюда кухни",              span: "",              pos: "object-top",    wide: false },
];

export function GallerySection() {
  return (
    <section id="gallery" className="py-28 bg-[#EFE3D8]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
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
          {PHOTOS.map(({ src, alt, span, pos, wide }, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={[
                "relative overflow-hidden rounded-2xl group cursor-pointer",
                span,
                wide ? "aspect-[2/1]" : "aspect-[4/3]",
              ].join(" ")}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className={["object-cover transition-transform duration-700 group-hover:scale-105", pos].join(" ")}
                style={{ filter: "brightness(1.03) contrast(1.06) saturate(1.08)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D1B19]/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 p-4 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <p className="text-white text-xs font-medium tracking-wide">{alt}</p>
              </div>
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