"use client";

import { useEffect, useRef, useState } from "react";

export function useUrlState<T extends Record<string, number | string>>(
  defaults: T,
  serializers?: Partial<{ [K in keyof T]: (raw: string) => T[K] }>,
): [T, (next: Partial<T>) => void] {
  const [state, setState] = useState<T>(defaults);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const next = { ...defaults };
    for (const key of Object.keys(defaults) as (keyof T)[]) {
      const raw = params.get(String(key));
      if (raw === null) continue;
      const parser = serializers?.[key];
      if (parser) {
        next[key] = parser(raw);
      } else if (typeof defaults[key] === "number") {
        const num = Number(raw);
        if (!Number.isNaN(num)) next[key] = num as T[keyof T];
      } else {
        next[key] = raw as T[keyof T];
      }
    }
    setState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (patch: Partial<T>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      if (typeof window !== "undefined") {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(next)) params.set(k, String(v));
        window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
      }
      return next;
    });
  };

  return [state, update];
}
