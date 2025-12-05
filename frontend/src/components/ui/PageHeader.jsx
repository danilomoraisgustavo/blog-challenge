import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PageHeader({ 
  title, 
  description, 
  action, 
  actionLabel = "Novo", 
  actionIcon: ActionIcon = Plus 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-white/60 mt-1">{description}</p>
        )}
      </div>
      {action && (
        <Button 
          onClick={action}
          className="pokemon-gradient text-white border-0 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-shadow"
        >
          <ActionIcon className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}