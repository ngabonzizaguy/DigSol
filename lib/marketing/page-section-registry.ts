/**
 * Canonical registry of marketing pages and toggleable sections.
 * Used by the admin Page Sections UI and (later) public marketing routes.
 */

export type PageSectionDef = {
  id: string;
  label: string;
  description: string;
  defaultEnabled?: boolean;
};

export type MarketingPageDef = {
  id: string;
  label: string;
  path: string;
  group: string;
  sections: PageSectionDef[];
};

function ctaBand(description = "Bottom call-to-action strip with primary and secondary links."): PageSectionDef[] {
  return [s("cta_band", "CTA band", description)];
}

const s = (
  id: string,
  label: string,
  description: string,
  defaultEnabled = true,
): PageSectionDef => ({ id, label, description, defaultEnabled });

const hero = (extra?: PageSectionDef[]) => [
  s("hero", "Page hero", "Eyebrow, headline, subtitle, and primary actions."),
  ...(extra ?? []),
];

const crumbs = () => [s("breadcrumbs", "Breadcrumbs", "Navigation trail below the hero.")];

/** Shared section sets for detail / hub templates */
const solutionDetailSections: PageSectionDef[] = [
  ...hero(),
  ...crumbs(),
  s("overview", "Service overview", "Long description, outcomes, and deliverables."),
  s("capabilities", "Capabilities", "Capability tags and technical scope."),
  s("related_work", "Related case studies", "Linked work examples for this service."),
  ...ctaBand(),
];

const industryDetailSections: PageSectionDef[] = [
  ...hero(),
  ...crumbs(),
  s("challenges", "Industry challenges", "Challenge list for this vertical."),
  s("solutions", "Our solutions", "How DigSolutions addresses the vertical."),
  s("related_work", "Related case studies", "Case studies in this industry."),
  ...ctaBand(),
];

const caseStudyDetailSections: PageSectionDef[] = [
  s("hero", "Case study hero", "Client, title, summary, and segment badges."),
  ...crumbs(),
  s("metrics", "Key metrics", "Highlighted outcome metrics."),
  s("story", "Challenge / approach / outcome", "Three-column narrative."),
  s("services_involved", "Services involved", "Links to related solution pillars."),
  ...ctaBand(),
];

const insightDetailSections: PageSectionDef[] = [
  s("hero", "Article hero", "Category, title, author, and publish metadata."),
  ...crumbs(),
  s("body", "Article body", "Main essay content."),
  s("related", "Related posts", "Suggested further reading."),
  ...ctaBand(),
];

const careerDetailSections: PageSectionDef[] = [
  ...hero(),
  ...crumbs(),
  s("description", "Role description", "Responsibilities and requirements."),
  s("apply_cta", "Apply CTA", "Application call-to-action."),
  ...ctaBand(),
];

export const MARKETING_PAGE_GROUPS = [
  "Global",
  "Home",
  "Solutions",
  "Industries",
  "Work",
  "Insights",
  "About",
  "How we work",
  "Audience",
  "Conversion",
  "Legal",
] as const;

