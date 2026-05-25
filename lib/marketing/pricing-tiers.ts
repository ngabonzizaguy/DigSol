import "server-only";
import { pricingTiers, type PricingTier } from "@/components/marketing/pricing-card";
import { getPageSectionsStore } from "@/lib/marketing/page-sections-server";
import { getSectionContent } from "@/lib/marketing/page-sections-store";
import { getSiteSettings } from "@/lib/marketing/site-settings-server";
import type { SectionContentValue } from "@/lib/marketing/section-content-defaults";

type RichTierRow = {
  name?: string;
  description?: string;
  price?: string;
  cadence?: string;
  features?: string;
  cta_label?: string;
  cta_href?: string;
  featured?: string;
  badge?: string;
};

function parseFeatures(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseRichTier(row: RichTierRow): PricingTier | null {
  const name = row.name?.trim();
  if (!name) return null;

  const features = parseFeatures(row.features);
  const ctaHref = row.cta_href?.trim();
  const ctaLabel = row.cta_label?.trim();
  if (!ctaHref || !ctaLabel || features.length === 0) return null;

  const featured = row.featured === "true" || row.featured === "1" || row.featured === "yes";

  return {
    name,
    description: row.description?.trim() ?? "",
    price: row.price?.trim() ?? "",
    cadence: row.cadence?.trim() ?? "",
    features,
    ctaLabel,
    ctaHref,
    featured: featured || undefined,
    badge: row.badge?.trim() || undefined,
  };
}

function mergeDbTiersWithDefaults(
  dbTiers: { name: string; price: string; cadence: string; featured?: boolean }[],
): PricingTier[] {
  return pricingTiers.map((defaultTier) => {
    const db = dbTiers.find((t) => t.name === defaultTier.name);
    if (!db) return defaultTier;
    return {
      ...defaultTier,
      price: db.price?.trim() || defaultTier.price,
      cadence: db.cadence?.trim() || defaultTier.cadence,
      featured: db.featured ?? defaultTier.featured,
    };
  });
}

/** Parse pricing tiers from a page section content blob (list key: `tiers`). */
export function getPricingTiers(sectionContent: SectionContentValue): PricingTier[] {
  const raw = sectionContent.tiers;
  if (!Array.isArray(raw) || raw.length === 0) return pricingTiers;

  const parsed = (raw as RichTierRow[]).map((row) => parseRichTier(row)).filter((t): t is PricingTier => t !== null);
  return parsed.length > 0 ? parsed : pricingTiers;
}

export async function getPricingTiersForMarketing(): Promise<PricingTier[]> {
  const [settings, store] = await Promise.all([getSiteSettings(), getPageSectionsStore()]);
  const homePricing = getSectionContent(store, "home", "pricing");
  const parsed = getPricingTiers(homePricing);
  const hasCmsTiers = Array.isArray(homePricing.tiers) && (homePricing.tiers as RichTierRow[]).length > 0;

  if (hasCmsTiers && parsed.length > 0) {
    return parsed;
  }

  return mergeDbTiersWithDefaults(settings.pricing_tiers ?? []);
}
