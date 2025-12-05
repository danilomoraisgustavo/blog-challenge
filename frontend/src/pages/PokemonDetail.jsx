import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Swords, Target, Sparkles, GitCompare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PokemonCard from "@/components/pokemon/PokemonCard";
import StatsRadar, { StatsComparison } from "@/components/pokemon/StatsRadar";

const typeColors = {
  normal: "bg-gray-400", fire: "bg-orange-500", water: "bg-blue-500",
  electric: "bg-yellow-400", grass: "bg-green-500", ice: "bg-cyan-400",
  fighting: "bg-red-700", poison: "bg-purple-500", ground: "bg-amber-600",
  flying: "bg-indigo-400", psychic: "bg-pink-500", bug: "bg-lime-500",
  rock: "bg-stone-500", ghost: "bg-violet-700", dragon: "bg-indigo-700",
  dark: "bg-stone-800", steel: "bg-slate-400", fairy: "bg-pink-400",
};

const genLabels = {
  gen1: "Geração I", gen2: "Geração II", gen3: "Geração III",
  gen4: "Geração IV", gen5: "Geração V", gen6: "Geração VI",
  gen7: "Geração VII", gen8: "Geração VIII", gen9: "Geração IX",
};

const tierLabels = {
  ag: "Anything Goes", uber: "Uber", ou: "OverUsed", uu: "UnderUsed",
  ru: "RarelyUsed", nu: "NeverUsed", pu: "PU", lc: "Little Cup",
  nao_classificado: "Não Classificado",
};

