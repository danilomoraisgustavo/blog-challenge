import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { Plus, Search, Database, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const generations = [
  { value: "gen1", label: "Gen I" }, { value: "gen2", label: "Gen II" },
  { value: "gen3", label: "Gen III" }, { value: "gen4", label: "Gen IV" },
  { value: "gen5", label: "Gen V" }, { value: "gen6", label: "Gen VI" },
  { value: "gen7", label: "Gen VII" }, { value: "gen8", label: "Gen VIII" },
  { value: "gen9", label: "Gen IX" },
];

const tiers = [
  { value: "ag", label: "AG" }, { value: "uber", label: "Uber" },
  { value: "ou", label: "OU" }, { value: "uu", label: "UU" },
  { value: "ru", label: "RU" }, { value: "nu", label: "NU" },
  { value: "pu", label: "PU" }, { value: "lc", label: "LC" },
  { value: "nao_classificado", label: "Não Classificado" },
];

const defaultFormData = {
  pokedex_number: "", name: "", name_en: "", types: [], generation: "gen1",
  sprite_url: "", custom_notes: "", tier: "nao_classificado", strategies: "", counters: [],
};

export default function AdminPokedex() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPokemon, setEditingPokemon] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const [typesInput, setTypesInput] = useState("");
  const [countersInput, setCountersInput] = useState("");

  const queryClient = useQueryClient();

  const { data: pokemonList = [], isLoading } = useQuery({
    queryKey: ["admin-pokemon"],
    queryFn: () => api.entities.PokemonData.list("pokedex_number"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.entities.PokemonData.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-pokemon"] }); closeDialog(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.PokemonData.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-pokemon"] }); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.entities.PokemonData.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-pokemon"] }),
  });

  const filteredPokemon = pokemonList.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pokedex_number?.toString().includes(searchTerm)
  );

  const openDialog = (pokemon = null) => {
    if (pokemon) {
      setEditingPokemon(pokemon);
      setFormData({
        pokedex_number: pokemon.pokedex_number || "", name: pokemon.name || "",
        name_en: pokemon.name_en || "", types: pokemon.types || [],
        generation: pokemon.generation || "gen1", sprite_url: pokemon.sprite_url || "",
        custom_notes: pokemon.custom_notes || "", tier: pokemon.tier || "nao_classificado",
        strategies: pokemon.strategies || "", counters: pokemon.counters || [],
      });
      setTypesInput(pokemon.types?.join(", ") || "");
      setCountersInput(pokemon.counters?.join(", ") || "");
    } else {
      setEditingPokemon(null);
      setFormData(defaultFormData);
      setTypesInput("");
      setCountersInput("");
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPokemon(null);
    setFormData(defaultFormData);
    setTypesInput("");
    setCountersInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      pokedex_number: parseInt(formData.pokedex_number),
      types: typesInput.split(",").map(t => t.trim()).filter(Boolean),
      counters: countersInput.split(",").map(c => c.trim()).filter(Boolean),
    };
    if (editingPokemon) updateMutation.mutate({ id: editingPokemon.id, data });
    else createMutation.mutate(data);
  };

  const handleDelete = (pokemon) => {
    if (confirm("Excluir este Pokémon?")) deleteMutation.mutate(pokemon.id);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Pokédex</h1>
          <p className="text-white/60 mt-1">Gerencie dados e estratégias de Pokémon</p>
        </div>
        <Button onClick={() => openDialog()} className="pokemon-gradient text-white">
          <Plus className="w-4 h-4 mr-2" /> Novo Pokémon
        </Button>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nome ou número..." className="bg-white/5 border-white/10 text-white pl-10" />
      </div>

      {isLoading ? (
        <div className="py-20"><LoadingSpinner text="Carregando Pokédex..." /></div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">#</TableHead>
                <TableHead className="text-white/60">Pokémon</TableHead>
                <TableHead className="text-white/60">Tipos</TableHead>
                <TableHead className="text-white/60">Geração</TableHead>
                <TableHead className="text-white/60">Tier</TableHead>
                <TableHead className="text-white/60 w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPokemon.map((pokemon) => (
                <TableRow key={pokemon.id} className="border-white/5 hover:bg-white/5">
                  <TableCell className="text-white/50 font-mono">#{pokemon.pokedex_number?.toString().padStart(4, "0")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {pokemon.sprite_url ? (
                        <img src={pokemon.sprite_url} alt={pokemon.name} className="w-10 h-10 object-contain" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <Database className="w-5 h-5 text-white/40" />
                        </div>
                      )}
                      <p className="text-white font-medium">{pokemon.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {pokemon.types?.map((type) => (
                        <Badge key={type} className="bg-white/10 text-white/70 border-white/20 text-xs capitalize">{type}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/60 capitalize">{pokemon.generation?.replace("gen", "Gen ")}</TableCell>
                  <TableCell>
                    {pokemon.tier && pokemon.tier !== "nao_classificado" ? (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 uppercase">{pokemon.tier}</Badge>
                    ) : (
                      <span className="text-white/40">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                        <DropdownMenuItem onClick={() => openDialog(pokemon)} className="text-white/80 focus:text-white focus:bg-white/10"><Pencil className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(pokemon)} className="text-red-400 focus:text-red-300 focus:bg-red-500/10"><Trash2 className="w-4 h-4 mr-2" /> Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPokemon.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-12 text-white/40">Nenhum Pokémon encontrado</TableCell></TableRow>}
            </TableBody>
          </Table>
        </motion.div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPokemon ? "Editar Pokémon" : "Novo Pokémon"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Número</Label><Input type="number" value={formData.pokedex_number} onChange={(e) => setFormData({ ...formData, pokedex_number: e.target.value })} placeholder="25" className="bg-white/5 border-white/10 text-white mt-1" required /></div>
              <div><Label>Nome (PT-BR)</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Pikachu" className="bg-white/5 border-white/10 text-white mt-1" required /></div>
              <div><Label>Nome (EN)</Label><Input value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} placeholder="Pikachu" className="bg-white/5 border-white/10 text-white mt-1" /></div>
              <div><Label>Tipos (vírgula)</Label><Input value={typesInput} onChange={(e) => setTypesInput(e.target.value)} placeholder="Electric" className="bg-white/5 border-white/10 text-white mt-1" /></div>
              <div>
                <Label>Geração</Label>
                <Select value={formData.generation} onValueChange={(v) => setFormData({ ...formData, generation: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">{generations.map((g) => <SelectItem key={g.value} value={g.value} className="text-white">{g.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tier</Label>
                <Select value={formData.tier} onValueChange={(v) => setFormData({ ...formData, tier: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">{tiers.map((t) => <SelectItem key={t.value} value={t.value} className="text-white">{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2"><Label>URL do Sprite</Label><Input value={formData.sprite_url} onChange={(e) => setFormData({ ...formData, sprite_url: e.target.value })} placeholder="https://raw.githubusercontent.com/..." className="bg-white/5 border-white/10 text-white mt-1" /></div>
              <div className="md:col-span-2"><Label>Counters (vírgula)</Label><Input value={countersInput} onChange={(e) => setCountersInput(e.target.value)} placeholder="Garchomp, Landorus" className="bg-white/5 border-white/10 text-white mt-1" /></div>
              <div className="md:col-span-2"><Label>Notas</Label><Textarea value={formData.custom_notes} onChange={(e) => setFormData({ ...formData, custom_notes: e.target.value })} placeholder="Notas sobre o Pokémon..." className="bg-white/5 border-white/10 text-white mt-1" rows={3} /></div>
              <div className="md:col-span-2"><Label>Estratégias</Label><Textarea value={formData.strategies} onChange={(e) => setFormData({ ...formData, strategies: e.target.value })} placeholder="Dicas de uso competitivo..." className="bg-white/5 border-white/10 text-white mt-1" rows={5} /></div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="outline" onClick={closeDialog} className=" border-white/20 text-black hover:bg-white/5 hover:text-white">Cancelar</Button>
              <Button type="submit" className="pokemon-gradient text-white" disabled={createMutation.isPending || updateMutation.isPending}>{editingPokemon ? "Salvar" : "Adicionar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}