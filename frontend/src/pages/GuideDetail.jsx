import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Layers, Eye, ChevronRight, ChevronLeft, Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import GuideCard from "@/components/guides/GuideCard";
import ChapterNav from "@/components/guides/ChapterNav";

const typeConfig = {
  detonado: { label: "Detonado", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  guia_pokemon: { label: "Guia Pokémon", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  guia_itens: { label: "Guia de Itens", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  guia_competitivo: { label: "Competitivo", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  walkthrough: { label: "Walkthrough", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
};

const genLabels = {
  gen1: "Geração I", gen2: "Geração II", gen3: "Geração III", gen4: "Geração IV",
  gen5: "Geração V", gen6: "Geração VI", gen7: "Geração VII", gen8: "Geração VIII", gen9: "Geração IX",
};

export default function GuideDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const guideId = urlParams.get("id");
  const [activeChapter, setActiveChapter] = useState(0);
  const [completedChapters, setCompletedChapters] = useState([]);

  const { data: guide, isLoading } = useQuery({
    queryKey: ["guide", guideId],
    queryFn: async () => {
      const guides = await api.entities.Guide.filter({ id: guideId });
      return guides[0];
    },
    enabled: !!guideId,
  });

  const { data: relatedGuides = [] } = useQuery({
    queryKey: ["related-guides", guide?.generation],
    queryFn: () => api.entities.Guide.filter({ generation: guide.generation }, "-views", 4),
    enabled: !!guide?.generation,
  });

  const filteredRelated = relatedGuides.filter((g) => g.id !== guideId && g.status !== "rascunho").slice(0, 3);

  const markComplete = (index) => {
    if (!completedChapters.includes(index)) {
      setCompletedChapters([...completedChapters, index]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Carregando guia..." />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Guia não encontrado</h1>
        <Link to={createPageUrl("GuidesIndex")}>
          <Button className="pokemon-gradient text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Guias
          </Button>
        </Link>
      </div>
    );
  }

  const typeInfo = typeConfig[guide.type] || typeConfig.detonado;
  const chapters = guide.chapters || [];
  const currentChapter = chapters[activeChapter];

  return (
    <div>
      {/* Hero */}
      <div className="relative">
        {guide.cover_image && (
          <div className="absolute inset-0 h-72">
            <img src={guide.cover_image} alt={guide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-12">
          <Link to={createPageUrl("GuidesIndex")} className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Guias
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={`${typeInfo.color} border`}>{typeInfo.label}</Badge>
              {guide.generation && <Badge variant="outline" className="text-white/60 border-white/20">{genLabels[guide.generation]}</Badge>}
              {guide.status === "completo" && <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">✓ Completo</Badge>}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{guide.title}</h1>
            <p className="text-white/60 text-lg mb-4">{guide.game}</p>

            {guide.description && <p className="text-white/70 max-w-3xl mb-4">{guide.description}</p>}

            <div className="flex items-center gap-4 text-white/50 text-sm">
              <span className="flex items-center gap-1"><Layers className="w-4 h-4" />{chapters.length} capítulos</span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{guide.views || 0} visualizações</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {chapters.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Chapter Nav */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <div className="sticky top-8">
                <ChapterNav
                  chapters={chapters}
                  activeChapter={activeChapter}
                  onSelect={setActiveChapter}
                  completedChapters={completedChapters}
                />
              </div>
            </motion.div>

            {/* Chapter Content */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {currentChapter ? (
                  <motion.div
                    key={activeChapter}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-card rounded-2xl p-6 md:p-8"
                  >
                    <div className="mb-6">
                      <span className="text-white/40 text-sm">Capítulo {currentChapter.number || activeChapter + 1}</span>
                      <h2 className="text-2xl font-bold text-white">{currentChapter.title}</h2>
                    </div>

                    {/* Maps */}
                    {currentChapter.maps?.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-white font-semibold mb-3">Mapas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentChapter.maps.map((map, i) => (
                            <a key={i} href={map} target="_blank" rel="noopener noreferrer">
                              <img src={map} alt={`Mapa ${i + 1}`} className="rounded-lg w-full hover:opacity-80 transition-opacity" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Videos */}
                    {currentChapter.videos?.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-white font-semibold mb-3">Vídeos</h3>
                        <div className="space-y-3">
                          {currentChapter.videos.map((video, i) => (
                            <a key={i} href={video} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                                <Play className="w-5 h-5 text-red-400" />
                              </div>
                              <span className="text-white/70 text-sm truncate">{video}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-invert prose-lg max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-5 mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-bold text-white mt-4 mb-2">{children}</h3>,
                          p: ({ children }) => <p className="text-white/80 leading-relaxed mb-4">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside text-white/80 mb-4 space-y-1">{children}</ol>,
                          blockquote: ({ children }) => <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-white/70 my-4">{children}</blockquote>,
                        }}
                      >
                        {currentChapter.content || ""}
                      </ReactMarkdown>
                    </div>

                    {/* Navigation & Mark Complete */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-white/10">
                      <Button
                        variant="outline"
                        onClick={() => markComplete(activeChapter)}
                        disabled={completedChapters.includes(activeChapter)}
                        className={`border-white/20 text-white hover:bg-white/10 ${completedChapters.includes(activeChapter) ? "bg-emerald-500/20 border-emerald-500/30" : ""}`}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {completedChapters.includes(activeChapter) ? "Concluído" : "Marcar como concluído"}
                      </Button>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          disabled={activeChapter === 0}
                          onClick={() => setActiveChapter(activeChapter - 1)}
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Anterior
                        </Button>
                        <Button
                          className="pokemon-gradient text-white"
                          disabled={activeChapter === chapters.length - 1}
                          onClick={() => {
                            markComplete(activeChapter);
                            setActiveChapter(activeChapter + 1);
                          }}
                        >
                          Próximo
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40">Selecione um capítulo</p>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h2 className="text-white font-semibold mb-2">Em Construção</h2>
            <p className="text-white/40">Este guia ainda está sendo escrito.</p>
          </div>
        )}

        {/* Related Guides */}
        {filteredRelated.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Guias Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRelated.map((g) => <GuideCard key={g.id} guide={g} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}