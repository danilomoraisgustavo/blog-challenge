import React from "react";
import { Badge } from "@/components/ui/badge";

const genConfig = {
  gen1: { label: "Gen I", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  gen2: { label: "Gen II", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  gen3: { label: "Gen III", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  gen4: { label: "Gen IV", color: "bg-sky-500/20 text-sky-400 border-sky-500/30" },
  gen5: { label: "Gen V", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  gen6: { label: "Gen VI", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  gen7: { label: "Gen VII", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  gen8: { label: "Gen VIII", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  gen9: { label: "Gen IX", color: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
  geral: { label: "Geral", color: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
};

export default function GenerationBadge({ generation }) {
  const config = genConfig[generation] || genConfig.geral;
  
  return (
    <Badge variant="outline" className={`${config.color} border`}>
      {config.label}
    </Badge>
  );
}