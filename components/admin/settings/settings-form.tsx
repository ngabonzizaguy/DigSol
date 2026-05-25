"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { saveSettings } from "@/app/(admin)/admin/(protected)/settings/actions";
import { AdminTabBar } from "@/components/admin/shared/admin-tab-bar";
import { LiveContentNotice } from "@/components/admin/shared/live-content-notice";
import { PricingTierOverrides } from "@/components/admin/settings/pricing-tier-overrides";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input, Textarea } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import { pricingSourceLabel, type PricingContentSource } from "@/lib/admin/content-source-labels";
import type { PricingTier } from "@/components/marketing/pricing-card";
import type { SiteSettings } from "@/lib/supabase/types";

const TABS = ["Brand", "Contact", "Social", "SEO", "Pricing"] as const;

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="sm" disabled={pending}>
      {pending ? "Saving…" : "Save settings"}
    </Button>
  );
}

type Props = {
  settings: SiteSettings;
  effectivePricing: { tiers: PricingTier[]; source: PricingContentSource };
};

export function SettingsForm({ settings, effectivePricing }: Props) {
  const [state, action] = useActionState(saveSettings, null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Brand");
  const [tiers, setTiers] = useState(settings.pricing_tiers ?? []);

  useEffect(() => {
    setTiers(settings.pricing_tiers ?? []);
  }, [settings]);

  useEffect(() => {
    if (state?.ok) toast.success("Settings saved");
    else if (state && !state.ok) toast.error(state.error);
  }, [state]);

  function resetPricingToDefaults() {
    setTiers(settings.pricing_tiers ?? []);
    toast.message("Pricing rows reset to current live defaults (save to persist)");
  }

  const richPricingOnSite = effectivePricing.source === "page_sections";

  return (
    <form action={action} className="min-w-0 space-y-4">
      <LiveContentNotice title="Editing the live site baseline">
        Fields below reflect what the public site shows today — including former static copy merged from defaults. Saving
        writes to Supabase; until then, marketing pages keep using the merged preview.
      </LiveContentNotice>

      <AdminTabBar
        tabs={TABS.map((t) => ({ id: t, label: t }))}
        active={tab}
        onChange={setTab}
        actions={<Submit />}
      />

      {tab === "Brand" ? (
        <Card>
          <CardHeader>
            <CardTitle>Brand</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormField label="Brand name">
              <Input name="brand_name" defaultValue={settings.brand.name ?? ""} />
            </FormField>
            <FormField label="Legal entity">
              <Input name="brand_legal" defaultValue={settings.brand.legal ?? ""} />
            </FormField>
            <FormField label="Tagline">
              <Input name="brand_tagline" defaultValue={settings.brand.tagline ?? ""} />
            </FormField>
            <FormField label="Description" className="md:col-span-2">
              <Textarea name="brand_description" rows={3} defaultValue={settings.brand.description ?? ""} />
            </FormField>
          </CardContent>
        </Card>
      ) : null}

      {tab === "Contact" ? (
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormField label="Email">
              <Input type="email" name="contact_email" defaultValue={settings.contact.email ?? ""} />
            </FormField>
            <FormField label="Phone">
              <Input name="contact_phone" defaultValue={settings.contact.phone ?? ""} />
            </FormField>
          </CardContent>
        </Card>
      ) : null}

      {tab === "Social" ? (
        <Card>
          <CardHeader>
            <CardTitle>Social</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormField label="LinkedIn">
              <Input type="url" name="social_linkedin" defaultValue={settings.social.linkedin ?? ""} />
            </FormField>
            <FormField label="X / Twitter">
              <Input type="url" name="social_x" defaultValue={settings.social.x ?? ""} />
            </FormField>
            <FormField label="Instagram">
              <Input type="url" name="social_instagram" defaultValue={settings.social.instagram ?? ""} />
            </FormField>
            <FormField label="YouTube">
              <Input type="url" name="social_youtube" defaultValue={settings.social.youtube ?? ""} />
            </FormField>
          </CardContent>
        </Card>
      ) : null}

      {tab === "SEO" ? (
        <Card>
          <CardHeader>
            <CardTitle>SEO defaults</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField label="Keywords" hint="Comma-separated">
              <Textarea name="seo_keywords" rows={3} defaultValue={(settings.seo_defaults.keywords ?? []).join(", ")} />
            </FormField>
          </CardContent>
        </Card>
      ) : null}

      {tab === "Pricing" ? (
        <div className="min-w-0 space-y-4">
          <LiveContentNotice title="What visitors see on pricing sections">
            <p className="break-words">
              Source: <span className="text-admin-fg">{pricingSourceLabel(effectivePricing.source)}</span>
            </p>
            {richPricingOnSite ? (
              <p className="mt-2 break-words">
                Full tier copy (descriptions, features, CTAs) is controlled in{" "}
                <Link href="/admin/page-sections" className="text-admin-fg underline underline-offset-2">
                  Page sections → Homepage → Pricing
                </Link>
                . Use the rows below only for quick name / price / cadence overrides when rich tiers are not saved.
              </p>
            ) : (
              <p className="mt-2 break-words">
                These rows override the built-in Launch / Growth / Enterprise defaults on the homepage when Page sections
                pricing is empty.
              </p>
            )}
          </LiveContentNotice>

          <Card>
            <CardHeader>
              <CardTitle>Live pricing preview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {effectivePricing.tiers.map((tier) => (
                <div
                  key={tier.name}
                  className="min-w-0 rounded-lg border border-admin-border-soft bg-admin-canvas/50 p-4"
                >
                  <p className="font-medium text-admin-fg">{tier.name}</p>
                  <p className="mt-1 break-words text-[12px] text-admin-fg-muted line-clamp-3">{tier.description}</p>
                  <p className="mt-2 break-words font-mono text-[12px] text-admin-fg">
                    {tier.price}
                    {tier.cadence ? ` · ${tier.cadence}` : ""}
                  </p>
                  {tier.features.length > 0 ? (
                    <ul className="mt-2 space-y-1 break-words text-[11px] text-admin-fg-subtle">
                      {tier.features.slice(0, 3).map((f) => (
                        <li key={f}>· {f}</li>
                      ))}
                      {tier.features.length > 3 ? <li>· +{tier.features.length - 3} more</li> : null}
                    </ul>
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>

          <PricingTierOverrides tiers={tiers} onChange={setTiers} onReset={resetPricingToDefaults} />
        </div>
      ) : null}
    </form>
  );
}
