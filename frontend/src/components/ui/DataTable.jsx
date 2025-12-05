import React from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DataTable({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView,
  loading,
  emptyMessage = "Nenhum item encontrado" 
}) {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/60 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-12 text-center">
          <p className="text-white/40">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            {columns.map((col) => (
              <TableHead key={col.key} className="text-white/60 font-medium">
                {col.label}
              </TableHead>
            ))}
            <TableHead className="text-white/60 font-medium w-20">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow 
              key={row.id || idx} 
              className="border-white/5 hover:bg-white/5 transition-colors"
            >
              {columns.map((col) => (
                <TableCell key={col.key} className="text-white/80">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </TableCell>
              ))}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(row)} className="text-white/80 hover:text-white focus:text-white focus:bg-white/10">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(row)} className="text-white/80 hover:text-white focus:text-white focus:bg-white/10">
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem onClick={() => onDelete(row)} className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}