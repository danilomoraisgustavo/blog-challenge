import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const typeColors = {
  normal: "bg-gray-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-400",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-stone-500",
  ghost: "bg-violet-700",
  dragon: "bg-indigo-700",
  dark: "bg-stone-800",
  steel: "bg-slate-400",
  fairy: "bg-pink-400",
};

const typeGradients = {
  normal: "from-gray-400/20 to-gray-600/5",
  fire: "from-orange-500/20 to-red-600/5",
  water: "from-blue-500/20 to-cyan-600/5",
  electric: "from-yellow-400/20 to-amber-600/5",
  grass: "from-green-500/20 to-emerald-600/5",
  ice: "from-cyan-400/20 to-blue-600/5",
  fighting: "from-red-700/20 to-orange-600/5",
  poison: "from-purple-500/20 to-violet-600/5",
  ground: "from-amber-600/20 to-yellow-600/5",
  flying: "from-indigo-400/20 to-sky-600/5",
  psychic: "from-pink-500/20 to-purple-600/5",
  bug: "from-lime-500/20 to-green-600/5",
  rock: "from-stone-500/20 to-amber-600/5",
  ghost: "from-violet-700/20 to-purple-900/5",
  dragon: "from-indigo-700/20 to-violet-800/5",
  dark: "from-stone-800/20 to-gray-900/5",
  steel: "from-slate-400/20 to-gray-600/5",
  fairy: "from-pink-400/20 to-rose-600/5",
};

export default function PokemonCard({ pokemon }) {
  const primaryType = pokemon.types?.[0]?.toLowerCase() || "normal";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${typeGradients[primaryType]} border border-white/10 hover:border-white/20 transition-all group cursor-pointer`}
    >
      <Link to={createPageUrl(`PokemonDetail?id=${pokemon.id}`)}>
        <div className="p-4">
          {/* Number */}
          <span className="text-white/30 text-xs font-mono">
            #{pokemon.pokedex_number?.toString().padStart(4, "0")}
          </span>

          {/* Sprite */}
          <div className="relative w-full aspect-square flex items-center justify-center my-2">
            {pokemon.sprite_url ? (
              <img
                src={pokemon.sprite_url}
                alt={pokemon.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                <span className="text-3xl font-bold text-white/20">?</span>
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="text-white font-semibold text-center mb-2 truncate">
            {pokemon.name}
          </h3>

          {/* Types */}
          <div className="flex justify-center gap-1">
            {pokemon.types?.map((type) => (
              <span
                key={type}
                className={`${typeColors[type.toLowerCase()] || "bg-gray-500"} text-white text-xs px-2 py-0.5 rounded-full capitalize`}
              >
                {type}
              </span>
            ))}
          </div>

          {/* Tier Badge */}
          {pokemon.tier && pokemon.tier !== "nao_classificado" && (
            <div className="mt-3 text-center">
              <span className="text-white/40 text-xs uppercase tracking-wider">
                {pokemon.tier}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}