"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { activePrice, getProduct } from "@/lib/products";
import { money, shortDate } from "@/lib/format";
import { useStore, type Order } from "@/lib/store";

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="shell py-20">
          <p className="text-sm text-muted">Loading…</p>
        </div>
      }
    >
      <OrderLookup />
    </Suspense>
  );
}

function OrderLookup() {
  const params = useSearchParams();
  const { findOrder, orders, hydrated } = useStore();

  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  // Deep link from the confirmation screen: /orders?id=TF1A2B3C
  useEffect(() => {
    const fromUrl = params.get("id");
    if (fromUrl) setId(fromUrl);
  }, [params]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setResult(findOrder(id, email) ?? null);
    setSearched(true);
  }

  return (
    <div className="shell py-12">
      <p className="label">Order tracking</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-ink">Find your order</h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
        Enter the order number from your confirmation along with the email you used at checkout.
      </p>

      <form onSubmit={submit} className="mt-8 grid max-w-xl gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <div>
          <label htmlFor="order-id" className="label mb-2 block">
            Order number
          </label>
          <input
            id="order-id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="TF1A2B3C"
            className="field"
          />
        </div>
        <div>
          <label htmlFor="order-email" className="label mb-2 block">
            Email
          </label>
          <input
            id="order-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="field"
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full sm:w-auto">
            Track
          </button>
        </div>
      </form>

      {searched && !result && (
        <p className="mt-6 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted" role="status">
          No order matches that number and email in this browser. Orders in this demonstration store
          are saved locally, so they only appear on the device that placed them.
        </p>
      )}

      {result && <OrderCard order={result} />}

      {hydrated && orders.length > 0 && (
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="font-serif text-2xl text-ink">Orders from this browser</h2>
          <ul className="mt-6 space-y-3">
            {orders.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => {
                    setResult(o);
                    setId(o.id);
                    setEmail(o.address.email);
                    setSearched(true);
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-4 text-left transition-colors hover:border-brass/60"
                >
                  <span>
                    <span className="font-serif text-lg text-brass">{o.id}</span>
                    <span className="ml-3 text-xs text-faint">{shortDate(o.placedAt)}</span>
                  </span>
                  <span className="text-sm text-ink">{money(o.total)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hydrated && orders.length === 0 && !searched && (
        <p className="mt-10 text-sm text-muted">
          No orders in this browser yet.{" "}
          <Link href="/shop" className="text-brass underline underline-offset-4">
            Start shopping
          </Link>
          .
        </p>
      )}
    </div>
  );
}

const STAGES: Order["status"][] = ["Confirmed", "Packing", "Shipped"];

function OrderCard({ order }: { order: Order }) {
  const stageIndex = STAGES.indexOf(order.status);

  return (
    <section className="mt-10 rounded-xl border border-line bg-surface p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-5">
        <div>
          <p className="label">Order</p>
          <p className="mt-1 font-serif text-2xl text-brass">{order.id}</p>
        </div>
        <p className="text-xs text-faint">Placed {shortDate(order.placedAt)}</p>
      </div>

      <ol className="mt-6 flex items-center gap-2" aria-label="Order progress">
        {STAGES.map((stage, i) => (
          <li key={stage} className="flex flex-1 items-center gap-2">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] ${
                i <= stageIndex
                  ? "border-sage bg-sage/15 text-sage"
                  : "border-line text-faint"
              }`}
            >
              {i + 1}
            </span>
            <span className={`text-xs ${i <= stageIndex ? "text-ink" : "text-faint"}`}>{stage}</span>
            {i < STAGES.length - 1 && (
              <span className={`h-px flex-1 ${i < stageIndex ? "bg-sage" : "bg-line"}`} />
            )}
          </li>
        ))}
      </ol>

      <ul className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
        {order.lines.map((l) => {
          const p = getProduct(l.productId);
          if (!p) return null;
          return (
            <li key={`${l.productId}-${l.size}-${l.color}`} className="flex justify-between gap-3">
              <span className="text-muted">
                {p.name}
                <span className="text-faint">
                  {" "}
                  &times;{l.qty} &middot; {l.size} &middot; {l.color}
                </span>
              </span>
              <span className="shrink-0 text-ink">{money(activePrice(p) * l.qty)}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex justify-between border-t border-line pt-4 text-base">
        <span className="font-medium text-ink">Total</span>
        <span className="font-medium text-ink">{money(order.total)}</span>
      </div>

      <address className="mt-6 border-t border-line pt-4 text-xs not-italic leading-relaxed text-muted">
        <span className="text-ink">{order.address.name}</span>
        <br />
        {order.address.address}
        <br />
        {order.address.city}, {order.address.postcode}
        <br />
        {order.address.country}
      </address>
    </section>
  );
}
