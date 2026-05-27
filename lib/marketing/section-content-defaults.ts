import { pricingTiers } from "@/components/marketing/pricing-card";
import { stats } from "@/lib/site";
import type { ContentSchemaId } from "@/lib/marketing/section-content-schemas";
import { MARKETING_PAGE_REGISTRY } from "@/lib/marketing/page-section-registry";
import { resolveSectionSchemaId } from "@/lib/marketing/section-content-schemas";

export type SectionContentValue = Record<string, unknown>;

export type PageSectionContentMap = Record<string, Record<string, SectionContentValue>>;

/** Per-page hero defaults (marketing copy currently in route files). */
const PAGE_HERO_DEFAULTS: Record<string, SectionContentValue> = {
  solutions: {
    eyebrow: "Solutions",
    title: "Eight pillars. One accountable partner.",
    subtitle:
      "Pick the pillars that move the needle for your business — or partner with us on the whole transformation. Every engagement is shaped around outcomes, not deliverable lists.",
  },
  industries: {
    eyebrow: "Industries",
    title: "Vertical expertise without vertical theatre.",
    subtitle: "We bring patterns from regulated, operational, and consumer businesses — adapted to your context.",
  },
  work: {
    eyebrow: "Work",
    title: "Outcomes we can stand behind.",
    subtitle: "Case studies across SMB, mid-market, and enterprise — with metrics, not marketing fluff.",
  },
  insights: {
    eyebrow: "Insights",
    title: "Field notes from real engagements.",
    subtitle: "Essays, guides, and operating-model frameworks from the team. We publish what we'd want to read.",
  },
  about: {
    eyebrow: "About",
    title: "A small, senior team. A clear way of working.",
    subtitle:
      "We started DigSolutions because we wanted the discipline of top-tier consulting and the velocity of a product team, with none of the politics.",
  },
  how_we_work: {
    eyebrow: "How we work",
    title: "A method you can audit.",
    subtitle: "Five stages, two-week cadence, weekly demos. Everything we ship is observable, documented, and handed over with care.",
    primary_label: "Methodology",
    primary_href: "/how-we-work/methodology",
    secondary_label: "Engagement models",
    secondary_href: "/how-we-work/engagement-models",
  },
  contact: {
    eyebrow: "Contact",
    title: "Tell us what you're trying to build.",
    subtitle: "We respond to every message within one business day.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Straight answers.",
    subtitle: "No pitch deck required. Here is how we work with teams of different sizes.",
  },
  for_smb: {
    eyebrow: "For small businesses",
    title: "Credible, fast, affordable — without dropping your standards.",
    subtitle:
      "If you have a real business and an outdated website, we can have you live, instrumented, and converting within eight weeks.",
    primary_label: "Start your project",
    primary_href: "/book-consultation?intent=smb",
    secondary_label: "See SMB case studies",
    secondary_href: "/work",
  },
  for_enterprise: {
    eyebrow: "For enterprise",
    title: "Transformation at portfolio scale.",
    subtitle: "Multi-workstream programs with governance, security, and measurable outcomes.",
    primary_label: "Request enterprise briefing",
    primary_href: "/contact?intent=enterprise",
    secondary_label: "Read methodology",
    secondary_href: "/how-we-work/methodology",
  },
  book_consultation: {
    eyebrow: "Book consultation",
    title: "A focused 30 minutes.",
    subtitle: "Walk away with three concrete next steps — whether or not we work together.",
  },
  about_partners: {
    eyebrow: "Partners",
    title: "Technology and alliance partners.",
    subtitle: "We build on best-in-class platforms and maintain relationships that benefit our clients.",
  },
  how_we_work_methodology: {
    eyebrow: "Methodology",
    title: "How we deliver — in detail.",
    subtitle: "Frameworks, cadence, and quality bars we apply on every engagement.",
  },
  how_we_work_engagement_models: {
    eyebrow: "Engagement models",
    title: "How we structure projects, retainers, and enterprise programs.",
    subtitle: "Clear starting prices. Custom scoping. Every engagement begins with a free consultation.",
  },
  insights_events: {
    eyebrow: "Events",
    title: "Webinars, briefings, and meetups.",
    subtitle: "Practical sessions from practitioners — not vendor theatre.",
  },
  thank_you: {
    eyebrow: "Thank you",
    title: "Message received",
    subtitle: "",
  },
  legal_detail: {
    eyebrow: "Legal",
    title: "Policies and terms",
    subtitle: "",
  },
};

