import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { Plus, Search, Trophy, Users, MoreHorizontal, Pencil, Trash2, Sparkles } from "lucide-react";
import AIGeneratorButton from "@/components/common/AIGeneratorButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const formats = [
  { value: "singles", label: "Singles" }, { value: "doubles", label: "Doubles" },
  { value: "vgc", label: "VGC" }, { value: "smogon_ou", label: "Smogon OU" },
  { value: "smogon_uu", label: "Smogon UU" }, { value: "random_battle", label: "Random Battle" },
  { value: "outro", label: "Outro" },
];

const statuses = [
  { value: "inscricoes_abertas", label: "Inscrições Abertas" },
  { value: "em_andamento", label: "Em Andamento" },
  { value: "finalizado", label: "Finalizado" },
  { value: "cancelado", label: "Cancelado" },
];

const generations = [
  { value: "gen1", label: "Gen I" }, { value: "gen2", label: "Gen II" },
  { value: "gen3", label: "Gen III" }, { value: "gen4", label: "Gen IV" },
  { value: "gen5", label: "Gen V" }, { value: "gen6", label: "Gen VI" },
  { value: "gen7", label: "Gen VII" }, { value: "gen8", label: "Gen VIII" },
  { value: "gen9", label: "Gen IX" },
];

const statusColors = {
  inscricoes_abertas: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  em_andamento: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  finalizado: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  cancelado: "bg-red-500/20 text-red-400 border-red-500/30",
};

const defaultFormData = {
  name: "", description: "", cover_image: "", format: "singles",
  rules: "", prize: "", max_participants: 16, start_date: "",
  end_date: "", status: "inscricoes_abertas", generation: "gen9", winner: "",
};

