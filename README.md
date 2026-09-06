# TrueFit3D — The Fitting Room

Measurement-driven sizing and AI photo try-on for the boutique, built with
Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Features

- **Avatar stage** — a measurement-driven body model you shape with sliders
- **Garment catalog** — browse and layer pieces onto the avatar
- **Photo try-on** — upload your own photo and have a garment composited on
  using Google's Gemini image model

## API keys

This app is **BYOK (bring your own key)**. There are **no server-side
environment variables and no secrets to configure at deploy time.**

The user pastes their own Google Gemini API key into the app's UI. It is:

- stored only in that browser's `localStorage`
- sent per-request to this app's own `/api/tryon` route
- forwarded to Google for that one request and never persisted server-side

Get a key at <https://aistudio.google.com/apikey>.

## Local development

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Build

```bash
npm run build
npm start
```

## Deploying

Deploys to Vercel with zero configuration — the framework is auto-detected and
no environment variables are required.
