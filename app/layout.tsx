import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrueFit3D — The Fitting Room",
  description: "Measurement-driven sizing and photo try-on for the boutique.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-ink-950 text-parchment antialiased">
        {children}
      </body>
    </html>
  );
}
