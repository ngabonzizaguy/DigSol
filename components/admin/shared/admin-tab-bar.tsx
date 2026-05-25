"use client";

import { cn } from "@/lib/utils";

type Tab<T extends string> = { id: T; label: string };

type Props<T extends string> = {
  tabs: Tab<T>[];
  active: T;
  onChange: (id: T) => void;
  actions?: React.ReactNode;
  className?: string;
};

export function AdminTabBar<T extends string>({ tabs, active, onChange, actions, className }: Props<T>) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0 flex-1">
        <div
          className="flex flex-wrap gap-1 rounded-lg border border-admin-border bg-admin-surface p-1"
          role="tablist"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "rounded-md px-3 py-2 text-[12px] font-medium transition-colors",
                active === tab.id
                  ? "bg-admin-hover text-admin-fg"
                  : "text-admin-fg-muted hover:bg-admin-hover/60 hover:text-admin-fg",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {actions ? <div className="flex w-full shrink-0 sm:w-auto [&_button]:w-full sm:[&_button]:w-auto">{actions}</div> : null}
    </div>
  );
}