export default function PokemonDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonId = urlParams.get("id");
  const [compareOpen, setCompareOpen] = useState(false);
  const [comparePokemonId, setComparePokemonId] = useState("");

  const { data: pokemon, isLoading } = useQuery({
    queryKey: ["pokemon", pokemonId],
    queryFn: async () => {
      const list = await api.entities.PokemonData.filter({ id: pokemonId });
      return list[0];
    },
    enabled: !!pokemonId,
  });

  const { data: allPokemon = [] } = useQuery({
    queryKey: ["pokemon-all"],
    queryFn: () => api.entities.PokemonData.list("pokedex_number"),
  });

  const { data: relatedPokemon = [] } = useQuery({
    queryKey: ["related-pokemon", pokemon?.generation],
    queryFn: () => api.entities.PokemonData.filter({ generation: pokemon.generation }, "pokedex_number", 7),
    enabled: !!pokemon?.generation,
  });

  const comparePokemon = allPokemon.find(p => p.id === comparePokemonId);
  const filteredRelated = relatedPokemon.filter((p) => p.id !== pokemonId).slice(0, 6);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Carregando Pokémon..." />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Pokémon não encontrado</h1>
        <Link to={createPageUrl("Pokedex")}>
          <Button className="pokemon-gradient text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Pokédex
          </Button>
        </Link>
      </div>
    );
  }

  const primaryType = pokemon.types?.[0]?.toLowerCase() || "normal";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link
        to={createPageUrl("Pokedex")}
        className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar à Pokédex
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pokemon Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="glass-card rounded-2xl overflow-hidden sticky top-8">
            <div className={`bg-gradient-to-br from-${primaryType}-500/30 to-transparent p-8`}>
              <div className="text-center">
                <span className="text-white/30 font-mono text-sm">
                  #{pokemon.pokedex_number?.toString().padStart(4, "0")}
                </span>
                {pokemon.sprite_url ? (
                  <motion.img
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    src={pokemon.sprite_url}
                    alt={pokemon.name}
                    className="w-48 h-48 mx-auto object-contain drop-shadow-2xl"
                  />
                ) : (
                  <div className="w-48 h-48 mx-auto bg-white/5 rounded-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-white/20">?</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <h1 className="text-2xl font-bold text-white text-center mb-1">{pokemon.name}</h1>
              {pokemon.name_en && pokemon.name_en !== pokemon.name && (
                <p className="text-white/50 text-center text-sm mb-4">{pokemon.name_en}</p>
              )}

              <div className="flex justify-center gap-2 mb-4">
                {pokemon.types?.map((type) => (
                  <span key={type} className={`${typeColors[type.toLowerCase()] || "bg-gray-500"} text-white px-4 py-1 rounded-full text-sm font-medium capitalize`}>
                    {type}
                  </span>
                ))}
              </div>

              <div className="space-y-3">
                {pokemon.generation && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">Geração</span>
                    <span className="text-white font-medium">{genLabels[pokemon.generation]}</span>
                  </div>
                )}
                {pokemon.tier && pokemon.tier !== "nao_classificado" && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">Tier</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 uppercase">{pokemon.tier}</Badge>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setCompareOpen(true)}
                variant="outline"
                className="w-full mt-6 border-white/20 text-white hover:bg-white/10"
              >
                <GitCompare className="w-4 h-4 mr-2" />
                Comparar Stats
              </Button>
            </div>
          </div>

          {/* Stats */}
          {pokemon.stats && <StatsRadar stats={pokemon.stats} />}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Tabs defaultValue="strategies" className="space-y-6">
            <TabsList className="bg-white/5 border border-white/10 w-full">
              <TabsTrigger value="strategies" className="flex-1 data-[state=active]:bg-white/10">Estratégias</TabsTrigger>
              <TabsTrigger value="builds" className="flex-1 data-[state=active]:bg-white/10">Builds</TabsTrigger>
              <TabsTrigger value="counters" className="flex-1 data-[state=active]:bg-white/10">Counters</TabsTrigger>
            </TabsList>

            <TabsContent value="strategies">
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Swords className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Estratégias de Uso</h2>
                </div>
                {pokemon.strategies ? (
                  <p className="text-white/70 leading-relaxed whitespace-pre-line">{pokemon.strategies}</p>
                ) : (
                  <p className="text-white/40 italic">Nenhuma estratégia documentada ainda.</p>
                )}
              </div>

              {pokemon.custom_notes && (
                <div className="glass-card rounded-xl p-6 mt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Notas</h2>
                  </div>
                  <p className="text-white/70 leading-relaxed">{pokemon.custom_notes}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="builds">
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Builds Recomendadas</h2>
                </div>
                {pokemon.recommended_builds?.length > 0 ? (
                  <div className="space-y-4">
                    {pokemon.recommended_builds.map((build, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <h3 className="text-white font-semibold mb-3">{build.name}</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {build.nature && <div><span className="text-white/40">Nature:</span> <span className="text-white">{build.nature}</span></div>}
                          {build.ability && <div><span className="text-white/40">Ability:</span> <span className="text-white">{build.ability}</span></div>}
                          {build.item && <div><span className="text-white/40">Item:</span> <span className="text-white">{build.item}</span></div>}
                          {build.evs && <div><span className="text-white/40">EVs:</span> <span className="text-white">{build.evs}</span></div>}
                        </div>
                        {build.moves?.length > 0 && (
                          <div className="mt-3">
                            <span className="text-white/40 text-sm">Moves:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {build.moves.map((move, i) => (
                                <Badge key={i} variant="outline" className="text-white/70 border-white/20">{move}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {build.description && <p className="text-white/60 text-sm mt-3">{build.description}</p>}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/40 italic">Nenhuma build documentada ainda.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="counters">
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-red-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Counters</h2>
                </div>
                {pokemon.counters?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {pokemon.counters.map((counter, index) => (
                      <Badge key={index} className="bg-red-500/20 text-red-300 border-red-500/30 px-3 py-1">{counter}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/40 italic">Nenhum counter documentado ainda.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Related Pokemon */}
      {filteredRelated.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Pokémon da Mesma Geração</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {filteredRelated.map((p) => <PokemonCard key={p.id} pokemon={p} />)}
          </div>
        </div>
      )}

      {/* Compare Dialog */}
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitCompare className="w-5 h-5" />
              Comparar com outro Pokémon
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <Select value={comparePokemonId} onValueChange={setComparePokemonId}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Selecione um Pokémon..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 max-h-60">
                {allPokemon.filter(p => p.id !== pokemonId).map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-white">
                    #{p.pokedex_number?.toString().padStart(4, "0")} - {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {comparePokemon && pokemon && (
            <div className="mt-6">
              <StatsComparison pokemon1={pokemon} pokemon2={comparePokemon} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}