"use client";

import { Measurements } from "@/lib/types";

const fields: { key: keyof Measurements; label: string; min: number; max: number }[] = [
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
    <div className="space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          <div className="flex items-baseline justify-between">
            <label className="text-sm text-parchment/70">{f.label}</label>
            <span className="font-serif text-sm text-brass-400">{values[f.key]} cm</span>
          </div>
          <input
            type="range"
            min={f.min}
            max={f.max}
            value={values[f.key]}
            onChange={(e) => onChange({ ...values, [f.key]: Number(e.target.value) })}
            className="mt-1.5 w-full accent-brass"
          />
        </div>
      ))}
    </div>
  );
}
