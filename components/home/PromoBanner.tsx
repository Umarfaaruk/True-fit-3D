import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="shell py-8">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface px-8 py-14 text-center sm:px-16">
        <div
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brass/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-sage/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <p className="label">The mid-season edit</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
            Up to <span className="text-brass">20% off</span> selected outerwear
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            A short list of coats we over-ordered and would rather see worn than warehoused. While
            sizes last.
          </p>
          <Link href="/shop?sale=1" className="btn-primary mt-8">
            Shop the sale
          </Link>
        </div>
      </div>
    </section>
  );
}
