import React from "react";
import { motion } from "framer-motion";

const statLabels = {
  hp: "HP",
  attack: "Atk",
  defense: "Def",
  sp_attack: "SpA",
  sp_defense: "SpD",
  speed: "Spe",
};

const statColors = {
  hp: "#ef4444",
  attack: "#f97316",
  defense: "#eab308",
  sp_attack: "#3b82f6",
  sp_defense: "#22c55e",
  speed: "#ec4899",
};

export default function StatsRadar({ stats = {} }) {
  const maxStat = 255;
  
  const defaultStats = {
    hp: stats.hp || 0,
    attack: stats.attack || 0,
    defense: stats.defense || 0,
    sp_attack: stats.sp_attack || 0,
    sp_defense: stats.sp_defense || 0,
    speed: stats.speed || 0,
  };

  const total = Object.values(defaultStats).reduce((a, b) => a + b, 0);

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Base Stats</h3>
      
      <div className="space-y-3">
        {Object.entries(defaultStats).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="w-12 text-white/60 text-sm font-medium">
              {statLabels[key]}
            </span>
            <span className="w-10 text-white font-mono text-sm text-right">
              {value}
            </span>
            <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(value / maxStat) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: statColors[key] }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
        <span className="text-white/60">Total</span>
        <span className="text-xl font-bold text-white">{total}</span>
      </div>
    </div>
  );
}

export function StatsComparison({ pokemon1, pokemon2 }) {
  const stats = ["hp", "attack", "defense", "sp_attack", "sp_defense", "speed"];
  const maxStat = 255;

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Comparação de Stats</h3>
      
      <div className="flex justify-between mb-4 text-sm">
        <span className="text-blue-400 font-medium">{pokemon1?.name}</span>
        <span className="text-red-400 font-medium">{pokemon2?.name}</span>
      </div>

      <div className="space-y-3">
        {stats.map((stat) => {
          const val1 = pokemon1?.stats?.[stat] || 0;
          const val2 = pokemon2?.stats?.[stat] || 0;
          const pct1 = (val1 / maxStat) * 50;
          const pct2 = (val2 / maxStat) * 50;

          return (
            <div key={stat} className="flex items-center gap-2">
              <div className="flex-1 flex justify-end">
                <div className="w-full max-w-[120px] h-3 bg-white/10 rounded-full overflow-hidden flex justify-end">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct1 * 2}%` }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
                <span className="w-8 text-right text-white/60 text-xs ml-2">{val1}</span>
              </div>
              
              <span className="w-10 text-center text-white/60 text-xs font-medium">
                {statLabels[stat]}
              </span>
              
              <div className="flex-1 flex">
                <span className="w-8 text-white/60 text-xs mr-2">{val2}</span>
                <div className="w-full max-w-[120px] h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct2 * 2}%` }}
                    className="h-full bg-red-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}