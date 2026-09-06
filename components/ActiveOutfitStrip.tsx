"use client";

import { Garment } from "@/lib/garments";

export default function ActiveOutfitStrip({
  active,
  onRemove,
}: {
  active: Record<string, Garment>;
  onRemove: (layer: string) => void;
}) {
  const layers = Object.values(active);
  if (layers.length === 0) {
    return <p className="px-6 py-4 text-xs text-parchment/40">No pieces equipped yet — pick something from the wardrobe.</p>;
  }
  return (
    <div className="flex gap-2 overflow-x-auto px-6 py-4">
      {layers.map((g) => (
        <div key={g.layer} className="flex shrink-0 items-center gap-2 rounded-full border border-ink-700 bg-ink-900 py-1.5 pl-3 pr-1.5">
          <span className="text-[10px] uppercase tracking-wide text-sage">{g.layer}</span>
          <span className="text-xs text-parchment">{g.name}</span>
          <button
            onClick={() => onRemove(g.layer)}
            className="ml-1 rounded-full px-1.5 text-parchment/40 hover:bg-ink-700 hover:text-parchment"
            aria-label={`Remove ${g.name}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
