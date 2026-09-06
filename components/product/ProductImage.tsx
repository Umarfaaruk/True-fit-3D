import type { Category } from "@/lib/products";

/**
 * Generated product visuals. These stand in for real product photography —
 * swap in shot imagery (and populate `Product.imageUrl`) when it exists, which
 * also lifts Gemini try-on from text-described to image-driven.
 */
export default function ProductImage({
  category,
  color,
  className = "",
}: {
  category: Category;
  color: string;
  className?: string;
}) {
  const uid = `${category}-${color}`.replace(/[^a-zA-Z0-9]/g, "");

  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label={`${category} illustration`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--raised))" />
          <stop offset="100%" stopColor="rgb(var(--surface))" />
        </linearGradient>
        <linearGradient id={`cloth-${uid}`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.72" />
        </linearGradient>
      </defs>

      <rect width="400" height="500" fill={`url(#bg-${uid})`} />

      <g
        fill={`url(#cloth-${uid})`}
        stroke="rgb(var(--ink) / 0.28)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {category === "Outerwear" && (
          <>
            <path d="M150 96 L112 122 L82 176 L110 208 L136 184 L136 404 L264 404 L264 184 L290 208 L318 176 L288 122 L250 96 L228 122 Q200 146 172 122 Z" />
            <path d="M200 128 L200 404" fill="none" strokeDasharray="5 9" strokeWidth="1.6" opacity="0.65" />
            <circle cx="182" cy="206" r="4.5" fill="rgb(var(--ink) / 0.35)" stroke="none" />
            <circle cx="182" cy="268" r="4.5" fill="rgb(var(--ink) / 0.35)" stroke="none" />
            <circle cx="182" cy="330" r="4.5" fill="rgb(var(--ink) / 0.35)" stroke="none" />
          </>
        )}

        {category === "Tops" && (
          <>
            <path d="M158 100 L110 130 L84 190 L118 214 L142 188 L142 398 L258 398 L258 188 L282 214 L316 190 L290 130 L242 100 Q222 132 200 132 Q178 132 158 100 Z" />
            <path d="M158 100 Q200 148 242 100" fill="none" strokeWidth="1.6" opacity="0.7" />
          </>
        )}

        {category === "Bottoms" && (
          <>
            <path d="M142 106 L258 106 L266 226 L292 404 L238 404 L206 236 L194 236 L162 404 L108 404 L134 226 Z" />
            <path d="M142 142 L258 142" fill="none" strokeWidth="1.6" opacity="0.7" />
            <path d="M200 150 L200 232" fill="none" strokeDasharray="5 9" strokeWidth="1.6" opacity="0.55" />
          </>
        )}

        {category === "Footwear" && (
          <>
            <path d="M104 210 L104 296 Q104 330 148 330 L306 330 Q330 330 330 302 Q330 274 296 264 L232 246 L232 178 L152 178 Z" />
            <path d="M104 268 L232 268" fill="none" strokeWidth="1.6" opacity="0.7" />
            <path d="M148 196 L148 246 M176 190 L176 246 M204 186 L204 246" fill="none" strokeWidth="1.6" opacity="0.5" />
          </>
        )}
      </g>
    </svg>
  );
}
