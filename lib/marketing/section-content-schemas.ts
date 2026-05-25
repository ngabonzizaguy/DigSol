/**
 * Editable field schemas for marketing page sections.
 * CMS entity grids (services, case studies, etc.) stay in their own admin areas — only section chrome/copy here.
 */

export type ContentSchemaId =
  | "none"
  | "page_hero"
  | "section_heading"
  | "cta_band"
  | "home_hero"
  | "home_hero_preview"
  | "home_trust"
  | "stat_grid"
  | "text_block"
  | "item_list"
  | "faq_list"
  | "contact_sidebar"
  | "confirmation"
  | "card_list"
  | "icon_card_list"
  | "location_list"
  | "partner_group_list"
  | "phase_card_list"
  | "checklist"
  | "pricing_tiers_rich"
  | "newsletter_block"
  | "event_card_list"
  | "numbered_steps"
  | "site_header"
  | "footer_nav";

export type SectionFieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "url";
  optional?: boolean;
  hint?: string;
};

export type SectionListDef = {
  key: string;
  label: string;
  itemFields: SectionFieldDef[];
  minItems?: number;
};

export type ContentSchema = {
  id: ContentSchemaId;
  label: string;
  fields?: SectionFieldDef[];
  list?: SectionListDef;
  lists?: SectionListDef[];
};

const SECTION_HEADING_FIELDS: SectionFieldDef[] = [
  { key: "eyebrow", label: "Eyebrow", type: "text", optional: true },
  { key: "title", label: "Title", type: "text", optional: true },
  { key: "subtitle", label: "Subtitle", type: "textarea", optional: true },
];

