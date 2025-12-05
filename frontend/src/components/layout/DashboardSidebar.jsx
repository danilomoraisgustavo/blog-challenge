import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Gamepad2,
  Trophy,
  BookOpen,
  Database,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
  ExternalLink,
  Users
} from "lucide-react";
import { api } from "@/api/client";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { name: "Posts", icon: FileText, page: "AdminPosts" },
  { name: "ROMs", icon: Gamepad2, page: "AdminROMs" },
  { name: "Torneios", icon: Trophy, page: "AdminTournaments" },
  { name: "Guias", icon: BookOpen, page: "AdminGuides" },
  { name: "Pokédex", icon: Database, page: "AdminPokedex" },
  { name: "Analytics", icon: BarChart3, page: "Analytics" },
];

export default function DashboardSidebar({ isOpen, setIsOpen, currentPage }) {
  const handleLogout = () => {
    api.auth.logout();
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 260 : 80 }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col bg-slate-900/50 backdrop-blur-xl border-r border-white/10"
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <h1 className="text-white font-bold text-xl">My Son's Wolrd</h1>
              <p className="text-white/40 text-xs">Admin Dashboard</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
      >
        <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <Link
              key={item.name}
              to={createPageUrl(item.page)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? "bg-gradient-to-r from-red-500/20 to-blue-500/20 text-white border-l-2 border-red-500"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-red-400" : ""}`} />
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          to={createPageUrl("Home")}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium"
              >
                Ver Site
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium"
              >
                Sair
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}