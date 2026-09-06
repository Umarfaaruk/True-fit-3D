"use client";

import { useState } from "react";
import { Garment } from "@/lib/garments";
import { Measurements, defaultMeasurements } from "@/lib/types";
import AvatarStage from "./AvatarStage";
import MeasurementSliders from "./MeasurementSliders";
import PhotoTryOnPanel from "./PhotoTryOnPanel";
import ActiveOutfitStrip from "./ActiveOutfitStrip";

export default function FittingRoomPanel({
  active,
  selectedGarment,
  onRemoveLayer,
}: {
  active: Record<string, Garment>;
  selectedGarment: Garment | null;
  onRemoveLayer: (layer: string) => void;
}) {
  const [tab, setTab] = useState<"sizing" | "tryon">("sizing");
  const [measurements, setMeasurements] = useState<Measurements>(defaultMeasurements);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-8 pt-6">
        <div className="flex gap-1 rounded-full border border-ink-700 p-1">
          <button
            onClick={() => setTab("sizing")}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              tab === "sizing" ? "bg-brass text-ink-950" : "text-parchment/60"
            }`}
          >
            Fit &amp; Sizing
          </button>
          <button
            onClick={() => setTab("tryon")}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              tab === "tryon" ? "bg-brass text-ink-950" : "text-parchment/60"
            }`}
          >
            Photo Try-On
          </button>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-sage">
          <span className="h-1.5 w-1.5 rounded-full bg-sage" />
          {tab === "sizing" ? "Live fit" : "Real-time preview"}
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {tab === "sizing" ? (
          <div className="grid h-full grid-cols-5">
            <div className="col-span-3 flex items-center justify-center p-6">
              <div className="h-full max-h-[420px] w-full max-w-[300px]">
                <AvatarStage m={measurements} />
              </div>
            </div>
            <div className="col-span-2 overflow-y-auto border-l border-ink-800 p-6">
              <h3 className="mb-4 font-serif text-lg text-parchment">Body measurements</h3>
              <MeasurementSliders values={measurements} onChange={setMeasurements} />
            </div>
          </div>
        ) : (
          <PhotoTryOnPanel selectedGarment={selectedGarment} />
        )}
      </div>

      <div className="border-t border-ink-800">
        <p className="px-6 pt-3 text-[10px] uppercase tracking-wide text-parchment/30">Active outfit</p>
        <ActiveOutfitStrip active={active} onRemove={onRemoveLayer} />
      </div>
    </div>
  );
}
