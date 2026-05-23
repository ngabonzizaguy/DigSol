export type Service = {
  slug: string;
  title: string;
  short: string;
  long: string;
  outcomes: string[];
  deliverables: string[];
  capabilities: string[];
  orb: "mint" | "peach" | "lavender" | "sky" | "rose";
};

export const services: Service[] = [
  {
    slug: "digital-strategy",
    title: "Digital strategy & consultation",
    short: "Maps for businesses that need clarity before they need code.",
    long:
      "We help leadership teams diagnose where they are, prioritise what to digitise, and build a transformation roadmap with sequencing, budgets, and measurable outcomes.",
    outcomes: [
      "12–24 month transformation roadmap",
      "Quantified ROI per initiative",
      "Vendor and platform recommendations",
    ],
    deliverables: ["Discovery workshops", "Maturity assessment", "Roadmap deck", "Executive briefing"],
    capabilities: ["Digital maturity audit", "Operating model design", "Investment prioritisation"],
    orb: "lavender",
  },
  {
    slug: "web-mobile",
    title: "Website & mobile app development",
    short: "Editorial-grade marketing sites and production-grade mobile apps.",
    long:
      "From conversion-focused marketing sites to React Native customer apps, we ship fast, accessible, performant products with a design system that grows with you.",
    outcomes: ["Launch-ready site in 4–8 weeks", "Lighthouse 90+ scores", "Native iOS + Android from one codebase"],
    deliverables: ["Design system", "Next.js or Expo build", "CMS or headless backend", "App Store launch"],
    capabilities: ["Next.js", "React Native (Expo)", "Sanity / Contentful", "Native integrations"],
    orb: "mint",
  },
  {
    slug: "design-branding",
    title: "Branding & UI/UX design",
    short: "Identity systems and product surfaces that feel inevitable.",
    long:
      "We build brand identities, design systems, and pixel-perfect product UI. Premium polish without the agency premium — and every asset is engineered for handoff.",
    outcomes: ["Cohesive brand across touchpoints", "Faster engineering handoff", "Higher conversion on key journeys"],
    deliverables: ["Logo + identity", "Design tokens", "Figma library", "UX research"],
    capabilities: ["Brand strategy", "Visual identity", "Design systems", "Motion language"],
    orb: "rose",
  },
  {
    slug: "automation-ai",
    title: "Business automation & AI integration",
    short: "Quiet automation and tasteful AI — not chatbot theatre.",
    long:
      "We map your workflows, eliminate manual handoffs with n8n / Zapier / custom integrations, and embed AI agents where they create real leverage — sales ops, support, content, ops.",
    outcomes: ["20–60% faster operations", "AI-assisted support and sales", "Cleaner data, fewer manual steps"],
    deliverables: ["Workflow audit", "Automation builds", "AI agent / LLM integration", "Monitoring"],
    capabilities: ["n8n / Make / Zapier", "OpenAI / Anthropic", "Vercel AI SDK", "Custom webhooks"],
    orb: "sky",
  },
  {
    slug: "crm-sales",
    title: "CRM systems",
    short: "A sales and service backbone that your team will actually use.",
    long:
      "We implement, customise, and integrate CRM platforms (HubSpot, Salesforce, Attio, Pipedrive) — and connect them to marketing, finance, and product data.",
    outcomes: ["Single customer record", "Pipeline visibility", "Automated nurturing"],
    deliverables: ["CRM build", "Data migration", "Pipeline automation", "Team training"],
    capabilities: ["HubSpot", "Salesforce", "Attio", "Pipedrive"],
    orb: "peach",
  },
  {
    slug: "commerce-payments",
    title: "E-commerce & payment integration",
    short: "Storefronts, checkouts, and billing that just work — globally.",
    long:
      "Headless storefronts (Shopify, Medusa), subscription billing (Stripe), invoicing, and reconciliation. Designed for international currencies, taxes, and edge cases.",
    outcomes: ["Higher checkout conversion", "Lower payment ops overhead", "Global currency + tax handling"],
    deliverables: ["Shopify / Medusa build", "Stripe billing", "Invoicing", "Webhook reconciliation"],
    capabilities: ["Shopify Hydrogen", "Stripe", "Medusa", "Adyen"],
    orb: "mint",
  },
  {
    slug: "hosting-ops",
    title: "Hosting, maintenance & cloud infrastructure",
    short: "Operations you don't have to think about.",
    long:
      "We host, monitor, patch, and scale your apps on Vercel, AWS, or GCP — with infrastructure-as-code, SLAs, and 24/7 alerting baked in.",
    outcomes: ["99.95% uptime targets", "Predictable monthly ops cost", "Hands-off scaling"],
    deliverables: ["Vercel / AWS setup", "IaC (Terraform/Pulumi)", "Monitoring stack", "Runbook"],
    capabilities: ["Vercel", "AWS", "GCP", "Cloudflare", "Terraform"],
    orb: "sky",
  },
  {
    slug: "analytics-growth",
    title: "Analytics, marketing & SEO",
    short: "Numbers you trust, content that ranks, ads that pay back.",
    long:
      "We build analytics dashboards (PostHog, GA4, Looker), run SEO programs, manage paid acquisition (Google, LinkedIn, Meta), and tie it all to revenue.",
    outcomes: ["Single source of truth for growth", "Higher organic traffic", "Predictable CAC"],
    deliverables: ["Analytics implementation", "SEO program", "Paid acquisition", "Content engine"],
    capabilities: ["PostHog", "GA4", "Looker", "Ahrefs", "Google / LinkedIn Ads"],
    orb: "lavender",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
