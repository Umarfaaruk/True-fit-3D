import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — resolved from CSS variables so light/dark swap cleanly.
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        raised: "rgb(var(--raised) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        brass: {
          DEFAULT: "rgb(var(--brass) / <alpha-value>)",
          soft: "rgb(var(--brass-soft) / <alpha-value>)",
        },
        sage: "rgb(var(--sage) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        onBrass: "rgb(var(--on-brass) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["Iowan Old Style", "Palatino Linotype", "URW Palladio L", "P052", "Georgia", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      letterSpacing: {
        label: "0.18em",
      },
      maxWidth: {
        shell: "1280px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
