"use client";

import { RangeSlider } from "@/components/ui/range-slider";
import { useQuickStart } from "../quick-start-provider";
import type { BudgetCurrency } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

function formatMoney(amount: number, currency: BudgetCurrency): string {
  if (currency === "USD") return `$${amount.toLocaleString()}`;
  return `${amount.toLocaleString()} RWF`;
}

export function StepBudget() {
  const { draft, setDraft, config } = useQuickStart();
  const currency = draft.budget.currency;
  const bounds = currency === "RWF" ? config.budget_bounds.rwf : config.budget_bounds.usd;
  const presets = currency === "RWF" ? config.budget_presets.rwf : config.budget_presets.usd;

  const setCurrency = (next: BudgetCurrency) => {
    const nextBounds = next === "RWF" ? config.budget_bounds.rwf : config.budget_bounds.usd;
    const nextPresets = next === "RWF" ? config.budget_presets.rwf : config.budget_presets.usd;
    setDraft((d) => ({
      ...d,
      budget: {
        ...d.budget,
        currency: next,
        min: nextPresets[0]?.min ?? nextBounds.min,
        max: nextPresets[0]?.max ?? nextBounds.max,
      },
    }));
  };

  const setRange = ([min, max]: [number, number]) => {
    setDraft((d) => ({ ...d, budget: { ...d.budget, min, max, unsure: false } }));
  };

  const toggleUnsure = () => {
    setDraft((d) => ({ ...d, budget: { ...d.budget, unsure: !d.budget.unsure } }));
  };

  const applyPreset = (preset: { min: number; max: number }) => {
    setDraft((d) => ({
      ...d,
      budget: { ...d.budget, min: preset.min, max: preset.max, unsure: false },
    }));
  };

  return (
    <div className="space-y-5">
      <p className="text-[15px] text-body">{config.copy.budget.body}</p>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-body-strong">Currency</span>
        <div className="inline-flex rounded-full border border-hairline-strong bg-surface-card p-1">
          {(["RWF", "USD"] as BudgetCurrency[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                currency === c ? "bg-ink text-on-dark" : "text-ink hover:bg-surface-strong",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {presets.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => {
            const on =
              !draft.budget.unsure && draft.budget.min === p.min && draft.budget.max === p.max;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                className={
                  on
                    ? "rounded-full bg-ink px-4 py-2 text-sm text-on-dark"
                    : "rounded-full border border-hairline-strong px-4 py-2 text-sm text-ink hover:bg-surface-strong"
                }
              >
                {p.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className={cn("rounded-2xl border border-hairline bg-surface-card p-4", draft.budget.unsure && "opacity-50")}>
        <RangeSlider
          value={[draft.budget.min, draft.budget.max]}
          onChange={setRange}
          min={bounds.min}
          max={bounds.max}
          step={bounds.step}
          disabled={draft.budget.unsure}
          formatValue={(n) => formatMoney(n, currency)}
        />
      </div>

      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-body">
        <input
          type="checkbox"
          checked={draft.budget.unsure}
          onChange={toggleUnsure}
          className="h-4 w-4 rounded border-hairline-strong text-ink focus:ring-ink"
        />
        I'm not sure yet — recommend a range.
      </label>
    </div>
  );
}
