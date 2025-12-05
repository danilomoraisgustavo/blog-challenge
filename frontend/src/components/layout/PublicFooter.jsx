import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Zap, Github, Twitter, Youtube, Mail } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl">My Son's Wolrd</span>
            </div>
            <p className="text-white/50 text-sm">
              Seu portal completo sobre o universo Pokémon. Notícias, ROMs, guias, torneios e muito mais.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Conteúdo</h4>
            <ul className="space-y-2">
              <li>
                <Link to={createPageUrl("Blog")} className="text-white/50 hover:text-white transition-colors text-sm">
                  Blog & Notícias
                </Link>
              </li>
              <li>
                <Link to={createPageUrl("RomLibrary")} className="text-white/50 hover:text-white transition-colors text-sm">
                  Biblioteca de ROMs
                </Link>
              </li>
              <li>
                <Link to={createPageUrl("GuidesIndex")} className="text-white/50 hover:text-white transition-colors text-sm">
                  Guias & Detonados
                </Link>
              </li>
              <li>
                <Link to={createPageUrl("Pokedex")} className="text-white/50 hover:text-white transition-colors text-sm">
                  Pokédex
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Competitivo</h4>
            <ul className="space-y-2">
              <li>
                <Link to={createPageUrl("Tournaments")} className="text-white/50 hover:text-white transition-colors text-sm">
                  Torneios
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">
                  Tier Lists
                </a>
              </li>
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">
                  Builds & Movesets
                </a>
              </li>
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">
                  Calculadora IV/EV
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-white/50 text-sm">
                <Mail className="w-4 h-4" />
                contato@mysonsworld.com
              </li>
            </ul>
            <div className="mt-4 p-4 bg-white/5 rounded-xl">
              <p className="text-white/70 text-sm">
                Quer contribuir? Entre em contato para fazer parte da nossa equipe!
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © 2024 My Son's Wolrd. Pokémon é marca registrada da Nintendo/Game Freak.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
              Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}