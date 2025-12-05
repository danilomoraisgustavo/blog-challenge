import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function AdvancedFilters({
  searchPlaceholder = "Buscar...",
  filters = [],
  activeFilters = {},
  onFilterChange,
  onSearchChange,
  searchValue = "",
  resultCount = 0,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeCount = Object.values(activeFilters).filter(
    (v) => v && v !== "all"
  ).length;

  const clearFilters = () => {
    const cleared = {};
    filters.forEach((f) => {
      cleared[f.key] = "all";
    });
    onFilterChange(cleared);
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="bg-white/5 border-white/10 text-white pl-10 h-11"
            />
          </div>

          {/* Quick Filters (First 2-3) */}
          <div className="flex gap-2 flex-wrap lg:flex-nowrap">
            {filters.slice(0, 3).map((filter) => (
              <Select
                key={filter.key}
                value={activeFilters[filter.key] || "all"}
                onValueChange={(v) =>
                  onFilterChange({ ...activeFilters, [filter.key]: v })
                }
              >
                <SelectTrigger className="w-full lg:w-40 bg-white/5 border-white/10 text-white h-11">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="all" className="text-white">
                    {filter.allLabel || `Todos`}
                  </SelectItem>
                  {filter.options.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-white"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

            {filters.length > 3 && (
              <Button
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className={` border-white/20 text-black hover:bg-white/5 hover:text-white" h-11 ${
                  isExpanded ? "bg-white/10" : ""
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Mais Filtros
                {activeCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5">
                    {activeCount}
                  </Badge>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {isExpanded && filters.length > 3 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filters.slice(3).map((filter) => (
                    <div key={filter.key}>
                      <label className="text-white/60 text-xs mb-1.5 block">
                        {filter.label}
                      </label>
                      <Select
                        value={activeFilters[filter.key] || "all"}
                        onValueChange={(v) =>
                          onFilterChange({ ...activeFilters, [filter.key]: v })
                        }
                      >
                        <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                          <SelectItem value="all" className="text-white">
                            {filter.allLabel || "Todos"}
                          </SelectItem>
                          {filter.options.map((opt) => (
                            <SelectItem
                              key={opt.value}
                              value={opt.value}
                              className="text-white"
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters Tags & Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/50 text-sm">
            {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
          </span>

          {activeCount > 0 && (
            <>
              <span className="text-white/30">|</span>
              {Object.entries(activeFilters)
                .filter(([_, v]) => v && v !== "all")
                .map(([key, value]) => {
                  const filter = filters.find((f) => f.key === key);
                  const option = filter?.options.find((o) => o.value === value);
                  return (
                    <Badge
                      key={key}
                      className="bg-white/10 text-white/80 border-white/20 gap-1 pr-1"
                    >
                      {option?.label || value}
                      <button
                        onClick={() =>
                          onFilterChange({ ...activeFilters, [key]: "all" })
                        }
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })}
              <button
                onClick={clearFilters}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Limpar tudo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}