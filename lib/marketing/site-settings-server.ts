import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { SiteSettings } from "@/lib/supabase/types";
import { site } from "@/lib/site";
import { pricingTiers } from "@/components/marketing/pricing-card";

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  brand: {
    name: site.name,
    legal: site.legal,
    tagline: site.tagline,
    description: site.description,
  },
  contact: { email: site.email, phone: site.phone },
  social: { ...site.social },
  seo_defaults: {},
  pricing_tiers: pricingTiers.map(({ name, price, cadence, featured }) => ({
    name,
    price,
    cadence,
    featured,
  })),
  integrations: {},
  updated_at: new Date().toISOString(),
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const supabase = createPublicClient();
    if (!supabase) return DEFAULT_SETTINGS;
    const { data } = await supabase
      .from("site_settings")
      .select("brand, contact, social, pricing_tiers, integrations, updated_at")
      .eq("id", 1)
      .maybeSingle();

    if (!data) return DEFAULT_SETTINGS;

    return {
      ...DEFAULT_SETTINGS,
      brand: { ...DEFAULT_SETTINGS.brand, ...(data.brand as SiteSettings["brand"]) },
      contact: { ...DEFAULT_SETTINGS.contact, ...(data.contact as SiteSettings["contact"]) },
      social: { ...DEFAULT_SETTINGS.social, ...(data.social as SiteSettings["social"]) },
      pricing_tiers: Array.isArray(data.pricing_tiers) && data.pricing_tiers.length > 0
        ? (data.pricing_tiers as SiteSettings["pricing_tiers"])
        : DEFAULT_SETTINGS.pricing_tiers,
      integrations: (data.integrations as Record<string, unknown>) ?? {},
      updated_at: (data.updated_at as string) ?? DEFAULT_SETTINGS.updated_at,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
});
