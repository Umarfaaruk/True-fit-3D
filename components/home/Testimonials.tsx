import Rating from "@/components/product/Rating";

const QUOTES = [
  {
    body:
      "I have never once got a coat right online before. Put my chest and shoulder numbers in, took the recommended size, and it fits like it was cut for me.",
    author: "Daniel O.",
    context: "Heritage Double-Breasted Trench",
    rating: 5,
  },
  {
    body:
      "The try-on talked me out of a size I would have ordered by habit. Saved me a return and it arrived fitting properly first time.",
    author: "Priya N.",
    context: "Ribbed Merino Knit Sweater",
    rating: 5,
  },
  {
    body:
      "Ordered as a guest, tracked it with the order number, done. No account, no marketing emails, just the jacket.",
    author: "Marcus T.",
    context: "MA-1 Flight Bomber",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="border-y border-line bg-surface py-20">
      <div className="shell">
        <p className="label">What customers say</p>
        <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
          Fit, in their words.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {QUOTES.map((q) => (
            <figure key={q.author} className="flex flex-col rounded-xl border border-line bg-canvas p-6">
              <Rating value={q.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink">
                &ldquo;{q.body}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <p className="text-sm font-medium text-ink">{q.author}</p>
                <p className="mt-0.5 text-xs text-faint">Verified buyer &middot; {q.context}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