const PRICING_TIERS_RICH_DEFAULT = {
  tiers: pricingTiers.map((t) => ({
    name: t.name,
    description: t.description,
    price: t.price,
    cadence: t.cadence,
    features: t.features.join("\n"),
    cta_label: t.ctaLabel,
    cta_href: t.ctaHref,
    featured: t.featured ? "true" : "",
    badge: t.badge ?? "",
  })),
};

const ABOUT_VALUES_DEFAULT = {
  eyebrow: "What we believe",
  title: "Principles we won't compromise on.",
  items: [
    { title: "Outcomes over output", body: "We measure ourselves on what changed in the business, not how many decks shipped." },
    { title: "Quiet craft", body: "We avoid hype. We build calm, durable systems and write down what we learn." },
    { title: "Accountability", body: "One team, one lead, one Slack channel. You always know who owns what." },
    { title: "Plain language", body: "If we can't explain it to your COO in two minutes, we don't ship it." },
  ],
};

const ABOUT_LOCATIONS_DEFAULT = {
  eyebrow: "Where we are",
  title: "Distributed by design.",
  items: [
    { city: "Kigali", country: "Rwanda" },
    { city: "London", country: "United Kingdom" },
    { city: "Remote", country: "Distributed across 4 continents" },
  ],
};

const PARTNERS_GRID_DEFAULT = {
  items: [
    { tier: "Platform partners", names: "Vercel\nAWS\nStripe\nSupabase\nHubSpot\nShopify" },
    { tier: "Technology partners", names: "OpenAI\nAnthropic\nCloudflare\nPostHog\nSanity\nResend" },
    { tier: "Ecosystem & alliances", names: "Local chambers of commerce\nAccounting partner network\nStartup accelerators" },
  ],
};

const FOR_SMB_BENEFITS_DEFAULT = {
  items: [
    { icon_key: "clock", title: "4–8 week launch", body: "Ship a credible website, brand, and analytics stack within a quarter." },
    { icon_key: "dollar", title: "Transparent pricing", body: "Fixed-scope projects starting at $4,900. No hidden hours." },
    { icon_key: "sparkles", title: "Tech we handle", body: "We host, monitor, and maintain — so you can keep selling." },
  ],
};

const FOR_SMB_PACKAGE_DEFAULT = {
  eyebrow: "Launch package",
  title: "What you get in eight weeks.",
  items: [
    { text: "Strategic kickoff and outcome definition" },
    { text: "Brand refresh (logo, palette, type)" },
    { text: "8-page Next.js marketing site" },
    { text: "Stripe payments / commerce setup if needed" },
    { text: "GA4 + PostHog analytics and SEO foundations" },
    { text: "Hosting on Vercel + ongoing maintenance retainer (optional)" },
    { text: "Training, handover, and 30 days of post-launch support" },
    { text: "Roadmap for the next two quarters" },
  ],
};

const FOR_ENTERPRISE_PILLARS_DEFAULT = {
  eyebrow: "Enterprise pillars",
  title: "How we run portfolio-scale programs.",
  items: [
    { icon_key: "shield", title: "Governed delivery", body: "Steering committees, change advisory, security gates, and audit-ready documentation." },
    { icon_key: "users", title: "Dedicated squads", body: "Pods of 4–8 specialists per workstream — design, engineering, data, AI, change." },
    { icon_key: "layers", title: "Multi-workstream", body: "Run brand, product, data, automation, and migration tracks in parallel without losing coherence." },
    { icon_key: "workflow", title: "Change adoption", body: "Communications, training, and enablement baked in — not bolted on at the end." },
  ],
};

const FOR_ENTERPRISE_GOVERNANCE_DEFAULT = {
  eyebrow: "Governance",
  title: "A typical enterprise arc.",
  items: [
    {
      phase: "Months 0–3",
      title: "Diagnose & roadmap",
      body: "Workshops, audits, current-state architecture, target-state, prioritised roadmap.",
    },
    {
      phase: "Months 3–9",
      title: "Build & migrate",
      body: "Parallel workstreams ship in two-week increments. Shadow infrastructure and phased cutover.",
    },
    {
      phase: "Months 9–12+",
      title: "Operate & optimise",
      body: "Steady-state managed services, experimentation, adoption metrics, executive review cadence.",
    },
  ],
};

