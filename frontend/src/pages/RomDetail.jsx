import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Gamepad2,
  Globe,
  HardDrive,
  Hash,
  Calendar,
  Shield,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import RomCard from "@/components/roms/RomCard";

const platformColors = {
  GB: "bg-gray-600",
  GBC: "bg-purple-600",
  GBA: "bg-indigo-600",
  NDS: "bg-slate-600",
  "3DS": "bg-red-600",
  Switch: "bg-red-500",
};

const languageLabels = {
  "pt-br": "🇧🇷 Português (Brasil)",
  en: "🇺🇸 Inglês",
  es: "🇪🇸 Espanhol",
  ja: "🇯🇵 Japonês",
  multi: "🌐 Multi-idioma",
};

const genLabels = {
  gen1: "Geração I",
  gen2: "Geração II",
  gen3: "Geração III",
  gen4: "Geração IV",
  gen5: "Geração V",
  gen6: "Geração VI",
  gen7: "Geração VII",
  gen8: "Geração VIII",
  gen9: "Geração IX",
};

export default function RomDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const romId = urlParams.get("id");

  const { data: rom, isLoading } = useQuery({
    queryKey: ["rom", romId],
    queryFn: async () => {
      const roms = await api.entities.ROM.filter({ id: romId });
      return roms[0];
    },
    enabled: !!romId,
  });

  const { data: relatedRoms = [] } = useQuery({
    queryKey: ["related-roms", rom?.generation],
    queryFn: () =>
      api.entities.ROM.filter(
        { status: "ativo", generation: rom.generation },
        "-downloads",
        5
      ),
    enabled: !!rom?.generation,
  });

  const filteredRelated = relatedRoms.filter((r) => r.id !== romId).slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Carregando ROM..." />
      </div>
    );
  }

  if (!rom) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">ROM não encontrada</h1>
        <Link to={createPageUrl("RomLibrary")}>
          <Button className="pokemon-gradient text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Biblioteca
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to={createPageUrl("RomLibrary")}
        className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar à Biblioteca
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cover & Download */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="glass-card rounded-2xl overflow-hidden sticky top-8">
            <div className="aspect-square relative">
              {rom.cover_image ? (
                <img
                  src={rom.cover_image}
                  alt={rom.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <Gamepad2 className="w-20 h-20 text-white/20" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <Badge className={`${platformColors[rom.platform] || "bg-gray-600"} text-white border-0`}>
                  {rom.platform}
                </Badge>
              </div>
              {rom.is_hack && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-purple-500/80 text-white border-0">ROM Hack</Badge>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/50 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  {rom.downloads?.toLocaleString() || 0} downloads
                </span>
              </div>

              {rom.file_url && rom.file_url !== "#" ? (
                <a href={rom.file_url} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full pokemon-gradient text-white" size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    Baixar ROM
                  </Button>
                </a>
              ) : (
                <Button className="w-full" size="lg" disabled>
                  <Download className="w-5 h-5 mr-2" />
                  Download Indisponível
                </Button>
              )}

              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-200/80 text-xs">
                    Este site não hospeda ROMs. Verifique as leis de seu país sobre emulação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{rom.name}</h1>
            {rom.is_hack && rom.hack_base && (
              <p className="text-white/50">Baseado em: {rom.hack_base}</p>
            )}
          </div>

          {/* Info Grid */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Informações</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <p className="text-white/40 text-xs">Plataforma</p>
                  <p className="text-white font-medium">{rom.platform}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <p className="text-white/40 text-xs">Idioma</p>
                  <p className="text-white font-medium">
                    {languageLabels[rom.language] || rom.language}
                  </p>
                </div>
              </div>

              {rom.generation && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Geração</p>
                    <p className="text-white font-medium">{genLabels[rom.generation]}</p>
                  </div>
                </div>
              )}

              {rom.version && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Hash className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Versão</p>
                    <p className="text-white font-medium">{rom.version}</p>
                  </div>
                </div>
              )}

              {rom.file_size && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Tamanho</p>
                    <p className="text-white font-medium">{rom.file_size}</p>
                  </div>
                </div>
              )}

              {rom.created_at && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Adicionado em</p>
                    <p className="text-white font-medium">
                      {format(new Date(rom.created_at), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {rom.md5_hash && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <p className="text-white/40 text-xs mb-1">MD5 Hash</p>
                <p className="text-white/80 font-mono text-sm break-all">{rom.md5_hash}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {rom.description && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Descrição</h2>
              <p className="text-white/70 leading-relaxed">{rom.description}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Related ROMs */}
      {filteredRelated.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">ROMs Relacionadas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredRelated.map((relatedRom) => (
              <RomCard key={relatedRom.id} rom={relatedRom} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}