"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";
import { useMeasurements } from "@/lib/useMeasurements";
import { recommendSize } from "@/lib/sizing";
import {
  clearStoredApiKey,
  fileToBase64,
  getStoredApiKey,
  setStoredApiKey,
  urlToBase64,
} from "@/lib/apikey";
import AvatarStage from "./AvatarStage";

/**
 * A persistent fitting room. The mannequin is the shopper's own measurement
 * model, so it is useful before any photo or API key exists; adding a photo and
 * a Gemini key upgrades it to a real composite.
 */
export default function FittingRoomDrawer() {
  const { fittingOpen, closeFittingRoom, wornProductId, clearWorn } = useStore();
  const { measurements, saved } = useMeasurements();

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [showKeyForm, setShowKeyForm] = useState(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const worn = wornProductId ? getProduct(wornProductId) : null;
  const advice = worn ? recommendSize(worn, measurements) : null;

  useEffect(() => {
    setApiKey(getStoredApiKey());
  }, []);

  // A new garment invalidates the previous composite.
  useEffect(() => {
    setResult(null);
    setError(null);
  }, [wornProductId]);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  // Escape closes, and the page behind should not scroll while open.
  useEffect(() => {
    if (!fittingOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeFittingRoom();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [fittingOpen, closeFittingRoom]);

  function handleSaveKey() {
    const trimmed = keyInput.trim();
    if (!trimmed) return;
    setStoredApiKey(trimmed);
    setApiKey(trimmed);
    setKeyInput("");
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

  function startOver() {
    setPhotoFile(null);
    setPhotoPreview(null);
    setResult(null);
    setError(null);
    clearWorn();
  }

  async function handleWear() {
    if (!photoFile || !worn || !apiKey) return;
    setLoading(true);
    setError(null);
    try {
      const person = await fileToBase64(photoFile);

      let garmentImageBase64: string | undefined;
      let garmentMimeType: string | undefined;
      if (worn.imageUrl) {
        try {
          const g = await urlToBase64(worn.imageUrl);
          garmentImageBase64 = g.base64;
          garmentMimeType = g.mimeType;
        } catch {
          garmentImageBase64 = undefined;
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
          garmentText: `${worn.name} (${worn.material})`,
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

  if (!fittingOpen) return null;

  const canWear = Boolean(photoFile && worn && apiKey);

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Fitting room">
      <button
        type="button"
        aria-label="Close fitting room"
        onClick={closeFittingRoom}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-line bg-canvas shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="font-serif text-xl text-ink">Fitting Room</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Tap the hanger on any piece to wear it.
            </p>
          </div>
          <button
            type="button"
            onClick={closeFittingRoom}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Stage */}
          <div className="relative overflow-hidden rounded-xl border border-line bg-surface">
            {result ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={result} alt={`You wearing ${worn?.name ?? "the selected piece"}`} className="w-full object-cover" />
            ) : photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="Your uploaded photo" className="max-h-[380px] w-full object-cover" />
            ) : (
              <div className="mx-auto h-[380px] w-full max-w-[240px] py-4">
                <AvatarStage m={measurements} />
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 grid place-items-center bg-canvas/70 backdrop-blur-sm">
                <p className="text-xs text-brass" role="status">
                  Generating…
                </p>
              </div>
            )}
          </div>

          {!photoPreview && !result && (
            <p className="mt-2 text-center text-[11px] leading-relaxed text-faint">
              {saved
                ? "Your measurement model. Add a photo for a photoreal try-on."
                : "Default proportions — set your measurements to shape this."}
            </p>
          )}

          {/* Worn item */}
          <div className="mt-4 rounded-lg border border-line bg-surface px-4 py-3">
            <p className="label">Wearing</p>
            {worn ? (
              <>
                <p className="mt-1 text-sm text-ink">{worn.name}</p>
                {advice?.size && (
                  <p className="mt-1 text-xs text-sage">Your size: {advice.size}</p>
                )}
              </>
            ) : (
              <p className="mt-1 text-xs text-muted">
                Nothing yet — tap the hanger on any piece in the{" "}
                <Link href="/shop" onClick={closeFittingRoom} className="text-brass underline underline-offset-2">
                  shop
                </Link>
                .
              </p>
            )}
          </div>

          {error && (
            <p className="mt-3 rounded-lg border border-danger/40 px-3 py-2 text-xs leading-relaxed text-danger" role="alert">
              {error}
            </p>
          )}

          {/* Key form */}
          {showKeyForm && (
            <div className="mt-4 rounded-lg border border-brass/40 bg-surface p-4">
              <label htmlFor="fr-key" className="label mb-2 block">
                Gemini API key
              </label>
              <input
                id="fr-key"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Paste your key"
                autoComplete="off"
                className="field"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={handleSaveKey} className="btn-primary px-4 py-2 text-xs">
                  Save
                </button>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  Get one free
                </a>
                <button
                  type="button"
                  onClick={() => setShowKeyForm(false)}
                  className="px-2 py-2 text-xs text-muted underline underline-offset-4"
                >
                  Cancel
                </button>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-faint">
                Stored in this browser only and passed straight to Google. Generation bills to you.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <footer className="space-y-2 border-t border-line px-5 py-4">
          <label className="btn-secondary w-full cursor-pointer">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <rect x="3" y="6" width="18" height="14" rx="2.5" />
              <circle cx="12" cy="13" r="3.4" />
            </svg>
            {photoPreview ? "Use a different photo" : "Use my photo"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>

          <p className="text-[11px] leading-relaxed text-faint">
            A full-body photo works best. It is sent to Google for this one request and is never
            stored by us.
          </p>

          {apiKey ? (
            <button
              type="button"
              onClick={handleWear}
              disabled={!canWear || loading}
              className="btn-primary w-full"
            >
              {loading ? "Generating…" : worn ? `Wear ${worn.name.split(" ").slice(-1)[0]}` : "Pick a piece"}
            </button>
          ) : (
            <button type="button" onClick={() => setShowKeyForm(true)} className="btn-primary w-full">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <circle cx="8" cy="12" r="3.2" />
                <path d="M11.2 12H21l-2 2.4M16.5 12v2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Add your API key
            </button>
          )}

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/fitting-room"
              onClick={closeFittingRoom}
              className="text-xs text-muted underline underline-offset-4 hover:text-brass"
            >
              Edit measurements
            </Link>
            <button
              type="button"
              onClick={startOver}
              className="flex items-center gap-1.5 text-xs text-muted underline underline-offset-4 hover:text-brass"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M4 12a8 8 0 1 1 2.5 5.8" strokeLinecap="round" />
                <path d="M4 19v-5h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Start over
            </button>
          </div>

          {apiKey && (
            <button
              type="button"
              onClick={() => {
                clearStoredApiKey();
                setApiKey(null);
              }}
              className="text-[11px] text-faint underline underline-offset-4"
            >
              Forget my API key
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
