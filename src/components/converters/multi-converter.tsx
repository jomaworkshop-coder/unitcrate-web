"use client";

import { useMemo, useState, useCallback } from "react";
import { Copy, Check, ArrowDownUp } from "lucide-react";
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

  const copyResult = useCallback((key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const fromDef = units.find((u) => u.value === s.from);
  const toDef = units.find((u) => u.value === s.to);

  return (
    <div className="space-y-6">
      {/* Primary converter */}
      <div className="rounded-2xl border border-ink bg-surface p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <Field
            label={fromDef?.label ?? "From"}
            symbol={fromDef?.symbol ?? s.from}
            value={s.value}
            readOnly={false}
            onChange={(v) => set({ value: v })}
            unit={s.from}
            units={units}
            onUnitChange={(u) => set({ from: u })}
          />

          <button
            type="button"
            onClick={swap}
            aria-label="Swap units"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-ink bg-surface hover:bg-surface-muted transition-colors sm:mb-1"
          >
            <ArrowDownUp className="h-4 w-4 text-foreground-muted sm:rotate-90" />
          </button>

          <Field
            label={toDef?.label ?? "To"}
            symbol={toDef?.symbol ?? s.to}
            value={mainResult}
            readOnly
            unit={s.to}
            units={units}
            onUnitChange={(u) => set({ to: u })}
          />
        </div>

        {/* Copy result row */}
        <div className="mt-4 flex items-center justify-between gap-3 rounded-[4px] border border-ink bg-surface-muted/50 px-4 py-3 text-sm">
          <span className="font-mono">
            {smartRound(s.value)} {fromDef?.symbol} = <strong>{smartRound(mainResult)} {toDef?.symbol}</strong>
          </span>
          <button
            onClick={() => copyResult("main", `${smartRound(mainResult)} ${toDef?.symbol}`)}
            className="text-foreground-muted hover:text-foreground transition-colors"
            aria-label="Copy result"
          >
            {copied === "main" ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* All-units output — THE DIFFERENTIATOR */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground-muted mb-3">
          {smartRound(s.value)} {fromDef?.symbol} in all units
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {allResults.map(({ unit, result }) => (
            <AllUnitRow
              key={unit.value}
              unit={unit}
              result={result}
              isActive={unit.value === s.to}
              onClick={() => set({ to: unit.value })}
              onCopy={() => copyResult(unit.value, `${smartRound(result)} ${unit.symbol}`)}
              copied={copied === unit.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({
  label, symbol, value, readOnly, onChange, unit, units, onUnitChange,
}: {
  label: string;
  symbol: string;
  value: number;
  readOnly: boolean;
  onChange?: (v: number) => void;
  unit: string;
  units: UnitDef[];
  onUnitChange: (u: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
        {label} ({symbol})
      </label>
      {readOnly ? (
        <div className="flex h-14 items-center rounded-[4px] border border-ink bg-surface-muted/30 px-4 text-2xl font-bold tabular-nums">
          {Number.isFinite(value) ? smartRound(value) : "—"}
        </div>
      ) : (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="h-14 rounded-[4px] border border-ink bg-surface px-4 text-2xl font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      )}
      <select
        value={unit}
        onChange={(e) => onUnitChange(e.target.value)}
        className="h-9 rounded-[4px] border border-ink bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {units.map((u) => (
          <option key={u.value} value={u.value}>
            {u.label} ({u.symbol})
          </option>
        ))}
      </select>
    </div>
  );
}

function AllUnitRow({
  unit, result, isActive, onClick, onCopy, copied,
}: {
  unit: UnitDef;
  result: number;
  isActive: boolean;
  onClick: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-[4px] border px-4 py-3 cursor-pointer transition-colors ${
        isActive
          ? "border-primary bg-primary-soft"
          : "border-ink bg-surface hover:bg-surface-muted"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="min-w-0">
        <p className="text-xs text-foreground-muted">{unit.label}</p>
        <p className="font-bold tabular-nums truncate">
          {Number.isFinite(result) ? smartRound(result) : "—"}{" "}
          <span className="font-normal text-foreground-muted">{unit.symbol}</span>
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onCopy(); }}
        aria-label={`Copy ${unit.label} value`}
        className="shrink-0 text-foreground-muted hover:text-foreground"
      >
        {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
