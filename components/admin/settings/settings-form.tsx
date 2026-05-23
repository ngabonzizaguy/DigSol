"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { saveSettings } from "@/app/(admin)/admin/(protected)/settings/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input, Textarea } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import type { SiteSettings } from "@/lib/supabase/types";

const TABS = ["Brand", "Contact", "Social", "SEO", "Pricing"] as const;

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="primary" size="sm" disabled={pending}>{pending ? "Saving…" : "Save settings"}</Button>;
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useActionState(saveSettings, null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Brand");
  const [tiers, setTiers] = useState(settings.pricing_tiers ?? []);

  useEffect(() => {
    if (state?.ok) toast.success("Settings saved");
    else if (state && !state.ok) toast.error(state.error);
  }, [state]);

  function updateTier(i: number, key: "name" | "price" | "cadence" | "featured", value: string | boolean) {
    setTiers((arr) => arr.map((t, idx) => (idx === i ? { ...t, [key]: value } : t)));
  }

  return (
    <form action={action} className="space-y-4">
      <nav className="flex items-center gap-1 rounded-lg border border-admin-border bg-admin-surface p-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1.5 text-[12px] ${tab === t ? "bg-admin-hover text-admin-fg" : "text-admin-fg-muted hover:text-admin-fg"}`}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto pr-1">
          <Submit />
        </div>
      </nav>

      {tab === "Brand" ? (
        <Card>
          <CardHeader><CardTitle>Brand</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <FormField label="Brand name"><Input name="brand_name" defaultValue={settings.brand.name ?? ""} /></FormField>
            <FormField label="Legal entity"><Input name="brand_legal" defaultValue={settings.brand.legal ?? ""} /></FormField>
            <FormField label="Tagline"><Input name="brand_tagline" defaultValue={settings.brand.tagline ?? ""} /></FormField>
            <FormField label="Description" className="md:col-span-2"><Textarea name="brand_description" rows={3} defaultValue={settings.brand.description ?? ""} /></FormField>
          </CardContent>
        </Card>
      ) : null}

      {tab === "Contact" ? (
        <Card>
          <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <FormField label="Email"><Input type="email" name="contact_email" defaultValue={settings.contact.email ?? ""} /></FormField>
            <FormField label="Phone"><Input name="contact_phone" defaultValue={settings.contact.phone ?? ""} /></FormField>
          </CardContent>
        </Card>
      ) : null}

      {tab === "Social" ? (
        <Card>
          <CardHeader><CardTitle>Social</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <FormField label="LinkedIn"><Input type="url" name="social_linkedin" defaultValue={settings.social.linkedin ?? ""} /></FormField>
            <FormField label="X / Twitter"><Input type="url" name="social_x" defaultValue={settings.social.x ?? ""} /></FormField>
            <FormField label="Instagram"><Input type="url" name="social_instagram" defaultValue={settings.social.instagram ?? ""} /></FormField>
            <FormField label="YouTube"><Input type="url" name="social_youtube" defaultValue={settings.social.youtube ?? ""} /></FormField>
          </CardContent>
        </Card>
      ) : null}

      {tab === "SEO" ? (
        <Card>
          <CardHeader><CardTitle>SEO defaults</CardTitle></CardHeader>
          <CardContent>
            <FormField label="Keywords" hint="Comma-separated">
              <Textarea name="seo_keywords" rows={3} defaultValue={(settings.seo_defaults.keywords ?? []).join(", ")} />
            </FormField>
          </CardContent>
        </Card>
      ) : null}

      {tab === "Pricing" ? (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Pricing tiers</CardTitle>
            <Button type="button" variant="ghost" size="xs" onClick={() => setTiers((arr) => [...arr, { name: "", price: "", cadence: "", featured: false }])}>
              <Plus className="size-3" /> Add tier
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {tiers.map((t, i) => (
              <div key={i} className="grid grid-cols-[1.2fr_1fr_1fr_auto_auto] items-center gap-2">
                <Input name="tier_name" placeholder="Name" value={t.name} onChange={(e) => updateTier(i, "name", e.target.value)} />
                <Input name="tier_price" placeholder="Price" value={t.price} onChange={(e) => updateTier(i, "price", e.target.value)} />
                <Input name="tier_cadence" placeholder="Cadence" value={t.cadence} onChange={(e) => updateTier(i, "cadence", e.target.value)} />
                <label className="flex items-center gap-1.5 text-[12px] text-admin-fg-muted">
                  <input type="checkbox" name="tier_featured" value={t.featured ? "true" : "false"} checked={Boolean(t.featured)} onChange={(e) => updateTier(i, "featured", e.target.checked)} className="size-3.5 rounded border-admin-border" />
                  Featured
                </label>
                <Button type="button" variant="ghost" size="icon" onClick={() => setTiers((arr) => arr.filter((_, idx) => idx !== i))}>
                  <X className="size-3.5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </form>
  );
}
