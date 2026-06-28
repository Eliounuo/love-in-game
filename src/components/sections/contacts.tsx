"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Link } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import type { Contact } from "@/lib/types";

type Props = { contacts: Contact[] };

function getContact(contacts: Contact[], type: string) {
  return contacts.find((c) => c.type === type)?.value ?? "";
}

export function ContactsSection({ contacts }: Props) {
  const phone = getContact(contacts, "phone");
  const address = getContact(contacts, "address");
  const hours = getContact(contacts, "hours");
  const instagram = getContact(contacts, "instagram");

  const INFO = [
    { icon: <MapPin size={18} />, label: "Адрес", value: address || "г. Алматы" },
    { icon: <Clock size={18} />, label: "Время работы", value: hours || "Ежедневно: 10:00 – 02:00" },
    { icon: <Phone size={18} />, label: "Телефон", value: phone || "+7 700 000 00 00" },
    { icon: <Link size={18} />, label: "Instagram", value: instagram ? `@${instagram}` : "@loveingame" },
  ];

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

            <div className="pt-4">
              <WhatsAppButton
                text="Написать в WhatsApp"
                size="md"
                message="Хочу узнать подробнее о Love in Game"
                className="w-full justify-center"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center"
          >
            <div className="text-center">
              <MapPin size={40} className="text-[#B7774E] mx-auto mb-3" />
              <p className="font-display text-xl text-[#1D1B19]">Love in Game</p>
              <p className="text-[#55504C] text-sm mt-1">{address || "г. Алматы"}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
