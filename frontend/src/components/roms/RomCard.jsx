import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Download, Gamepad2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const platformColors = {
  GB: "bg-gray-600",
  GBC: "bg-purple-600",
  GBA: "bg-indigo-600",
  NDS: "bg-slate-600",
  "3DS": "bg-red-600",
  Switch: "bg-red-500",
};

const languageLabels = {
  "pt-br": "🇧🇷 PT-BR",
  en: "🇺🇸 EN",
  es: "🇪🇸 ES",
  ja: "🇯🇵 JA",
  multi: "🌐 Multi",
};

export default function RomCard({ rom }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl overflow-hidden group hover:border-white/20 transition-all"
    >
      <Link to={createPageUrl(`RomDetail?id=${rom.id}`)}>
        <div className="aspect-square relative overflow-hidden bg-slate-800">
          {rom.cover_image ? (
            <img
              src={rom.cover_image}
              alt={rom.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <Gamepad2 className="w-16 h-16 text-white/20" />
            </div>
          )}
          
          {/* Platform Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${platformColors[rom.platform] || "bg-gray-600"} text-white border-0`}>
              {rom.platform}
            </Badge>
          </div>

          {/* Hack Badge */}
          {rom.is_hack && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-purple-500/80 text-white border-0">
                ROM Hack
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold mb-1 group-hover:text-red-400 transition-colors truncate">
            {rom.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white/40 text-xs">
              {languageLabels[rom.language] || rom.language}
            </span>
            {rom.version && (
              <span className="text-white/40 text-xs">• {rom.version}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/50 text-sm flex items-center gap-1">
              <Download className="w-4 h-4" />
              {rom.downloads?.toLocaleString() || 0}
            </span>
            {rom.file_size && (
              <span className="text-white/40 text-xs">{rom.file_size}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}