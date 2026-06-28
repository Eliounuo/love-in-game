"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MENU_ITEMS } from "@/lib/constants";

const TABS = [
  { key: "drinks" as const, label: "Напитки", emoji: "☕" },
  { key: "food" as const, label: "Еда", emoji: "🍔" },
  { key: "snacks" as const, label: "Снэки", emoji: "🍿" },
];

export function MenuSection() {
  const [active, setActive] = useState<"drinks" | "food" | "snacks">("drinks");

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
        </motion.div>

        <div className="flex justify-center gap-2 mb-10">
          {TABS.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={[
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
                active === key
                  ? "bg-[#B7774E] text-white shadow-lg shadow-[#B7774E]/25"
                  : "bg-[#EFE3D8] text-[#55504C] hover:bg-[#E7D8CC]",
              ].join(" ")}
            >
              <span>{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {MENU_ITEMS[active].map(({ name, price, desc }) => (
              <div
                key={name}
                className="glass rounded-xl px-5 py-4 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-[#1D1B19] text-sm">{name}</p>
                  <p className="text-[#55504C] text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <span className="shrink-0 font-display text-[#B7774E] font-semibold text-sm whitespace-nowrap">
                  {price}
                </span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
