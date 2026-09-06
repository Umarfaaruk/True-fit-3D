"use client";

import Link from "next/link";
import { useState } from "react";
import { products } from "@/lib/products";
import { defaultMeasurements } from "@/lib/types";
import { useMeasurements } from "@/lib/useMeasurements";
import { recommendSize } from "@/lib/sizing";
import AvatarStage from "@/components/fitting/AvatarStage";
import MeasurementSliders from "@/components/fitting/MeasurementSliders";
import TryOnPanel from "@/components/tryon/TryOnPanel";

export default function FittingRoomPage() {
  const { measurements, update, saved, hydrated } = useMeasurements();
  const [pickedId, setPickedId] = useState(products[0].id);
  const picked = products.find((p) => p.id === pickedId) ?? products[0];

  const advice = recommendSize(picked, measurements);

  return (
    <div className="shell py-12">
      <p className="label">The Fitting Room</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
        Set your measure once.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Everything you set here is saved to this browser and used to recommend a size on every
        product page. Nothing is sent to a server.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex items-center justify-center rounded-xl border border-line bg-surface p-8">
          <div className="h-[440px] w-full max-w-[320px]">
            {hydrated && <AvatarStage m={measurements} />}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl text-ink">Body measurements</h2>
            {saved && <span className="text-xs text-sage">Saved</span>}
          </div>

          <div className="mt-6">
            <MeasurementSliders values={measurements} onChange={update} />
          </div>

          <button
            type="button"
            onClick={() => update(defaultMeasurements)}
            className="mt-6 text-xs text-muted underline underline-offset-4 hover:text-brass"
          >
            Reset to defaults
          </button>
        </div>
      </div>

      {/* Size check against any piece */}
      <section className="mt-12 rounded-xl border border-line bg-surface p-6">
        <h2 className="font-serif text-xl text-ink">Check a size</h2>
        <p className="mt-2 text-sm text-muted">
          Pick any piece to see which size your measurements point to.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label htmlFor="size-check" className="sr-only">
            Choose a piece
          </label>
          <select
            id="size-check"
            value={pickedId}
            onChange={(e) => setPickedId(e.target.value)}
            className="field w-auto"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {advice.size && (
            <span className="rounded-full border border-sage/50 bg-sage/10 px-4 py-2 text-sm text-sage">
              Recommended: {advice.size}
            </span>
          )}

          <Link href={`/product/${picked.id}`} className="text-xs text-brass underline underline-offset-4">
            Open product page
          </Link>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">{advice.note}</p>
      </section>

      {/* Try-on */}
      <section className="mt-8">
        <TryOnPanel product={picked} />
      </section>
    </div>
  );
}
