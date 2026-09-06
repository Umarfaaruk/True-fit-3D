"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error");
      return;
    }
    setState("done");
    setEmail("");
  }

  if (state === "done") {
    return (
      <p className="text-sm text-sage" role="status">
        You are on the list — though nothing is actually sent from this demonstration store.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="newsletter" className="label mb-2 block">
        Newsletter
      </label>
      <p className="mb-3 text-sm leading-relaxed text-muted">
        New drops and sizing notes. No more than monthly.
      </p>
      <div className="flex gap-2">
        <input
          id="newsletter"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
          placeholder="you@example.com"
          className={`field ${state === "error" ? "border-danger" : ""}`}
          aria-invalid={state === "error" || undefined}
        />
        <button type="submit" className="btn-primary shrink-0 px-5 py-2.5 text-xs">
          Join
        </button>
      </div>
      {state === "error" && (
        <p className="mt-1.5 text-xs text-danger" role="alert">
          Enter a valid email address.
        </p>
      )}
    </form>
  );
}
