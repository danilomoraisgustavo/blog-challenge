import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RomCard from "@/components/roms/RomCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import AdvancedFilters from "@/components/common/AdvancedFilters";
import InfiniteScrollList from "@/components/common/InfiniteScrollList";

const filterConfig = [
  {
    key: "platform",
    label: "Plataforma",
    allLabel: "Todas",
    options: [
      { value: "GB", label: "Game Boy" },
      { value: "GBC", label: "Game Boy Color" },
      { value: "GBA", label: "Game Boy Advance" },
      { value: "NDS", label: "Nintendo DS" },
      { value: "3DS", label: "Nintendo 3DS" },
      { value: "Switch", label: "Switch" },
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
  {
    key: "language",
    label: "Idioma",
    allLabel: "Todos Idiomas",
    options: [
      { value: "pt-br", label: "🇧🇷 Português" },
      { value: "en", label: "🇺🇸 Inglês" },
      { value: "es", label: "🇪🇸 Espanhol" },
      { value: "ja", label: "🇯🇵 Japonês" },
      { value: "multi", label: "🌐 Multi" },
    ],
  },
  {
    key: "featured",
    label: "Destaque",
    allLabel: "Todas",
    options: [
      { value: "true", label: "Destaques" },
    ],
  },
];

export default function RomLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ platform: "all", generation: "all", language: "all", featured: "all" });
  const [romType, setRomType] = useState("all");

  const { data: roms = [], isLoading } = useQuery({
    queryKey: ["roms-public"],
    queryFn: () => api.entities.ROM.filter({ status: "ativo" }, "-downloads"),
  });

  const filteredRoms = useMemo(() => {
    return roms.filter((rom) => {
      const matchesSearch = rom.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = filters.platform === "all" || rom.platform === filters.platform;
      const matchesLanguage = filters.language === "all" || rom.language === filters.language;
      const matchesGeneration = filters.generation === "all" || rom.generation === filters.generation;
      const matchesFeatured = filters.featured === "all" || (filters.featured === "true" && rom.featured);
      const matchesType =
        romType === "all" ||
        (romType === "official" && !rom.is_hack) ||
        (romType === "hack" && rom.is_hack);
      return matchesSearch && matchesPlatform && matchesLanguage && matchesGeneration && matchesFeatured && matchesType;
    });
  }, [roms, searchTerm, filters, romType]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Biblioteca de ROMs</h1>
        <p className="text-white/60">Encontre e baixe ROMs de Pokémon para todas as plataformas</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Tabs value={romType} onValueChange={setRomType}>
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Todas
            </TabsTrigger>
            <TabsTrigger value="official" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Oficiais
            </TabsTrigger>
            <TabsTrigger value="hack" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              ROM Hacks
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
          searchPlaceholder="Buscar ROMs..."
          filters={filterConfig}
          activeFilters={filters}
          onFilterChange={setFilters}
          onSearchChange={setSearchTerm}
          searchValue={searchTerm}
          resultCount={filteredRoms.length}
        />
      </motion.div>

      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner text="Carregando ROMs..." />
        </div>
      ) : filteredRoms.length === 0 ? (
        <EmptyState
          icon={Gamepad2}
          title="Nenhuma ROM encontrada"
          description="Tente ajustar os filtros de busca"
        />
      ) : (
        <InfiniteScrollList
          items={filteredRoms}
          renderItem={(rom) => <RomCard rom={rom} />}
          pageSize={20}
          gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          gap="gap-4"
          loadingText="Carregando mais ROMs..."
        />
      )}
    </div>
  );
}