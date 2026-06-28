"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { ADDRESS, PHONE_DISPLAY, HOURS, INSTAGRAM_URL } from "@/lib/constants";

const EXTERIOR = "https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos/exterior.jpg";

const INFO = [
  { icon: <MapPin size={18} />, label: "Адрес", value: ADDRESS },
  { icon: <Clock size={18} />, label: "Время работы", value: HOURS },
  { icon: <Phone size={18} />, label: "Телефон / WhatsApp", value: PHONE_DISPLAY },
  { icon: <ExternalLink size={18} />, label: "Instagram", value: "@love.in.game1" },
];

export function ContactsSection() {
  return (
    <section id="contacts" className="py-28 bg-[#EFE3D8]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.3em] text-[#B7774E] uppercase font-semibold">Контакты</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#1D1B19] mt-3 leading-tight">
            Найдите нас <span className="italic text-[#B7774E]">в Алматы</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {INFO.map(({ icon, label, value }) => (
              <div key={label} className="glass rounded-xl px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#B7774E]/10 flex items-center justify-center text-[#B7774E] shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-xs text-[#55504C] font-medium tracking-wide uppercase">{label}</p>
                  <p className="text-[#1D1B19] font-semibold text-sm mt-0.5">{value}</p>
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <WhatsAppButton
                text="Написать в WhatsApp"
                size="md"
                message="Хочу узнать подробнее о Love in Game"
                className="flex-1 justify-center"
              />
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-5 inline-flex items-center justify-center rounded-full border border-[#B7774E]/30 text-[#B7774E] hover:bg-[#B7774E]/10 transition-all duration-200 text-sm font-medium gap-2"
              >
                <ExternalLink size={16} />
                Instagram
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl"
          >
            <Image
              src={EXTERIOR}
              alt="Love in Game — фасад здания, ул. Уалиханова 212/2"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              style={{ filter: "brightness(1.04) contrast(1.05) saturate(1.08)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D1B19]/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <p className="font-display text-xl text-white">Love in Game</p>
              <p className="text-white/70 text-sm mt-1">{ADDRESS}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

