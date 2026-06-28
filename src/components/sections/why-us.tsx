"use client";

import { motion } from "framer-motion";
import { WHY_US } from "@/lib/constants";

export function WhyUs() {
  return (
    <section id="why" className="py-28 bg-[#E7D8CC]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.3em] text-[#B7774E] uppercase font-semibold">Преимущества</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#1D1B19] mt-3 leading-tight">
            Почему выбирают <span className="italic text-[#B7774E]">нас</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US.map(({ icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-7 transition-shadow duration-300 hover:shadow-md"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-display text-xl font-semibold text-[#1D1B19] mb-2">{title}</h3>
              <p className="text-[#55504C] text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
