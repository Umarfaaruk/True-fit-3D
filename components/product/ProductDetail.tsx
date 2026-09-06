"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { activePrice, isLowStock, type Product } from "@/lib/products";
import { money, shortDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useMeasurements } from "@/lib/useMeasurements";
import { recommendSize } from "@/lib/sizing";
import ProductImage from "./ProductImage";
import ProductPhoto from "./ProductPhoto";
import ProductCard from "./ProductCard";
import Rating from "./Rating";
import HangerIcon from "./HangerIcon";
import ShareRow from "./ShareRow";

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const router = useRouter();
  const { addToCart, isWished, toggleWish, hydrated, wearProduct } = useStore();
  const { measurements, saved } = useMeasurements();

  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [tab, setTab] = useState<"description" | "reviews">("description");

  const advice = useMemo(() => recommendSize(product, measurements), [product, measurements]);
  const onSale = product.salePrice !== undefined;
  const wished = hydrated && isWished(product.id);
  const lowStock = isLowStock(product);

  /** Returns false (and flags the error) when no size is chosen yet. */
  function commit(): boolean {
    if (!size) {
      setSizeError(true);
      return false;
    }
    addToCart({ productId: product.id, size, color: color.name, qty });
    setSizeError(false);
    return true;
  }

  function handleAdd() {
    if (!commit()) return;
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  function handleBuyNow() {
    if (!commit()) return;
    router.push("/checkout");
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
            <button
              type="button"
              onClick={() => wearProduct(product.id)}
              aria-label={`Wear ${product.name} in the fitting room`}
              title="Try it on"
              className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-line bg-surface/90 text-muted backdrop-blur transition-colors hover:border-brass hover:text-brass"
            >
              <HangerIcon size={18} />
            </button>
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

          <div className="mt-3">
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
          <p className="mt-1 text-xs text-faint">Inclusive of all taxes</p>

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

          {/* Stock */}
          {lowStock && (
            <p className="mt-5 flex items-center gap-2 text-xs text-danger">
              <span className="h-1.5 w-1.5 rounded-full bg-danger" />
              Only {product.stock} left — do not miss it
            </p>
          )}

          {/* Quantity + actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
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

            <button type="button" onClick={handleAdd} className="btn-secondary flex-1 sm:flex-none">
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

          <button type="button" onClick={handleBuyNow} className="btn-primary mt-3 w-full">
            Buy now
          </button>

          <button
            type="button"
            onClick={() => wearProduct(product.id)}
            className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-full border border-brass/50 bg-brass/5 px-5 py-3 text-sm text-brass transition-colors hover:bg-brass/10"
          >
            <HangerIcon size={17} />
            Try it on in the Fitting Room
          </button>

          {added && (
            <p className="mt-3 text-xs text-sage" role="status">
              Added — <Link href="/cart" className="underline underline-offset-4">view your bag</Link>.
            </p>
          )}

          <ul className="mt-8 space-y-2 border-t border-line pt-6 text-xs text-muted">
            <li>Free shipping on orders over $150</li>
            <li>Free 30-day returns</li>
            <li>Secure checkout — no account needed</li>
          </ul>

          <ShareRow name={product.name} />
        </div>
      </div>

      {/* Description / Reviews tabs */}
      <section className="mt-16 border-t border-line pt-10">
        <div className="flex gap-1 border-b border-line" role="tablist">
          {(
            [
              ["description", "Description"],
              ["reviews", `Reviews (${product.reviews.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm transition-colors ${
                tab === key
                  ? "border-brass text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="pt-8">
          {tab === "description" ? (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="font-serif text-xl text-ink">About this piece</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{product.description}</p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-ink">Details</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between border-b border-line pb-2">
                    <dt className="text-muted">Material</dt>
                    <dd className="text-ink">{product.material}</dd>
                  </div>
                  <div className="flex justify-between border-b border-line pb-2">
                    <dt className="text-muted">Category</dt>
                    <dd className="text-ink">{product.category}</dd>
                  </div>
                  <div className="flex justify-between border-b border-line pb-2">
                    <dt className="text-muted">Colourways</dt>
                    <dd className="text-ink">{product.colors.map((c) => c.name).join(", ")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Sizes</dt>
                    <dd className="text-ink">{product.sizes.join(", ")}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {product.reviews.map((r) => (
                <article key={r.id} className="rounded-xl border border-line bg-surface p-5">
                  <Rating value={r.rating} />
                  <p className="mt-3 text-sm leading-relaxed text-ink">{r.body}</p>
                  <footer className="mt-4 flex flex-wrap items-center gap-2 text-xs text-faint">
                    <span className="font-medium text-muted">{r.author}</span>
                    {r.verified && <span className="text-sage">Verified buyer</span>}
                    <span>&middot; {shortDate(r.date)}</span>
                  </footer>
                </article>
              ))}
            </div>
          )}
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
