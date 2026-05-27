"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PRESETS = [
  { label: "7 days", range: "7d" },
  { label: "30 days", range: "30d" },
  { label: "90 days", range: "90d" },
] as const;

type Props = {
  activePreset: "7d" | "30d" | "90d" | "custom";
  from: string;
  to: string;
};

export function AnalyticsRangePicker({ activePreset, from, to }: Props) {
  const router = useRouter();
  const search = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [showCustom, setShowCustom] = useState(activePreset === "custom");
  const [fromValue, setFromValue] = useState(from);
  const [toValue, setToValue] = useState(to);

  useEffect(() => {
    setFromValue(from);
    setToValue(to);
  }, [from, to]);

  function applyPreset(range: string) {
    const params = new URLSearchParams(search?.toString() ?? "");
    params.set("range", range);
    params.delete("from");
    params.delete("to");
    startTransition(() => router.push(`/admin/analytics?${params.toString()}`));
  }

  function applyCustom() {
    if (!fromValue || !toValue) return;
    const params = new URLSearchParams(search?.toString() ?? "");
    params.delete("range");
    params.set("from", fromValue);
    params.set("to", toValue);
    startTransition(() => router.push(`/admin/analytics?${params.toString()}`));
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <nav className="flex flex-wrap gap-1 rounded-lg border border-admin-border-soft bg-admin-surface p-1">
        {PRESETS.map((p) => (
          <button
            key={p.range}
            type="button"
            disabled={pending}
            onClick={() => applyPreset(p.range)}
            className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
              activePreset === p.range
                ? "bg-admin-accent text-admin-accent-fg"
                : "text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowCustom((v) => !v)}
          className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
            activePreset === "custom"
              ? "bg-admin-accent text-admin-accent-fg"
              : "text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg"
          }`}
        >
          Custom
        </button>
      </nav>

      {showCustom ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-admin-border-soft bg-admin-surface p-1.5">
          <input
            type="date"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            className="h-7 rounded border border-admin-border bg-admin-bg px-2 text-[12px]"
            aria-label="From date"
          />
          <span className="text-[11px] text-admin-fg-subtle">to</span>
          <input
            type="date"
            value={toValue}
            onChange={(e) => setToValue(e.target.value)}
            className="h-7 rounded border border-admin-border bg-admin-bg px-2 text-[12px]"
            aria-label="To date"
          />
          <button
            type="button"
            onClick={applyCustom}
            disabled={pending || !fromValue || !toValue}
            className="rounded-md bg-admin-accent px-2.5 py-1 text-[11px] font-medium text-admin-accent-fg disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      ) : null}
    </div>
  );
}
