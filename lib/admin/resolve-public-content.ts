import "server-only";
import { pricingTiers, type PricingTier } from "@/components/marketing/pricing-card";
import { getPricingTiersForMarketing } from "@/lib/marketing/pricing-tiers";
import { getPageSectionsStore } from "@/lib/marketing/page-sections-server";
import { getSectionContent, parsePageSectionsFromIntegrations } from "@/lib/marketing/page-sections-store";
import { getSiteSettings } from "@/lib/marketing/site-settings-server";
import type { SiteSettings } from "@/lib/supabase/types";
import type { PageSectionsPersistState, PricingContentSource } from "@/lib/admin/content-source-labels";

/** Same merged settings the marketing site uses (DB + static fallbacks). */
export async function getResolvedSiteSettingsForAdmin(): Promise<SiteSettings> {
  return getSiteSettings();
}

export async function getEffectivePricingForAdmin(): Promise<{
  tiers: PricingTier[];
  source: PricingContentSource;
}> {
  const settings = await getSiteSettings();
  const tiers = await getPricingTiersForMarketing();

  const dbHasTiers =
    Array.isArray(settings.pricing_tiers) &&
    settings.pricing_tiers.length > 0 &&
    settings.pricing_tiers.some((t) => t.name?.trim() && t.price?.trim());

  if (dbHasTiers) {
    return { tiers, source: "settings" };
  }

  const store = await getPageSectionsStore();
  const homePricing = getSectionContent(store, "home", "pricing");
  const rawTiers = homePricing.tiers;
  const hasRich =
    Array.isArray(rawTiers) &&
    rawTiers.length > 0 &&
    (rawTiers as { name?: string }[]).some((t) => t.name?.trim());

  if (hasRich && tiers.length > 0) {
    return { tiers, source: "page_sections" };
  }

  return { tiers, source: "static_defaults" };
}

/** Settings tab rows: always at least the static Launch/Growth/Enterprise baseline. */
export function settingsPricingRowsFromResolved(settings: SiteSettings): SiteSettings["pricing_tiers"] {
  const rows = settings.pricing_tiers ?? [];
  if (rows.length > 0) return rows;
  return pricingTiers.map(({ name, price, cadence, featured }) => ({
    name,
    price,
    cadence,
    featured,
  }));
}

export function getPageSectionsPersistState(integrations: Record<string, unknown> | null | undefined): PageSectionsPersistState {
  const { content } = parsePageSectionsFromIntegrations(integrations);
  if (!content || Object.keys(content).length === 0) return "defaults_only";
  return "saved";
}
