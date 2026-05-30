"use client";

import { useMemo, useState, useCallback } from "react";
import { Copy, Check, ArrowRightLeft } from "lucide-react";
import { UNITS, convertAll, convert, type UnitCategory, type UnitDef } from "@/lib/units";
import { useUrlState } from "@/lib/use-url-state";
import { smartRound } from "@/lib/utils";

type Props = {
  category: UnitCategory;
  defaultFrom?: string;
  defaultTo?: string;
};

export function MultiConverter({ category, defaultFrom, defaultTo }: Props) {
  const units = UNITS[category];
  const firstUnit = units[0].value;
  const secondUnit = units[1]?.value ?? units[0].value;

  const [s, set] = useUrlState({
    from: defaultFrom ?? firstUnit,
    to: defaultTo ?? secondUnit,
    value: 1,
  });

  const [copied, setCopied] = useState<string | null>(null);

  const allResults = useMemo(() => convertAll(s.value, s.from, category), [s.value, s.from, category]);
  const mainResult = useMemo(() => convert(s.value, s.from, s.to, category), [s, category]);

  const swap = useCallback(() => set({ from: s.to, to: s.from, value: mainResult }), [s, mainResult, set]);

  const copy = useCallback((key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const fromDef = units.find((u) => u.value === s.from);
  const toDef = units.find((u) => u.value === s.to);

  return (
    <div className="space-y-8">
      {/* ── Answer-first hero ─────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-3xl border border-ink bg-surface elev-2">
        <div className="grid sm:grid-cols-[1fr_auto_1fr]">
          {/* Input zone */}
          <div className="p-6 sm:p-7">
            <UnitPicker
              label="From"
              unit={s.from}
              units={units}
              onUnitChange={(u) => set({ from: u })}
            />
            <input
              type="number"
              inputMode="decimal"
              value={s.value}
              onChange={(e) => set({ value: Number(e.target.value) })}
              aria-label={`Value in ${fromDef?.label}`}
              className="mt-3 w-full bg-transparent text-5xl font-semibold tabular-nums tracking-tight outline-none placeholder:text-foreground-muted/40"
            />
          </div>

          {/* Swap — sits on the seam */}
          <div className="relative flex items-center justify-center border-y border-dashed border-border-soft sm:border-x sm:border-y-0">
            <button
              type="button"
              onClick={swap}
              aria-label="Swap units"
              className="my-3 flex h-11 w-11 items-center justify-center rounded-full border border-ink bg-surface text-foreground-muted transition-[transform,color] duration-150 elev-1 hover:text-primary active:scale-95 sm:my-0 [@media(hover:hover)]:hover:scale-105"
            >
              <ArrowRightLeft className="h-4 w-4 rotate-90 sm:rotate-0" />
            </button>
          </div>

          {/* Result zone — the hero */}
          <div className="bg-primary-soft/60 p-6 sm:p-7">
            <UnitPicker
              label="To"
              unit={s.to}
              units={units}
              onUnitChange={(u) => set({ to: u })}
            />
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-5xl font-bold tabular-nums tracking-tight text-primary">
                {Number.isFinite(mainResult) ? smartRound(mainResult) : "—"}
              </span>
              <span className="text-xl font-medium text-foreground-muted">{toDef?.symbol}</span>
            </div>
          </div>
        </div>

        {/* Equation strip + copy */}
        <div className="flex items-center justify-between gap-3 border-t border-border-soft bg-surface-muted/40 px-5 py-3">
          <p className="truncate font-mono text-sm text-foreground-muted">
            {smartRound(s.value)} {fromDef?.symbol}
            <span className="mx-1.5 text-foreground/40">=</span>
            <span className="font-semibold text-foreground">{smartRound(mainResult)} {toDef?.symbol}</span>
          </p>
          <button
            onClick={() => copy("main", `${smartRound(mainResult)} ${toDef?.symbol}`)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border-soft bg-surface px-3 py-1.5 text-xs font-medium text-foreground-muted transition-colors [@media(hover:hover)]:hover:border-ink [@media(hover:hover)]:hover:text-foreground"
            aria-label="Copy result"
          >
            {copied === "main" ? (
              <><Check className="h-3.5 w-3.5 text-accent" /> Copied</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy</>
            )}
          </button>
        </div>
      </div>

      {/* ── All units at once — the differentiator ────────────────────── */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground-muted">
          {smartRound(s.value)} {fromDef?.symbol} in every unit
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {allResults.map(({ unit, result }) => (
            <AllUnitRow
              key={unit.value}
              unit={unit}
              result={result}
              isActive={unit.value === s.to}
              isSource={unit.value === s.from}
              onClick={() => set({ to: unit.value })}
              onCopy={() => copy(unit.value, `${smartRound(result)} ${unit.symbol}`)}
              copied={copied === unit.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function UnitPicker({
  label, unit, units, onUnitChange,
}: {
  label: string;
  unit: string;
  units: UnitDef[];
  onUnitChange: (u: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">{label}</span>
      <div className="relative">
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          aria-label={`${label} unit`}
          className="cursor-pointer appearance-none rounded-full border border-border-soft bg-surface py-1 pl-3 pr-7 text-sm font-medium transition-colors [@media(hover:hover)]:hover:border-ink"
        >
          {units.map((u) => (
            <option key={u.value} value={u.value}>{u.label} ({u.symbol})</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-foreground-muted" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function AllUnitRow({
  unit, result, isActive, isSource, onClick, onCopy, copied,
}: {
  unit: UnitDef;
  result: number;
  isActive: boolean;
  isSource: boolean;
  onClick: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onClick())}
      className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-[border-color,background-color] duration-150 ${
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
          {Number.isFinite(result) ? smartRound(result) : "—"}
          <span className="ml-1 font-normal text-foreground-muted">{unit.symbol}</span>
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onCopy(); }}
        aria-label={`Copy ${unit.label} value`}
        className="shrink-0 text-foreground-muted/0 transition-colors group-hover:text-foreground-muted [@media(hover:hover)]:hover:!text-foreground [@media(hover:none)]:text-foreground-muted/60"
      >
        {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
