// Stored only in the browser's localStorage, sent only to our own /api/tryon
// route (which forwards it to Google per-request, never persisted server-side).
// Same "your own key, your own cost" model as the reference site.
const KEY = "truefit3d_gemini_api_key";

export function getStoredApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setStoredApiKey(key: string) {
  window.localStorage.setItem(KEY, key);
}

export function clearStoredApiKey() {
  window.localStorage.removeItem(KEY);
}

export function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [meta, base64] = result.split(",");
      const mimeType = meta.match(/data:(.*);base64/)?.[1] || file.type;
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function urlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const resp = await fetch(url);
  const blob = await resp.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [meta, base64] = result.split(",");
      const mimeType = meta.match(/data:(.*);base64/)?.[1] || blob.type;
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
