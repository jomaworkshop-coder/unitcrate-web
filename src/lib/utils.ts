import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 6, ...options }).format(value);
}

export function smartRound(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1000) return formatNumber(value, { maximumFractionDigits: 2 });
  if (abs >= 1) return formatNumber(value, { maximumFractionDigits: 4 });
  if (abs >= 0.001) return formatNumber(value, { maximumFractionDigits: 6 });
  return value.toExponential(4);
}
