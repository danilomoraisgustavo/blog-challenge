import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Calendar, Eye, User, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const categoryColors = {
  noticias: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  guias: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  detonados: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  torneios: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  curiosidades: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  estrategias: "bg-red-500/20 text-red-400 border-red-500/30",
};

const categoryLabels = {
  noticias: "Notícias",
  guias: "Guias",
  detonados: "Detonados",
  torneios: "Torneios",
  curiosidades: "Curiosidades",
  estrategias: "Estratégias",
};

export default function ArticleCard({ article, featured = false }) {
  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl group"
      >
        <Link to={createPageUrl(`BlogPost?id=${article.id}`)}>
          <div className="aspect-[21/9] relative">
            {article.cover_image ? (
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-blue-500/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <Badge className={`${categoryColors[article.category]} border mb-3`}>
                {categoryLabels[article.category] || article.category}
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                {article.title}
              </h2>
              <p className="text-white/70 text-sm md:text-base mb-4 line-clamp-2 max-w-3xl">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-4 text-white/50 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {article.created_at && format(new Date(article.created_at), "dd MMM yyyy", { locale: ptBR })}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {article.views || 0} views
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl overflow-hidden group hover:border-white/20 transition-colors"
    >
      <Link to={createPageUrl(`BlogPost?id=${article.id}`)}>
        <div className="aspect-video relative overflow-hidden">
          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={`${categoryColors[article.category]} border`}>
              {categoryLabels[article.category] || article.category}
            </Badge>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-white/60 text-sm mb-4 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-white/40 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {article.created_at && format(new Date(article.created_at), "dd/MM/yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views || 0}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}