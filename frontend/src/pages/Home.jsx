import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  Gamepad2,
  BookOpen,
  Trophy,
  Database,
  ArrowRight,
  Download,
  Users,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/blog/ArticleCard";
import RomCard from "@/components/roms/RomCard";
import TournamentCard from "@/components/tournaments/TournamentCard";
import SectionHeader from "@/components/common/SectionHeader";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function Home() {
  // Agora usamos o backend novo de artigos
  const {
    data: posts = [],
    isLoading: loadingPosts,
    isError: errorPosts,
  } = useQuery({
    queryKey: ["posts-public-home"],
    queryFn: () => api.listArticles(), // traz todos, filtramos publicados abaixo
  });

  // ROMs / Torneios ainda não estão integrados no backend novo,
  // então mantemos a estrutura com arrays vazios (não quebra o layout).
  const roms = [];
  const loadingRoms = false;

  const tournaments = [];
  const loadingTournaments = false;

  // ---- Lógica de posts (apenas publicados) ----
  const publishedPosts = posts.filter((p) => p.status === "publicado");

  const sortedPublishedPosts = [...publishedPosts].sort((a, b) => {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0;
    const db = b.created_at ? new Date(b.created_at).getTime() : 0;
    return db - da; // mais recentes primeiro
  });

  const featuredPost =
    sortedPublishedPosts.find((p) => p.featured) || sortedPublishedPosts[0];

  const regularPosts = sortedPublishedPosts
    .filter((p) => p.id !== featuredPost?.id)
    .slice(0, 3);

  const featuredRoms = roms.filter((r) => r.featured).slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-blue-500/10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=1920')] bg-cover bg-center opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white/70 text-sm">
                Seu portal Pokémon completo
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Tudo sobre{" "}
              <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                Pokémon
              </span>{" "}
              em um só lugar
            </h1>

            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Notícias, ROMs, detonados, guias competitivos, torneios e muito
              mais. Explore o universo Pokémon como nunca antes.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to={createPageUrl("Blog")}>
                <Button
                  size="lg"
                  className="pokemon-gradient text-white shadow-lg shadow-red-500/20"
                >
                  Explorar Conteúdo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("RomLibrary")}>
                <Button
                  size="lg"
                  variant="outline"
                  className=" border-white/20 text-black hover:bg-white/5 hover:text-white"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Biblioteca de ROMs
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {[
              {
                icon: BookOpen,
                label: "Artigos",
                value: `${publishedPosts.length}+`,
              },
              {
                icon: Gamepad2,
                label: "ROMs",
                value: `${roms.length}+`,
              },
              {
                icon: Trophy,
                label: "Torneios",
                value: `${tournaments.length}+`,
              },
              {
                icon: Users,
                label: "Treinadores",
                value: "5K+",
              },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-xl p-4 text-center">
                <stat.icon className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <SectionHeader
          title="Destaque"
          linkText="Ver todos os posts"
          linkPage="Blog"
        />

        {loadingPosts ? (
          <div className="py-8">
            <LoadingSpinner text="Carregando posts..." />
          </div>
        ) : errorPosts ? (
          <p className="text-red-400 text-sm">
            Erro ao carregar posts. Tente novamente mais tarde.
          </p>
        ) : !featuredPost ? (
          <p className="text-white/50 text-sm">
            Nenhum post publicado ainda. Assim que você publicar artigos, eles
            aparecerão aqui.
          </p>
        ) : (
          <ArticleCard article={featuredPost} featured />
        )}
      </section>

      {/* Latest Posts */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <SectionHeader
          title="Últimos Posts"
          subtitle="Fique por dentro das novidades"
          linkText="Ver mais"
          linkPage="Blog"
        />

        {loadingPosts ? (
          <div className="py-8">
            <LoadingSpinner text="Carregando posts..." />
          </div>
        ) : regularPosts.length === 0 ? (
          <p className="text-white/50 text-sm">
            Ainda não há outros posts publicados além do destaque.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <ArticleCard key={post.id} article={post} />
            ))}
          </div>
        )}
      </section>

      {/* Featured ROMs */}
      {roms.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <SectionHeader
            title="ROMs em Destaque"
            subtitle="Os jogos mais populares"
            linkText="Ver biblioteca completa"
            linkPage="RomLibrary"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(featuredRoms.length > 0 ? featuredRoms : roms.slice(0, 4)).map(
              (rom) => (
                <RomCard key={rom.id} rom={rom} />
              )
            )}
          </div>
        </section>
      )}

      {/* Tournaments */}
      {tournaments.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <SectionHeader
            title="Torneios Abertos"
            subtitle="Participe e mostre suas habilidades"
            linkText="Ver todos"
            linkPage="Tournaments"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                featured
              />
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Explore a Pokédex Completa
              </h2>
              <p className="text-white/60">
                Mais de 1000 Pokémon com stats, builds competitivas e
                estratégias.
              </p>
            </div>
            <Link to={createPageUrl("Pokedex")}>
              <Button
                size="lg"
                className="pokemon-gradient text-white whitespace-nowrap"
              >
                <Database className="w-5 h-5 mr-2" />
                Acessar Pokédex
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
