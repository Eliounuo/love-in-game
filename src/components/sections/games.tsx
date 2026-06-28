"use client";

import { motion } from "framer-motion";
import type { Game } from "@/lib/types";

type Props = { games: Game[] };

const GENRE_COLORS: Record<string, string> = {
  Спорт: "bg-blue-100 text-blue-700",
  Экшен: "bg-red-100 text-red-700",
  Файтинг: "bg-purple-100 text-purple-700",
  Шутер: "bg-orange-100 text-orange-700",
  Гонки: "bg-yellow-100 text-yellow-700",
  RPG: "bg-green-100 text-green-700",
  Другое: "bg-[#EFE3D8] text-[#B7774E]",
};

function genreColor(genre: string) {
  return GENRE_COLORS[genre] ?? GENRE_COLORS["Другое"];
}

export function GamesSection({ games }: Props) {
  return (
    <section id="games" className="py-28 bg-[#E7D8CC]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.3em] text-[#B7774E] uppercase font-semibold">Игры</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#1D1B19] mt-3 leading-tight">
            Более <span className="italic text-[#B7774E]">100 игр</span> на выбор
          </h2>
          <p className="text-[#55504C] mt-4 max-w-md mx-auto">
            Топовые тайтлы PlayStation 5. Библиотека пополняется каждый месяц.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              whileHover={{ y: -3 }}
              className="glass rounded-xl p-4 flex flex-col gap-2 cursor-default"
            >
              {game.cover_url ? (
                <img
                  src={game.cover_url}
                  alt={game.title}
                  className="w-full aspect-[3/4] object-cover rounded-lg mb-1"
                />
              ) : (
                <div className="w-full aspect-[3/4] rounded-lg bg-[#E7D8CC] flex items-center justify-center mb-1">
                  <span className="text-3xl">🎮</span>
                </div>
              )}
              <p className="text-[#1D1B19] text-xs font-semibold leading-tight line-clamp-2">
                {game.title}
              </p>
              <span
                className={[
                  "self-start text-[10px] px-2 py-0.5 rounded-full font-medium",
                  genreColor(game.genre),
                ].join(" ")}
              >
                {game.genre}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-[#55504C] text-sm mt-10"
        >
          И ещё десятки игр — уточняйте у администраторов
        </motion.p>
      </div>
    </section>
  );
}
