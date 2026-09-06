import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import CommandPalette from "@/components/site/CommandPalette";
import FittingRoomDrawer from "@/components/fitting/FittingRoomDrawer";
import FittingRoomButton from "@/components/fitting/FittingRoomButton";

export const metadata: Metadata = {
  title: "TrueFit3D — Premium Menswear, Measured to You",
  description:
    "A curated menswear store with measurement-driven sizing and AI photo try-on, so what arrives is what you pictured.",
};

/**
 * Applies the stored theme before first paint so the page never flashes the
 * wrong palette. Mirrors the defaults in lib/store.tsx.
 */
const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("truefit3d_theme");
    var dark = stored
      ? stored === "dark"
      : !window.matchMedia("(prefers-color-scheme: light)").matches;
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <StoreProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brass focus:px-4 focus:py-2 focus:text-sm focus:text-onBrass"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <FittingRoomButton />
          <FittingRoomDrawer />
          <CommandPalette />
        </StoreProvider>
      </body>
    </html>
  );
}
