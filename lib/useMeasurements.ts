"use client";

import { useCallback, useEffect, useState } from "react";
import { MEASUREMENTS_KEY, defaultMeasurements, type Measurements } from "./types";

/**
 * Measurements live in localStorage so the Fitting Room and every product page
 * agree on one body. `saved` stays false until the shopper has actually set
 * them, which lets product pages distinguish "no data" from "default data".
 */
export function useMeasurements() {
  const [measurements, setMeasurements] = useState<Measurements>(defaultMeasurements);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MEASUREMENTS_KEY);
      if (raw) {
        setMeasurements({ ...defaultMeasurements, ...(JSON.parse(raw) as Partial<Measurements>) });
        setSaved(true);
      }
    } catch {
      /* storage blocked — fall back to defaults */
    }
    setHydrated(true);
  }, []);

  const update = useCallback((next: Measurements) => {
    setMeasurements(next);
    setSaved(true);
    try {
      window.localStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(next));
    } catch {
      /* nothing to do — the session still works, it just will not persist */
    }
  }, []);

  return { measurements, update, saved, hydrated };
}
