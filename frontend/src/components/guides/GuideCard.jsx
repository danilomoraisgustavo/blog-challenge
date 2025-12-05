import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { BookOpen, Layers, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const typeConfig = {
  detonado: { label: "Detonado", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  guia_pokemon: { label: "Guia Pokémon", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  guia_itens: { label: "Guia de Itens", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  guia_competitivo: { label: "Competitivo", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  walkthrough: { label: "Walkthrough", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
};

const statusLabels = {
  rascunho: "Rascunho",
  em_progresso: "Em Progresso",
  completo: "Completo",
};

export default function GuideCard({ guide }) {
  const typeInfo = typeConfig[guide.type] || typeConfig.detonado;
  const chapterCount = guide.chapters?.length || 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl overflow-hidden group hover:border-white/20 transition-all"
    >
      <Link to={createPageUrl(`GuideDetail?id=${guide.id}`)}>
        <div className="aspect-video relative overflow-hidden">
          {guide.cover_image ? (
            <img
              src={guide.cover_image}
              alt={guide.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white/20" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={`${typeInfo.color} border`}>{typeInfo.label}</Badge>
          </div>
          {guide.status === "completo" && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-emerald-500/80 text-white border-0">✓ Completo</Badge>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-emerald-400 transition-colors line-clamp-2">
            {guide.title}
          </h3>
          <p className="text-white/50 text-sm mb-3">{guide.game}</p>
          
          {guide.description && (
            <p className="text-white/60 text-sm mb-4 line-clamp-2">{guide.description}</p>
          )}

          <div className="flex items-center justify-between text-white/40 text-xs">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {chapterCount} {chapterCount === 1 ? "capítulo" : "capítulos"}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {guide.views || 0}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}