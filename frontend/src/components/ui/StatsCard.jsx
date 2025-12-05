import React from "react";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, trend, trendUp, color = "red" }) {
  const colorClasses = {
    red: "from-red-500/20 to-red-600/5 border-red-500/30 text-red-500",
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-500",
    yellow: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30 text-yellow-500",
    green: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-500",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClasses[color]} border p-6`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? "text-emerald-400" : "text-red-400"}`}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-white/5`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].split(" ").pop()}`} />
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
    </motion.div>
  );
}