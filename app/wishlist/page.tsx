"use client";

import Link from "next/link";
import { getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { wishlist, hydrated } = useStore();

  if (!hydrated) {
    return (
      <div className="shell py-20">
        <p className="text-sm text-muted">Loading your saved pieces…</p>
      </div>
    );
  }

  const saved = wishlist.map(getProduct).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (saved.length === 0) {
    return (
      <div className="shell py-24 text-center">
        <p className="label">Wishlist</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-ink">Nothing saved yet.</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          Tap the heart on any piece to keep it here while you think about it.
        </p>
        <Link href="/shop" className="btn-primary mt-8">
          Browse the wardrobe
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <p className="label">Wishlist</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-ink">
        {saved.length} saved {saved.length === 1 ? "piece" : "pieces"}
      </h1>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {saved.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
