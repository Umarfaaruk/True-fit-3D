import Link from "next/link";
import Hero from "@/components/home/Hero";
import TrustMarquee from "@/components/home/TrustMarquee";
import Collections from "@/components/home/Collections";
import PromoBanner from "@/components/home/PromoBanner";
import Testimonials from "@/components/home/Testimonials";
import ProductCard from "@/components/product/ProductCard";
import { products } from "@/lib/products";

export default function HomePage() {
  const featured = products.slice(0, 8);

  return (
    <>
      <Hero />
      <TrustMarquee />

      <section className="shell py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label">New arrivals</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
              Just landed.
            </h2>
          </div>
          <Link href="/shop" className="btn-secondary">
            Shop all 16
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Collections />
      <PromoBanner />
      <Testimonials />

      <section className="shell py-24 text-center">
        <p className="label">Discover more</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
          Stop guessing your size.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted">
          Set your measurements once in the Fitting Room. Every product page then tells you which
          size to take — and you can see it on your own photo before you commit.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/fitting-room" className="btn-primary">
            Open the Fitting Room
          </Link>
          <Link href="/shop" className="btn-secondary">
            Browse the wardrobe
          </Link>
        </div>
      </section>
    </>
  );
}