export default function AdminTournaments() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  const { data: tournaments = [], isLoading } = useQuery({
    queryKey: ["admin-tournaments"],
    queryFn: () => api.entities.Tournament.list("-created_at"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.entities.Tournament.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-tournaments"] }); closeDialog(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.Tournament.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-tournaments"] }); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.entities.Tournament.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-tournaments"] }),
  });

  const filteredTournaments = tournaments.filter(t => t.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const openDialog = (tournament = null) => {
    if (tournament) {
      setEditingTournament(tournament);
      setFormData({
        name: tournament.name || "", description: tournament.description || "",
        cover_image: tournament.cover_image || "", format: tournament.format || "singles",
        rules: tournament.rules || "", prize: tournament.prize || "",
        max_participants: tournament.max_participants || 16,
        start_date: tournament.start_date ? tournament.start_date.split("T")[0] : "",
        end_date: tournament.end_date ? tournament.end_date.split("T")[0] : "",
        status: tournament.status || "inscricoes_abertas",
        generation: tournament.generation || "gen9", winner: tournament.winner || "",
      });
    } else {
      setEditingTournament(null);
      setFormData(defaultFormData);
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => { setIsDialogOpen(false); setEditingTournament(null); setFormData(defaultFormData); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTournament) updateMutation.mutate({ id: editingTournament.id, data: formData });
    else createMutation.mutate(formData);
  };

  const handleDelete = (tournament) => {
    if (confirm("Excluir este torneio?")) deleteMutation.mutate(tournament.id);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Torneios</h1>
          <p className="text-white/60 mt-1">Gerencie competições e eventos</p>
        </div>
        <div className="flex gap-2">
          <AIGeneratorButton 
            type="tournament" 
            onGenerated={(data) => {
              setFormData({
                ...defaultFormData,
                name: data.name || "",
                description: data.description || "",
                rules: data.rules || "",
                format: data.format || "singles",
                generation: data.generation || "gen9",
              });
              setIsDialogOpen(true);
            }}
          />
          <Button onClick={() => openDialog()} className="pokemon-gradient text-white">
            <Plus className="w-4 h-4 mr-2" /> Novo Torneio
          </Button>
        </div>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar torneios..." className="bg-white/5 border-white/10 text-white pl-10" />
      </div>

      {isLoading ? (
        <div className="py-20"><LoadingSpinner text="Carregando torneios..." /></div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Torneio</TableHead>
                <TableHead className="text-white/60">Formato</TableHead>
                <TableHead className="text-white/60">Participantes</TableHead>
                <TableHead className="text-white/60">Data</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60 w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTournaments.map((tournament) => (
                <TableRow key={tournament.id} className="border-white/5 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{tournament.name}</p>
                        {tournament.winner && <p className="text-yellow-400 text-xs">🏆 {tournament.winner}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge className="bg-white/10 text-white/70 border-white/20">{formats.find(f => f.value === tournament.format)?.label}</Badge></TableCell>
                  <TableCell className="text-white/60"><span className="flex items-center gap-1"><Users className="w-4 h-4" /> {tournament.participants?.length || 0}/{tournament.max_participants}</span></TableCell>
                  <TableCell className="text-white/60">{tournament.start_date ? format(new Date(tournament.start_date), "dd/MM/yyyy") : "-"}</TableCell>
                  <TableCell><Badge className={statusColors[tournament.status]}>{statuses.find(s => s.value === tournament.status)?.label}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                        <DropdownMenuItem onClick={() => openDialog(tournament)} className="text-white/80 focus:text-white focus:bg-white/10"><Pencil className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(tournament)} className="text-red-400 focus:text-red-300 focus:bg-red-500/10"><Trash2 className="w-4 h-4 mr-2" /> Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTournaments.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-12 text-white/40">Nenhum torneio encontrado</TableCell></TableRow>}
            </TableBody>
          </Table>
        </motion.div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingTournament ? "Editar Torneio" : "Novo Torneio"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Nome do Torneio</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Copa Pokémon 2024" className="bg-white/5 border-white/10 text-white mt-1" required />
              </div>
              <div>
                <Label>Formato</Label>
                <Select value={formData.format} onValueChange={(v) => setFormData({ ...formData, format: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">{formats.map((f) => <SelectItem key={f.value} value={f.value} className="text-white">{f.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Geração</Label>
                <Select value={formData.generation} onValueChange={(v) => setFormData({ ...formData, generation: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">{generations.map((g) => <SelectItem key={g.value} value={g.value} className="text-white">{g.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Data Início</Label><Input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="bg-white/5 border-white/10 text-white mt-1" /></div>
              <div><Label>Data Fim</Label><Input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="bg-white/5 border-white/10 text-white mt-1" /></div>
              <div><Label>Máx. Participantes</Label><Input type="number" value={formData.max_participants} onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 16 })} className="bg-white/5 border-white/10 text-white mt-1" /></div>
              <div><Label>Prêmio</Label><Input value={formData.prize} onChange={(e) => setFormData({ ...formData, prize: e.target.value })} placeholder="R$ 500" className="bg-white/5 border-white/10 text-white mt-1" /></div>
              <div><Label>Imagem (URL)</Label><Input value={formData.cover_image} onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })} placeholder="https://..." className="bg-white/5 border-white/10 text-white mt-1" /></div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">{statuses.map((s) => <SelectItem key={s.value} value={s.value} className="text-white">{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {formData.status === "finalizado" && <div><Label>Vencedor</Label><Input value={formData.winner} onChange={(e) => setFormData({ ...formData, winner: e.target.value })} placeholder="Nome do vencedor" className="bg-white/5 border-white/10 text-white mt-1" /></div>}
              <div className="md:col-span-2"><Label>Descrição</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Descrição do torneio..." className="bg-white/5 border-white/10 text-white mt-1" rows={3} /></div>
              <div className="md:col-span-2"><Label>Regras</Label><Textarea value={formData.rules} onChange={(e) => setFormData({ ...formData, rules: e.target.value })} placeholder="Regras detalhadas..." className="bg-white/5 border-white/10 text-white mt-1" rows={5} /></div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="outline" onClick={closeDialog} className=" border-white/20 text-black hover:bg-white/5 hover:text-white">Cancelar</Button>
              <Button type="submit" className="pokemon-gradient text-white" disabled={createMutation.isPending || updateMutation.isPending}>{editingTournament ? "Salvar" : "Criar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}