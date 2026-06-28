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
  { label: "Отзывы", href: "#reviews" },
  { label: "Контакты", href: "#contacts" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={[
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "glass border-b border-[rgba(183,119,78,0.12)] py-3"
            : "py-5 bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex flex-col leading-none select-none"
          >
            <span className="font-display text-xl font-bold tracking-widest text-[#1D1B19] uppercase">
              Love in Game
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[#B7774E] uppercase font-medium">
              Gaming Café
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm text-[#55504C] hover:text-[#B7774E] font-medium transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <WhatsAppButton text="Забронировать" size="sm" className="hidden sm:inline-flex" />
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[#EFE3D8] text-[#1D1B19]"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[68px] z-40 glass border-b border-[rgba(183,119,78,0.12)] px-5 py-6 lg:hidden"
          >
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-base font-medium text-[#1D1B19] hover:text-[#B7774E] transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <WhatsAppButton text="Забронировать" size="md" className="mt-2 w-full" />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
