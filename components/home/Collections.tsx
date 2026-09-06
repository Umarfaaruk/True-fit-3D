import Link from "next/link";
import { collections, products } from "@/lib/products";
import ProductImage from "@/components/product/ProductImage";

export default function Collections() {
  return (
    <section className="shell py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">What we curate</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
            Three ways to
            <br />
            build a wardrobe.
          </h2>
        </div>
        <Link href="/shop" className="btn-secondary">
          View all
        </Link>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {collections.map((c) => {
          const hero = products.find((p) => p.collection === c.id);
          const count = products.filter((p) => p.collection === c.id).length;

          return (
            <Link
              key={c.id}
              href={`/shop?collection=${c.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-brass/60"
            >
              <div className="relative aspect-[5/4] overflow-hidden bg-raised">
                {hero && (
                  <ProductImage
                    category={hero.category}
                    color={hero.colors[0].hex}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <span className="absolute left-4 top-4 font-serif text-3xl text-brass/80">
                  {c.numeral}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-serif text-xl text-ink">{c.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.blurb}</p>
                <p className="mt-4 text-xs text-brass">
                  {count} {count === 1 ? "piece" : "pieces"} &rarr;
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
