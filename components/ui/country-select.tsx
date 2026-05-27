"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, Search } from "lucide-react";
import { COUNTRIES, type CountryEntry, findCountry, flagEmoji } from "@/lib/marketing/countries";
import { cn } from "@/lib/utils";

export interface CountrySelectProps {
  value?: string | null;
  onChange?: (entry: CountryEntry) => void;
  name?: string;
  placeholder?: string;
  className?: string;
  variant?: "field" | "compact"; // compact = just flag+dial inline (for phone input)
  required?: boolean;
}

export function CountrySelect({
  value,
  onChange,
  name,
  placeholder = "Select country",
  className,
  variant = "field",
  required,
}: CountrySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const selected = findCountry(value ?? undefined);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dial.includes(q),
    );
  }, [query]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Select country"
          className={cn(
            variant === "field"
              ? "flex h-11 w-full items-center justify-between rounded-lg border border-hairline-strong bg-surface-card px-4 text-[15px] text-ink hover:border-ink/40 focus:outline-none focus:border-ink transition-colors"
              : "flex h-11 items-center gap-1.5 rounded-l-lg border border-r-0 border-hairline-strong bg-surface-card px-3 text-[15px] text-ink hover:bg-surface-strong focus:outline-none transition-colors",
            className,
          )}
        >
          {selected ? (
            <span className="flex items-center gap-2 truncate">
              <span aria-hidden className="text-base leading-none">
                {flagEmoji(selected.code)}
              </span>
              {variant === "field" ? (
                <span className="truncate">
                  {selected.name} <span className="text-muted">{selected.dial}</span>
                </span>
              ) : (
                <span className="text-muted">{selected.dial}</span>
              )}
            </span>
          ) : (
            <span className="text-muted-soft truncate">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted" aria-hidden />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-[60] w-[var(--radix-popover-trigger-width)] min-w-[260px] glass rounded-2xl border border-hairline p-2 shadow-lift"
        >
          <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 mb-2">
            <Search className="h-4 w-4 text-muted" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search countries"
              className="w-full bg-transparent text-[14px] text-ink placeholder:text-muted-soft focus:outline-none"
              aria-label="Search countries"
            />
          </div>
          <div className="max-h-72 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted">No matches</p>
            ) : (
              filtered.map((c) => {
                const isSelected = selected?.code === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onChange?.(c);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[14px] hover:bg-white/70 focus:bg-white/70 focus:outline-none transition-colors",
                      isSelected && "bg-white/60",
                    )}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span aria-hidden className="text-base leading-none">
                        {flagEmoji(c.code)}
                      </span>
                      <span className="truncate text-ink">{c.name}</span>
                      <span className="text-muted">{c.dial}</span>
                    </span>
                    {isSelected ? <Check className="h-4 w-4 text-ink" aria-hidden /> : null}
                  </button>
                );
              })
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
      {name ? (
        <input type="hidden" name={name} value={selected?.code ?? ""} required={required} readOnly />
      ) : null}
    </Popover.Root>
  );
}
