import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuideCard from "@/components/guides/GuideCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import AdvancedFilters from "@/components/common/AdvancedFilters";
import InfiniteScrollList from "@/components/common/InfiniteScrollList";

const filterConfig = [
  {
    key: "type",
    label: "Tipo",
    allLabel: "Todos Tipos",
    options: [
      { value: "detonado", label: "Detonados" },
      { value: "guia_pokemon", label: "Guia Pokémon" },
      { value: "guia_itens", label: "Guia de Itens" },
      { value: "guia_competitivo", label: "Competitivo" },
      { value: "walkthrough", label: "Walkthroughs" },
    ],
  },
  {
    key: "generation",
    label: "Geração",
    allLabel: "Todas Gerações",
    options: [
      { value: "gen1", label: "Geração I" },
      { value: "gen2", label: "Geração II" },
      { value: "gen3", label: "Geração III" },
      { value: "gen4", label: "Geração IV" },
      { value: "gen5", label: "Geração V" },
      { value: "gen6", label: "Geração VI" },
      { value: "gen7", label: "Geração VII" },
      { value: "gen8", label: "Geração VIII" },
      { value: "gen9", label: "Geração IX" },
    ],
  },
];

export default function GuidesIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: "all", generation: "all" });
  const [status, setStatus] = useState("all");

  const { data: guides = [], isLoading } = useQuery({
    queryKey: ["guides-public"],
    queryFn: () => api.entities.Guide.list("-views"),
  });

  const publicGuides = guides.filter((g) => g.status !== "rascunho");

  const filteredGuides = useMemo(() => {
    return publicGuides.filter((guide) => {
      const matchesSearch =
        guide.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.game?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filters.type === "all" || guide.type === filters.type;
      const matchesGeneration = filters.generation === "all" || guide.generation === filters.generation;
      const matchesStatus =
        status === "all" ||
        (status === "completo" && guide.status === "completo") ||
        (status === "em_progresso" && guide.status === "em_progresso");
      return matchesSearch && matchesType && matchesGeneration && matchesStatus;
    });
  }, [publicGuides, searchTerm, filters, status]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Guias & Detonados</h1>
        <p className="text-white/60">Walkthroughs completos, guias de itens, Pokémon e estratégias competitivas</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Tabs value={status} onValueChange={setStatus}>
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Todos
            </TabsTrigger>
            <TabsTrigger value="completo" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Completos
            </TabsTrigger>
            <TabsTrigger value="em_progresso" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Em Progresso
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <AdvancedFilters
          searchPlaceholder="Buscar guias..."
          filters={filterConfig}
          activeFilters={filters}
          onFilterChange={setFilters}
          onSearchChange={setSearchTerm}
          searchValue={searchTerm}
          resultCount={filteredGuides.length}
        />
      </motion.div>

      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner text="Carregando guias..." />
        </div>
      ) : filteredGuides.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Nenhum guia encontrado"
          description={searchTerm ? "Tente ajustar os filtros" : "Novos guias serão publicados em breve"}
        />
      ) : (
        <InfiniteScrollList
          items={filteredGuides}
          renderItem={(guide) => <GuideCard guide={guide} />}
          pageSize={12}
          gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          loadingText="Carregando mais guias..."
        />
      )}
    </div>
  );
}