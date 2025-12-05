import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { Plus, Search, Gamepad2, Download, MoreHorizontal, Pencil, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const platforms = [
  { value: "GB", label: "Game Boy" },
  { value: "GBC", label: "Game Boy Color" },
  { value: "GBA", label: "Game Boy Advance" },
  { value: "NDS", label: "Nintendo DS" },
  { value: "3DS", label: "Nintendo 3DS" },
  { value: "Switch", label: "Nintendo Switch" },
];

const languages = [
  { value: "pt-br", label: "Português (BR)" },
  { value: "en", label: "Inglês" },
  { value: "es", label: "Espanhol" },
  { value: "ja", label: "Japonês" },
  { value: "multi", label: "Multi-idioma" },
];

const generations = [
  { value: "gen1", label: "Gen I" }, { value: "gen2", label: "Gen II" },
  { value: "gen3", label: "Gen III" }, { value: "gen4", label: "Gen IV" },
  { value: "gen5", label: "Gen V" }, { value: "gen6", label: "Gen VI" },
  { value: "gen7", label: "Gen VII" }, { value: "gen8", label: "Gen VIII" },
  { value: "gen9", label: "Gen IX" },
];

const defaultFormData = {
  name: "", platform: "GBA", version: "", language: "en", description: "",
  cover_image: "", file_url: "", file_size: "", md5_hash: "",
  generation: "gen3", is_hack: false, hack_base: "", featured: false, status: "ativo",
};

export default function AdminROMs() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRom, setEditingRom] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  const { data: roms = [], isLoading } = useQuery({
    queryKey: ["admin-roms"],
    queryFn: () => api.entities.ROM.list("-created_at"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.entities.ROM.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-roms"] }); closeDialog(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.ROM.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-roms"] }); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.entities.ROM.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-roms"] }),
  });

  const filteredRoms = roms.filter(rom => rom.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const openDialog = (rom = null) => {
    if (rom) {
      setEditingRom(rom);
      setFormData({
        name: rom.name || "", platform: rom.platform || "GBA", version: rom.version || "",
        language: rom.language || "en", description: rom.description || "",
        cover_image: rom.cover_image || "", file_url: rom.file_url || "",
        file_size: rom.file_size || "", md5_hash: rom.md5_hash || "",
        generation: rom.generation || "gen3", is_hack: rom.is_hack || false,
        hack_base: rom.hack_base || "", featured: rom.featured || false,
        status: rom.status || "ativo",
      });
    } else {
      setEditingRom(null);
      setFormData(defaultFormData);
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => { setIsDialogOpen(false); setEditingRom(null); setFormData(defaultFormData); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRom) updateMutation.mutate({ id: editingRom.id, data: formData });
    else createMutation.mutate(formData);
  };

  const handleDelete = (rom) => {
    if (confirm("Excluir esta ROM?")) deleteMutation.mutate(rom.id);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">ROMs</h1>
          <p className="text-white/60 mt-1">Gerencie a biblioteca de ROMs</p>
        </div>
        <Button onClick={() => openDialog()} className="pokemon-gradient text-white">
          <Upload className="w-4 h-4 mr-2" /> Nova ROM
        </Button>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar ROMs..." className="bg-white/5 border-white/10 text-white pl-10" />
      </div>

      {isLoading ? (
        <div className="py-20"><LoadingSpinner text="Carregando ROMs..." /></div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Nome</TableHead>
                <TableHead className="text-white/60">Plataforma</TableHead>
                <TableHead className="text-white/60">Geração</TableHead>
                <TableHead className="text-white/60">Downloads</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60 w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoms.map((rom) => (
                <TableRow key={rom.id} className="border-white/5 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                        {rom.cover_image ? <img src={rom.cover_image} alt="" className="w-full h-full object-cover" /> : <Gamepad2 className="w-5 h-5 text-white/40" />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{rom.name}</p>
                        {rom.is_hack && <Badge className="bg-purple-500/20 text-purple-400 text-xs mt-1">Hack</Badge>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge className="bg-white/10 text-white/70 border-white/20">{rom.platform}</Badge></TableCell>
                  <TableCell className="text-white/60 capitalize">{rom.generation?.replace("gen", "Gen ")}</TableCell>
                  <TableCell className="text-white/60"><span className="flex items-center gap-1"><Download className="w-4 h-4" /> {rom.downloads || 0}</span></TableCell>
                  <TableCell>
                    <Badge className={rom.status === "ativo" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-500/20 text-slate-400 border-slate-500/30"}>
                      {rom.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                        <DropdownMenuItem onClick={() => openDialog(rom)} className="text-white/80 focus:text-white focus:bg-white/10"><Pencil className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(rom)} className="text-red-400 focus:text-red-300 focus:bg-red-500/10"><Trash2 className="w-4 h-4 mr-2" /> Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRoms.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-12 text-white/40">Nenhuma ROM encontrada</TableCell></TableRow>}
            </TableBody>
          </Table>
        </motion.div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingRom ? "Editar ROM" : "Nova ROM"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Nome do Jogo</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Pokémon Emerald" className="bg-white/5 border-white/10 text-white mt-1" required />
              </div>
              <div>
                <Label>Plataforma</Label>
                <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">{platforms.map((p) => <SelectItem key={p.value} value={p.value} className="text-white">{p.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Geração</Label>
                <Select value={formData.generation} onValueChange={(v) => setFormData({ ...formData, generation: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">{generations.map((g) => <SelectItem key={g.value} value={g.value} className="text-white">{g.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Idioma</Label>
                <Select value={formData.language} onValueChange={(v) => setFormData({ ...formData, language: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">{languages.map((l) => <SelectItem key={l.value} value={l.value} className="text-white">{l.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Versão</Label>
                <Input value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} placeholder="v1.0" className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
              <div>
                <Label>Imagem de Capa (URL)</Label>
                <Input value={formData.cover_image} onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })} placeholder="https://..." className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
              <div>
                <Label>URL do Arquivo</Label>
                <Input value={formData.file_url} onChange={(e) => setFormData({ ...formData, file_url: e.target.value })} placeholder="https://..." className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
              <div>
                <Label>Tamanho</Label>
                <Input value={formData.file_size} onChange={(e) => setFormData({ ...formData, file_size: e.target.value })} placeholder="16MB" className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
              <div>
                <Label>MD5 Hash</Label>
                <Input value={formData.md5_hash} onChange={(e) => setFormData({ ...formData, md5_hash: e.target.value })} placeholder="abc123..." className="bg-white/5 border-white/10 text-white mt-1 font-mono text-sm" />
              </div>
              <div className="flex items-center gap-3"><Switch checked={formData.is_hack} onCheckedChange={(v) => setFormData({ ...formData, is_hack: v })} /><Label>ROM Hack</Label></div>
              <div className="flex items-center gap-3"><Switch checked={formData.featured} onCheckedChange={(v) => setFormData({ ...formData, featured: v })} /><Label>Destaque</Label></div>
              {formData.is_hack && (
                <div className="md:col-span-2">
                  <Label>Jogo Base</Label>
                  <Input value={formData.hack_base} onChange={(e) => setFormData({ ...formData, hack_base: e.target.value })} placeholder="Pokémon FireRed" className="bg-white/5 border-white/10 text-white mt-1" />
                </div>
              )}
              <div className="md:col-span-2">
                <Label>Descrição</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Descrição do jogo..." className="bg-white/5 border-white/10 text-white mt-1" rows={4} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="ativo" className="text-white">Ativo</SelectItem>
                    <SelectItem value="inativo" className="text-white">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="outline" onClick={closeDialog} className=" border-white/20 text-black hover:bg-white/5 hover:text-white"> Cancelar</Button>
              <Button type="submit" className="pokemon-gradient text-white" disabled={createMutation.isPending || updateMutation.isPending}>{editingRom ? "Salvar" : "Cadastrar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}