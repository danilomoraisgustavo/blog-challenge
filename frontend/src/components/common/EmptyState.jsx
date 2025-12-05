import React from "react";
import { Button } from "@/components/ui/button";

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="glass-card rounded-2xl p-12 text-center">
      {Icon && (
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
          <Icon className="w-8 h-8 text-white/30" />
        </div>
      )}
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      {description && <p className="text-white/50 mb-6">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="pokemon-gradient text-white">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}