"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { REVIEWS } from "@/lib/constants";

export function ReviewsSection() {
  return (
    <section id="reviews" className="py-28 bg-[#E7D8CC]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.3em] text-[#B7774E] uppercase font-semibold">Отзывы</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#1D1B19] mt-3 leading-tight">
            Что говорят <span className="italic text-[#B7774E]">гости</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map(({ name, initials, rating, date, text }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="glass rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex gap-1">
                {Array.from({ length: rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-[#B7774E] text-[#B7774E]" />
                ))}
              </div>

              <p className="text-[#55504C] text-sm leading-relaxed flex-1">"{text}"</p>

              <div className="flex items-center gap-3 pt-2 border-t border-[#B7774E]/10">
                <div className="w-9 h-9 rounded-full bg-[#B7774E] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="text-[#1D1B19] text-sm font-semibold">{name}</p>
                  <p className="text-[#55504C] text-xs">{date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-[#55504C] text-sm">
            Более 200 отзывов · средняя оценка{" "}
            <span className="text-[#B7774E] font-semibold">5.0 ★</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
