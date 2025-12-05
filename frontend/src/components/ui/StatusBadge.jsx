import React from "react";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  // Post status
  rascunho: { label: "Rascunho", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  publicado: { label: "Publicado", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  agendado: { label: "Agendado", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  
  // ROM status
  ativo: { label: "Ativo", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  inativo: { label: "Inativo", className: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
  
  // Tournament status
  inscricoes_abertas: { label: "Inscrições Abertas", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  em_andamento: { label: "Em Andamento", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  finalizado: { label: "Finalizado", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  cancelado: { label: "Cancelado", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  
  // Guide status
  em_progresso: { label: "Em Progresso", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  completo: { label: "Completo", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, className: "bg-slate-500/20 text-slate-400 border-slate-500/30" };
  
  return (
    <Badge variant="outline" className={`${config.className} border`}>
      {config.label}
    </Badge>
  );
}