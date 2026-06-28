"use client";

import { motion } from "framer-motion";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#E7D8CC]"
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#B7774E]/8 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#C99268]/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block text-xs tracking-[0.35em] text-[#B7774E] uppercase font-semibold mb-6">
            PlayStation 5 Gaming Café · Алматы
          </span>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-[#1D1B19] leading-[1.05] mb-6">
            Игры нового
            <br />
            <span className="italic text-[#B7774E]">уровня</span>
          </h1>

          <p className="text-lg md:text-xl text-[#55504C] max-w-xl mx-auto mb-10 leading-relaxed">
            Премиальный зал PlayStation 5 с уютной атмосферой,
            отличной кухней и незабываемыми вечерами в Алматы.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <WhatsAppButton
              text="Забронировать сеанс"
              size="lg"
              message="Хочу забронировать сеанс в Love in Game"
            />
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-14 px-8 text-base inline-flex items-center justify-center rounded-full border border-[#B7774E]/30 text-[#55504C] hover:border-[#B7774E] hover:text-[#B7774E] transition-all duration-200"
            >
              Узнать больше
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-sm mx-auto"
        >
          {[
            { value: "PS5", label: "Консоли" },
            { value: "100+", label: "Игр" },
            { value: "24/7", label: "Поддержка" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl font-semibold text-[#B7774E]">{value}</div>
              <div className="text-xs text-[#55504C] tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] text-[#B7774E]/60 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-[#B7774E]/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
