"use client";

import { useMemo, useState, useCallback } from "react";
import { Copy, Check, ArrowRightLeft } from "lucide-react";
import { UNITS } from "@/lib/units";
import { convertCurrency, formatCurrency, type FxRates } from "@/lib/currency";
import { useUrlState } from "@/lib/use-url-state";

type Props = {
  rates: FxRates;
  defaultFrom?: string;
  defaultTo?: string;
};

const CURRENCIES = UNITS.currency;

export function CurrencyConverter({ rates, defaultFrom = "usd", defaultTo = "eur" }: Props) {
  const [s, set] = useUrlState({ from: defaultFrom, to: defaultTo, value: 1 });
  const [copied, setCopied] = useState<string | null>(null);

  const allResults = useMemo(
    () => CURRENCIES.map((c) => ({ unit: c, result: convertCurrency(s.value, s.from, c.value, rates.rates) })),
    [s.value, s.from, rates.rates]
  );
  const mainResult = useMemo(
    () => convertCurrency(s.value, s.from, s.to, rates.rates),
    [s, rates.rates]
  );

  const swap = useCallback(
    () => set({ from: s.to, to: s.from, value: mainResult }),
    [s, mainResult, set]
  );

  const copy = useCallback((key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied((k) => (k === key ? null : k)), 1500);
  }, []);

  const fromDef = CURRENCIES.find((c) => c.value === s.from);
  const toDef = CURRENCIES.find((c) => c.value === s.to);

  return (
    <div className="space-y-4">
      {/* Rate freshness badge */}
      <p className="text-xs text-foreground-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent mr-1.5" />
        ECB rates · updated {rates.date}
      </p>

      {/* Main converter card */}
      <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface elev-1">
        {/* Input row */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border-soft">
          <input
            type="number"
            value={s.value}
            onChange={(e) => set({ value: parseFloat(e.target.value) || 0 })}
            className="min-w-0 flex-1 bg-transparent text-2xl font-semibold tabular-nums outline-none placeholder:text-foreground-muted/40"
            placeholder="1"
          />
          <CurrencySelect value={s.from} onChange={(v) => set({ from: v })} label="From currency" />
        </div>

        {/* Swap + output row */}
        <div className="flex items-center gap-3 px-5 py-4">
          <button
            onClick={swap}
            aria-label="Swap currencies"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-soft bg-surface text-foreground-muted transition-colors [@media(hover:hover)]:hover:border-primary [@media(hover:hover)]:hover:text-primary"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
          <p className="min-w-0 flex-1 text-2xl font-semibold tabular-nums text-primary truncate">
            {formatCurrency(mainResult, s.to)}
          </p>
          <CurrencySelect value={s.to} onChange={(v) => set({ to: v })} label="To currency" />
        </div>

        {/* Equation strip */}
        <div className="flex items-center justify-between gap-3 border-t border-border-soft bg-surface-muted/40 px-5 py-3">
          <p className="truncate font-mono text-sm text-foreground-muted">
            {s.value} {fromDef?.symbol}
            <span className="mx-1.5 text-foreground/40">=</span>
            <span className="font-semibold text-foreground">{formatCurrency(mainResult, s.to)} {toDef?.symbol}</span>
          </p>
          <button
            onClick={() => copy("main", formatCurrency(mainResult, s.to))}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border-soft bg-surface px-3 py-1.5 text-xs font-medium text-foreground-muted transition-colors [@media(hover:hover)]:hover:border-ink [@media(hover:hover)]:hover:text-foreground"
          >
            {copied === "main" ? <><Check className="h-3.5 w-3.5 text-accent" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
          </button>
        </div>
      </div>

      {/* All currencies */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground-muted">
          {s.value} {fromDef?.symbol} in every currency
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {allResults.map(({ unit, result }) => {
            const isActive = unit.value === s.to;
            const isSource = unit.value === s.from;
            return (
              <div
                key={unit.value}
                onClick={() => set({ to: unit.value })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), set({ to: unit.value }))}
                className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-[border-color,background-color] duration-150 cursor-pointer ${
                  isActive
                    ? "border-primary bg-primary-soft elev-1"
                    : isSource
                      ? "border-border-soft bg-surface-muted/50"
                      : "border-border-soft bg-surface [@media(hover:hover)]:hover:border-ink"
                }`}
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
                    {unit.label}
                    {isSource && <span className="rounded-full bg-foreground/10 px-1.5 text-[10px] font-medium uppercase tracking-wide">from</span>}
                  </p>
                  <p className="truncate font-semibold tabular-nums">
                    {formatCurrency(result, unit.value)}
                    <span className="ml-1 font-normal text-foreground-muted">{unit.symbol}</span>
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); copy(unit.value, formatCurrency(result, unit.value)); }}
                  aria-label={`Copy ${unit.label} value`}
                  className="shrink-0 text-foreground-muted/0 transition-colors group-hover:text-foreground-muted [@media(hover:hover)]:hover:!text-foreground [@media(hover:none)]:text-foreground-muted/60"
                >
                  {copied === unit.value ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CurrencySelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="cursor-pointer appearance-none rounded-full border border-border-soft bg-surface py-1.5 pl-3 pr-7 text-sm font-semibold transition-colors [@media(hover:hover)]:hover:border-ink"
      >
        {CURRENCIES.map((c) => (
          <option key={c.value} value={c.value}>{c.symbol} — {c.label}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-foreground-muted" viewBox="0 0 12 12" fill="none">
        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
