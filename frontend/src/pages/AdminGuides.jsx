import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { Plus, Search, BookOpen, Layers, Eye, MoreHorizontal, Pencil, Trash2, Sparkles } from "lucide-react";
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
import LoadingSpinner from "@/components/common/LoadingSpinner";

const guideTypes = [
  { value: "detonado", label: "Detonado" },
  { value: "guia_pokemon", label: "Guia Pokémon" },
  { value: "guia_itens", label: "Guia de Itens" },
  { value: "guia_competitivo", label: "Competitivo" },
  { value: "walkthrough", label: "Walkthrough" },
];

const statuses = [
  { value: "rascunho", label: "Rascunho" },
  { value: "em_progresso", label: "Em Progresso" },
  { value: "completo", label: "Completo" },
];

const generations = [
  { value: "gen1", label: "Gen I" }, { value: "gen2", label: "Gen II" },
  { value: "gen3", label: "Gen III" }, { value: "gen4", label: "Gen IV" },
  { value: "gen5", label: "Gen V" }, { value: "gen6", label: "Gen VI" },
  { value: "gen7", label: "Gen VII" }, { value: "gen8", label: "Gen VIII" },
  { value: "gen9", label: "Gen IX" },
];

const statusColors = {
  rascunho: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  em_progresso: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  completo: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const defaultFormData = {
  title: "", slug: "", game: "", generation: "gen3",
  type: "detonado", cover_image: "", description: "", status: "rascunho",
};

export default function AdminGuides() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  const { data: guides = [], isLoading } = useQuery({
    queryKey: ["admin-guides"],
    queryFn: () => api.entities.Guide.list("-created_at"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.entities.Guide.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-guides"] }); closeDialog(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.Guide.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-guides"] }); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.entities.Guide.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-guides"] }),
  });

  const filteredGuides = guides.filter(g => g.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  const openDialog = (guide = null) => {
    if (guide) {
      setEditingGuide(guide);
      setFormData({
        title: guide.title || "", slug: guide.slug || "", game: guide.game || "",
        generation: guide.generation || "gen3", type: guide.type || "detonado",
        cover_image: guide.cover_image || "", description: guide.description || "",
        status: guide.status || "rascunho",
      });
    } else {
      setEditingGuide(null);
      setFormData(defaultFormData);
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => { setIsDialogOpen(false); setEditingGuide(null); setFormData(defaultFormData); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const data = { ...formData, slug };
    if (editingGuide) updateMutation.mutate({ id: editingGuide.id, data });
    else createMutation.mutate(data);
  };

  const handleDelete = (guide) => {
    if (confirm("Excluir este guia?")) deleteMutation.mutate(guide.id);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Guias</h1>
          <p className="text-white/60 mt-1">Gerencie detonados e walkthroughs</p>
        </div>
        <div className="flex gap-2">
          <AIGeneratorButton 
            type="guide" 
            onGenerated={(data) => {
              const guideData = {
                ...defaultFormData,
                title: data.title || "",
                game: data.game || "",
                description: data.description || "",
                generation: data.generation || "gen3",
                status: "em_progresso",
              };
              // Criar o guia com capítulos
              if (data.chapters?.length > 0) {
                createMutation.mutate({
                  ...guideData,
                  chapters: data.chapters
                });
              } else {
                setFormData(guideData);
                setIsDialogOpen(true);
              }
            }}
          />
          <Button onClick={() => openDialog()} className="pokemon-gradient text-white">
            <Plus className="w-4 h-4 mr-2" /> Novo Guia
          </Button>
        </div>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar guias..." className="bg-white/5 border-white/10 text-white pl-10" />
      </div>

      {isLoading ? (
        <div className="py-20"><LoadingSpinner text="Carregando guias..." /></div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Título</TableHead>
                <TableHead className="text-white/60">Tipo</TableHead>
                <TableHead className="text-white/60">Capítulos</TableHead>
                <TableHead className="text-white/60">Views</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60 w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuides.map((guide) => (
                <TableRow key={guide.id} className="border-white/5 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center overflow-hidden">
                        {guide.cover_image ? <img src={guide.cover_image} alt="" className="w-full h-full object-cover" /> : <BookOpen className="w-5 h-5 text-emerald-400" />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{guide.title}</p>
                        <p className="text-white/40 text-xs">{guide.game}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge className="bg-white/10 text-white/70 border-white/20">{guideTypes.find(t => t.value === guide.type)?.label}</Badge></TableCell>
                  <TableCell className="text-white/60"><span className="flex items-center gap-1"><Layers className="w-4 h-4" /> {guide.chapters?.length || 0}</span></TableCell>
                  <TableCell className="text-white/60"><span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {guide.views || 0}</span></TableCell>
                  <TableCell><Badge className={statusColors[guide.status]}>{statuses.find(s => s.value === guide.status)?.label}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                        <DropdownMenuItem onClick={() => openDialog(guide)} className="text-white/80 focus:text-white focus:bg-white/10"><Pencil className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(guide)} className="text-red-400 focus:text-red-300 focus:bg-red-500/10"><Trash2 className="w-4 h-4 mr-2" /> Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredGuides.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-12 text-white/40">Nenhum guia encontrado</TableCell></TableRow>}
            </TableBody>
          </Table>
        </motion.div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingGuide ? "Editar Guia" : "Novo Guia"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><Label>Título</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Detonado Pokémon Emerald" className="bg-white/5 border-white/10 text-white mt-1" required /></div>
              <div><Label>Slug</Label><Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="detonado-emerald" className="bg-white/5 border-white/10 text-white mt-1" /></div>
              <div><Label>Nome do Jogo</Label><Input value={formData.game} onChange={(e) => setFormData({ ...formData, game: e.target.value })} placeholder="Pokémon Emerald" className="bg-white/5 border-white/10 text-white mt-1" required /></div>
              <div>
                <Label>Tipo</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">{guideTypes.map((t) => <SelectItem key={t.value} value={t.value} className="text-white">{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Geração</Label>
                <Select value={formData.generation} onValueChange={(v) => setFormData({ ...formData, generation: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">{generations.map((g) => <SelectItem key={g.value} value={g.value} className="text-white">{g.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Imagem (URL)</Label><Input value={formData.cover_image} onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })} placeholder="https://..." className="bg-white/5 border-white/10 text-white mt-1" /></div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">{statuses.map((s) => <SelectItem key={s.value} value={s.value} className="text-white">{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2"><Label>Descrição</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Descrição do guia..." className="bg-white/5 border-white/10 text-white mt-1" rows={4} /></div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="outline" onClick={closeDialog} className=" border-white/20 text-black hover:bg-white/5 hover:text-white">Cancelar</Button>
              <Button type="submit" className="pokemon-gradient text-white" disabled={createMutation.isPending || updateMutation.isPending}>{editingGuide ? "Salvar" : "Criar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}