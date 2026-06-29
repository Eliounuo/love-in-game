"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MENU_CATEGORIES } from "@/lib/constants";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import type { MenuCategory, MenuItem } from "@/lib/types";

type Props = { categories: MenuCategory[]; items: MenuItem[] };

export function MenuSection({ categories, items }: Props) {
  // Fallback to hardcoded constants if Supabase tables not yet created
  const cats: { key: string; label: string; photo: string }[] =
    categories.length > 0
      ? categories.map((c) => ({ key: c.key, label: c.label, photo: c.photo_url ?? "" }))
      : MENU_CATEGORIES.map((c) => ({ key: c.key, label: c.label, photo: c.photo }));

  const [active, setActive] = useState(cats[0]?.key ?? "pizza");
  const current = cats.find((c) => c.key === active) ?? cats[0];

  const currentItems: { name: string; price: string }[] =
    items.length > 0
      ? items.filter((i) => i.category_key === active)
      : [...(MENU_CATEGORIES.find((c) => c.key === active)?.items ?? [])];

  return (
    <section id="menu" className="py-28 bg-[#E7D8CC]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs tracking-[0.3em] text-[#B7774E] uppercase font-semibold">Меню</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#1D1B19] mt-3 leading-tight">
            Вкусно во время <span className="italic text-[#B7774E]">игры</span>
          </h2>
          <p className="text-[#55504C] mt-4 text-base max-w-lg mx-auto">
            Собственная кухня с полным меню — завтраки, супы, горячее, пицца, салаты.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {cats.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={[
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                active === key
                  ? "bg-[#B7774E] text-white shadow-lg shadow-[#B7774E]/25"
                  : "bg-[#EFE3D8] text-[#55504C] hover:bg-[#E0D0C4]",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-8 items-stretch"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl group">
              {current?.photo && (
                <Image
                  src={current.photo}
                  alt={current.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "brightness(1.03) contrast(1.06) saturate(1.1)" }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D1B19]/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="font-display text-2xl text-white font-light">{current?.label}</span>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3">
              {currentItems.map(({ name, price }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="glass rounded-xl px-5 py-4 flex items-center justify-between gap-4"
                >
                  <span className="text-[#1D1B19] font-medium text-sm">{name}</span>
                  <span className="shrink-0 font-display text-[#B7774E] font-semibold text-sm whitespace-nowrap">
                    {price}
                  </span>
                </motion.div>
              ))}
              <div className="pt-4">
                <WhatsAppButton
                  text="Заказать сейчас"
                  size="md"
                  message={`Хочу заказать из категории "${current?.label}" в Love in Game`}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}