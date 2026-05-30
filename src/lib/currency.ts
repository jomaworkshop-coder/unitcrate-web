export type FxRates = {
  base: string;
  date: string;
  rates: Record<string, number>;
};

const SUPPORTED = ["USD","EUR","GBP","JPY","CAD","AUD","CHF","CNY","INR","MXN","BRL","KRW","SGD","HKD","NOK","SEK","DKK","PLN","TRY","ZAR"];

export async function fetchFxRates(): Promise<FxRates> {
  const res = await fetch(
    "https://api.frankfurter.app/latest?base=USD&symbols=" + SUPPORTED.filter(c => c !== "USD").join(","),
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error("Frankfurter fetch failed");
  const data = await res.json() as { base: string; date: string; rates: Record<string, number> };
  return {
    base: "USD",
    date: data.date,
    rates: { USD: 1, ...data.rates },
  };
}

export function convertCurrency(amount: number, from: string, to: string, rates: Record<string, number>): number {
  const fromRate = rates[from.toUpperCase()];
  const toRate = rates[to.toUpperCase()];
  if (!fromRate || !toRate) return NaN;
  return (amount / fromRate) * toRate;
}

export function formatCurrency(value: number, code: string): string {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 1000) return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (Math.abs(value) >= 1) return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

export function parseCurrencySlug(slug: string): { from: string; to: string } | null {
  const m = slug.match(/^([a-z]{3})-to-([a-z]{3})$/);
  if (!m) return null;
  return { from: m[1], to: m[2] };
}

export const SUPPORTED_CURRENCIES = SUPPORTED;
