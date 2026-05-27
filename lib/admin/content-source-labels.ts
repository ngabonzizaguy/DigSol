export type PricingContentSource = "page_sections" | "settings" | "static_defaults";

export type PageSectionsPersistState = "defaults_only" | "saved";

export function pricingSourceLabel(source: PricingContentSource): string {
  switch (source) {
    case "page_sections":
      return "Page sections → Pricing (copy only; set prices in Settings → Pricing)";
    case "settings":
      return "Site settings → Pricing (live prices on the public site)";
    default:
      return "Built-in site defaults (not saved to Supabase yet)";
  }
}

export function pageSectionsPersistLabel(state: PageSectionsPersistState): string {
  return state === "saved"
    ? "Some section content is saved in Supabase. Unsaved fields still show live defaults below."
    : "All section copy below matches the public site defaults — nothing saved in Page sections yet.";
}
