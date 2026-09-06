import { NextRequest, NextResponse } from "next/server";

// Calls Google's Gemini Interactions API (gemini-3.1-flash-image, aka "Nano Banana 2")
// to composite a garment onto a person's photo. The API key is BYOK — sent from the
// client per-request, never stored server-side — matching the reference site's model.
// Docs: https://ai.google.dev/gemini-api/docs/image-generation

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, personImageBase64, personMimeType, garmentImageBase64, garmentMimeType, garmentText } = body;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API key." }, { status: 400 });
    }
    if (!personImageBase64) {
      return NextResponse.json({ error: "Missing person photo." }, { status: 400 });
    }

    const promptText = garmentImageBase64
      ? `Create a professional e-commerce fashion photo. Take the garment from the first image and let the person in the second image wear it. Generate a realistic, full-body shot of the person wearing the garment, matching the original photo's pose, lighting, and background as closely as possible. Keep the person's face and identity completely unchanged.`
      : `Using the provided photo of a person, dress them in the following garment: ${garmentText}. Generate a realistic, full-body result matching the original photo's pose, lighting, and background. Keep the person's face and identity completely unchanged.`;

    const input: Record<string, unknown>[] = [];
    if (garmentImageBase64) {
      input.push({ type: "image", mime_type: garmentMimeType || "image/jpeg", data: garmentImageBase64 });
    }
    input.push({ type: "image", mime_type: personMimeType || "image/jpeg", data: personImageBase64 });
    input.push({ type: "text", text: promptText });

    const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-3.1-flash-image",
        input,
        response_format: { type: "image", mime_type: "image/jpeg" },
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json({ error: `Gemini API error (${resp.status}): ${errText}` }, { status: 502 });
    }

    const data = await resp.json();
    const outputImage = data.output_image;
    if (!outputImage?.data) {
      return NextResponse.json({ error: "No image returned by the model.", raw: data }, { status: 502 });
    }

    return NextResponse.json({ imageBase64: outputImage.data, mimeType: outputImage.mime_type || "image/jpeg" });
  } catch (err) {
    return NextResponse.json({ error: `Server error: ${(err as Error).message}` }, { status: 500 });
  }
}
