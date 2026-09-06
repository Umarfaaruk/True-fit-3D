"use client";

import Link from "next/link";
import { activePrice, getProduct } from "@/lib/products";
import { money } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, useStore } from "@/lib/store";
import ProductPhoto from "@/components/product/ProductPhoto";

export default function CartPage() {
  const { cart, setQty, removeLine, subtotal, shipping, total, hydrated, cartCount } = useStore();

  if (!hydrated) {
    return (
      <div className="shell py-20">
        <p className="text-sm text-muted">Loading your bag…</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="shell py-24 text-center">
        <p className="label">Your bag</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-ink">Nothing in here yet.</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          When you find something worth keeping, it will show up here.
        </p>
        <Link href="/shop" className="btn-primary mt-8">
          Browse the wardrobe
        </Link>
      </div>
    );
  }

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="shell py-12">
      <p className="label">Your bag</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-ink">
        {cartCount} {cartCount === 1 ? "piece" : "pieces"}
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-line border-y border-line">
          {cart.map((line) => {
            const product = getProduct(line.productId);
            if (!product) return null;
            const swatch =
              product.colors.find((c) => c.name === line.color) ?? product.colors[0];

            return (
              <li key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4 py-6">
                <Link
                  href={`/product/${product.id}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-raised"
                >
                  <ProductPhoto product={product} color={swatch.hex} sizes="96px" />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link
                        href={`/product/${product.id}`}
                        className="text-sm font-medium text-ink hover:text-brass"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted">
                        Size {line.size} &middot; {line.color}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-ink">
                      {money(activePrice(product) * line.qty)}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center gap-3 pt-4">
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        onClick={() => setQty(line, line.qty - 1)}
                        aria-label={`Decrease quantity of ${product.name}`}
                        className="grid h-9 w-9 place-items-center text-muted hover:text-ink"
                      >
                        &minus;
                      </button>
                      <span className="w-7 text-center text-sm text-ink">{line.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(line, line.qty + 1)}
                        aria-label={`Increase quantity of ${product.name}`}
                        className="grid h-9 w-9 place-items-center text-muted hover:text-ink"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeLine(line)}
                      className="text-xs text-muted underline underline-offset-4 hover:text-danger"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-xl border border-line bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-xl text-ink">Summary</h2>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="text-ink">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="text-ink">{shipping === 0 ? "Free" : money(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className="font-medium text-ink">Total</dt>
              <dd className="font-medium text-ink">{money(total)}</dd>
            </div>
          </dl>

          {remaining > 0 && (
            <p className="mt-4 rounded-lg bg-raised px-3 py-2.5 text-xs text-muted">
              Add {money(remaining)} more for free shipping.
            </p>
          )}

          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Checkout
          </Link>
          <Link
            href="/shop"
            className="mt-3 block text-center text-xs text-muted underline underline-offset-4"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
