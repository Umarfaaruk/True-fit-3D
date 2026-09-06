"use client";

import { Category } from "@/lib/garments";

// Line-art category icons standing in for real product photography.
// Swap this out for actual garment photos (your own shoots, or the licensed
// CG asset pipeline from the Phase 2 build prompt) — see note in GarmentCatalog.tsx.
export default function GarmentIcon({ category }: { category: Category }) {
  const stroke = "#DCC178";
  const common = { fill: "none", stroke, strokeWidth: 1.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

  if (category === "Outerwear") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path {...common} d="M35 18 L28 26 L20 34 L25 46 L32 42 L32 84 L68 84 L68 42 L75 46 L80 34 L72 26 L65 18 L58 24 Q50 30 42 24 Z" />
        <line {...common} x1="50" y1="30" x2="50" y2="84" strokeDasharray="2 4" strokeWidth="1" />
      </svg>
    );
  }
  if (category === "Tops") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path {...common} d="M38 20 L26 28 L20 40 L28 46 L34 40 L34 82 L66 82 L66 40 L72 46 L80 40 L74 28 L62 20 Q56 28 50 28 Q44 28 38 20 Z" />
      </svg>
    );
  }
  if (category === "Bottoms") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path {...common} d="M32 18 L68 18 L70 50 L78 82 L64 82 L52 46 L48 46 L44 82 L30 82 L34 50 Z" />
        <line {...common} x1="32" y1="30" x2="68" y2="30" strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <path {...common} d="M30 40 L30 60 Q30 68 40 68 L78 68 Q82 68 82 62 Q82 56 74 54 L60 50 L60 34 L38 34 Z" />
      <line {...common} x1="30" y1="52" x2="60" y2="52" strokeWidth="1" />
    </svg>
  );
}