export const MARKETING_PAGE_REGISTRY: MarketingPageDef[] = [
  {
    id: "global",
    label: "Global chrome",
    path: "(all pages)",
    group: "Global",
    sections: [
      s("header", "Site header", "Logo, primary navigation, and book CTA."),
      s("footer", "Site footer", "Footer columns, social links, and copyright."),
      s("footer_newsletter", "Footer newsletter", "Email capture in the footer."),
      s("page_view_logger", "Analytics beacon", "Client-side page view tracking (invisible)."),
      s("smooth_scroll", "Smooth scroll", "Lenis smooth-scroll wrapper."),
    ],
  },
  {
    id: "home",
    label: "Homepage",
    path: "/",
    group: "Home",
    sections: [
      s("hero", "Hero", "Main headline, CTAs, and announcement pill."),
      s(
        "hero_preview_card",
        "Hero preview card",
        "Floating engagement preview card with metrics (example section you mentioned).",
      ),
      s("trust", "Trust bar", "Logo marquee and stat counters."),
      s("services", "Services grid", "Solution pillar cards."),
      s("features", "Differentiators", "Why DigSolutions feature grid."),
      s("process", "Process", "Five-stage methodology stepper."),
      s("portfolio", "Selected work", "Featured case study cards."),
      s("testimonials", "Testimonials", "Client quote carousel."),
      s("pricing", "Engagement models / pricing", "Pricing tier cards."),
      ...ctaBand(),
    ],
  },
  {
    id: "solutions",
    label: "Solutions hub",
    path: "/solutions",
    group: "Solutions",
    sections: [...hero(), s("grid", "Solutions grid", "All service pillar cards."), ...ctaBand()],
  },
  {
    id: "solutions_detail",
    label: "Solution detail",
    path: "/solutions/[slug]",
    group: "Solutions",
    sections: solutionDetailSections,
  },
  {
    id: "industries",
    label: "Industries hub",
    path: "/industries",
    group: "Industries",
    sections: [...hero(), s("grid", "Industries grid", "Vertical cards."), ...ctaBand()],
  },
  {
    id: "industries_detail",
    label: "Industry detail",
    path: "/industries/[slug]",
    group: "Industries",
    sections: industryDetailSections,
  },
  {
    id: "work",
    label: "Work hub",
    path: "/work",
    group: "Work",
    sections: [...hero(), s("grid", "Case studies grid", "Portfolio listing."), ...ctaBand()],
  },
  {
    id: "work_detail",
    label: "Case study detail",
    path: "/work/[slug]",
    group: "Work",
    sections: caseStudyDetailSections,
  },
  {
    id: "insights",
    label: "Insights hub",
    path: "/insights",
    group: "Insights",
    sections: [
      ...hero(),
      ...crumbs(),
      s("featured_post", "Featured article", "Large featured insight card."),
      s("posts_grid", "Articles grid", "Remaining insight cards."),
      s("guides_teaser", "Guides teaser", "Guide download cards with link to guides hub."),
      ...ctaBand(),
    ],
  },
  {
    id: "insights_blog",
    label: "Blog listing",
    path: "/insights/blog",
    group: "Insights",
    sections: [...hero(), ...crumbs(), s("posts_grid", "Articles grid", "Blog post cards."), ...ctaBand()],
  },
  {
    id: "insights_guides",
    label: "Guides hub",
    path: "/insights/guides",
    group: "Insights",
    sections: [...hero(), ...crumbs(), s("guides_grid", "Guides grid", "Downloadable guide cards."), ...ctaBand()],
  },
  {
    id: "insights_events",
    label: "Events",
    path: "/insights/events",
    group: "Insights",
    sections: [...hero(), ...crumbs(), s("events_list", "Events list", "Upcoming and past events."), ...ctaBand()],
  },
  {
    id: "insights_detail",
    label: "Insight article",
    path: "/insights/[slug]",
    group: "Insights",
    sections: insightDetailSections,
  },
  {
    id: "about",
    label: "About",
    path: "/about",
    group: "About",
    sections: [
      ...hero(),
      ...crumbs(),
      s("values", "Values", "Four belief cards."),
      s("locations", "Locations", "Office / distributed locations."),
      ...ctaBand("Bottom CTA: Want to know more?"),
    ],
  },
  {
    id: "about_leadership",
    label: "Leadership",
    path: "/about/leadership",
    group: "About",
    sections: [...hero(), ...crumbs(), s("team_grid", "Leadership grid", "Team member cards."), ...ctaBand()],
  },
  {
    id: "about_careers",
    label: "Careers hub",
    path: "/about/careers",
    group: "About",
    sections: [...hero(), ...crumbs(), s("roles_list", "Open roles", "Job listing cards."), ...ctaBand()],
  },
  {
    id: "about_careers_detail",
    label: "Role detail",
    path: "/about/careers/[slug]",
    group: "About",
    sections: careerDetailSections,
  },
  {
    id: "about_partners",
    label: "Partners",
    path: "/about/partners",
    group: "About",
    sections: [...hero(), ...crumbs(), s("partners_grid", "Partner logos", "Partner and ecosystem grid."), ...ctaBand()],
  },
  {
    id: "how_we_work",
    label: "How we work hub",
    path: "/how-we-work",
    group: "How we work",
    sections: [
      ...hero(),
      ...crumbs(),
      s("process", "Process stepper", "Five-stage method visualization."),
      s("operating_standards", "Operating standards", "Six standard cards."),
      ...ctaBand(),
    ],
  },
  {
    id: "how_we_work_methodology",
    label: "Methodology",
    path: "/how-we-work/methodology",
    group: "How we work",
    sections: [
      ...hero(),
      ...crumbs(),
      s("cadence", "Cadence", "Five stages / sprint cadence section."),
      s("frameworks", "Frameworks", "Toolkit frameworks grid."),
      s("decision_speed", "Decision speed", "Closing narrative block."),
      ...ctaBand(),
    ],
  },
  {
    id: "how_we_work_engagement_models",
    label: "Engagement models",
    path: "/how-we-work/engagement-models",
    group: "How we work",
    sections: [...hero(), ...crumbs(), s("models", "Engagement models", "Launch / Growth / Enterprise model cards."), ...ctaBand()],
  },
  {
    id: "how_we_work_security",
    label: "Security & compliance",
    path: "/how-we-work/security-compliance",
    group: "How we work",
    sections: [...hero(), ...crumbs(), s("practices", "Security practices", "Compliance and security content."), ...ctaBand()],
  },
  {
    id: "for_smb",
    label: "For SMB",
    path: "/for-smb",
    group: "Audience",
    sections: [
      ...hero(),
      s("benefits", "Benefits", "Three SMB benefit cards."),
      s("package", "Launch package", "What you get checklist."),
      s("proof", "SMB case studies", "Filtered case study cards."),
      ...ctaBand(),
    ],
  },
  {
    id: "for_enterprise",
    label: "For enterprise",
    path: "/for-enterprise",
    group: "Audience",
    sections: [
      ...hero(),
      s("pillars", "Enterprise pillars", "Program pillar cards."),
      s("proof", "Enterprise case studies", "Filtered case study cards."),
      s("governance", "Governance", "Security and governance narrative."),
      ...ctaBand(),
    ],
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    group: "Conversion",
    sections: [
      ...hero(),
      s("form", "Contact form", "Lead capture form."),
      s("sidebar_contact", "Contact sidebar", "Email, phone, and locations."),
      s("sidebar_booking", "Book consultation promo", "Secondary CTA card."),
    ],
  },
  {
    id: "book_consultation",
    label: "Book consultation",
    path: "/book-consultation",
    group: "Conversion",
    sections: [...hero(), s("form", "Consultation form", "Booking intake form."), s("expectations", "What to expect", "Sidebar expectations copy.")],
  },
  {
    id: "start",
    label: "Quick Start",
    path: "/start",
    group: "Conversion",
    sections: [
      ...hero(),
      s("flow", "Quick Start flow", "Multi-step intent capture (modal + page variant)."),
      s("sidebar", "Sidebar reassurance", "What happens next, expected response time."),
    ],
  },
  {
    id: "faq",
    label: "FAQ",
    path: "/faq",
    group: "Conversion",
    sections: [...hero(), ...crumbs(), s("faq_list", "FAQ accordion", "Question and answer list."), ...ctaBand()],
  },
  {
    id: "thank_you",
    label: "Thank you",
    path: "/thank-you",
    group: "Conversion",
    sections: [s("confirmation", "Confirmation message", "Post-submit thank-you content."), s("next_steps", "Next steps", "Links to insights or home.")],
  },
  {
    id: "legal_detail",
    label: "Legal document",
    path: "/legal/[doc]",
    group: "Legal",
    sections: [...hero(), ...crumbs(), s("document_body", "Legal content", "Policy sections and copy."), ...ctaBand()],
  },
];

export function getMarketingPageById(pageId: string): MarketingPageDef | undefined {
  return MARKETING_PAGE_REGISTRY.find((p) => p.id === pageId);
}

export function buildDefaultPageSectionVisibility(): Record<string, Record<string, boolean>> {
  const out: Record<string, Record<string, boolean>> = {};
  for (const page of MARKETING_PAGE_REGISTRY) {
    out[page.id] = {};
    for (const section of page.sections) {
      out[page.id][section.id] = section.defaultEnabled !== false;
    }
  }
  return out;
}
