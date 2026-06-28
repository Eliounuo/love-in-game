"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import type { Pricing } from "@/lib/types";

type Props = { pricing: Pricing[] };

export function PricingSection({ pricing }: Props) {
  return (
    <section id="pricing" className="py-28 bg-[#EFE3D8]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.3em] text-[#B7774E] uppercase font-semibold">Тарифы</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#1D1B19] mt-3 leading-tight">
            Выберите свой <span className="italic text-[#B7774E]">формат</span>
          </h2>
          <p className="text-[#55504C] mt-4 max-w-md mx-auto">
            Без предоплаты — оплата на месте. Бронирование за 1 минуту в WhatsApp.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pricing.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={[
                "relative rounded-2xl p-6 flex flex-col",
                plan.popular
                  ? "bg-[#B7774E] text-white shadow-2xl shadow-[#B7774E]/30 scale-[1.03]"
                  : "glass",
              ].join(" ")}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D1B19] text-white text-[10px] tracking-widest uppercase px-4 py-1 rounded-full">
                  Популярный
                </span>
              )}

              <div className="mb-4">
                <h3
                  className={[
                    "font-display text-2xl font-semibold",
                    plan.popular ? "text-white" : "text-[#1D1B19]",
                  ].join(" ")}
                >
                  {plan.name}
                </h3>
                <p className={["text-sm mt-1", plan.popular ? "text-white/70" : "text-[#55504C]"].join(" ")}>
                  {plan.duration} · {plan.players}
                </p>
              </div>

              <div className="mb-6">
                <span
                  className={[
                    "font-display text-4xl font-bold",
                    plan.popular ? "text-white" : "text-[#B7774E]",
                  ].join(" ")}
                >
                  {plan.price.toLocaleString("ru-KZ")} ₸
                </span>
              </div>

              <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      size={14}
                      className={["mt-0.5 shrink-0", plan.popular ? "text-white/70" : "text-[#B7774E]"].join(" ")}
                    />
                    <span className={plan.popular ? "text-white/90" : "text-[#55504C]"}>{f}</span>
                  </li>
                ))}
              </ul>

              <WhatsAppButton
                text="Забронировать"
                variant={plan.popular ? "outline" : "primary"}
                size="sm"
                message={`Хочу забронировать тариф «${plan.name}» в Love in Game`}
                className={plan.popular ? "border-white text-white hover:bg-white hover:text-[#B7774E]" : ""}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
