"use client";

import { motion } from "framer-motion";
import type { GalleryItem } from "@/lib/types";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

type Props = { gallery: GalleryItem[] };

const PLACEHOLDER_ITEMS = [
  { label: "Игровые зоны", emoji: "🛋️" },
  { label: "VIP комнаты", emoji: "👑" },
  { label: "Кухня и бар", emoji: "🍔" },
  { label: "Турниры", emoji: "🏆" },
  { label: "Консоли PS5", emoji: "🎮" },
  { label: "Атмосфера", emoji: "✨" },
];

export function GallerySection({ gallery }: Props) {
  const items = gallery.length > 0 ? gallery : null;

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

        {items ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={[
                  "overflow-hidden rounded-2xl",
                  i === 0 ? "md:col-span-2" : "",
                ].join(" ")}
              >
                <img
                  src={item.url}
                  alt={item.caption ?? "Love in Game"}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PLACEHOLDER_ITEMS.map(({ label, emoji }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={[
                  "glass rounded-2xl flex items-center justify-center",
                  i === 0 ? "md:col-span-2 h-64" : "h-48",
                ].join(" ")}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">{emoji}</div>
                  <div className="text-sm text-[#55504C] font-medium">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

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
