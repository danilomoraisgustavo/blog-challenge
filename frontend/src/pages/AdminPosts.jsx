import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  FileText,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import AIGeneratorButton from "@/components/common/AIGeneratorButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const categories = [
  { value: "noticias", label: "Notícias" },
  { value: "guias", label: "Guias" },
  { value: "detonados", label: "Detonados" },
  { value: "torneios", label: "Torneios" },
  { value: "curiosidades", label: "Curiosidades" },
  { value: "estrategias", label: "Estratégias" },
];

const generations = [
  { value: "gen1", label: "Geração I" },
  { value: "gen2", label: "Geração II" },
  { value: "gen3", label: "Geração III" },
  { value: "gen4", label: "Geração IV" },
  { value: "gen5", label: "Geração V" },
  { value: "gen6", label: "Geração VI" },
  { value: "gen7", label: "Geração VII" },
  { value: "gen8", label: "Geração VIII" },
  { value: "gen9", label: "Geração IX" },
  { value: "geral", label: "Geral" },
];

const statuses = [
  { value: "rascunho", label: "Rascunho" },
  { value: "publicado", label: "Publicado" },
  { value: "agendado", label: "Agendado" },
];

const defaultFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  cover_image: "",
  category: "noticias",
  tags: [],
  status: "rascunho",
  featured: false,
  generation: "geral",
  meta_description: "",
};

export default function AdminPosts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  // LISTAR POSTS
  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => api.listArticles(),
  });

  // CRIAR POST
  const createMutation = useMutation({
    mutationFn: (data) => api.createArticle(data),
    onSuccess: (created) => {
      // Atualiza o cache imediatamente
      queryClient.setQueryData(["admin-posts"], (old) =>
        old ? [created, ...old] : [created]
      );
      closeDialog();
    },
  });

  // ATUALIZAR POST
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.updateArticle(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["admin-posts"], (old) =>
        (old || []).map((post) => (post.id === updated.id ? updated : post))
      );
      closeDialog();
    },
  });

  // DELETAR POST
  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteArticle(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(["admin-posts"], (old) =>
        (old || []).filter((post) => post.id !== id)
      );
    },
  });


  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDialog = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title || "",
        slug: post.slug || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        cover_image: post.cover_image || "",
        category: post.category || "noticias",
        tags: post.tags || [],
        status: post.status || "rascunho",
        featured: post.featured || false,
        generation: post.generation || "geral",
        meta_description: post.meta_description || "",
      });
    } else {
      setEditingPost(null);
      setFormData(defaultFormData);
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPost(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const slug =
      formData.slug ||
      formData.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const payload = {
      ...formData,
      slug,
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (post) => {
    if (confirm("Tem certeza que deseja excluir este post?")) {
      deleteMutation.mutate(post.id);
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Posts</h1>
          <p className="text-white/60 mt-1">Gerencie artigos e notícias</p>
        </div>
        <div className="flex gap-2">
          <AIGeneratorButton
            type="post"
            onGenerated={(data) => {
              setFormData({
                ...defaultFormData,
                title: data.title || "",
                content: data.content || "",
                excerpt: data.excerpt || "",
                tags: data.tags || [],
                meta_description: data.meta_description || "",
                category: data.category || "noticias",
                generation: data.generation || "geral",
              });
              setIsDialogOpen(true);
            }}
          />
          <Button
            onClick={() => openDialog()}
            className="pokemon-gradient text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar posts..."
          className="bg-white/5 border-white/10 text-white pl-10"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner text="Carregando posts..." />
        </div>
      ) : isError ? (
        <div className="py-20 text-center text-red-400">
          Erro ao carregar posts. Verifique o backend.
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Título</TableHead>
                <TableHead className="text-white/60">Categoria</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60">Views</TableHead>
                <TableHead className="text-white/60">Data</TableHead>
                <TableHead className="text-white/60 w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow
                  key={post.id}
                  className="border-white/5 hover:bg-white/5"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                        {post.cover_image ? (
                          <img
                            src={post.cover_image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="w-5 h-5 text-white/40" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{post.title}</p>
                        <p className="text-white/40 text-xs">{post.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-white/10 text-white/70 border-white/20 capitalize">
                      {post.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        post.status === "publicado"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : post.status === "agendado"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }
                    >
                      {post.status || "rascunho"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/60">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {post.views || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-white/60">
                    {post.created_at || post.created_at
                      ? format(
                          new Date(post.created_at || post.created_at),
                          "dd/MM/yyyy"
                        )
                      : "--"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/60 hover:text-white"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-slate-900 border-white/10"
                      >
                        <DropdownMenuItem
                          onClick={() => openDialog(post)}
                          className="text-white/80 focus:text-white focus:bg:white/10"
                        >
                          <Pencil className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(post)}
                          className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPosts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-white/40"
                  >
                    Nenhum post encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Editar Post" : "Novo Post"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Título</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Título do post"
                  className="bg-white/5 border-white/10 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label>Slug (URL)</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="url-do-post"
                  className="bg:white/5 border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <Label>Imagem de Capa (URL)</Label>
                <Input
                  value={formData.cover_image}
                  onChange={(e) =>
                    setFormData({ ...formData, cover_image: e.target.value })
                  }
                  placeholder="https://..."
                  className="bg-white/5 border-white/10 text:white mt-1"
                />
              </div>

              <div>
                <Label>Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger className="bg:white/5 border-white/10 text:white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    {categories.map((c) => (
                      <SelectItem
                        key={c.value}
                        value={c.value}
                        className="text-white"
                      >
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Geração</Label>
                <Select
                  value={formData.generation}
                  onValueChange={(v) =>
                    setFormData({ ...formData, generation: v })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text:white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    {generations.map((g) => (
                      <SelectItem
                        key={g.value}
                        value={g.value}
                        className="text-white"
                      >
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) =>
                    setFormData({ ...formData, status: v })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text:white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    {statuses.map((s) => (
                      <SelectItem
                        key={s.value}
                        value={s.value}
                        className="text-white"
                      >
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(v) =>
                    setFormData({ ...formData, featured: v })
                  }
                />
                <Label>Destaque</Label>
              </div>

              <div className="md:col-span-2">
                <Label>Resumo</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Breve descrição..."
                  className="bg-white/5 border-white/10 text:white mt-1"
                  rows={2}
                />
              </div>

              <div className="md:col-span-2">
                <Label>Conteúdo (Markdown)</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Conteúdo do post..."
                  className="bg-white/5 border-white/10 text-white mt-1 font-mono"
                  rows={12}
                />
              </div>

              <div className="md:col-span-2">
                <Label>Meta Description (SEO)</Label>
                <Textarea
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_description: e.target.value,
                    })
                  }
                  placeholder="Descrição para buscadores..."
                  className="bg-white/5 border-white/10 text:white mt-1"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                className="  border-white/20 text-black hover:bg-white/5 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="pokemon-gradient text-white"
                disabled={
                  createMutation.isPending || updateMutation.isPending
                }
              >
                {editingPost ? "Salvar" : "Criar Post"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
