// frontend/src/pages/BlogPost.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Share2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ArticleCard from "@/components/blog/ArticleCard";

const categoryColors = {
  noticias: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  guias: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  detonados: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  torneios: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  curiosidades: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  estrategias: "bg-red-500/20 text-red-400 border-red-500/30",
};

const categoryLabels = {
  noticias: "Notícias",
  guias: "Guias",
  detonados: "Detonados",
  torneios: "Torneios",
  curiosidades: "Curiosidades",
  estrategias: "Estratégias",
};

export default function BlogPost() {
  // Mantemos o padrão atual: ?id=<uuid>
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  // Busca o artigo por ID no backend novo
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => api.getArticleById(postId),
    enabled: !!postId,
  });

  // Busca posts relacionados (mesma categoria, publicados)
  const { data: allArticles = [] } = useQuery({
    queryKey: ["articles-related"],
    queryFn: () => api.listArticles(),
    enabled: !!post, // só depois de ter o post carregado
  });

  const relatedPosts = allArticles
    .filter(
      (p) =>
        p.status === "publicado" &&
        p.category === post?.category &&
        p.id !== post?.id
    )
    .sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    })
    .slice(0, 3);

  if (!postId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          Nenhum post selecionado
        </h1>
        <Link to={createPageUrl("Blog")}>
          <Button className="pokemon-gradient text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Blog
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Carregando artigo..." />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          Post não encontrado
        </h1>
        <Link to={createPageUrl("Blog")}>
          <Button className="pokemon-gradient text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Blog
          </Button>
        </Link>
      </div>
    );
  }

  const readingTime = Math.ceil(
    (post.content?.split(" ").length || 0) / 200
  );

  return (
    <div>
      {/* Hero */}
      <div className="relative">
        {post.cover_image && (
          <div className="absolute inset-0 h-96">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          </div>
        )}

        <div className="relative max-w-4xl mx-auto px-4 pt-8 pb-12">
          {/* Back Button */}
          <Link
            to={createPageUrl("Blog")}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Badge
              className={`${
                categoryColors[post.category] || "bg-white/10 text-white/70 border-white/20"
              } border mb-4`}
            >
              {categoryLabels[post.category] || post.category}
            </Badge>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-white/70 text-lg mb-6">{post.excerpt}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-white/50 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.created_at &&
                  format(
                    new Date(post.created_at),
                    "dd 'de' MMMM 'de' yyyy",
                    { locale: ptBR }
                  )}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views || 0} visualizações
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readingTime} min de leitura
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 md:p-10"
        >
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-white mt-8 mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-white mt-6 mb-3">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-white mt-4 mb-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-white/80 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-white/80 mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-red-500 pl-4 italic text-white/70 my-4">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-white/10 px-2 py-1 rounded text-red-400">
                    {children}
                  </code>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-red-400 hover:text-red-300 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {post.content || ""}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-white/60 border-white/20"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-white/50 text-sm">
              Gostou? Compartilhe!
            </span>
            <Button
              variant="outline"
              size="sm"
              className=" border-white/20 text-black hover:bg-white/5 hover:text-white"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => alert("Link copiado para a área de transferência"));
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Posts Relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <ArticleCard key={relatedPost.id} article={relatedPost} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
