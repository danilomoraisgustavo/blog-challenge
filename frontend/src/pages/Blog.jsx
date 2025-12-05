// frontend/src/pages/Blog.jsx
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import ArticleCard from "@/components/blog/ArticleCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import AdvancedFilters from "@/components/common/AdvancedFilters";
import InfiniteScrollList from "@/components/common/InfiniteScrollList";

const filterConfig = [
  {
    key: "category",
    label: "Categoria",
    allLabel: "Todas Categorias",
    options: [
      { value: "noticias", label: "Notícias" },
      { value: "guias", label: "Guias" },
      { value: "detonados", label: "Detonados" },
      { value: "torneios", label: "Torneios" },
      { value: "curiosidades", label: "Curiosidades" },
      { value: "estrategias", label: "Estratégias" },
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
      { value: "geral", label: "Geral" },
    ],
  },
  {
    key: "featured",
    label: "Destaque",
    allLabel: "Todos",
    options: [
      { value: "true", label: "Destaques" },
      { value: "false", label: "Normais" },
    ],
  },
];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    generation: "all",
    featured: "all",
  });

  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts-public"],
    queryFn: () => api.listArticles(), // busca todos os artigos do backend (PostgreSQL)
  });

  /**
   * 1) Consideramos apenas posts publicados
   * 2) Ordenamos por data de criação (mais recentes primeiro)
   */
  const publishedPosts = useMemo(() => {
    const onlyPublished = posts.filter((p) => p.status === "publicado");

    return onlyPublished.sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    });
  }, [posts]);

  /**
   * Aplica busca + filtros (categoria, geração, destaque)
   */
  const filteredPosts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return publishedPosts.filter((post) => {
      const matchesSearch =
        !search ||
        post.title?.toLowerCase().includes(search) ||
        post.excerpt?.toLowerCase().includes(search);

      const matchesCategory =
        filters.category === "all" || post.category === filters.category;

      const matchesGeneration =
        filters.generation === "all" || post.generation === filters.generation;

      const matchesFeatured =
        filters.featured === "all" ||
        (filters.featured === "true" && post.featured) ||
        (filters.featured === "false" && !post.featured);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesGeneration &&
        matchesFeatured
      );
    });
  }, [publishedPosts, searchTerm, filters]);

  /**
   * Destaque:
   * - Primeiro tenta um post com featured = true dentro do resultado filtrado
   * - Senão, usa o primeiro post da lista filtrada (mais recente)
   */
  const featuredPost =
    filteredPosts.find((p) => p.featured) || filteredPosts[0];

  /**
   * Lista principal (sem o destaque)
   */
  const regularPosts = filteredPosts.filter(
    (p) => p.id !== featuredPost?.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Blog
        </h1>
        <p className="text-white/60">
          Notícias, guias, detonados e muito mais sobre Pokémon
        </p>
      </motion.div>

      {/* Filtros + busca */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <AdvancedFilters
          searchPlaceholder="Buscar posts..."
          filters={filterConfig}
          activeFilters={filters}
          onFilterChange={setFilters}
          onSearchChange={setSearchTerm}
          searchValue={searchTerm}
          resultCount={filteredPosts.length}
        />
      </motion.div>

      {/* Loading / Erro / Vazio */}
      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner text="Carregando posts..." />
        </div>
      ) : isError ? (
        <EmptyState
          icon={FileText}
          title="Erro ao carregar posts"
          description="Ocorreu um problema ao buscar os artigos. Tente novamente em alguns instantes."
        />
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum post encontrado"
          description={
            searchTerm || filters.category !== "all" || filters.generation !== "all"
              ? "Nenhum resultado para os filtros atuais. Tente ajustar a busca ou os filtros."
              : "Ainda não há posts publicados. Em breve novos conteúdos estarão disponíveis."
          }
        />
      ) : (
        <div className="space-y-8">
          {/* Destaque só aparece quando:
             - Existe featuredPost
             - Não há busca ativa
             - Não há filtro de categoria específico
             - Filtro de destaque está em 'all'
           */}
          {featuredPost &&
            !searchTerm &&
            filters.category === "all" &&
            filters.featured === "all" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <ArticleCard article={featuredPost} featured />
              </motion.div>
            )}

          {/* Lista principal com scroll infinito */}
          <InfiniteScrollList
            items={regularPosts}
            renderItem={(post) => <ArticleCard article={post} />}
            pageSize={12}
            gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            loadingText="Carregando mais posts..."
          />
        </div>
      )}
    </div>
  );
}
