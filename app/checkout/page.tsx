"use client";

import Link from "next/link";
import { useState } from "react";
import { activePrice, getProduct } from "@/lib/products";
import { money } from "@/lib/format";
import { useStore, type Order, type OrderAddress } from "@/lib/store";

const EMPTY: OrderAddress = {
  name: "",
  email: "",
  address: "",
  city: "",
  postcode: "",
  country: "",
};

export default function CheckoutPage() {
  const { cart, subtotal, shipping, total, placeOrder, hydrated } = useStore();
  const [form, setForm] = useState<OrderAddress>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof OrderAddress, string>>>({});
  const [placed, setPlaced] = useState<Order | null>(null);

  function set(field: keyof OrderAddress, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof OrderAddress, string>> = {};
    if (!form.name.trim()) next.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email";
    if (!form.address.trim()) next.address = "Required";
    if (!form.city.trim()) next.city = "Required";
    if (!form.postcode.trim()) next.postcode = "Required";
    if (!form.country.trim()) next.country = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setPlaced(placeOrder(form));
  }

  if (placed) {
    return (
      <div className="shell py-24">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-sage/50 text-sage">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="mt-6 font-serif text-4xl tracking-tight text-ink">Order confirmed</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Thanks, {placed.address.name.split(" ")[0]}. We have sent nothing to your inbox, because
            this is a demonstration store — but your order is saved in this browser and you can look
            it up any time.
          </p>

          <div className="mt-8 rounded-xl border border-line bg-surface p-6 text-left">
            <p className="label">Order number</p>
            <p className="mt-1 font-serif text-2xl text-brass">{placed.id}</p>
            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Items</dt>
                <dd className="text-ink">{placed.lines.reduce((n, l) => n + l.qty, 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Total</dt>
                <dd className="text-ink">{money(placed.total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Status</dt>
                <dd className="text-sage">{placed.status}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/orders?id=${placed.id}`} className="btn-primary">
              Track this order
            </Link>
            <Link href="/shop" className="btn-secondary">
              Keep shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (hydrated && cart.length === 0) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="font-serif text-4xl tracking-tight text-ink">Your bag is empty.</h1>
        <Link href="/shop" className="btn-primary mt-8">
          Browse the wardrobe
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <p className="label">Checkout</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-ink">Guest checkout</h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
        No account required. We only ask for what a courier would need.
      </p>

      <div
        className="mt-6 rounded-lg border border-brass/40 bg-brass/5 px-4 py-3 text-xs leading-relaxed text-muted"
        role="note"
      >
        <span className="font-medium text-ink">Demonstration store.</span> No payment is taken and
        no card details are collected. Orders are recorded in this browser only.
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} noValidate className="space-y-5">
          <Field id="name" label="Full name" value={form.name} error={errors.name} onChange={(v) => set("name", v)} autoComplete="name" />
          <Field id="email" label="Email" type="email" value={form.email} error={errors.email} onChange={(v) => set("email", v)} autoComplete="email" hint="Used to look your order up later." />
          <Field id="address" label="Address" value={form.address} error={errors.address} onChange={(v) => set("address", v)} autoComplete="street-address" />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="city" label="City" value={form.city} error={errors.city} onChange={(v) => set("city", v)} autoComplete="address-level2" />
            <Field id="postcode" label="Postcode" value={form.postcode} error={errors.postcode} onChange={(v) => set("postcode", v)} autoComplete="postal-code" />
          </div>

          <Field id="country" label="Country" value={form.country} error={errors.country} onChange={(v) => set("country", v)} autoComplete="country-name" />

          <button type="submit" className="btn-primary w-full sm:w-auto">
            Place order
          </button>
        </form>

        <aside className="h-fit rounded-xl border border-line bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-xl text-ink">Your order</h2>

          <ul className="mt-5 space-y-3 border-b border-line pb-5 text-sm">
            {cart.map((l) => {
              const p = getProduct(l.productId);
              if (!p) return null;
              return (
                <li key={`${l.productId}-${l.size}-${l.color}`} className="flex justify-between gap-3">
                  <span className="text-muted">
                    {p.name}
                    <span className="text-faint">
                      {" "}
                      &times;{l.qty} &middot; {l.size}
                    </span>
                  </span>
                  <span className="shrink-0 text-ink">{money(activePrice(p) * l.qty)}</span>
                </li>
              );
            })}
          </ul>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="text-ink">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="text-ink">{shipping === 0 ? "Free" : money(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className="font-medium text-ink">Total</dt>
              <dd className="font-medium text-ink">{money(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="label mb-2 block">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`field ${error ? "border-danger" : ""}`}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
