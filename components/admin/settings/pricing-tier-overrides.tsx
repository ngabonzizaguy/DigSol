"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import { AdminCardToolbar } from "@/components/admin/shared/admin-card-toolbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import type { SiteSettings } from "@/lib/supabase/types";

type Tier = SiteSettings["pricing_tiers"][number];

type Props = {
  tiers: Tier[];
  onChange: (tiers: Tier[]) => void;
  onReset: () => void;
};

export function PricingTierOverrides({ tiers, onChange, onReset }: Props) {
  function updateTier(i: number, key: keyof Tier, value: string | boolean) {
    onChange(tiers.map((t, idx) => (idx === i ? { ...t, [key]: value } : t)));
  }

  return (
    <Card>
      <CardHeader>
        <AdminCardToolbar
          title={<CardTitle>Quick tier overrides</CardTitle>}
          className="w-full"
        >
          <Button type="button" variant="ghost" size="sm" className="w-full sm:w-auto" onClick={onReset}>
            Reset to live defaults
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => onChange([...tiers, { name: "", price: "", cadence: "", featured: false }])}
          >
            <Plus className="size-3.5" />
            Add tier
          </Button>
        </AdminCardToolbar>
      </CardHeader>
      <CardContent className="space-y-3">
        {tiers.length === 0 ? (
          <p className="text-[13px] text-admin-fg-muted">No tiers loaded — use Reset to live defaults.</p>
        ) : (
          tiers.map((t, i) => (
            <div
              key={`tier-${i}-${t.name}`}
              className="rounded-lg border border-admin-border-soft bg-admin-canvas/40 p-3 sm:border-0 sm:bg-transparent sm:p-0"
            >
              <div className="mb-3 flex items-center justify-between gap-2 sm:hidden">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-admin-fg-muted">
                  Tier {i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove tier ${i + 1}`}
                  onClick={() => onChange(tiers.filter((_, idx) => idx !== i))}
                >
                  <X className="size-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto] lg:items-end lg:gap-2">
                <FormField label="Name" labelClassName="lg:sr-only">
                  <Input
                    name="tier_name"
                    placeholder="Name"
                    value={t.name}
                    onChange={(e) => updateTier(i, "name", e.target.value)}
                  />
                </FormField>
                <FormField label="Price" labelClassName="lg:sr-only">
                  <Input
                    name="tier_price"
                    placeholder="Price"
                    value={t.price}
                    onChange={(e) => updateTier(i, "price", e.target.value)}
                  />
                </FormField>
                <FormField label="Cadence" labelClassName="lg:sr-only">
                  <Input
                    name="tier_cadence"
                    placeholder="Cadence"
                    value={t.cadence}
                    onChange={(e) => updateTier(i, "cadence", e.target.value)}
                  />
                </FormField>
                <label className="flex h-10 items-center gap-2 rounded-md border border-transparent px-1 text-[12px] text-admin-fg-muted lg:h-auto">
                  <input
                    type="checkbox"
                    name="tier_featured"
                    checked={Boolean(t.featured)}
                    onChange={(e) => updateTier(i, "featured", e.target.checked)}
                    className="size-4 shrink-0 rounded border-admin-border"
                  />
                  Featured
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hidden shrink-0 sm:inline-flex"
                  aria-label={`Remove tier ${i + 1}`}
                  onClick={() => onChange(tiers.filter((_, idx) => idx !== i))}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
