"use client";

import { useState } from "react";

export default function ShareRow({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the share links below still work */
    }
  }

  const url = typeof window === "undefined" ? "" : window.location.href;
  const text = encodeURIComponent(`${name} — TrueFit3D`);

  return (
    <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
      <span className="label">Share</span>

      <button
        type="button"
        onClick={copyLink}
        className="text-xs text-muted underline underline-offset-4 hover:text-brass"
      >
        {copied ? "Link copied ✓" : "Copy link"}
      </button>

      <a
        href={`https://x.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Share on X"
        className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-brass hover:text-brass"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.2 2H21l-6.6 7.6L22 22h-6.2l-4.8-6.3L5.4 22H2.6l7-8.1L2 2h6.3l4.4 5.8ZM17.1 20.3h1.5L7 3.6H5.4Z" />
        </svg>
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Share on Facebook"
        className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-brass hover:text-brass"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.6A22 22 0 0 0 14.3 4.5c-2.4 0-4 1.45-4 4.1v2.3H7.6V14h2.7v8Z" />
        </svg>
      </a>
    </div>
  );
}