export const CONTENT_SCHEMAS: Record<ContentSchemaId, ContentSchema> = {
  none: { id: "none", label: "Visibility only", fields: [] },
  page_hero: {
    id: "page_hero",
    label: "Page hero",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", optional: true },
      { key: "title", label: "Headline", type: "textarea" },
      { key: "subtitle", label: "Subtitle", type: "textarea", optional: true },
      { key: "primary_label", label: "Primary button", type: "text", optional: true },
      { key: "primary_href", label: "Primary URL", type: "url", optional: true },
      { key: "secondary_label", label: "Secondary button", type: "text", optional: true },
      { key: "secondary_href", label: "Secondary URL", type: "url", optional: true },
    ],
  },
  section_heading: {
    id: "section_heading",
    label: "Section heading",
    fields: SECTION_HEADING_FIELDS,
  },
  cta_band: {
    id: "cta_band",
    label: "CTA band",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea", optional: true },
      { key: "primary_label", label: "Primary button", type: "text" },
      { key: "primary_href", label: "Primary URL", type: "url" },
      { key: "secondary_label", label: "Secondary button", type: "text", optional: true },
      { key: "secondary_href", label: "Secondary URL", type: "url", optional: true },
    ],
  },
  home_hero: {
    id: "home_hero",
    label: "Home hero",
    fields: [
      { key: "announcement", label: "Announcement pill", type: "text", optional: true },
      { key: "headline", label: "Headline", type: "textarea" },
      { key: "headline_emphasis", label: "Headline emphasis (muted span)", type: "text", optional: true },
      { key: "subtitle", label: "Subtitle", type: "textarea", optional: true },
      { key: "primary_label", label: "Primary CTA", type: "text" },
      { key: "primary_href", label: "Primary URL", type: "url" },
      { key: "secondary_label", label: "Secondary CTA", type: "text", optional: true },
      { key: "secondary_href", label: "Secondary URL", type: "url", optional: true },
      { key: "footnote", label: "Footnote under CTAs", type: "text", optional: true },
    ],
  },
  home_hero_preview: {
    id: "home_hero_preview",
    label: "Hero preview card",
    fields: [
      { key: "eyebrow", label: "Card eyebrow", type: "text", optional: true },
      { key: "title", label: "Card title", type: "textarea" },
    ],
    lists: [
      {
        key: "bullets",
        label: "Bullet lines",
        itemFields: [{ key: "text", label: "Line", type: "text" }],
      },
      {
        key: "metrics",
        label: "Metric tiles",
        itemFields: [
          { key: "value", label: "Value", type: "text" },
          { key: "label", label: "Label", type: "text" },
        ],
        minItems: 0,
      },
    ],
  },
  home_trust: {
    id: "home_trust",
    label: "Trust bar",
    fields: [{ key: "label", label: "Label above logos", type: "text", optional: true }],
    list: {
      key: "stats",
      label: "Stat counters",
      itemFields: [
        { key: "value", label: "Value", type: "text" },
        { key: "label", label: "Label", type: "text" },
      ],
      minItems: 0,
    },
  },
  stat_grid: {
    id: "stat_grid",
    label: "Stats",
    list: {
      key: "stats",
      label: "Stat counters",
      itemFields: [
        { key: "value", label: "Value", type: "text" },
        { key: "label", label: "Label", type: "text" },
      ],
      minItems: 0,
    },
  },
  text_block: {
    id: "text_block",
    label: "Text block",
    fields: [
      { key: "title", label: "Title", type: "text", optional: true },
      { key: "body", label: "Body", type: "textarea", optional: true },
    ],
  },
  item_list: {
    id: "item_list",
    label: "Item list",
    list: {
      key: "items",
      label: "Items",
      itemFields: [{ key: "text", label: "Text", type: "text" }],
      minItems: 0,
    },
  },
  faq_list: {
    id: "faq_list",
    label: "FAQ list",
    list: {
      key: "faqs",
      label: "Questions",
      itemFields: [
        { key: "q", label: "Question", type: "text" },
        { key: "a", label: "Answer", type: "textarea" },
      ],
      minItems: 0,
    },
  },
  contact_sidebar: {
    id: "contact_sidebar",
    label: "Contact sidebar",
    fields: [
      { key: "contact_title", label: "Contact card title", type: "text" },
      { key: "locations", label: "Locations line", type: "text", optional: true },
      { key: "booking_title", label: "Booking card title", type: "text" },
      { key: "booking_body", label: "Booking card body", type: "textarea", optional: true },
      { key: "booking_cta", label: "Booking CTA label", type: "text" },
    ],
  },
  confirmation: {
    id: "confirmation",
    label: "Confirmation",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea", optional: true },
    ],
  },
  card_list: {
    id: "card_list",
    label: "Card grid",
    fields: SECTION_HEADING_FIELDS,
    list: {
      key: "items",
      label: "Cards",
      itemFields: [
        { key: "title", label: "Title", type: "text" },
        { key: "body", label: "Body", type: "textarea" },
      ],
      minItems: 0,
    },
  },
  icon_card_list: {
    id: "icon_card_list",
    label: "Icon card grid",
    fields: SECTION_HEADING_FIELDS,
    list: {
      key: "items",
      label: "Cards",
      itemFields: [
        { key: "icon_key", label: "Icon key", type: "text", hint: "clock, shield, dollar, sparkles, users, layers, workflow" },
        { key: "title", label: "Title", type: "text" },
        { key: "body", label: "Body", type: "textarea" },
      ],
      minItems: 0,
    },
  },
  location_list: {
    id: "location_list",
    label: "Locations",
    fields: SECTION_HEADING_FIELDS,
    list: {
      key: "items",
      label: "Locations",
      itemFields: [
        { key: "city", label: "City", type: "text" },
        { key: "country", label: "Country / detail", type: "text" },
      ],
      minItems: 0,
    },
  },
  partner_group_list: {
    id: "partner_group_list",
    label: "Partner groups",
    list: {
      key: "items",
      label: "Groups",
      itemFields: [
        { key: "tier", label: "Tier label", type: "text" },
        { key: "names", label: "Partner names", type: "textarea", hint: "One name per line" },
      ],
      minItems: 0,
    },
  },
  phase_card_list: {
    id: "phase_card_list",
    label: "Phase cards",
    fields: SECTION_HEADING_FIELDS,
    list: {
      key: "items",
      label: "Phases",
      itemFields: [
        { key: "phase", label: "Phase label", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "body", label: "Body", type: "textarea" },
      ],
      minItems: 0,
    },
  },
  checklist: {
    id: "checklist",
    label: "Checklist",
    fields: SECTION_HEADING_FIELDS,
    list: {
      key: "items",
      label: "Items",
      itemFields: [{ key: "text", label: "Line", type: "text" }],
      minItems: 0,
    },
  },
  pricing_tiers_rich: {
    id: "pricing_tiers_rich",
    label: "Pricing tiers",
    fields: SECTION_HEADING_FIELDS,
    list: {
      key: "tiers",
      label: "Tiers",
      itemFields: [
        { key: "name", label: "Name", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "price", label: "Price", type: "text" },
        { key: "cadence", label: "Cadence", type: "text" },
        { key: "features", label: "Features", type: "textarea", hint: "One feature per line" },
        { key: "cta_label", label: "CTA label", type: "text" },
        { key: "cta_href", label: "CTA URL", type: "url" },
        { key: "featured", label: "Featured (true/false)", type: "text", optional: true },
        { key: "badge", label: "Badge", type: "text", optional: true },
      ],
      minItems: 0,
    },
  },
  newsletter_block: {
    id: "newsletter_block",
    label: "Newsletter",
    fields: [{ key: "blurb", label: "Blurb", type: "textarea", optional: true }],
  },
  event_card_list: {
    id: "event_card_list",
    label: "Events",
    list: {
      key: "items",
      label: "Events",
      itemFields: [
        { key: "date", label: "Date", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "type", label: "Type", type: "text" },
        { key: "spots", label: "Spots / location", type: "text" },
      ],
      minItems: 0,
    },
  },
  numbered_steps: {
    id: "numbered_steps",
    label: "Numbered steps",
    fields: [
      ...SECTION_HEADING_FIELDS,
      { key: "link_label", label: "Link label", type: "text", optional: true },
      { key: "link_href", label: "Link URL", type: "url", optional: true },
    ],
    list: {
      key: "items",
      label: "Steps",
      itemFields: [
        { key: "step", label: "Step number", type: "text", hint: "e.g. 01" },
        { key: "title", label: "Title", type: "text" },
        { key: "body", label: "Body", type: "textarea" },
      ],
      minItems: 0,
    },
  },
  site_header: {
    id: "site_header",
    label: "Site header",
    fields: [
      { key: "brand_name", label: "Brand name", type: "text" },
      { key: "logo_abbr", label: "Logo abbreviation", type: "text", hint: "Shown in the circle mark" },
      { key: "contact_label", label: "Contact button", type: "text" },
      { key: "contact_href", label: "Contact URL", type: "url" },
      { key: "book_label", label: "Book button", type: "text" },
      { key: "book_href", label: "Book URL", type: "url" },
    ],
    lists: [
      {
        key: "nav_items",
        label: "Primary navigation",
        itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "URL", type: "url" },
          {
            key: "mega_menu",
            label: "Mega menu",
            type: "text",
            hint: "none, services, industries, or company",
          },
        ],
        minItems: 1,
      },
      {
        key: "company_links",
        label: "Company submenu (when mega menu = company)",
        itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "URL", type: "url" },
          { key: "description", label: "Description", type: "textarea", optional: true },
        ],
        minItems: 0,
      },
    ],
  },
  footer_nav: {
    id: "footer_nav",
    label: "Footer navigation",
    lists: [
      {
        key: "solutions_links",
        label: "Solutions column",
        itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "URL", type: "url" },
        ],
        minItems: 0,
      },
      {
        key: "who_we_serve_links",
        label: "Who we serve column",
        itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "URL", type: "url" },
        ],
        minItems: 0,
      },
      {
        key: "company_links",
        label: "Company column",
        itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "URL", type: "url" },
        ],
        minItems: 0,
      },
      {
        key: "resources_links",
        label: "Resources column",
        itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "URL", type: "url" },
        ],
        minItems: 0,
      },
      {
        key: "legal_links",
        label: "Legal column",
        itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "URL", type: "url" },
        ],
        minItems: 0,
      },
    ],
  },
};