const OPERATING_STANDARDS_DEFAULT = {
  eyebrow: "Operating standards",
  title: "Non-negotiables on every engagement.",
  items: [
    { title: "Weekly demos", body: "Working software every Friday. No slides, no theatre." },
    { title: "Public tracking", body: "Single shared roadmap, daily Slack, real-time progress." },
    { title: "Production-only", body: "We ship behind feature flags, never to a staging-only dead-end." },
    { title: "Owned by humans", body: "Every deliverable has a named senior owner." },
    { title: "Documented", body: "Every system we hand over has a runbook and a diagram." },
    { title: "Audit-ready", body: "Compliance and security are gates, not afterthoughts." },
  ],
};

const PROCESS_STEPS_DEFAULT: SectionContentValue = {
  items: [
    {
      step: "01",
      title: "Discover",
      body: "Workshops, audits, stakeholder interviews. We map your current state and quantify the opportunity.",
    },
    {
      step: "02",
      title: "Design",
      body: "Strategy, architecture, brand, and product surfaces. Everything moves to a single design language.",
    },
    {
      step: "03",
      title: "Build",
      body: "Cross-functional squad ships in two-week increments. You see working software every Friday.",
    },
    {
      step: "04",
      title: "Launch",
      body: "Cutover plans, comms, training, instrumentation. We obsess over the first 30 days in production.",
    },
    {
      step: "05",
      title: "Optimise",
      body: "Monthly experimentation, performance, and roadmap reviews. Continuous, measurable improvement.",
    },
  ],
};

const METHODOLOGY_CADENCE_DEFAULT = {
  eyebrow: "Cadence",
  title: "Five stages. Two-week sprints. Weekly demos.",
  subtitle: "Each stage produces a tangible artefact your team can review and act on.",
  ...PROCESS_STEPS_DEFAULT,
};

const METHODOLOGY_FRAMEWORKS_DEFAULT = {
  eyebrow: "Frameworks",
  title: "Tools we actually use.",
  items: [
    { title: "Digital maturity audit", body: "A 12-dimension scorecard used in the first week of every engagement." },
    { title: "Outcome trees", body: "We map every initiative to a business outcome and a single accountable owner." },
    { title: "Domain-driven design", body: "Bounded contexts, ubiquitous language, event-storming for enterprise data work." },
    { title: "Evaluation-first AI", body: "Every AI workflow ships with a written eval set and a monitoring plan." },
    { title: "Design tokens & systems", body: "Token-first design libraries that survive engineering handoff." },
    { title: "Friday demos", body: "Every Friday: working software, decisions made, decisions needed." },
  ],
};

const METHODOLOGY_DECISION_SPEED_DEFAULT = {
  title: "A note on velocity.",
  body: "The single biggest predictor of engagement success is the speed of the first decision. We aim to make the first material decision within seven business days — not seventy.",
};

const BOOK_EXPECTATIONS_DEFAULT = {
  title: "What to expect.",
  body: "30-minute video call\nScheduled within 5 business days\nThree concrete takeaways — every time\nNo follow-up unless you ask\n\nWe don't take every call — we screen for fit. If we're not the right partner, we'll say so and point you somewhere better.",
};

const EVENTS_LIST_DEFAULT = {
  items: [
    { date: "Jun 12, 2026", title: "AI agents in production — the operating model", type: "Webinar", spots: "Free" },
    { date: "Jul 03, 2026", title: "Executive briefing: regional digital transformation", type: "Briefing", spots: "Invite only" },
    { date: "Aug 21, 2026", title: "Designing B2B products that feel consumer-grade", type: "Meetup", spots: "Kigali" },
  ],
};

const THANK_YOU_CONFIRMATION_DEFAULT = {
  title: "Thanks — we'll be in touch.",
  body: "We respond to every message within one business day. While you wait, you might enjoy our latest field notes.",
};

const THANK_YOU_NEXT_STEPS_DEFAULT = {
  title: "",
  body: "",
};

