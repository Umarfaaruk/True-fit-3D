"use client";

import Link from "next/link";
import { activePrice, type Product } from "@/lib/products";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";
import ProductPhoto from "./ProductPhoto";
import Rating from "./Rating";

export default function ProductCard({ product }: { product: Product }) {
  const { isWished, toggleWish, hydrated } = useStore();
  const wished = hydrated && isWished(product.id);
  const onSale = product.salePrice !== undefined;

  return (
    <div className="group relative">
      <Link
        href={`/product/${product.id}`}
        className="block overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-brass/60"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-raised">
          <ProductPhoto
            product={product}
            sizes="(min-width: 1280px) 20vw, (min-width: 640px) 30vw, 45vw"
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-brass px-2.5 py-1 text-[10px] font-medium uppercase tracking-label text-onBrass">
              {product.badge}
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-[11px] leading-tight text-brass">{product.material}</p>
          <h3 className="mt-1 text-sm font-medium leading-snug text-ink">{product.name}</h3>

          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-sm">
              {onSale ? (
                <>
                  <span className="font-medium text-sage">{money(activePrice(product))}</span>{" "}
                  <span className="text-muted line-through">{money(product.price)}</span>
                </>
              ) : (
                <span className="font-medium text-ink">{money(product.price)}</span>
              )}
            </p>
            <Rating value={product.rating} />
          </div>

          <div className="mt-3 flex gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3.5 w-3.5 rounded-full border border-line"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleWish(product.id)}
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        aria-pressed={wished}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-line bg-surface/90 backdrop-blur transition-colors hover:border-brass"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 20.5l-1.4-1.28C5.72 14.8 3 12.36 3 9.28 3 6.8 4.98 5 7.4 5c1.4 0 2.76.63 3.6 1.7C11.84 5.63 13.2 5 14.6 5 17.02 5 19 6.8 19 9.28c0 3.08-2.72 5.52-7.6 9.94z"
            fill={wished ? "rgb(var(--brass))" : "none"}
            stroke={wished ? "rgb(var(--brass))" : "rgb(var(--muted))"}
            strokeWidth="1.7"
          />
        </svg>
      </button>
    </div>
  );
}