/** Explicit overrides; otherwise inferred from section id. */
export const SECTION_SCHEMA_MAP: Partial<Record<string, Partial<Record<string, ContentSchemaId>>>> = {
  global: {
    header: "site_header",
    footer: "footer_nav",
    footer_newsletter: "newsletter_block",
  },
  home: {
    hero: "home_hero",
    hero_preview_card: "home_hero_preview",
    trust: "home_trust",
    services: "section_heading",
    features: "icon_card_list",
    process: "numbered_steps",
    portfolio: "section_heading",
    testimonials: "section_heading",
    pricing: "pricing_tiers_rich",
  },
  contact: {
    hero: "page_hero",
    sidebar_contact: "contact_sidebar",
    sidebar_booking: "none",
  },
  faq: {
    faq_list: "faq_list",
  },
  thank_you: {
    confirmation: "confirmation",
    next_steps: "text_block",
  },
  about: {
    values: "card_list",
    locations: "location_list",
  },
  about_partners: {
    partners_grid: "partner_group_list",
  },
  for_smb: {
    benefits: "icon_card_list",
    package: "checklist",
  },
  for_enterprise: {
    pillars: "icon_card_list",
    governance: "phase_card_list",
  },
  how_we_work: {
    operating_standards: "card_list",
    process: "numbered_steps",
  },
  how_we_work_methodology: {
    cadence: "numbered_steps",
    frameworks: "card_list",
    decision_speed: "text_block",
  },
  how_we_work_engagement_models: {
    models: "pricing_tiers_rich",
  },
  book_consultation: {
    expectations: "text_block",
  },
  insights_events: {
    events_list: "event_card_list",
  },
  legal_detail: {
    document_body: "text_block",
  },
};

export function resolveSectionSchemaId(pageId: string, sectionId: string): ContentSchemaId {
  const explicit = SECTION_SCHEMA_MAP[pageId]?.[sectionId];
  if (explicit) return explicit;

  if (sectionId === "cta_band") return "cta_band";
  if (sectionId === "hero") return "page_hero";
  if (sectionId === "footer_newsletter") return "newsletter_block";
  if (
    sectionId === "breadcrumbs" ||
    sectionId === "page_view_logger" ||
    sectionId === "smooth_scroll"
  ) {
    return "none";
  }
  if (
    sectionId.endsWith("_grid") ||
    sectionId === "grid" ||
    sectionId === "posts_grid" ||
    sectionId === "featured_post" ||
    sectionId === "guides_teaser" ||
    sectionId === "roles_list" ||
    sectionId === "process" ||
    sectionId === "metrics" ||
    sectionId === "story" ||
    sectionId === "related" ||
    sectionId === "related_work" ||
    sectionId === "services_involved" ||
    sectionId === "form"
  ) {
    if (sectionId === "metrics") return "stat_grid";
    if (sectionId === "form") return "none";
    return "section_heading";
  }
  if (sectionId === "proof") return "section_heading";

  return "none";
}

export function getContentSchema(pageId: string, sectionId: string): ContentSchema {
  const id = resolveSectionSchemaId(pageId, sectionId);
  return CONTENT_SCHEMAS[id];
}
