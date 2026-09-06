"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { categories } from "@/lib/products";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/fitting-room", label: "Fitting Room" },
  { href: "/orders", label: "Track Order" },
];

export default function Header() {
  const { cartCount, wishlist, theme, toggleTheme, hydrated } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="shell flex h-16 items-center gap-4">
        <Link href="/" className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="font-serif text-lg tracking-tight text-ink">TrueFit3D</span>
          <span className="hidden rounded-full border border-brass/40 px-2 py-0.5 text-[9px] uppercase tracking-label text-brass sm:inline">
            Atelier
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                pathname.startsWith(item.href) ? "text-brass" : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-xs flex-1 lg:block">
          <label className="sr-only" htmlFor="site-search">
            Search products
          </label>
          <input
            id="site-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the wardrobe"
            className="field py-2"
          />
        </form>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            {hydrated && theme === "dark" ? (
              <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 14.5A8.2 8.2 0 019.5 4 8.3 8.3 0 1020 14.5z" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M12 20.5l-1.4-1.28C5.72 14.8 3 12.36 3 9.28 3 6.8 4.98 5 7.4 5c1.4 0 2.76.63 3.6 1.7C11.84 5.63 13.2 5 14.6 5 17.02 5 19 6.8 19 9.28c0 3.08-2.72 5.52-7.6 9.94z" />
            </svg>
            {hydrated && wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brass px-1 text-[10px] font-medium text-onBrass">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart, ${hydrated ? cartCount : 0} items`}
            className="relative grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 7h12l-1.1 12.1a1.6 1.6 0 01-1.6 1.4H8.7a1.6 1.6 0 01-1.6-1.4z" strokeLinejoin="round" />
              <path d="M9 7V5.6A3 3 0 0112 3a3 3 0 013 2.6V7" />
            </svg>
            {hydrated && cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brass px-1 text-[10px] font-medium text-onBrass">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-raised hover:text-ink md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-canvas md:hidden">
          <div className="shell space-y-4 py-4">
            <form onSubmit={submitSearch}>
              <label className="sr-only" htmlFor="mobile-search">
                Search products
              </label>
              <input
                id="mobile-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the wardrobe"
                className="field"
              />
            </form>

            <nav className="flex flex-col">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="py-2 text-sm text-ink">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div>
              <p className="label mb-2">Categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link
                    key={c}
                    href={`/shop?category=${encodeURIComponent(c)}`}
                    className="rounded-full border border-line px-3 py-1.5 text-xs text-muted"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
