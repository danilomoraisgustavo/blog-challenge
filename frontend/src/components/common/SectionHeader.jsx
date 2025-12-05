import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({ title, subtitle, linkText, linkPage }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-white/60 mt-1">{subtitle}</p>}
      </div>
      {linkText && linkPage && (
        <Link
          to={createPageUrl(linkPage)}
          className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm font-medium transition-colors"
        >
          {linkText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}