"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { activePrice, categories, products } from "@/lib/products";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";

interface Item {
  id: string;
  label: string;
  hint?: string;
  href?: string;
  action?: () => void;
  group: "Products" | "Categories" | "Pages";
}

export default function CommandPalette() {
  const router = useRouter();
  const { openFittingRoom, paletteOpen: open, setPaletteOpen: setOpen } = useStore();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Ctrl/Cmd+K toggles from anywhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!openRef.current);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // Focus after paint so the input exists.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const productItems: Item[] = products.map((p) => ({
      id: `p-${p.id}`,
      label: p.name,
      hint: `${p.category} · ${money(activePrice(p))}`,
      href: `/product/${p.id}`,
      group: "Products",
    }));

    const categoryItems: Item[] = categories.map((c) => ({
      id: `c-${c}`,
      label: c,
      hint: "Browse category",
      href: `/shop?category=${encodeURIComponent(c)}`,
      group: "Categories",
    }));

    const pageItems: Item[] = [
      { id: "n-shop", label: "Shop all", href: "/shop", group: "Pages" },
      { id: "n-fitting", label: "Open the Fitting Room", action: () => openFittingRoom(), group: "Pages" },
      { id: "n-measure", label: "Edit my measurements", href: "/fitting-room", group: "Pages" },
      { id: "n-cart", label: "Your bag", href: "/cart", group: "Pages" },
      { id: "n-wishlist", label: "Wishlist", href: "/wishlist", group: "Pages" },
      { id: "n-orders", label: "Track an order", href: "/orders", group: "Pages" },
      { id: "n-faq", label: "FAQ", href: "/faq", group: "Pages" },
      { id: "n-contact", label: "Contact", href: "/contact", group: "Pages" },
      { id: "n-sale", label: "On sale", href: "/shop?sale=1", group: "Pages" },
    ];

    return [...productItems, ...categoryItems, ...pageItems];
  }, [openFittingRoom]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.filter((i) => i.group === "Pages").slice(0, 8);
    return items
      .filter((i) => `${i.label} ${i.hint ?? ""}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [items, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function run(item: Item) {
    setOpen(false);
    if (item.action) item.action();
    else if (item.href) router.push(item.href);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) run(item);
    }
  }

  if (!open) return null;

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search">
      <button type="button" aria-label="Close search" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-line bg-canvas shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--faint))" strokeWidth="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" strokeLinecap="round" />
          </svg>
          <label className="sr-only" htmlFor="cmdk-input">
            Search products and pages
          </label>
          <input
            id="cmdk-input"
            ref={inputRef}
            // autoFocus is reliable on a freshly mounted node; the rAF above is
            // a belt-and-braces fallback for browsers that skip it.
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search pieces, categories, pages…"
            className="w-full bg-transparent py-4 text-sm text-ink outline-none placeholder:text-faint"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-faint">Esc</kbd>
        </div>

        {results.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">Nothing matches “{query}”.</p>
        ) : (
          <ul ref={listRef} className="max-h-80 overflow-y-auto py-2">
            {results.map((item, i) => {
              const showGroup = item.group !== lastGroup;
              lastGroup = item.group;
              return (
                <li key={item.id}>
                  {showGroup && <p className="label px-4 pb-1 pt-3">{item.group}</p>}
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => run(item)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      i === active ? "bg-raised text-ink" : "text-muted"
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {item.hint && <span className="shrink-0 text-xs text-faint">{item.hint}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center gap-3 border-t border-line px-4 py-2.5 text-[11px] text-faint">
          <span>↑↓ to move</span>
          <span>↵ to open</span>
        </div>
      </div>
    </div>
  );
}
