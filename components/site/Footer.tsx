import Link from "next/link";
import { categories } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-lg text-ink">TrueFit3D</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Measurement-driven sizing and photoreal try-on, so the piece that arrives is the piece
            you pictured.
          </p>
        </div>

        <div>
          <p className="label mb-3">Shop</p>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={`/shop?category=${encodeURIComponent(c)}`}
                  className="text-muted transition-colors hover:text-brass"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label mb-3">Fit</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/fitting-room" className="text-muted transition-colors hover:text-brass">
                The Fitting Room
              </Link>
            </li>
            <li>
              <Link href="/shop" className="text-muted transition-colors hover:text-brass">
                Size guidance
              </Link>
            </li>
            <li>
              <Link href="/orders" className="text-muted transition-colors hover:text-brass">
                Track an order
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="label mb-3">The Promise</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>Free shipping over $150</li>
            <li>30-day returns</li>
            <li>Secure checkout</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} TrueFit3D. A demonstration storefront.</p>
          <p>Try-on runs on your own Gemini API key — billed to you, stored in your browser.</p>
        </div>
      </div>
    </footer>
  );
}
