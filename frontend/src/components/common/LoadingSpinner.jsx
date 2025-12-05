import React from "react";

export default function LoadingSpinner({ size = "default", text }) {
  const sizeClasses = {
    small: "w-5 h-5 border-2",
    default: "w-8 h-8 border-2",
    large: "w-12 h-12 border-3",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-red-500 border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="text-white/60 text-sm">{text}</p>}
    </div>
  );
}