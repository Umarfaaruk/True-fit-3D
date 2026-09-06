"use client";

import { useState } from "react";
import { garments, categories, Category, Garment } from "@/lib/garments";
import GarmentIcon from "./GarmentIcon";

export default function GarmentCatalog({
  active,
  onSelect,
}: {
  active: Record<string, string>;
  onSelect: (g: Garment) => void;
}) {
  const [filter, setFilter] = useState<Category | "All">("All");
  const shown = filter === "All" ? garments : garments.filter((g) => g.category === filter);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-baseline justify-between px-6 pt-6">
        <h2 className="font-serif text-2xl text-parchment">The Wardrobe</h2>
        <span className="text-xs text-ink-600">{shown.length} styles</span>
      </div>

      <div className="mt-4 flex gap-1 overflow-x-auto px-6 pb-1">
        {(["All", ...categories] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              filter === c
                ? "bg-brass text-ink-950"
                : "text-parchment/60 hover:text-parchment"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {shown.map((g) => {
            const isActive = active[g.layer] === g.id;
            return (
              <button
                key={g.id}
                onClick={() => onSelect(g)}
                className={`group rounded-lg border p-3 text-left transition-colors ${
                  isActive
                    ? "border-sage bg-sage/10"
                    : "border-ink-700 bg-ink-900 hover:border-ink-600"
                }`}
              >
                <div className="mb-2 flex aspect-[4/5] w-full items-center justify-center rounded-md bg-gradient-to-br from-ink-800 to-ink-700 p-6">
                  <GarmentIcon category={g.category} />
                </div>
                <p className="text-[11px] leading-tight text-brass-400">{g.material}</p>
                <p className="mt-0.5 text-sm leading-snug text-parchment">{g.name}</p>
                <p className="mt-1.5 text-sm text-parchment/70">
                  {g.salePrice ? (
                    <>
                      <span className="text-sage">${g.salePrice}</span>{" "}
                      <span className="line-through text-parchment/40">${g.price}</span>
                    </>
                  ) : (
                    `$${g.price}`
                  )}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