const FAQ_DEFAULTS = {
  faqs: [
    {
      q: "What size companies do you work with?",
      a: "Everything from 5-person businesses to 5,000-person enterprises. Our engagement models scale from fixed-scope Launch projects through multi-quarter Enterprise programs.",
    },
    {
      q: "How long does a typical project take?",
      a: "SMB projects run 4–8 weeks. Mid-market engagements are typically 3–6 months. Enterprise programs run 6–24 months in coordinated workstreams.",
    },
    {
      q: "Do you work on retainer?",
      a: "Yes — most clients stay on a retainer after launch for ongoing optimisation, hosting, and net-new work. Retainers start at $4,900/month.",
    },
    {
      q: "Can you sign NDAs and MSAs?",
      a: "Absolutely. We sign mutual NDAs before any technical discussion, and we work under client MSAs as well as our own.",
    },
    {
      q: "Where is your team based?",
      a: "We're a distributed team headquartered in Kigali with operations in London. The team covers four continents.",
    },
    {
      q: "Do you guarantee outcomes?",
      a: "We guarantee process and craft. We can't guarantee market outcomes, but we'll commit to measurable milestones and we share progress weekly.",
    },
    {
      q: "Will senior people actually work on my project?",
      a: "Yes. The people listed on our Leadership page are on every engagement by design. No bait-and-switch.",
    },
    {
      q: "What's your stance on AI?",
      a: "Tasteful and useful. Every engagement ships at least one production AI workflow, monitored like any other piece of software. We're allergic to AI theatre.",
    },
  ],
};

const CONTACT_SIDEBAR_DEFAULTS = {
  contact_title: "Other ways to reach us.",
  locations: "Kigali · London · Remote",
  booking_title: "Prefer a call?",
  booking_body:
    "Book a free 30-minute consultation with no pitch deck and three concrete takeaways.",
  booking_cta: "Book consultation",
};

const HOME_FEATURES_DEFAULT: SectionContentValue = {
  eyebrow: "Why DigSolutions",
  title: "Premium agency breadth with SaaS-grade client experience.",
  subtitle:
    "We took the parts of consulting, agencies, and product teams that work — and dropped the parts that don't.",
  items: [
    {
      icon_key: "boxes",
      title: "Unified delivery",
      body: "Strategy, design, engineering, growth — one team, one Slack channel, one accountable lead. No vendor relay race.",
    },
    {
      icon_key: "sparkles",
      title: "AI-native by default",
      body: "Every engagement ships at least one production AI workflow. We treat AI as boring software with monitoring, not a demo.",
    },
    {
      icon_key: "layout-dashboard",
      title: "A real client portal",
      body: "Project status, deliverables, invoices, analytics — in one place. Coming Q3. Built on the same stack we sell.",
    },
    {
      icon_key: "line-chart",
      title: "Ongoing optimisation",
      body: "Most agencies leave after launch. We stay — measuring, experimenting, and shipping monthly improvements.",
    },
  ],
};

const TRUST_PARTNERS_DEFAULT = [
  { name: "Northwind" },
  { name: "Meridian Financial" },
  { name: "Cedar Health" },
  { name: "Forge & Field" },
  { name: "Loop Analytics" },
  { name: "Atlas Foods" },
  { name: "Lumen & Co." },
  { name: "Halcyon Bank" },
  { name: "Tessera Labs" },
  { name: "Brightline" },
  { name: "Orbital Logistics" },
  { name: "Kinship Health" },
];

