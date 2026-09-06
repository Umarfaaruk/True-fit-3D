"use client";

import type { Measurements } from "@/lib/types";

/**
 * Stylized tailoring silhouette, driven by measurement ratios. This is a
 * placeholder stage for a real SMPL-X mesh (three.js) — the measurement inputs
 * are already shaped to feed one.
 */
export default function AvatarStage({ m }: { m: Measurements }) {
  const shoulderW = 60 + (m.shoulderWidth - 38) * 2.2;
  const chestW = 46 + (m.chest - 80) * 0.55;
  const waistW = 40 + (m.waist - 70) * 0.55;
  const hipW = 46 + (m.hip - 85) * 0.5;
  const legLen = 210 + (m.inseam - 76) * 1.4;
  const heightScale = 0.86 + (m.height - 160) * 0.0018;

  const body = "rgb(var(--raised))";
  const edge = "rgb(var(--line))";

  return (
    <svg
      viewBox="0 0 320 460"
      className="h-full w-full"
      style={{ transform: `scale(${heightScale})` }}
      role="img"
      aria-label={`Body silhouette for a ${m.height}cm frame with a ${m.chest}cm chest and ${m.waist}cm waist`}
    >
      <defs>
        <linearGradient id="figGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--line))" />
          <stop offset="100%" stopColor={body} />
        </linearGradient>
      </defs>

      {/* measurement guide lines */}
      <line x1="60" y1="150" x2="260" y2="150" stroke="rgb(var(--brass))" strokeOpacity="0.4" strokeDasharray="3 4" />
      <line x1="60" y1="200" x2="260" y2="200" stroke="rgb(var(--sage))" strokeOpacity="0.4" strokeDasharray="3 4" />
      <line x1="60" y1="240" x2="260" y2="240" stroke="rgb(var(--brass))" strokeOpacity="0.4" strokeDasharray="3 4" />

      <ellipse cx="160" cy="55" rx="26" ry="30" fill="url(#figGrad)" stroke={edge} />
      <rect x="148" y="80" width="24" height="18" fill="url(#figGrad)" />

      <path
        d={`M ${160 - shoulderW / 2} 105
            Q 160 95 ${160 + shoulderW / 2} 105
            L ${160 + chestW / 2} 190
            L ${160 + waistW / 2} 235
            L ${160 + hipW / 2} 270
            L ${160 - hipW / 2} 270
            L ${160 - waistW / 2} 235
            L ${160 - chestW / 2} 190
            Z`}
        fill="url(#figGrad)"
        stroke={edge}
      />

      <path
        d={`M ${160 - shoulderW / 2} 108 L ${160 - shoulderW / 2 - 34} 240 L ${160 - shoulderW / 2 - 22} 244 L ${160 - shoulderW / 2 - 2} 116 Z`}
        fill="url(#figGrad)"
        stroke={edge}
      />
      <path
        d={`M ${160 + shoulderW / 2} 108 L ${160 + shoulderW / 2 + 34} 240 L ${160 + shoulderW / 2 + 22} 244 L ${160 + shoulderW / 2 + 2} 116 Z`}
        fill="url(#figGrad)"
        stroke={edge}
      />

      <rect x={160 - hipW / 2 + 4} y="270" width={hipW / 2 - 8} height={legLen * 0.42} fill="url(#figGrad)" stroke={edge} />
      <rect x={160 + 4} y="270" width={hipW / 2 - 8} height={legLen * 0.42} fill="url(#figGrad)" stroke={edge} />
      <rect x={160 - hipW / 2 + 6} y={270 + legLen * 0.42} width={hipW / 2 - 12} height={legLen * 0.4} fill="url(#figGrad)" stroke={edge} />
      <rect x={160 + 6} y={270 + legLen * 0.42} width={hipW / 2 - 12} height={legLen * 0.4} fill="url(#figGrad)" stroke={edge} />
    </svg>
  );
}
