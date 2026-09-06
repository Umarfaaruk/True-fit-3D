"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import {
  clearStoredApiKey,
  fileToBase64,
  getStoredApiKey,
  setStoredApiKey,
  urlToBase64,
} from "@/lib/apikey";

export default function TryOnPanel({ product }: { product: Product | null }) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [showKeyForm, setShowKeyForm] = useState(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    setApiKey(getStoredApiKey());
  }, []);

  // Revoke the object URL when the preview changes or the panel unmounts.
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function handleSaveKey() {
    const trimmed = keyInput.trim();
    if (!trimmed) return;
    setStoredApiKey(trimmed);
    setApiKey(trimmed);
    setShowKeyForm(false);
    setKeyInput("");
  }

  function handleForgetKey() {
    clearStoredApiKey();
    setApiKey(null);
    setShowKeyForm(false);
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  }

  async function handleTryOn() {
    if (!photoFile || !product || !apiKey) return;
    setLoading(true);
    setError(null);
    try {
      const person = await fileToBase64(photoFile);

      // Sending the garment photo gives a much better composite than describing
      // it, but a blocked or failed fetch should degrade to text, not error out.
      let garmentImageBase64: string | undefined;
      let garmentMimeType: string | undefined;
      if (product.imageUrl) {
        try {
          const g = await urlToBase64(product.imageUrl);
          garmentImageBase64 = g.base64;
          garmentMimeType = g.mimeType;
        } catch {
          garmentImageBase64 = undefined;
          garmentMimeType = undefined;
        }
      }

      const resp = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          personImageBase64: person.base64,
          personMimeType: person.mimeType,
          garmentImageBase64,
          garmentMimeType,
          garmentText: `${product.name} (${product.material})`,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Try-on request failed.");
      setResult(`data:${data.mimeType};base64,${data.imageBase64}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (!apiKey || showKeyForm) {
    return (
      <div className="rounded-xl border border-brass/40 bg-surface p-6">
        <p className="label">Photo try-on</p>
        <h3 className="mt-2 font-serif text-2xl text-ink">
          See {product ? product.name : "this piece"} on you
        </h3>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
          Upload a photo of yourself and we will composite this garment onto it, keeping your face,
          pose and background as they are.
        </p>

        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { n: "1", t: "Add your Gemini key", d: "One time, saved in this browser only." },
            { n: "2", t: "Upload a photo", d: "Front-facing and evenly lit works best." },
            { n: "3", t: "See the result", d: "Usually just a few seconds." },
          ].map((s) => (
            <li key={s.n} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-brass/50 text-xs text-brass">
                {s.n}
              </span>
              <span>
                <span className="block text-sm text-ink">{s.t}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-faint">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-6">
          <label className="sr-only" htmlFor="gemini-key">
            Gemini API key
          </label>
          <input
            id="gemini-key"
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Paste your Gemini API key"
            className="field max-w-xs"
            autoComplete="off"
          />
          <button type="button" onClick={handleSaveKey} className="btn-primary px-5 py-2.5">
            Start try-on
          </button>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer noopener"
            className="btn-secondary px-5 py-2.5"
          >
            Get a free key
          </a>
        </div>

        <p className="mt-3 max-w-lg text-xs leading-relaxed text-faint">
          Image generation is a paid Google feature, so try-on runs on your key and bills to you.
          The key never reaches our servers — it is passed straight through to Google per request.
        </p>

        {apiKey && (
          <button
            type="button"
            onClick={() => setShowKeyForm(false)}
            className="mt-4 text-xs text-muted underline underline-offset-4"
          >
            Cancel
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label">Photo try-on</p>
          <h3 className="mt-2 font-serif text-xl text-ink">See it on you</h3>
        </div>
        <div className="flex shrink-0 gap-3 text-xs">
          <button
            type="button"
            onClick={() => setShowKeyForm(true)}
            className="text-muted underline underline-offset-4 hover:text-brass"
          >
            Change key
          </button>
          <button
            type="button"
            onClick={handleForgetKey}
            className="text-muted underline underline-offset-4 hover:text-brass"
          >
            Forget
          </button>
        </div>
      </div>

      {!photoPreview && (
        <div className="mt-5">
          <label className="btn-primary cursor-pointer px-5 py-2.5">
            Upload a photo
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-faint">
            Front-facing, evenly lit, one person in frame works best. Your photo is sent to Google
            for this one request and is not stored by us.
          </p>
        </div>
      )}

      {photoPreview && !result && (
        <div className="mt-5 flex flex-wrap items-start gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoPreview}
            alt="Your uploaded photo"
            className="max-h-56 rounded-lg border border-line object-cover"
          />
          <div className="flex-1">
            <button
              type="button"
              onClick={handleTryOn}
              disabled={!product || loading}
              className="btn-primary px-5 py-2.5"
            >
              {loading ? "Generating…" : product ? `Try on ${product.name}` : "Pick a piece first"}
            </button>
            {loading && (
              <p className="mt-3 text-xs text-muted" role="status">
                Calling Gemini — usually a few seconds.
              </p>
            )}
            {error && (
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-danger" role="alert">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setPhotoFile(null);
                setPhotoPreview(null);
              }}
              className="mt-3 block text-xs text-muted underline underline-offset-4"
            >
              Use a different photo
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-5 flex flex-wrap items-start gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result}
            alt={`Try-on result for ${product?.name ?? "selected piece"}`}
            className="max-h-72 rounded-lg border border-sage/50 object-cover"
          />
          <button
            type="button"
            onClick={() => setResult(null)}
            className="btn-secondary px-5 py-2.5"
          >
            Try another
          </button>
        </div>
      )}
    </div>
  );
}
