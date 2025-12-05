import React from "react";
import { Badge } from "@/components/ui/badge";
import { Newspaper, BookOpen, Map, Trophy, Sparkles, Swords } from "lucide-react";

const categoryConfig = {
  noticias: { label: "Notícias", icon: Newspaper, className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  guias: { label: "Guias", icon: BookOpen, className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  detonados: { label: "Detonados", icon: Map, className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  torneios: { label: "Torneios", icon: Trophy, className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  curiosidades: { label: "Curiosidades", icon: Sparkles, className: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  estrategias: { label: "Estratégias", icon: Swords, className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function CategoryBadge({ category }) {
  const config = categoryConfig[category] || { label: category, icon: Sparkles, className: "bg-slate-500/20 text-slate-400 border-slate-500/30" };
  const Icon = config.icon;
  
  return (
    <Badge variant="outline" className={`${config.className} border flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}