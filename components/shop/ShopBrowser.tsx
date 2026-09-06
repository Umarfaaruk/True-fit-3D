"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  activePrice,
  categories,
  collections,
  products,
  type Category,
  type CollectionId,
} from "@/lib/products";
import { money } from "@/lib/format";
import ProductCard from "@/components/product/ProductCard";

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export interface ShopFilters {
  q: string;
  category: Category | null;
  collection: CollectionId | null;
  size: string | null;
  color: string | null;
  maxPrice: number;
  saleOnly: boolean;
  sort: SortKey;
}

const PRICE_CEILING = 700;

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
};

const ALL_SIZES = Array.from(new Set(products.flatMap((p) => p.sizes)));
const ALL_COLORS = Array.from(
  new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values()
);

export default function ShopBrowser({ initial }: { initial: ShopFilters }) {
  const router = useRouter();
  const [f, setF] = useState<ShopFilters>(initial);
  const [panelOpen, setPanelOpen] = useState(false);

  function update(patch: Partial<ShopFilters>) {
    const next = { ...f, ...patch };
    setF(next);

    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.category) params.set("category", next.category);
    if (next.collection) params.set("collection", next.collection);
    if (next.size) params.set("size", next.size);
    if (next.color) params.set("color", next.color);
    if (next.maxPrice < PRICE_CEILING) params.set("max", String(next.maxPrice));
    if (next.saleOnly) params.set("sale", "1");
    if (next.sort !== "featured") params.set("sort", next.sort);

    const qs = params.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }

  function reset() {
    const cleared: ShopFilters = {
      q: "",
      category: null,
      collection: null,
      size: null,
      color: null,
      maxPrice: PRICE_CEILING,
      saleOnly: false,
      sort: "featured",
    };
    setF(cleared);
    router.replace("/shop", { scroll: false });
  }

  const results = useMemo(() => {
    const needle = f.q.trim().toLowerCase();

    const filtered = products.filter((p) => {
      if (f.category && p.category !== f.category) return false;
      if (f.collection && p.collection !== f.collection) return false;
      if (f.size && !p.sizes.includes(f.size)) return false;
      if (f.color && !p.colors.some((c) => c.name === f.color)) return false;
      if (activePrice(p) > f.maxPrice) return false;
      if (f.saleOnly && p.salePrice === undefined) return false;
      if (needle) {
        const haystack = `${p.name} ${p.material} ${p.category} ${p.description}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    switch (f.sort) {
      case "price-asc":
        return [...filtered].sort((a, b) => activePrice(a) - activePrice(b));
      case "price-desc":
        return [...filtered].sort((a, b) => activePrice(b) - activePrice(a));
      case "rating":
        return [...filtered].sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  }, [f]);

  const activeCount =
    (f.category ? 1 : 0) +
    (f.collection ? 1 : 0) +
    (f.size ? 1 : 0) +
    (f.color ? 1 : 0) +
    (f.saleOnly ? 1 : 0) +
    (f.maxPrice < PRICE_CEILING ? 1 : 0);

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <label className="label mb-2 block" htmlFor="filter-q">
          Search
        </label>
        <input
          id="filter-q"
          type="search"
          value={f.q}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Trench, merino, denim…"
          className="field"
        />
      </div>

      <fieldset>
        <legend className="label mb-3">Category</legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={f.category === c}
              onClick={() => update({ category: f.category === c ? null : c })}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                f.category === c
                  ? "border-brass bg-brass text-onBrass"
                  : "border-line text-muted hover:border-brass hover:text-brass"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label mb-3">Collection</legend>
        <div className="flex flex-wrap gap-2">
          {collections.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={f.collection === c.id}
              onClick={() => update({ collection: f.collection === c.id ? null : c.id })}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                f.collection === c.id
                  ? "border-brass bg-brass text-onBrass"
                  : "border-line text-muted hover:border-brass hover:text-brass"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label mb-3">Size</legend>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={f.size === s}
              onClick={() => update({ size: f.size === s ? null : s })}
              className={`min-w-11 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                f.size === s
                  ? "border-brass bg-brass text-onBrass"
                  : "border-line text-muted hover:border-brass hover:text-brass"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label mb-3">Colour</legend>
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              title={c.name}
              aria-label={c.name}
              aria-pressed={f.color === c.name}
              onClick={() => update({ color: f.color === c.name ? null : c.name })}
              className={`h-8 w-8 rounded-full border-2 transition-colors ${
                f.color === c.name ? "border-brass" : "border-line hover:border-brass/60"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </fieldset>

      <div>
        <label className="label mb-2 block" htmlFor="filter-price">
          Max price — {money(f.maxPrice)}
        </label>
        <input
          id="filter-price"
          type="range"
          min={40}
          max={PRICE_CEILING}
          step={10}
          value={f.maxPrice}
          onChange={(e) => update({ maxPrice: Number(e.target.value) })}
          className="w-full accent-brass"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
        <input
          type="checkbox"
          checked={f.saleOnly}
          onChange={(e) => update({ saleOnly: e.target.checked })}
          className="h-4 w-4 accent-brass"
        />
        On sale only
      </label>

      {activeCount > 0 && (
        <button type="button" onClick={reset} className="text-xs text-brass underline underline-offset-4">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="shell py-12">
      <header className="border-b border-line pb-8">
        <p className="label">The wardrobe</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
          Shop all pieces
        </h1>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">{filterPanel}</aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {results.length} {results.length === 1 ? "piece" : "pieces"}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPanelOpen((v) => !v)}
                aria-expanded={panelOpen}
                className="btn-secondary px-4 py-2 text-xs lg:hidden"
              >
                Filters{activeCount > 0 ? ` (${activeCount})` : ""}
              </button>

              <label className="sr-only" htmlFor="sort">
                Sort by
              </label>
              <select
                id="sort"
                value={f.sort}
                onChange={(e) => update({ sort: e.target.value as SortKey })}
                className="field w-auto py-2 text-xs"
              >
                {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                  <option key={k} value={k}>
                    {SORT_LABELS[k]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {panelOpen && (
            <div className="mb-8 rounded-xl border border-line bg-surface p-6 lg:hidden">{filterPanel}</div>
          )}

          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line px-6 py-20 text-center">
              <p className="font-serif text-xl text-ink">Nothing matches those filters.</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                Try widening the price range or clearing a filter or two.
              </p>
              <button type="button" onClick={reset} className="btn-secondary mt-6">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
