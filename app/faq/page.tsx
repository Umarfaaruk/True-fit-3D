import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — TrueFit3D",
  description: "Sizing, try-on, shipping, returns and orders at TrueFit3D.",
};

const GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Fit and sizing",
    items: [
      {
        q: "How does measurement-based sizing work?",
        a: "Set your height, chest, waist, hip, shoulder width and inseam once in the Fitting Room. Every product page then marks the size those measurements point to, and explains the reasoning — including when your shoulders or waist sit awkwardly between two sizes.",
      },
      {
        q: "Where are my measurements stored?",
        a: "In your browser only. They are never sent to a server, which also means they do not follow you to another device or survive clearing your site data.",
      },
      {
        q: "What if I am between sizes?",
        a: "The fit note says which way we would lean and why. For bottoms it tells you whether your waist sits over or under the size we suggest, so you know whether to expect room or a belt.",
      },
    ],
  },
  {
    title: "Photo try-on",
    items: [
      {
        q: "How do I try something on?",
        a: "Tap the hanger on any product, or open the Fitting Room from the button in the corner. Upload a full-body photo, add your Gemini API key, and the garment is composited onto your photo.",
      },
      {
        q: "Why do I need my own API key?",
        a: "Try-on calls Google's Gemini image model, and image generation is a paid Google feature. Using your own key means you see exactly what it costs and we never mark it up. The key is stored in your browser and passed straight through to Google per request.",
      },
      {
        q: "What happens to my photo?",
        a: "It is sent to Google for that one request and is not stored by us. It never touches our database, because there is not one.",
      },
    ],
  },
  {
    title: "Orders, shipping and returns",
    items: [
      {
        q: "Do I need an account?",
        a: "No. Checkout is guest-only by design. You get an order number you can look up later with your email.",
      },
      {
        q: "What does shipping cost?",
        a: "Free over $150, otherwise a flat $12.",
      },
      {
        q: "What is the returns window?",
        a: "30 days. The point of measurement-led sizing and try-on is that you should rarely need it.",
      },
      {
        q: "Where is my order?",
        a: "Look it up on the Track Order page with your order number and email. Orders are recorded in the browser that placed them, so use the same device.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="shell py-12">
      <p className="label">Help</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
        Frequently asked
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
        Everything about fit, try-on and orders. If something is missing,{" "}
        <Link href="/contact" className="text-brass underline underline-offset-4">
          get in touch
        </Link>
        .
      </p>

      <div className="mt-12 space-y-12">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="font-serif text-2xl text-ink">{group.title}</h2>
            <div className="mt-5 space-y-3">
              {group.items.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-line bg-surface px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-ink">
                    {item.q}
                    <span className="shrink-0 text-brass transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-line bg-surface p-8 text-center">
        <h2 className="font-serif text-2xl text-ink">Still stuck?</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Send us the details and we will come back to you.
        </p>
        <Link href="/contact" className="btn-primary mt-6">
          Contact us
        </Link>
      </div>
    </div>
  );
}