const HOME_DEFAULTS: PageSectionContentMap["home"] = {
  hero: {
    announcement: "Now booking Q3 transformation engagements",
    headline: "Complete digital transformation —",
    headline_emphasis: "one trusted partner.",
    subtitle:
      "Strategy, design, engineering, automation, AI, and ongoing optimisation — delivered by a single accountable team. We move small businesses to credible, and enterprises to modern.",
    primary_label: "Start your project",
    primary_href: "/book-consultation",
    secondary_label: "Request enterprise briefing",
    secondary_href: "/for-enterprise",
    footnote: "Free 30-minute consultation · No pitch deck",
  },
  hero_preview_card: {
    eyebrow: "Engagement preview",
    title: "A 90-day strike team that ships something useful before quarter-end.",
    bullets: [
      { text: "Discovery and roadmap in week 1." },
      { text: "First production release by week 4." },
      { text: "Measurable outcome by week 12." },
    ],
    metrics: [
      { value: "+112%", label: "Revenue growth" },
      { value: "21d → 4h", label: "Compliance" },
      { value: "-34%", label: "Defect rate" },
      { value: "98%", label: "Retention" },
    ],
  },
  trust: {
    label: "Trusted by teams shipping real digital work",
    partners: TRUST_PARTNERS_DEFAULT.map((p) => ({ ...p })),
    stats: stats.map((s) => ({ value: s.value, label: s.label })),
  },
  services: {
    eyebrow: "What we do",
    title: "One partner for the entire digital stack.",
    subtitle:
      "From strategy and brand to AI, CRM, payments, and cloud — we deliver the complete digital transformation surface for your business.",
  },
  features: { ...HOME_FEATURES_DEFAULT },
  process: {
    eyebrow: "How we work",
    title: "A disciplined five-stage method.",
    subtitle: "Each stage is short, measurable, and produces a tangible artefact your team can review and act on.",
    link_label: "Read the full methodology",
    link_href: "/how-we-work",
    ...PROCESS_STEPS_DEFAULT,
  },
  portfolio: {
    eyebrow: "Selected work",
    title: "Outcomes, not output.",
    subtitle: "A taste of recent engagements across SMB, mid-market, and enterprise.",
  },
  testimonials: {
    eyebrow: "Word of mouth",
    title: "The kind of partner clients keep on retainer.",
  },
  pricing: {
    eyebrow: "Engagement models",
    title: "From single projects to multi-year platforms.",
    subtitle: "Clear starting prices. Custom scoping. Every engagement begins with a free 30-minute consultation.",
    ...PRICING_TIERS_RICH_DEFAULT,
  },
  cta_band: {
    title: "Ready to transform your business?",
    subtitle:
      "Book a free 30-minute consultation and walk away with three concrete next steps — whether or not we work together.",
    primary_label: "Book consultation",
    primary_href: "/book-consultation",
    secondary_label: "See our work",
    secondary_href: "/work",
  },
};

const HEADING_ONLY = (eyebrow: string, title: string, subtitle?: string): SectionContentValue => ({
  eyebrow,
  title,
  ...(subtitle ? { subtitle } : {}),
});

const FOOTER_NEWSLETTER_DEFAULTS: SectionContentValue = {
  blurb: "Quiet, monthly insights. No spam. Unsubscribe in one click.",
};

const GLOBAL_HEADER_DEFAULTS: SectionContentValue = {
  brand_name: "DigSolutions",
  logo_abbr: "DS",
  contact_label: "Contact",
  contact_href: "/contact",
  book_label: "Book consultation",
  book_href: "/book-consultation",
  nav_items: [
    { label: "Solutions", href: "/solutions", mega_menu: "services" },
    { label: "For SMB", href: "/for-smb", mega_menu: "none" },
    { label: "For Enterprise", href: "/for-enterprise", mega_menu: "none" },
    { label: "Industries", href: "/industries", mega_menu: "industries" },
    { label: "Work", href: "/work", mega_menu: "none" },
    { label: "Insights", href: "/insights", mega_menu: "none" },
    { label: "Company", href: "/about", mega_menu: "company" },
  ],
  company_links: [
    { label: "About", href: "/about", description: "Who we are and what we believe." },
    { label: "How we work", href: "/how-we-work", description: "Engagement models and methodology." },
    { label: "Leadership", href: "/about/leadership", description: "The people behind DigSolutions." },
    { label: "Careers", href: "/about/careers", description: "Open roles and culture." },
    { label: "Partners", href: "/about/partners", description: "Our technology and alliance partners." },
  ],
};

const GLOBAL_FOOTER_NAV_DEFAULTS: SectionContentValue = {
  who_we_serve_links: [
    { label: "Small business", href: "/for-smb" },
    { label: "Enterprise", href: "/for-enterprise" },
    { label: "Industries", href: "/industries" },
  ],
  company_links: [
    { label: "About", href: "/about" },
    { label: "How we work", href: "/how-we-work" },
    { label: "Leadership", href: "/about/leadership" },
    { label: "Careers", href: "/about/careers" },
    { label: "Partners", href: "/about/partners" },
  ],
  resources_links: [
    { label: "Insights", href: "/insights" },
    { label: "Guides", href: "/insights/guides" },
    { label: "Work", href: "/work" },
    { label: "FAQ", href: "/faq" },
  ],
  legal_links: [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Cookies", href: "/legal/cookies" },
  ],
};

