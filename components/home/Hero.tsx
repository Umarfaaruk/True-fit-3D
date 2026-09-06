import Link from "next/link";
import { getProduct } from "@/lib/products";
import ProductPhoto from "@/components/product/ProductPhoto";

/** Three pieces fanned out behind the headline. */
const SHOWCASE = [
  { id: "oxford", position: "left-0 top-10 w-52 rotate-[-6deg]" },
  { id: "trench", position: "right-6 top-0 w-60 rotate-[5deg]" },
  { id: "jeans", position: "bottom-0 left-1/2 w-56 -translate-x-1/2 rotate-[-2deg]" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="grain absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-brass/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="shell relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-up">
          <p className="label">New Collection — 2026</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Clothes that
            <br />
            know your
            <span className="text-brass"> measure.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Premium menswear, chosen piece by piece — then fitted to your actual body before you buy.
            Set your measurements once and every size on the site answers to them.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary">
              Shop the collection
            </Link>
            <Link href="/fitting-room" className="btn-secondary">
              Try it on first
            </Link>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            <div>
              <dt className="label">Pieces</dt>
              <dd className="mt-1 font-serif text-2xl text-ink">16</dd>
            </div>
            <div>
              <dt className="label">Avg. rating</dt>
              <dd className="mt-1 font-serif text-2xl text-ink">4.6</dd>
            </div>
            <div>
              <dt className="label">Returns</dt>
              <dd className="mt-1 font-serif text-2xl text-ink">30d</dd>
            </div>
          </dl>
        </div>

        <div className="relative hidden h-[520px] lg:block" aria-hidden="true">
          {SHOWCASE.map((s) => {
            const product = getProduct(s.id);
            if (!product) return null;
            return (
              <div
                key={s.id}
                className={`absolute aspect-[4/5] overflow-hidden rounded-2xl border border-line shadow-2xl shadow-black/25 ${s.position}`}
              >
                <ProductPhoto product={product} sizes="260px" priority />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
