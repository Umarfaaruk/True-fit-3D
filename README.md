# TrueFit3D — Premium Menswear, Measured to You

An e-commerce storefront with measurement-driven sizing and AI photo try-on, built
with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Features

- **Storefront** — homepage with hero, collections, promo and testimonials
- **Catalog** — URL-driven search, filtering (category, collection, size, colour,
  price, sale) and sorting
- **Product pages** — colour variants, size selection, reviews, related products
- **Measurement-led sizing** — set your body once in the Fitting Room and every
  product page recommends the size that matches it
- **Photo try-on** — upload a photo and have a garment composited on using
  Google's Gemini image model
- **Cart & wishlist** — persisted per browser
- **Guest checkout & order tracking** — no account required
- **Light and dark themes** — follows system preference, remembers your choice

## Scope and limitations

This is a front-end demonstration. There is **no backend or database**:

- Cart, wishlist, orders and measurements live in the browser's `localStorage`,
  so they are per-device and not shared between browsers
- Checkout takes **no payment and collects no card details**; placing an order
  records it locally and issues an order number
- Order tracking finds orders saved in the same browser that placed them

Adding real persistence and payments would mean a database and a payment
processor (Stripe or similar) — neither is wired up here.

## Product imagery

Product photos are hotlinked from [Unsplash](https://unsplash.com), which the
[Unsplash License](https://unsplash.com/license) permits for commercial use
without attribution, and whose CDN is intended to be linked directly. They are
served through `next/image` (see `images.remotePatterns` in `next.config.mjs`).

Two things to know before this goes anywhere near production:

- **One photo per product.** Colour swatches select the variant that goes into
  the cart, but do not change the image — per-colour shots need a real shoot.
  Products without an `imageUrl` fall back to a generated silhouette.
- **Stock photos are not your products.** Replace `imageUrl` in
  `lib/products.ts` with your own photography before selling anything.

Populating `imageUrl` also improves try-on: the garment photo is sent to Gemini
alongside the shopper's photo instead of a text description. If that image fetch
fails, try-on falls back to the text description rather than erroring.

## API keys

The storefront itself needs **no API keys and no environment variables.**

Photo try-on is **BYOK (bring your own key)**: the shopper pastes their own
Google Gemini API key into the UI. It is stored only in that browser's
`localStorage`, sent per-request to this app's `/api/tryon` route, forwarded to
Google for that one request, and never persisted server-side. Image generation
is a paid Google feature, so cost falls to whoever supplies the key.

Get a key at <https://aistudio.google.com/apikey>.

> Never commit a Gemini key to this repository. If you want the store to supply
> the key instead of the shopper, use a server-only environment variable — never
> a `NEXT_PUBLIC_` one, which would ship the key to every visitor's browser.

## Local development

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Build

```bash
npm run build
npm start
```

## Deploying

Deploys to Vercel with zero configuration — the framework is auto-detected and no
environment variables are required.
