import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0D0F14",
          900: "#12151C",
          800: "#1A1E28",
          700: "#252A38",
          600: "#333A4C",
        },
        brass: {
          400: "#DCC178",
          DEFAULT: "#C9A24B",
          600: "#A9843A",
        },
        sage: {
          DEFAULT: "#7FA894",
          600: "#5E8672",
        },
        parchment: "#EDE7D9",
      },
      fontFamily: {
        serif: ["Iowan Old Style", "Palatino Linotype", "URW Palladio L", "P052", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
