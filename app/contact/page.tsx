"use client";

import Link from "next/link";
import { useState } from "react";

const TOPICS = ["Sizing and fit", "An order", "Photo try-on", "Returns", "Something else"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email";
    if (form.message.trim().length < 10) next.message = "Tell us a little more";
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }

  if (sent) {
    return (
      <div className="shell py-24 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-sage/50 text-sage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 font-serif text-4xl tracking-tight text-ink">Thanks, {form.name.split(" ")[0]}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Your message was not actually sent — this is a demonstration store with no mail service
          wired up. Connecting one is a small change once you have a provider.
        </p>
        <Link href="/shop" className="btn-primary mt-8">
          Back to the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <p className="label">Contact</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
        Talk to us
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
        Most sizing questions are already answered in the{" "}
        <Link href="/faq" className="text-brass underline underline-offset-4">
          FAQ
        </Link>
        . For anything else, this reaches us.
      </p>

      <div
        className="mt-6 max-w-2xl rounded-lg border border-brass/40 bg-brass/5 px-4 py-3 text-xs leading-relaxed text-muted"
        role="note"
      >
        <span className="font-medium text-ink">Demonstration store.</span> No mail provider is
        connected, so this form validates and confirms but does not deliver anything.
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <form onSubmit={submit} noValidate className="max-w-xl space-y-5">
          <div>
            <label htmlFor="c-name" className="label mb-2 block">
              Your name
            </label>
            <input
              id="c-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={`field ${errors.name ? "border-danger" : ""}`}
              autoComplete="name"
            />
            {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="c-email" className="label mb-2 block">
              Email
            </label>
            <input
              id="c-email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={`field ${errors.email ? "border-danger" : ""}`}
              autoComplete="email"
            />
            {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="c-topic" className="label mb-2 block">
              What is it about?
            </label>
            <select
              id="c-topic"
              value={form.topic}
              onChange={(e) => set("topic", e.target.value)}
              className="field"
            >
              {TOPICS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="c-message" className="label mb-2 block">
              Message
            </label>
            <textarea
              id="c-message"
              rows={6}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              className={`field resize-y ${errors.message ? "border-danger" : ""}`}
            />
            {errors.message && <p className="mt-1.5 text-xs text-danger">{errors.message}</p>}
          </div>

          <button type="submit" className="btn-primary">
            Send message
          </button>
        </form>

        <aside className="h-fit space-y-6 rounded-xl border border-line bg-surface p-6">
          <div>
            <p className="label mb-2">Response time</p>
            <p className="text-sm text-muted">Within one working day.</p>
          </div>
          <div>
            <p className="label mb-2">Order questions</p>
            <p className="text-sm text-muted">
              Have your order number ready, or{" "}
              <Link href="/orders" className="text-brass underline underline-offset-4">
                track it here
              </Link>
              .
            </p>
          </div>
          <div>
            <p className="label mb-2">Returns</p>
            <p className="text-sm text-muted">30 days from delivery, unworn with tags on.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
