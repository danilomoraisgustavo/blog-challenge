import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TournamentCard from "@/components/tournaments/TournamentCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import AdvancedFilters from "@/components/common/AdvancedFilters";
import InfiniteScrollList from "@/components/common/InfiniteScrollList";

const filterConfig = [
  {
    key: "format",
    label: "Formato",
    allLabel: "Todos Formatos",
    options: [
      { value: "singles", label: "Singles" },
      { value: "doubles", label: "Doubles" },
      { value: "vgc", label: "VGC" },
      { value: "smogon_ou", label: "Smogon OU" },
      { value: "smogon_uu", label: "Smogon UU" },
      { value: "random_battle", label: "Random Battle" },
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

export default function Tournaments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ format: "all", generation: "all" });
  const [status, setStatus] = useState("all");

  const { data: tournaments = [], isLoading } = useQuery({
    queryKey: ["tournaments-public"],
    queryFn: () => api.entities.Tournament.list("-start_date"),
  });

  const publicTournaments = tournaments.filter((t) => t.status !== "cancelado");

  const filteredTournaments = useMemo(() => {
    return publicTournaments.filter((tournament) => {
      const matchesSearch = tournament.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFormat = filters.format === "all" || tournament.format === filters.format;
      const matchesGeneration = filters.generation === "all" || tournament.generation === filters.generation;
      const matchesStatus = status === "all" || tournament.status === status;
      return matchesSearch && matchesFormat && matchesGeneration && matchesStatus;
    });
  }, [publicTournaments, searchTerm, filters, status]);

  const openTournaments = filteredTournaments.filter((t) => t.status === "inscricoes_abertas");
  const ongoingTournaments = filteredTournaments.filter((t) => t.status === "em_andamento");
  const finishedTournaments = filteredTournaments.filter((t) => t.status === "finalizado");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Torneios</h1>
        <p className="text-white/60">Participe de competições e mostre suas habilidades</p>
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
            <TabsTrigger value="inscricoes_abertas" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Inscrições Abertas
            </TabsTrigger>
            <TabsTrigger value="em_andamento" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Em Andamento
            </TabsTrigger>
            <TabsTrigger value="finalizado" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Finalizados
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
          searchPlaceholder="Buscar torneios..."
          filters={filterConfig}
          activeFilters={filters}
          onFilterChange={setFilters}
          onSearchChange={setSearchTerm}
          searchValue={searchTerm}
          resultCount={filteredTournaments.length}
        />
      </motion.div>

      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner text="Carregando torneios..." />
        </div>
      ) : filteredTournaments.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="Nenhum torneio encontrado"
          description={searchTerm ? "Tente ajustar os filtros" : "Novos torneios serão anunciados em breve"}
        />
      ) : status === "all" ? (
        <div className="space-y-12">
          {openTournaments.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Inscrições Abertas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {openTournaments.map((t) => <TournamentCard key={t.id} tournament={t} featured />)}
              </div>
            </div>
          )}
          {ongoingTournaments.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                Em Andamento
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingTournaments.map((t) => <TournamentCard key={t.id} tournament={t} featured />)}
              </div>
            </div>
          )}
          {finishedTournaments.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Finalizados</h2>
              <InfiniteScrollList
                items={finishedTournaments}
                renderItem={(t) => <TournamentCard tournament={t} />}
                pageSize={9}
                gridCols="grid-cols-1"
                gap="gap-3"
              />
            </div>
          )}
        </div>
      ) : (
        <InfiniteScrollList
          items={filteredTournaments}
          renderItem={(t) => <TournamentCard tournament={t} featured={t.status !== "finalizado"} />}
          pageSize={12}
          gridCols={status === "finalizado" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}
          gap={status === "finalizado" ? "gap-3" : "gap-6"}
          loadingText="Carregando mais torneios..."
        />
      )}
    </div>
  );
}