import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { Eye, Download, FileText, Gamepad2, Trophy, BookOpen, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#E3350D", "#3B5BA7", "#FFCB05", "#10B981", "#8B5CF6", "#EC4899"];

function StatsCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    red: "from-red-500/20 to-red-600/5 border-red-500/30",
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
    yellow: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30",
    green: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClasses[color]} border p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <Icon className="w-6 h-6 text-white/60" />
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  const { data: posts = [] } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => api.entities.Post.list("-created_at"),
  });

  const { data: roms = [] } = useQuery({
    queryKey: ["admin-roms"],
    queryFn: () => api.entities.ROM.list("-created_at"),
  });

  const { data: tournaments = [] } = useQuery({
    queryKey: ["admin-tournaments"],
    queryFn: () => api.entities.Tournament.list("-created_at"),
  });

  const { data: guides = [] } = useQuery({
    queryKey: ["admin-guides"],
    queryFn: () => api.entities.Guide.list("-created_at"),
  });

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalDownloads = roms.reduce((acc, r) => acc + (r.downloads || 0), 0);

  // Category distribution
  const categoryData = posts.reduce((acc, post) => {
    const cat = post.category || "outros";
    const existing = acc.find(i => i.name === cat);
    if (existing) existing.value++;
    else acc.push({ name: cat, value: 1 });
    return acc;
  }, []);

  // Platform distribution
  const platformData = roms.reduce((acc, rom) => {
    const platform = rom.platform || "outros";
    const existing = acc.find(i => i.name === platform);
    if (existing) {
      existing.value++;
      existing.downloads += rom.downloads || 0;
    } else {
      acc.push({ name: platform, value: 1, downloads: rom.downloads || 0 });
    }
    return acc;
  }, []);

  // Weekly mock data
  const weeklyData = [
    { name: "Seg", views: 120, downloads: 45 },
    { name: "Ter", views: 180, downloads: 62 },
    { name: "Qua", views: 150, downloads: 38 },
    { name: "Qui", views: 220, downloads: 78 },
    { name: "Sex", views: 280, downloads: 95 },
    { name: "Sáb", views: 350, downloads: 120 },
    { name: "Dom", views: 310, downloads: 108 },
  ];

  // Top content
  const topPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  const topROMs = [...roms].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 5);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-white/60 mt-1">Métricas e estatísticas do conteúdo</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total de Views" value={totalViews.toLocaleString()} icon={Eye} color="red" />
        <StatsCard title="Total Downloads" value={totalDownloads.toLocaleString()} icon={Download} color="blue" />
        <StatsCard title="Posts" value={posts.length} icon={FileText} color="green" />
        <StatsCard title="ROMs" value={roms.length} icon={Gamepad2} color="yellow" />
      </div>

      {/* Main Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Visão Geral</h2>
            <p className="text-white/60 text-sm">Últimos 7 dias</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-white/60 text-sm">Views</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-white/60 text-sm">Downloads</span></div>
          </div>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" />
              <YAxis stroke="rgba(255,255,255,0.4)" />
              <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }} />
              <Area type="monotone" dataKey="views" stroke="#E3350D" fillOpacity={1} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="downloads" stroke="#3B5BA7" fillOpacity={1} fill="url(#colorDownloads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Posts por Categoria</h2>
          <div className="h-[250px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }} />
                  <Legend formatter={(value) => <span className="text-white/80 capitalize">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-white/40">Sem dados</div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Downloads por Plataforma</h2>
          <div className="h-[250px]">
            {platformData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" />
                  <YAxis stroke="rgba(255,255,255,0.4)" />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }} />
                  <Bar dataKey="downloads" fill="#E3350D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-white/40">Sem dados</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Posts Mais Vistos</h2>
          <div className="space-y-4">
            {topPosts.length === 0 ? (
              <p className="text-white/40 text-center py-4">Nenhum post</p>
            ) : (
              topPosts.map((post, index) => (
                <div key={post.id} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                    index === 1 ? "bg-gray-400/20 text-gray-400" :
                    index === 2 ? "bg-amber-700/20 text-amber-600" : "bg-white/10 text-white/60"
                  }`}>{index + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{post.title}</p>
                    <p className="text-white/40 text-sm capitalize">{post.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-white/60"><Eye className="w-4 h-4" /> {post.views || 0}</div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">ROMs Mais Baixadas</h2>
          <div className="space-y-4">
            {topROMs.length === 0 ? (
              <p className="text-white/40 text-center py-4">Nenhuma ROM</p>
            ) : (
              topROMs.map((rom, index) => (
                <div key={rom.id} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                    index === 1 ? "bg-gray-400/20 text-gray-400" :
                    index === 2 ? "bg-amber-700/20 text-amber-600" : "bg-white/10 text-white/60"
                  }`}>{index + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{rom.name}</p>
                    <p className="text-white/40 text-sm">{rom.platform}</p>
                  </div>
                  <div className="flex items-center gap-1 text-white/60"><Download className="w-4 h-4" /> {rom.downloads || 0}</div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <FileText className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{posts.length}</p>
          <p className="text-white/60 text-sm">Posts</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Gamepad2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{roms.length}</p>
          <p className="text-white/60 text-sm">ROMs</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{tournaments.length}</p>
          <p className="text-white/60 text-sm">Torneios</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <BookOpen className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{guides.length}</p>
          <p className="text-white/60 text-sm">Guias</p>
        </div>
      </motion.div>
    </div>
  );
}