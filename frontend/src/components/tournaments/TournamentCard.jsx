import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Calendar, Users, Trophy, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig = {
  inscricoes_abertas: {
    label: "Inscrições Abertas",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  em_andamento: {
    label: "Em Andamento",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  finalizado: {
    label: "Finalizado",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

const formatLabels = {
  singles: "Singles",
  doubles: "Doubles",
  vgc: "VGC",
  smogon_ou: "Smogon OU",
  smogon_uu: "Smogon UU",
  random_battle: "Random Battle",
  outro: "Outro",
};

export default function TournamentCard({ tournament, featured = false }) {
  const status = statusConfig[tournament.status] || statusConfig.inscricoes_abertas;
  const participantCount = tournament.participants?.length || 0;

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="relative">
          {tournament.cover_image ? (
            <img
              src={tournament.cover_image}
              alt={tournament.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 flex items-center justify-center">
              <Trophy className="w-16 h-16 text-yellow-500/30" />
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge className={`${status.color} border`}>{status.label}</Badge>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{tournament.name}</h3>
              <Badge variant="outline" className="text-white/60 border-white/20">
                {formatLabels[tournament.format] || tournament.format}
              </Badge>
            </div>
            {tournament.prize && (
              <div className="text-right">
                <span className="text-yellow-400 font-bold">{tournament.prize}</span>
              </div>
            )}
          </div>

          <p className="text-white/60 text-sm mb-4 line-clamp-2">{tournament.description}</p>

          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <span className="flex items-center gap-2 text-white/50">
              <Calendar className="w-4 h-4" />
              {tournament.start_date
                ? format(new Date(tournament.start_date), "dd MMM yyyy", { locale: ptBR })
                : "Data a definir"}
            </span>
            <span className="flex items-center gap-2 text-white/50">
              <Users className="w-4 h-4" />
              {participantCount}/{tournament.max_participants || "∞"} participantes
            </span>
          </div>

          <Link to={createPageUrl(`TournamentDetail?id=${tournament.id}`)}>
            <Button className="w-full pokemon-gradient text-white">
              {tournament.status === "inscricoes_abertas" ? "Inscrever-se" : "Ver Detalhes"}
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-5 hover:border-white/20 transition-all"
    >
      <Link to={createPageUrl(`TournamentDetail?id=${tournament.id}`)}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold truncate">{tournament.name}</h3>
              <Badge className={`${status.color} border text-xs`}>{status.label}</Badge>
            </div>
            <p className="text-white/50 text-sm">
              {formatLabels[tournament.format]} • {participantCount}/{tournament.max_participants || "∞"}
            </p>
            {tournament.start_date && (
              <p className="text-white/40 text-xs mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(new Date(tournament.start_date), "dd/MM/yyyy 'às' HH:mm")}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}