function defaultForSection(pageId: string, sectionId: string, schemaId: ContentSchemaId): SectionContentValue {
  if (pageId === "global" && sectionId === "header") {
    return { ...GLOBAL_HEADER_DEFAULTS };
  }
  if (pageId === "global" && sectionId === "footer") {
    return { ...GLOBAL_FOOTER_NAV_DEFAULTS };
  }
  if (pageId === "global" && sectionId === "footer_newsletter") {
    return { ...FOOTER_NEWSLETTER_DEFAULTS };
  }
  if (sectionId === "process" && schemaId === "numbered_steps") {
    if (pageId === "home" && HOME_DEFAULTS.process) {
      return { ...HOME_DEFAULTS.process };
    }
    return {
      eyebrow: "Process",
      title: "Five stages from discovery to optimisation.",
      subtitle: "A repeatable method we apply on every engagement.",
      ...PROCESS_STEPS_DEFAULT,
    };
  }
  if (pageId === "home" && HOME_DEFAULTS[sectionId]) {
    return { ...HOME_DEFAULTS[sectionId] };
  }
  if (pageId === "faq" && sectionId === "faq_list") {
    return { faqs: FAQ_DEFAULTS.faqs.map((f) => ({ ...f })) };
  }
  if (pageId === "contact" && sectionId === "sidebar_contact") {
    return { ...CONTACT_SIDEBAR_DEFAULTS };
  }
  if (pageId === "about" && sectionId === "values") return { ...ABOUT_VALUES_DEFAULT };
  if (pageId === "about" && sectionId === "locations") return { ...ABOUT_LOCATIONS_DEFAULT };
  if (pageId === "about_partners" && sectionId === "partners_grid") return { ...PARTNERS_GRID_DEFAULT };
  if (pageId === "for_smb" && sectionId === "benefits") return { ...FOR_SMB_BENEFITS_DEFAULT };
  if (pageId === "for_smb" && sectionId === "package") return { ...FOR_SMB_PACKAGE_DEFAULT };
  if (pageId === "for_enterprise" && sectionId === "pillars") return { ...FOR_ENTERPRISE_PILLARS_DEFAULT };
  if (pageId === "for_enterprise" && sectionId === "governance") return { ...FOR_ENTERPRISE_GOVERNANCE_DEFAULT };
  if (pageId === "how_we_work" && sectionId === "operating_standards") return { ...OPERATING_STANDARDS_DEFAULT };
  if (pageId === "how_we_work_methodology" && sectionId === "cadence") return { ...METHODOLOGY_CADENCE_DEFAULT };
  if (pageId === "how_we_work_methodology" && sectionId === "frameworks") return { ...METHODOLOGY_FRAMEWORKS_DEFAULT };
  if (pageId === "how_we_work_methodology" && sectionId === "decision_speed") return { ...METHODOLOGY_DECISION_SPEED_DEFAULT };
  if (pageId === "how_we_work_engagement_models" && sectionId === "models") {
    return {
      eyebrow: "Engagement models",
      title: "Launch, Growth, and Enterprise.",
      subtitle: "Clear starting prices. Custom scoping. Every engagement begins with a free consultation.",
      ...PRICING_TIERS_RICH_DEFAULT,
    };
  }
  if (pageId === "book_consultation" && sectionId === "expectations") return { ...BOOK_EXPECTATIONS_DEFAULT };
  if (pageId === "insights_events" && sectionId === "events_list") return { ...EVENTS_LIST_DEFAULT };
  if (pageId === "thank_you" && sectionId === "confirmation") return { ...THANK_YOU_CONFIRMATION_DEFAULT };
  if (pageId === "thank_you" && sectionId === "next_steps") return { ...THANK_YOU_NEXT_STEPS_DEFAULT };

  if (schemaId === "page_hero" && PAGE_HERO_DEFAULTS[pageId]) {
    return { ...PAGE_HERO_DEFAULTS[pageId] };
  }

  if (schemaId === "cta_band") {
    return { ...HOME_DEFAULTS.cta_band };
  }

  if (schemaId === "section_heading") {
    return HEADING_ONLY("Section", "Section title", "");
  }

  if (schemaId === "pricing_tiers_rich") {
    return {
      eyebrow: "Engagement models",
      title: "Pricing",
      ...PRICING_TIERS_RICH_DEFAULT,
    };
  }

  return {};
}

export function buildDefaultPageSectionContent(): PageSectionContentMap {
  const out: PageSectionContentMap = {};
  for (const page of MARKETING_PAGE_REGISTRY) {
    out[page.id] = {};
    for (const section of page.sections) {
      const schemaId = resolveSectionSchemaId(page.id, section.id);
      if (schemaId === "none") {
        out[page.id][section.id] = {};
        continue;
      }
      out[page.id][section.id] = defaultForSection(page.id, section.id, schemaId);
    }
  }
  return out;
}
