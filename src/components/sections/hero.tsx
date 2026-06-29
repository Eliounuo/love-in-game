"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

const INTERIOR = "https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos/interior.jpg";

export function Hero() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 700], ["0px", "180px"]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div
        className="absolute"
        style={{ top: "-20%", right: "-20%", bottom: "-20%", left: "-20%", y: bgY }}
      >
        <Image
          src={INTERIOR}
          alt="Love in Game интерьер"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{ filter: "brightness(0.47) contrast(1.06) saturate(1.12)" }}
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1D1B19]/60 via-[#1D1B19]/15 to-[#1D1B19]/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#B7774E]/8 via-transparent to-transparent" />

      {/* Corner decoration top-left */}
      <div className="absolute top-28 left-8 md:left-14 pointer-events-none" style={{ opacity: 0.22 }}>
        <div style={{ width: 1, height: 60, background: "#C99268" }} />
        <div style={{ width: 48, height: 1, background: "#C99268" }} />
      </div>
      {/* Corner decoration top-right */}
      <div className="absolute top-28 right-8 md:right-14 pointer-events-none flex flex-col items-end" style={{ opacity: 0.22 }}>
        <div style={{ width: 1, height: 60, background: "#C99268", marginLeft: "auto" }} />
        <div style={{ width: 48, height: 1, background: "#C99268" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 text-center">

        {/* Eyebrow with side lines */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="h-px w-10 bg-[#C99268]/45" />
          <span className="text-[10px] tracking-[0.4em] text-[#C99268] uppercase font-semibold">
            PlayStation 5 Gaming Cafe · Кокшетау
          </span>
          <div className="h-px w-10 bg-[#C99268]/45" />
        </motion.div>

        {/* Headline — word by word reveal */}
        <h1 className="font-display font-light text-white mb-8" style={{ lineHeight: 0.92 }}>
          <div style={{ overflow: "hidden" }}>
            {["Игры", "нового"].map((word, i) => (
              <motion.span
                key={word}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 0.15 + i * 0.13, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "inline-block",
                  marginRight: "0.22em",
                  fontSize: "clamp(52px, 7.5vw, 108px)",
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.41, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "block", fontSize: "clamp(52px, 7.5vw, 108px)" }}
              className="italic text-[#C99268]"
            >
              уровня
            </motion.span>
          </div>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg text-white/58 max-w-sm mx-auto mb-10 leading-relaxed tracking-wide"
        >
          Премиальный зал PlayStation 5 с уютной атмосферой,
          отличной кухней и незабываемыми вечерами.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
        >
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
            className="h-14 px-8 text-xs tracking-[0.2em] uppercase inline-flex items-center justify-center rounded-full border border-white/20 text-white/65 hover:border-[#C99268] hover:text-[#C99268] transition-all duration-300"
          >
            Узнать больше
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="flex items-center justify-center gap-10 md:gap-16"
        >
          {[
            { value: "PS5", label: "Консоли" },
            { value: "100+", label: "Игр" },
            { value: "24/7", label: "Поддержка" },
          ].map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 + i * 0.09, duration: 0.5 }}
              className="text-center"
            >
              <div className="font-display text-3xl md:text-4xl font-semibold text-[#C99268]">
                {value}
              </div>
              <div
                className="text-white/35 font-medium"
                style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 8 }}
              >
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="text-[#C99268]/40 uppercase font-medium"
          style={{ fontSize: 9, letterSpacing: "0.35em" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-[#C99268]/35 to-transparent"
        />
      </motion.div>
    </section>
  );
}