import type { Measurements } from "./types";
import type { Product } from "./products";

export interface SizeAdvice {
  size: string | null;
  note: string;
}

/** Chest circumference (cm) → apparel size band. */
const CHEST_BANDS: [number, string][] = [
  [86, "XS"],
  [93, "S"],
  [100, "M"],
  [108, "L"],
  [116, "XL"],
  [Infinity, "XXL"],
];

/** Waist circumference (cm) → nearest even inch waist. */
function waistToInches(waistCm: number): number {
  const inches = waistCm / 2.54;
  return Math.round(inches / 2) * 2;
}

function nearestAvailable(target: string, available: string[]): string | null {
  if (available.includes(target)) return target;
  // Numeric sizes: fall back to the closest offered value.
  const t = Number(target);
  if (!Number.isNaN(t)) {
    const nums = available.map(Number).filter((n) => !Number.isNaN(n));
    if (nums.length === 0) return null;
    return String(nums.reduce((best, n) => (Math.abs(n - t) < Math.abs(best - t) ? n : best)));
  }
  return null;
}

export function recommendSize(product: Product, m: Measurements): SizeAdvice {
  if (product.category === "Footwear") {
    return {
      size: null,
      note: "Footwear is not measurement-driven — these run true to standard EU sizing.",
    };
  }

  if (product.layer === "bottom") {
    const inches = waistToInches(m.waist);
    const size = nearestAvailable(String(inches), product.sizes);
    if (!size) {
      return { size: null, note: "Your waist falls outside the sizes we stock for this piece." };
    }
    const offered = Number(size);
    const note =
      offered > inches
        ? `Your ${m.waist}cm waist sits just under a ${size}, so expect a touch of room at the waistband.`
        : offered < inches
        ? `Your ${m.waist}cm waist sits just over a ${size} — a belt or a size up may suit you better.`
        : `A ${size} matches your ${m.waist}cm waist directly.`;
    return { size, note };
  }

  const band = CHEST_BANDS.find(([max]) => m.chest <= max);
  const target = band ? band[1] : "XXL";
  const size = nearestAvailable(target, product.sizes) ?? target;

  const shoulderNote =
    m.shoulderWidth >= 47
      ? " Your shoulder width is broad for this band, so check the fit across the back."
      : m.shoulderWidth <= 39
      ? " Your shoulders are narrow for this band — the drop shoulder may sit low."
      : "";

  return {
    size,
    note: `Based on a ${m.chest}cm chest we would put you in a ${size}.${shoulderNote}`,
  };
}
