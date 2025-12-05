import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navLinks = [
  { name: "Início", page: "Home" },
  { name: "Blog", page: "Blog" },
  { name: "ROMs", page: "RomLibrary" },
  { name: "Pokédex", page: "Pokedex" },
  { name: "Guias", page: "GuidesIndex" },
  { name: "Torneios", page: "Tournaments" },
];

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-3">
            <span className="text-white font-bold text-xl hidden sm:block">My Son's Wolrd</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={`${searchOpen ? "flex" : "hidden"} md:flex items-center`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Buscar..."
                  className="w-40 lg:w-64 bg-white/5 border-white/10 text-white pl-9 h-9"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white/70"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Admin Link */}
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="outline" className="hidden sm:flex border-white/20 text-black hover:bg-white/5 hover:text-white">
                Dashboard
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white/70"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to={createPageUrl("Dashboard")}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors sm:hidden"
              >
                Dashboard Admin
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}