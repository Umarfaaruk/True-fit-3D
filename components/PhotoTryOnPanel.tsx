"use client";

import { useEffect, useState } from "react";
import { Garment } from "@/lib/garments";
import { getStoredApiKey, setStoredApiKey, clearStoredApiKey, fileToBase64, urlToBase64 } from "@/lib/apikey";

export default function PhotoTryOnPanel({ selectedGarment }: { selectedGarment: Garment | null }) {
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

  function handleSaveKey() {
    if (!keyInput.trim()) return;
    setStoredApiKey(keyInput.trim());
    setApiKey(keyInput.trim());
    setShowKeyForm(false);
    setKeyInput("");
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
    if (!photoFile || !selectedGarment || !apiKey) return;
    setLoading(true);
    setError(null);
    try {
      const person = await fileToBase64(photoFile);
      let garmentImageBase64: string | undefined;
      let garmentMimeType: string | undefined;
      if (selectedGarment.imageUrl) {
        const g = await urlToBase64(selectedGarment.imageUrl);
        garmentImageBase64 = g.base64;
        garmentMimeType = g.mimeType;
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
          garmentText: `${selectedGarment.name} (${selectedGarment.material})`,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Try-on request failed.");
      }
      setResult(`data:${data.mimeType};base64,${data.imageBase64}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (!apiKey || showKeyForm) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <h3 className="font-serif text-lg text-parchment">Use your own Gemini API key</h3>
        <p className="max-w-sm text-xs text-parchment/50">
          Photo try-on calls Google&apos;s Gemini image model directly. Image generation is a paid
          Google feature — your key is used per-request and stored only in this browser, never on a server.
        </p>
        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="Paste your Gemini API key"
          className="w-72 rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-parchment outline-none focus:border-brass"
        />
        <div className="flex gap-2">
          <button onClick={handleSaveKey} className="rounded-full bg-brass px-5 py-2 text-sm font-medium text-ink-950 hover:bg-brass-400">
            Save key
          </button>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink-700 px-5 py-2 text-sm text-parchment/70 hover:text-parchment"
          >
            Get a key
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <button onClick={() => setShowKeyForm(true)} className="absolute right-8 top-24 text-xs text-parchment/40 underline underline-offset-2">
        Change API key
      </button>

      {!photoPreview && (
        <>
          <div className="rounded-full border border-dashed border-ink-600 p-8">
            <span className="text-sm text-parchment/50">No photo yet</span>
          </div>
          <label className="cursor-pointer rounded-full bg-brass px-5 py-2 text-sm font-medium text-ink-950 hover:bg-brass-400">
            Upload a photo
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
          <p className="max-w-xs text-xs text-parchment/40">Front-facing, good lighting, one person in frame works best.</p>
        </>
      )}

      {photoPreview && !result && (
        <>
          <img src={photoPreview} alt="Uploaded" className="max-h-72 rounded-lg border border-ink-700 object-cover" />
          <button
            onClick={handleTryOn}
            disabled={!selectedGarment || loading}
            className="rounded-full bg-brass px-5 py-2 text-sm font-medium text-ink-950 hover:bg-brass-400 disabled:opacity-40"
          >
            {loading ? "Generating…" : selectedGarment ? `Try on ${selectedGarment.name}` : "Pick a garment first"}
          </button>
          {loading && <p className="text-xs text-parchment/40">Calling Gemini — usually a few seconds.</p>}
          {error && <p className="max-w-sm text-xs text-red-400">{error}</p>}
        </>
      )}

      {result && (
        <>
          <img src={result} alt="Try-on result" className="max-h-80 rounded-lg border border-sage/50 object-cover" />
          <button onClick={() => setResult(null)} className="text-xs text-parchment/50 underline underline-offset-2">
            Try another garment
          </button>
        </>
      )}
    </div>
  );
}
