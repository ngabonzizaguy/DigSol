import "server-only";
import { pricingTiers, type PricingTier } from "@/components/marketing/pricing-card";
import { getPageSectionsStore } from "@/lib/marketing/page-sections-server";
import { getSectionContent } from "@/lib/marketing/page-sections-store";
import { getSiteSettings } from "@/lib/marketing/site-settings-server";
import type { SectionContentValue } from "@/lib/marketing/section-content-defaults";
import type { SiteSettings } from "@/lib/supabase/types";

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

type SettingsTierRow = SiteSettings["pricing_tiers"][number];

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

  const badge = row.badge?.trim() || undefined;
  const featuredExplicit =
    row.featured === "true" || row.featured === "1" || row.featured === "yes";
  const featured =
    featuredExplicit ||
    (badge ? /popular|featured/i.test(badge) : false) ||
    pricingTiers.find((t) => t.name === name)?.featured === true;

  return {
    name,
    description: row.description?.trim() ?? "",
    price: row.price?.trim() ?? "",
    cadence: row.cadence?.trim() ?? "",
    features,
    ctaLabel,
    ctaHref,
    featured: featured || undefined,
    badge,
  };
}

/** Parse pricing tiers from a page section content blob (list key: `tiers`). */
export function getPricingTiers(sectionContent: SectionContentValue): PricingTier[] {
  const raw = sectionContent.tiers;
  if (!Array.isArray(raw) || raw.length === 0) return pricingTiers;

  const parsed = (raw as RichTierRow[]).map((row) => parseRichTier(row)).filter((t): t is PricingTier => t !== null);
  return parsed.length > 0 ? parsed : pricingTiers;
}

function mergeDbTiersWithDefaults(dbTiers: SettingsTierRow[]): PricingTier[] {
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

/**
 * Site settings → Pricing tab wins for name / price / cadence / featured on matching tiers.
 * Page sections still supply descriptions, features, and CTAs when present.
 */
export function applySiteSettingsPricingOverrides(
  tiers: PricingTier[],
  dbTiers: SettingsTierRow[],
): PricingTier[] {
  const validRows = (dbTiers ?? []).filter((t) => t.name?.trim() && t.price?.trim());
  if (validRows.length === 0) return tiers;

  const byName = new Map(tiers.map((t) => [t.name, t]));
  const merged = tiers.map((tier) => {
    const db = validRows.find((t) => t.name === tier.name);
    if (!db) return tier;
    return {
      ...tier,
      price: db.price.trim(),
      cadence: db.cadence?.trim() || tier.cadence,
      featured: Boolean(db.featured || tier.featured),
    };
  });

  for (const db of validRows) {
    if (!byName.has(db.name)) {
      const staticTier = pricingTiers.find((t) => t.name === db.name);
      merged.push(
        staticTier
          ? {
              ...staticTier,
              price: db.price.trim(),
              cadence: db.cadence?.trim() || staticTier.cadence,
              featured: db.featured ?? staticTier.featured,
            }
          : {
              name: db.name,
              description: "",
              price: db.price.trim(),
              cadence: db.cadence?.trim() ?? "",
              features: ["Contact us for scope and deliverables."],
              ctaLabel: "Get in touch",
              ctaHref: "/contact",
              featured: db.featured,
            },
      );
    }
  }

  return merged;
}

export async function getPricingTiersForMarketing(): Promise<PricingTier[]> {
  const [settings, store] = await Promise.all([getSiteSettings(), getPageSectionsStore()]);
  const dbTiers = settings.pricing_tiers ?? [];
  const homePricing = getSectionContent(store, "home", "pricing");
  const parsed = getPricingTiers(homePricing);
  const hasRichCms =
    Array.isArray(homePricing.tiers) &&
    (homePricing.tiers as RichTierRow[]).length > 0 &&
    parsed.length > 0;

  const base = hasRichCms ? parsed : mergeDbTiersWithDefaults(dbTiers);
  return applySiteSettingsPricingOverrides(base, dbTiers);
}
