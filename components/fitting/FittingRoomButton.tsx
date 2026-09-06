"use client";

import { useStore } from "@/lib/store";
import { getProduct } from "@/lib/products";
import HangerIcon from "@/components/product/HangerIcon";

/** Always-available entry point to the fitting room drawer. */
export default function FittingRoomButton() {
  const { openFittingRoom, fittingOpen, wornProductId, hydrated } = useStore();
  const worn = wornProductId ? getProduct(wornProductId) : null;

  if (fittingOpen) return null;

  return (
    <button
      type="button"
      onClick={() => openFittingRoom()}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-brass/50 bg-brass px-4 py-3 text-sm font-medium text-onBrass shadow-lg shadow-black/25 transition-colors hover:bg-brass-soft"
      aria-label="Open the fitting room"
    >
      <HangerIcon size={17} />
      <span className="hidden sm:inline">Fitting Room</span>
      {hydrated && worn && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-onBrass/20 px-1 text-[10px]">
          1
        </span>
      )}
    </button>
  );
}
