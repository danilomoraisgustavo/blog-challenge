import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Users, Trophy, Award, FileText, Share2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import TournamentBracket from "@/components/tournaments/TournamentBracket";

const statusConfig = {
  inscricoes_abertas: { label: "Inscrições Abertas", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  em_andamento: { label: "Em Andamento", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  finalizado: { label: "Finalizado", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  cancelado: { label: "Cancelado", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const formatLabels = {
  singles: "Singles", doubles: "Doubles", vgc: "VGC",
  smogon_ou: "Smogon OU", smogon_uu: "Smogon UU",
  random_battle: "Random Battle", outro: "Outro",
};

const genLabels = {
  gen1: "Geração I", gen2: "Geração II", gen3: "Geração III", gen4: "Geração IV",
  gen5: "Geração V", gen6: "Geração VI", gen7: "Geração VII", gen8: "Geração VIII", gen9: "Geração IX",
};

export default function TournamentDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const tournamentId = urlParams.get("id");

  const { data: tournament, isLoading } = useQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: async () => {
      const tournaments = await api.entities.Tournament.filter({ id: tournamentId });
      return tournaments[0];
    },
    enabled: !!tournamentId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Carregando torneio..." />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Torneio não encontrado</h1>
        <Link to={createPageUrl("Tournaments")}>
          <Button className="pokemon-gradient text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Torneios
          </Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[tournament.status] || statusConfig.inscricoes_abertas;
  const participantCount = tournament.participants?.length || 0;
  const spotsLeft = tournament.max_participants ? tournament.max_participants - participantCount : null;

  return (
    <div>
      {/* Hero */}
      <div className="relative">
        {tournament.cover_image && (
          <div className="absolute inset-0 h-72">
            <img src={tournament.cover_image} alt={tournament.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-12">
          <Link to={createPageUrl("Tournaments")} className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Torneios
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className={`${status.color} border mb-4`}>{status.label}</Badge>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{tournament.name}</h1>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="text-white/70 border-white/20">{formatLabels[tournament.format] || tournament.format}</Badge>
              {tournament.generation && <Badge variant="outline" className="text-white/70 border-white/20">{genLabels[tournament.generation]}</Badge>}
              {tournament.prize && <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Award className="w-3 h-3 mr-1" />{tournament.prize}</Badge>}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <Tabs defaultValue="info" className="space-y-6">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="info" className="data-[state=active]:bg-white/10">Informações</TabsTrigger>
                <TabsTrigger value="rules" className="data-[state=active]:bg-white/10">Regras</TabsTrigger>
                <TabsTrigger value="bracket" className="data-[state=active]:bg-white/10">Bracket</TabsTrigger>
                <TabsTrigger value="participants" className="data-[state=active]:bg-white/10">Participantes</TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                {tournament.description && (
                  <div className="glass-card rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Sobre o Torneio</h2>
                    <p className="text-white/70 leading-relaxed">{tournament.description}</p>
                  </div>
                )}

                {/* Winner */}
                {tournament.winner && (
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="glass-card rounded-xl p-6 mt-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border-yellow-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Campeão</p>
                        <h3 className="text-2xl font-bold text-yellow-400">{tournament.winner}</h3>
                      </div>
                    </div>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="rules">
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Regras</h2>
                  </div>
                  {tournament.rules ? (
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="text-white/70 mb-3">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside text-white/70 space-y-1 mb-4">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside text-white/70 space-y-1 mb-4">{children}</ol>,
                          h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-4 mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-bold text-white mt-3 mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-bold text-white mt-2 mb-1">{children}</h3>,
                        }}
                      >
                        {tournament.rules}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-white/40 italic">Regras serão publicadas em breve.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="bracket">
                <TournamentBracket bracketData={tournament.bracket_data} />
              </TabsContent>

              <TabsContent value="participants">
                <div className="glass-card rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Participantes ({participantCount}{tournament.max_participants ? `/${tournament.max_participants}` : ""})
                  </h2>
                  {tournament.participants?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {tournament.participants.map((participant, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-white font-medium">{participant.name}</p>
                              {participant.showdown_nick && (
                                <p className="text-white/50 text-xs">{participant.showdown_nick}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 italic text-center py-8">Nenhum participante inscrito ainda.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="glass-card rounded-xl p-6 sticky top-8 space-y-6">
              {/* Info */}
              <div className="space-y-4">
                {tournament.start_date && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Data de Início</p>
                      <p className="text-white font-medium">
                        {format(new Date(tournament.start_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                      <p className="text-white/50 text-sm">{format(new Date(tournament.start_date), "HH:mm")}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Participantes</p>
                    <p className="text-white font-medium">{participantCount}/{tournament.max_participants || "∞"}</p>
                    {spotsLeft !== null && spotsLeft > 0 && tournament.status === "inscricoes_abertas" && (
                      <p className="text-emerald-400 text-xs">{spotsLeft} vagas restantes</p>
                    )}
                  </div>
                </div>

                {tournament.prize && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Premiação</p>
                      <p className="text-yellow-400 font-medium">{tournament.prize}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {tournament.status === "inscricoes_abertas" && (
                <Button className="w-full pokemon-gradient text-white" size="lg">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Inscrever-se
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={() => navigator.share?.({ title: tournament.name, url: window.location.href })}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}