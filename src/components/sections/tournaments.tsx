"use client";

import { motion } from "framer-motion";
import { Calendar, Trophy } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import type { Event } from "@/lib/types";

type Props = { events: Event[] };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function TournamentsSection({ events }: Props) {
  return (
    <section id="tournaments" className="py-28 bg-[#EFE3D8]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.3em] text-[#B7774E] uppercase font-semibold">Турниры</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#1D1B19] mt-3 leading-tight">
            Сражайся за <span className="italic text-[#B7774E]">призы</span>
          </h2>
          <p className="text-[#55504C] mt-4 max-w-md mx-auto">
            Регулярные соревнования по FIFA, Tekken, NBA 2K и другим играм.
            Регистрация через WhatsApp.
          </p>
        </motion.div>

        {events.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 text-[#B7774E] text-xs font-semibold mb-3">
                  <Calendar size={13} />
                  <span>{formatDate(event.event_date)}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-[#1D1B19] mb-2">
                  {event.title}
                </h3>
                <p className="text-[#55504C] text-sm leading-relaxed mb-4">{event.description}</p>
                {event.prize && (
                  <div className="flex items-center gap-2 text-[#B7774E] text-sm font-semibold">
                    <Trophy size={14} />
                    <span>Приз: {event.prize}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-10 text-center mb-12 max-w-lg mx-auto">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="font-display text-2xl text-[#1D1B19] mb-2">Скоро новые турниры</h3>
            <p className="text-[#55504C] text-sm">
              Следите за анонсами в нашем Instagram и WhatsApp-канале.
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <WhatsAppButton
            text="Зарегистрироваться на турнир"
            size="md"
            message="Хочу зарегистрироваться на турнир в Love in Game"
          />
        </motion.div>
      </div>
    </section>
  );
}
