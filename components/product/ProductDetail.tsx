"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { activePrice, type Product } from "@/lib/products";
import { money, shortDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useMeasurements } from "@/lib/useMeasurements";
import { recommendSize } from "@/lib/sizing";
import ProductImage from "./ProductImage";
import ProductPhoto from "./ProductPhoto";
import ProductCard from "./ProductCard";
import Rating from "./Rating";
import TryOnPanel from "@/components/tryon/TryOnPanel";

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addToCart, isWished, toggleWish, hydrated } = useStore();
  const { measurements, saved } = useMeasurements();

  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const advice = useMemo(() => recommendSize(product, measurements), [product, measurements]);
  const onSale = product.salePrice !== undefined;
  const wished = hydrated && isWished(product.id);

  function handleAdd() {
    if (!size) {
      setSizeError(true);
      return;
    }
    addToCart({ productId: product.id, size, color: color.name, qty });
    setAdded(true);
    setSizeError(false);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="shell py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-faint">
        <Link href="/" className="hover:text-brass">
          Home
        </Link>
        <span className="px-1.5">/</span>
        <Link href="/shop" className="hover:text-brass">
          Shop
        </Link>
        <span className="px-1.5">/</span>
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brass">
          {product.category}
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-muted">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line bg-raised">
            <ProductPhoto
              product={product}
              color={color.hex}
              sizes="(min-width: 1024px) 45vw, 100vw"
              priority
            />
          </div>

          {/* Without photography, the tinted silhouette previews each colourway. */}
          {!product.imageUrl && (
            <div className="mt-3 flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`View in ${c.name}`}
                  aria-pressed={c.name === color.name}
                  className={`h-20 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                    c.name === color.name ? "border-brass" : "border-line hover:border-brass/50"
                  }`}
                >
                  <ProductImage category={product.category} color={c.hex} className="h-full w-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy box */}
        <div>
          <p className="text-xs uppercase tracking-label text-brass">{product.material}</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <Rating value={product.rating} count={product.reviews.length} size="md" />
          </div>

          <p className="mt-5 text-2xl">
            {onSale ? (
              <>
                <span className="font-medium text-sage">{money(activePrice(product))}</span>{" "}
                <span className="text-base text-muted line-through">{money(product.price)}</span>
              </>
            ) : (
              <span className="font-medium text-ink">{money(product.price)}</span>
            )}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-muted">{product.description}</p>

          {/* Colour */}
          <div className="mt-8">
            <p className="label mb-2.5">
              Colour — <span className="text-muted">{color.name}</span>
            </p>
            <div className="flex gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c)}
                  title={c.name}
                  aria-label={c.name}
                  aria-pressed={c.name === color.name}
                  className={`h-9 w-9 rounded-full border-2 transition-colors ${
                    c.name === color.name ? "border-brass" : "border-line hover:border-brass/60"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-7">
            <div className="mb-2.5 flex items-center justify-between">
              <p className="label">Size</p>
              <Link href="/fitting-room" className="text-xs text-brass underline underline-offset-4">
                {saved ? "Edit measurements" : "Set your measurements"}
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const isPick = advice.size === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSize(s);
                      setSizeError(false);
                    }}
                    aria-pressed={size === s}
                    className={`relative min-w-14 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      size === s
                        ? "border-brass bg-brass text-onBrass"
                        : "border-line text-ink hover:border-brass"
                    }`}
                  >
                    {s}
                    {isPick && size !== s && (
                      <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-sage" />
                    )}
                  </button>
                );
              })}
            </div>

            {sizeError && (
              <p className="mt-2 text-xs text-danger" role="alert">
                Choose a size to continue.
              </p>
            )}

            <div className="mt-3 rounded-lg border border-line bg-surface px-4 py-3">
              <p className="text-xs leading-relaxed text-muted">
                {saved ? (
                  <>
                    <span className="font-medium text-sage">Your fit:</span> {advice.note}
                  </>
                ) : (
                  <>
                    <span className="font-medium text-ink">Not sure of your size?</span> Set your
                    measurements in the{" "}
                    <Link href="/fitting-room" className="text-brass underline underline-offset-2">
                      Fitting Room
                    </Link>{" "}
                    and we will mark the size that matches your body.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quantity + actions */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-line">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid h-11 w-11 place-items-center text-muted hover:text-ink"
              >
                &minus;
              </button>
              <span className="w-8 text-center text-sm text-ink" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(9, q + 1))}
                aria-label="Increase quantity"
                className="grid h-11 w-11 place-items-center text-muted hover:text-ink"
              >
                +
              </button>
            </div>

            <button type="button" onClick={handleAdd} className="btn-primary flex-1 sm:flex-none">
              {added ? "Added to bag ✓" : "Add to bag"}
            </button>

            <button
              type="button"
              onClick={() => toggleWish(product.id)}
              aria-pressed={wished}
              className="btn-secondary px-5"
            >
              {wished ? "Saved" : "Save"}
            </button>
          </div>

          {added && (
            <p className="mt-3 text-xs text-sage" role="status">
              Added — <Link href="/cart" className="underline underline-offset-4">view your bag</Link>.
            </p>
          )}

          <ul className="mt-8 space-y-2 border-t border-line pt-6 text-xs text-muted">
            <li>Free shipping on orders over $150</li>
            <li>30-day returns, no questions</li>
            <li>Guest checkout — no account needed</li>
          </ul>
        </div>
      </div>

      {/* Try-on */}
      <section className="mt-16">
        <TryOnPanel product={product} />
      </section>

      {/* Reviews */}
      <section className="mt-16 border-t border-line pt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-2xl text-ink">
            Reviews <span className="text-muted">({product.reviews.length})</span>
          </h2>
          <Rating value={product.rating} count={product.reviews.length} size="md" />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {product.reviews.map((r) => (
            <article key={r.id} className="rounded-xl border border-line bg-surface p-5">
              <Rating value={r.rating} />
              <p className="mt-3 text-sm leading-relaxed text-ink">{r.body}</p>
              <footer className="mt-4 flex items-center gap-2 text-xs text-faint">
                <span className="font-medium text-muted">{r.author}</span>
                {r.verified && <span className="text-sage">Verified buyer</span>}
                <span>&middot; {shortDate(r.date)}</span>
              </footer>
            </article>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mt-16 border-t border-line pt-12">
        <h2 className="font-serif text-2xl text-ink">You might also like</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
