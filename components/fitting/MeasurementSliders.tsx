"use client";

import type { Measurements } from "@/lib/types";

const FIELDS: { key: keyof Measurements; label: string; min: number; max: number }[] = [
  { key: "height", label: "Stature (height)", min: 150, max: 200 },
  { key: "chest", label: "Chest / bust circumference", min: 70, max: 130 },
  { key: "waist", label: "Waist circumference", min: 55, max: 120 },
  { key: "hip", label: "Hip circumference", min: 75, max: 130 },
  { key: "shoulderWidth", label: "Shoulder width", min: 34, max: 54 },
  { key: "inseam", label: "Inseam (leg length)", min: 65, max: 95 },
];

export default function MeasurementSliders({
  values,
  onChange,
}: {
  values: Measurements;
  onChange: (m: Measurements) => void;
}) {
  return (
    <div className="space-y-5">
      {FIELDS.map((f) => (
        <div key={f.key}>
          <div className="flex items-baseline justify-between">
            <label htmlFor={`m-${f.key}`} className="text-sm text-muted">
              {f.label}
            </label>
            <span className="font-serif text-sm text-brass">{values[f.key]} cm</span>
          </div>
          <input
            id={`m-${f.key}`}
            type="range"
            min={f.min}
            max={f.max}
            value={values[f.key]}
            onChange={(e) => onChange({ ...values, [f.key]: Number(e.target.value) })}
            className="mt-2 w-full accent-brass"
          />
        </div>
      ))}
    </div>
  );
}
