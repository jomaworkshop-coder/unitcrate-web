"use client";

import { useState, useMemo } from "react";
import { INGREDIENTS, COOKING_VOLUME_UNITS, volumeToGrams, gramsToVolume, getIngredient } from "@/lib/cooking-ingredients";
import { smartRound } from "@/lib/utils";

export function CookingIngredientConverter() {
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState("cup");
  const [ingredientValue, setIngredientValue] = useState("flour-ap");
  const [mode, setMode] = useState<"vol-to-weight" | "weight-to-vol">("vol-to-weight");
  const [weightInput, setWeightInput] = useState(100);

  const ingredient = getIngredient(ingredientValue)!;

  const grams = useMemo(
    () => mode === "vol-to-weight" ? volumeToGrams(amount, unit, ingredient) : weightInput,
    [amount, unit, ingredient, mode, weightInput]
  );
  const oz = grams / 28.3495;
  const volResult = useMemo(
    () => gramsToVolume(weightInput, unit, ingredient),
    [weightInput, unit, ingredient]
  );

  const tableAmounts = [0.25, 0.5, 1, 2, 4];

  return (
    <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface elev-1">
      <div className="border-b border-border-soft bg-surface-muted/40 px-5 py-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground-muted">Ingredient weight converter</h2>
        <div className="flex gap-1">
          <button
            onClick={() => setMode("vol-to-weight")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${mode === "vol-to-weight" ? "bg-primary text-primary-foreground" : "border border-border-soft text-foreground-muted [@media(hover:hover)]:hover:border-ink"}`}
          >
            Volume → Weight
          </button>
          <button
            onClick={() => setMode("weight-to-vol")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${mode === "weight-to-vol" ? "bg-primary text-primary-foreground" : "border border-border-soft text-foreground-muted [@media(hover:hover)]:hover:border-ink"}`}
          >
            Weight → Volume
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Ingredient selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Ingredient</label>
          <div className="relative">
            <select
              value={ingredientValue}
              onChange={(e) => setIngredientValue(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-border-soft bg-surface px-4 py-2.5 pr-9 text-sm font-medium transition-colors [@media(hover:hover)]:hover:border-ink"
            >
              {INGREDIENTS.map((ing) => (
                <option key={ing.value} value={ing.value}>
                  {ing.label}{ing.note ? ` (${ing.note})` : ""}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {mode === "vol-to-weight" ? (
          <>
            {/* Amount + unit */}
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Amount</label>
                <input
                  type="number"
                  min={0}
                  step={0.25}
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="rounded-xl border border-border-soft bg-surface px-4 py-2.5 text-sm font-medium outline-none transition-colors focus:border-primary"
                />
              </div>
              <div className="w-40 flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Unit</label>
                <div className="relative">
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-xl border border-border-soft bg-surface px-4 py-2.5 pr-9 text-sm font-medium transition-colors [@media(hover:hover)]:hover:border-ink"
                  >
                    {COOKING_VOLUME_UNITS.map((u) => (
                      <option key={u.value} value={u.value}>{u.label} ({u.symbol})</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Result */}
            <div className="rounded-xl border border-primary bg-primary-soft px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1">{amount} {COOKING_VOLUME_UNITS.find(u => u.value === unit)?.symbol} of {ingredient.label}</p>
              <p className="text-2xl font-bold tabular-nums">
                {smartRound(grams)} <span className="text-base font-normal text-foreground-muted">g</span>
                <span className="mx-2 text-base font-normal text-foreground/40">/</span>
                {smartRound(oz)} <span className="text-base font-normal text-foreground-muted">oz</span>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-3 items-end">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Weight (grams)</label>
                <input
                  type="number"
                  min={0}
                  value={weightInput}
                  onChange={(e) => setWeightInput(parseFloat(e.target.value) || 0)}
                  className="rounded-xl border border-border-soft bg-surface px-4 py-2.5 text-sm font-medium outline-none transition-colors focus:border-primary"
                />
              </div>
              <div className="w-40 flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Output unit</label>
                <div className="relative">
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-xl border border-border-soft bg-surface px-4 py-2.5 pr-9 text-sm font-medium transition-colors [@media(hover:hover)]:hover:border-ink"
                  >
                    {COOKING_VOLUME_UNITS.map((u) => (
                      <option key={u.value} value={u.value}>{u.label} ({u.symbol})</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-primary bg-primary-soft px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1">{weightInput}g of {ingredient.label} =</p>
              <p className="text-2xl font-bold tabular-nums">
                {smartRound(volResult)} <span className="text-base font-normal text-foreground-muted">{COOKING_VOLUME_UNITS.find(u => u.value === unit)?.symbol}</span>
              </p>
            </div>
          </>
        )}

        {/* Quick reference table */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Quick reference — cups of {ingredient.label}</p>
          <div className="overflow-hidden rounded-xl border border-border-soft">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border-soft bg-surface-muted/50">
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-foreground-muted">Cups</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-foreground-muted">Grams</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-foreground-muted">Oz</th>
                </tr>
              </thead>
              <tbody>
                {tableAmounts.map((a, i) => {
                  const g = volumeToGrams(a, "cup", ingredient);
                  return (
                    <tr key={a} className={i % 2 === 0 ? "bg-surface" : "bg-surface-muted/25"}>
                      <td className="px-3 py-2 tabular-nums text-foreground-muted">{a} cup</td>
                      <td className="px-3 py-2 font-semibold tabular-nums">{smartRound(g)} g</td>
                      <td className="px-3 py-2 tabular-nums text-foreground-muted">{smartRound(g / 28.3495)} oz</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
