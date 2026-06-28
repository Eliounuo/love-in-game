"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

const INTERIOR = "https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos/interior.jpg";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Real interior photo as background */}
      <div className="absolute inset-0">
        <Image
          src={INTERIOR}
          alt="Love in Game интерьер"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{ filter: "brightness(0.55) contrast(1.05) saturate(1.1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1D1B19]/60 via-[#1D1B19]/25 to-[#1D1B19]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#B7774E]/8 via-transparent to-[#B7774E]/5" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block text-xs tracking-[0.35em] text-[#C99268] uppercase font-semibold mb-6">
            PlayStation 5 Gaming Café · Алматы
          </span>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[1.05] mb-6">
            Игры нового
            <br />
            <span className="italic text-[#C99268]">уровня</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
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
              className="h-14 px-8 text-base inline-flex items-center justify-center rounded-full border border-white/30 text-white hover:border-[#C99268] hover:text-[#C99268] transition-all duration-200"
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
              <div className="font-display text-3xl font-semibold text-[#C99268]">{value}</div>
              <div className="text-xs text-white/60 tracking-wider mt-1">{label}</div>
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
        <span className="text-[10px] tracking-[0.2em] text-[#C99268]/70 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-[#C99268]/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
