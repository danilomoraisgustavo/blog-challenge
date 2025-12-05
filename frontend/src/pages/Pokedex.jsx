import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { Database } from "lucide-react";
import PokemonCard from "@/components/pokemon/PokemonCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import AdvancedFilters from "@/components/common/AdvancedFilters";
import InfiniteScrollList from "@/components/common/InfiniteScrollList";

const filterConfig = [
  {
    key: "generation",
    label: "Geração",
    allLabel: "Todas Gerações",
    options: [
      { value: "gen1", label: "Gen I (1-151)" },
      { value: "gen2", label: "Gen II (152-251)" },
      { value: "gen3", label: "Gen III (252-386)" },
      { value: "gen4", label: "Gen IV (387-493)" },
      { value: "gen5", label: "Gen V (494-649)" },
      { value: "gen6", label: "Gen VI (650-721)" },
      { value: "gen7", label: "Gen VII (722-809)" },
      { value: "gen8", label: "Gen VIII (810-905)" },
      { value: "gen9", label: "Gen IX (906-1025)" },
    ],
  },
  {
    key: "type",
    label: "Tipo",
    allLabel: "Todos Tipos",
    options: [
      { value: "Normal", label: "Normal" },
      { value: "Fire", label: "Fire" },
      { value: "Water", label: "Water" },
      { value: "Electric", label: "Electric" },
      { value: "Grass", label: "Grass" },
      { value: "Ice", label: "Ice" },
      { value: "Fighting", label: "Fighting" },
      { value: "Poison", label: "Poison" },
      { value: "Ground", label: "Ground" },
      { value: "Flying", label: "Flying" },
      { value: "Psychic", label: "Psychic" },
      { value: "Bug", label: "Bug" },
      { value: "Rock", label: "Rock" },
      { value: "Ghost", label: "Ghost" },
      { value: "Dragon", label: "Dragon" },
      { value: "Dark", label: "Dark" },
      { value: "Steel", label: "Steel" },
      { value: "Fairy", label: "Fairy" },
    ],
  },
  {
    key: "tier",
    label: "Tier",
    allLabel: "Todos Tiers",
    options: [
      { value: "ag", label: "AG" },
      { value: "uber", label: "Uber" },
      { value: "ou", label: "OU" },
      { value: "uu", label: "UU" },
      { value: "ru", label: "RU" },
      { value: "nu", label: "NU" },
      { value: "pu", label: "PU" },
      { value: "lc", label: "LC" },
    ],
  },
];

export default function Pokedex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ generation: "all", type: "all", tier: "all" });

  const { data: pokemonList = [], isLoading } = useQuery({
    queryKey: ["pokemon-public"],
    queryFn: () => api.entities.PokemonData.list("pokedex_number"),
  });

  const filteredPokemon = useMemo(() => {
    return pokemonList.filter((pokemon) => {
      const matchesSearch =
        pokemon.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.pokedex_number?.toString().includes(searchTerm);
      const matchesGeneration = filters.generation === "all" || pokemon.generation === filters.generation;
      const matchesType = filters.type === "all" || pokemon.types?.some((t) => t.toLowerCase() === filters.type.toLowerCase());
      const matchesTier = filters.tier === "all" || pokemon.tier === filters.tier;
      return matchesSearch && matchesGeneration && matchesType && matchesTier;
    });
  }, [pokemonList, searchTerm, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Pokédex</h1>
        <p className="text-white/60">Explore todos os Pokémon com stats, builds e estratégias competitivas</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <AdvancedFilters
          searchPlaceholder="Buscar por nome ou número..."
          filters={filterConfig}
          activeFilters={filters}
          onFilterChange={setFilters}
          onSearchChange={setSearchTerm}
          searchValue={searchTerm}
          resultCount={filteredPokemon.length}
        />
      </motion.div>

      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner text="Carregando Pokédex..." />
        </div>
      ) : filteredPokemon.length === 0 ? (
        <EmptyState
          icon={Database}
          title="Nenhum Pokémon encontrado"
          description={searchTerm ? "Tente ajustar os filtros" : "A Pokédex está sendo construída"}
        />
      ) : (
        <InfiniteScrollList
          items={filteredPokemon}
          renderItem={(pokemon) => <PokemonCard pokemon={pokemon} />}
          pageSize={24}
          gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          gap="gap-4"
          loadingText="Carregando mais Pokémon..."
        />
      )}
    </div>
  );
}