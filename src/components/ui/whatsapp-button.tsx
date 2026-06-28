"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = {
  text?: string;
  variant?: Variant;
  size?: Size;
  message?: string;
  className?: string;
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm gap-2",
  md: "h-12 px-7 text-sm gap-2.5",
  lg: "h-14 px-8 text-base gap-3",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[#B7774E] text-white shadow-lg shadow-[#B7774E]/25 hover:bg-[#A3673F] hover:shadow-[#B7774E]/40",
  outline:
    "border border-[#B7774E] text-[#B7774E] hover:bg-[#B7774E] hover:text-white",
  ghost: "text-[#B7774E] hover:bg-[#B7774E]/10",
};

export function WhatsAppButton({
  text = "Забронировать",
  variant = "primary",
  size = "md",
  message,
  className = "",
}: Props) {
  const href = message
    ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
    : WHATSAPP_URL;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={[
        "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200",
        sizes[size],
        variants[variant],
        className,
      ].join(" ")}
    >
      <MessageCircle
        style={{
          width: size === "sm" ? 16 : size === "lg" ? 20 : 18,
          height: size === "sm" ? 16 : size === "lg" ? 20 : 18,
        }}
        className="shrink-0"
      />
      {text}
    </motion.a>
  );
}
