import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  FileText,
  Gamepad2,
  Trophy,
  BookOpen,
  Eye,
  Download,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function StatsCard({ title, value, icon: Icon, color, trend, trendUp }) {
  const colorClasses = {
    red: "from-red-500/20 to-red-600/5 border-red-500/30 text-red-500",
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-500",
    yellow:
      "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30 text-yellow-500",
    green:
      "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-500",
    purple:
      "from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-500",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClasses[color]} border p-6`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trendUp ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <Icon className="w-6 h-6 text-current" />
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
    </div>
  );
}

export default function Dashboard() {
  // Agora o dashboard usa só o backend novo de artigos (PostgreSQL)
  const {
    data: posts = [],
    isLoading: isLoadingPosts,
    isError,
  } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => api.listArticles(),
  });

  // Por enquanto ainda não temos ROMs/Torneios/Guias no backend novo,
  // então mantemos a estrutura mas com arrays vazios para não quebrar nada.
  const roms = [];
  const tournaments = [];
  const guides = [];

  const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0);
  const publishedPosts = posts.filter(
    (p) => p.status === "publicado"
  ).length;
  const totalDownloads = roms.reduce(
    (acc, rom) => acc + (rom.downloads || 0),
    0
  );
  const activeTournaments = tournaments.filter(
    (t) =>
      t.status === "em_andamento" || t.status === "inscricoes_abertas"
  ).length;

  // Ordenar posts por data de criação (mais recentes primeiro)
  const sortedPosts = [...posts].sort((a, b) => {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0;
    const db = b.created_at ? new Date(b.created_at).getTime() : 0;
    return db - da;
  });

  const recentPosts = sortedPosts.slice(0, 5);
  const recentRoms = roms.slice(0, 5);

  // Geração simples de dados para o gráfico:
  // usamos os últimos 7 dias e contamos posts + views
  const today = new Date();
  const chartData = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - idx));
    const dayLabel = format(d, "EEE", { locale: ptBR }); // Seg, Ter, Qua...

    const postsInDay = posts.filter((p) => {
      if (!p.created_at) return false;
      const pd = new Date(p.created_at);
      return (
        pd.getFullYear() === d.getFullYear() &&
        pd.getMonth() === d.getMonth() &&
        pd.getDate() === d.getDate()
      );
    });

    const viewsInDay = postsInDay.reduce(
      (acc, p) => acc + (p.views || 0),
      0
    );

    return {
      name: dayLabel,
      views: viewsInDay,
      downloads: 0, // quando ROMs estiverem integradas, ajustar aqui
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/60 mt-1">
            Visão geral do conteúdo do My World&apos;s Pokémon
          </p>
        </div>
        <div className="flex gap-3">
          <Link to={createPageUrl("AdminPosts")}>
            <Button className="pokemon-gradient text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Post
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Posts Publicados"
          value={publishedPosts}
          icon={FileText}
          color="red"
          trend={posts.length ? "+100% (dev)" : undefined}
          trendUp
        />
        <StatsCard
          title="Total de Views"
          value={totalViews.toLocaleString("pt-BR")}
          icon={Eye}
          color="blue"
          trend={posts.length ? "+10% estimado" : undefined}
          trendUp
        />
        <StatsCard
          title="Downloads"
          value={totalDownloads.toLocaleString("pt-BR")}
          icon={Download}
          color="yellow"
          trend="+0% (em breve)"
          trendUp
        />
        <StatsCard
          title="Torneios Ativos"
          value={activeTournaments}
          icon={Trophy}
          color="purple"
        />
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Atividade (últimos 7 dias)
            </h2>
            <p className="text-white/60 text-sm">
              Views dos artigos por dia (baseado na data de criação)
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-white/60 text-sm">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-white/60 text-sm">Downloads</span>
            </div>
          </div>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E3350D" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E3350D" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B5BA7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B5BA7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.4)"
              />
              <YAxis stroke="rgba(255,255,255,0.4)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "white",
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#E3350D"
                fillOpacity={1}
                fill="url(#colorViews)"
              />
              <Area
                type="monotone"
                dataKey="downloads"
                stroke="#3B5BA7"
                fillOpacity={1}
                fill="url(#colorDownloads)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              Posts Recentes
            </h2>
            <Link
              to={createPageUrl("AdminPosts")}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingPosts ? (
            <p className="text-white/40 text-center py-8">
              Carregando posts...
            </p>
          ) : isError ? (
            <p className="text-red-400 text-center py-8">
              Erro ao carregar posts
            </p>
          ) : recentPosts.length === 0 ? (
            <p className="text-white/40 text-center py-8">
              Nenhum post criado ainda
            </p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileText className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-white/45 mt-0.5">
                      {post.category && (
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 capitalize">
                          {post.category}
                        </span>
                      )}
                      {post.created_at && (
                        <span>
                          {format(
                            new Date(post.created_at),
                            "dd/MM/yyyy",
                            { locale: ptBR }
                          )}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {post.views || 0}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      post.status === "publicado"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : post.status === "rascunho"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent ROMs – estrutura mantida, aguardando backend de ROMs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              ROMs Populares
            </h2>
            <Link
              to={createPageUrl("AdminROMs")}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentRoms.length === 0 ? (
              <p className="text-white/40 text-center py-8">
                Nenhuma ROM cadastrada (integração em desenvolvimento)
              </p>
            ) : (
              recentRoms.map((rom) => (
                <div
                  key={rom.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {rom.name}
                    </p>
                    <p className="text-white/40 text-xs">
                      {rom.platform}
                    </p>
                  </div>
                  <span className="text-white/50 text-sm flex items-center gap-1">
                    <Download className="w-3 h-3" /> {rom.downloads || 0}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Link
          to={createPageUrl("AdminPosts")}
          className="glass-card rounded-xl p-4 hover:bg-white/5 transition-colors group"
        >
          <FileText className="w-8 h-8 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-medium">Novo Post</h3>
          <p className="text-white/40 text-sm">Criar artigo</p>
        </Link>
        <Link
          to={createPageUrl("AdminROMs")}
          className="glass-card rounded-xl p-4 hover:bg-white/5 transition-colors group"
        >
          <Gamepad2 className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-medium">Nova ROM</h3>
          <p className="text-white/40 text-sm">Upload de jogo</p>
        </Link>
        <Link
          to={createPageUrl("AdminTournaments")}
          className="glass-card rounded-xl p-4 hover:bg-white/5 transition-colors group"
        >
          <Trophy className="w-8 h-8 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-medium">Novo Torneio</h3>
          <p className="text-white/40 text-sm">Criar competição</p>
        </Link>
        <Link
          to={createPageUrl("AdminGuides")}
          className="glass-card rounded-xl p-4 hover:bg-white/5 transition-colors group"
        >
          <BookOpen className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-medium">Novo Guia</h3>
          <p className="text-white/40 text-sm">Criar detonado</p>
        </Link>
      </motion.div>
    </div>
  );
}
