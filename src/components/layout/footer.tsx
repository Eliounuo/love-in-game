import { MessageCircle, Link } from "lucide-react";
import { WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-[#1D1B19] text-white py-12">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="font-display text-2xl font-bold tracking-widest uppercase">
              Love in Game
            </div>
            <div className="text-[10px] tracking-[0.25em] text-[#B7774E] uppercase mt-1">
              Gaming Café · Алматы
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/60">
            {[
              ["О нас", "#about"],
              ["Тарифы", "#pricing"],
              ["Игры", "#games"],
              ["Меню", "#menu"],
              ["Турниры", "#tournaments"],
              ["Контакты", "#contacts"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="hover:text-[#B7774E] transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#B7774E] transition-colors duration-200"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#B7774E] transition-colors duration-200"
              aria-label="Instagram"
            >
              <Link size={18} />
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Love in Game. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
