"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

const NAV_LINKS = [
  { label: "О нас", href: "#about" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Игры", href: "#games" },
  { label: "Меню", href: "#menu" },
  { label: "Галерея", href: "#gallery" },
  { label: "Контакты", href: "#contacts" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-sm" : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }}
          className="font-display text-xl font-bold tracking-widest uppercase text-[#1D1B19]"
        >
          Love in Game
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className="text-sm text-[#55504C] hover:text-[#B7774E] transition-colors duration-200 font-medium"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <WhatsAppButton
            text="Забронировать"
            size="sm"
            message="Хочу забронировать в Love in Game"
          />
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#B7774E]/10 transition-colors"
          aria-label="Меню"
        >
          {open ? <X size={20} className="text-[#1D1B19]" /> : <Menu size={20} className="text-[#1D1B19]" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-[#B7774E]/10 overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-3">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={href}
                  onClick={() => scrollTo(href)}
                  className="text-left text-sm text-[#55504C] hover:text-[#B7774E] transition-colors py-1 font-medium"
                >
                  {label}
                </button>
              ))}
              <div className="pt-2">
                <WhatsAppButton
                  text="Забронировать"
                  size="sm"
                  message="Хочу забронировать в Love in Game"
                  className="w-full justify-center"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}