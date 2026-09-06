"use client";

import { useState } from "react";
import GarmentCatalog from "@/components/GarmentCatalog";
import FittingRoomPanel from "@/components/FittingRoomPanel";
import { Garment } from "@/lib/garments";

export default function Home() {
  const [active, setActive] = useState<Record<string, Garment>>({});
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);

  function handleSelect(g: Garment) {
    setSelectedGarment(g);
    setActive((prev) => {
      const next = { ...prev };
      if (next[g.layer]?.id === g.id) {
        delete next[g.layer];
      } else {
        next[g.layer] = g;
      }
      return next;
    });
  }

  function handleRemove(layer: string) {
    setActive((prev) => {
      const next = { ...prev };
      delete next[layer];
      return next;
    });
  }

  return (
    <main className="grain flex h-screen flex-col bg-ink-950">
      <header className="flex items-center justify-between border-b border-ink-800 px-8 py-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-serif text-xl tracking-tight text-parchment">TrueFit3D</h1>
          <span className="rounded-full border border-brass/40 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-brass-400">
            The Fitting Room
          </span>
        </div>
        <p className="text-xs text-parchment/40">Measurement-driven sizing, photoreal try-on</p>
      </header>

      <div className="grid flex-1 grid-cols-5 overflow-hidden">
        <div className="col-span-2 overflow-hidden border-r border-ink-800">
          <GarmentCatalog active={Object.fromEntries(Object.entries(active).map(([k, v]) => [k, v.id]))} onSelect={handleSelect} />
        </div>
        <div className="col-span-3 overflow-hidden">
          <FittingRoomPanel active={active} selectedGarment={selectedGarment} onRemoveLayer={handleRemove} />
        </div>
      </div>
    </main>
  );
}
