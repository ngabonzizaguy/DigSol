export type CaseStudyGalleryItem = {
  url: string;
  mime?: string;
  alt?: string;
  caption?: string;
};

export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  segment: "smb" | "midmarket" | "enterprise";
  industry: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  metrics: { label: string; value: string }[];
  services: string[];
  orb: "mint" | "peach" | "lavender" | "sky" | "rose";
  cover_url?: string | null;
  featured?: boolean;
  project_url?: string | null;
  show_project_url?: boolean;
  customer_quote?: string | null;
  customer_name?: string | null;
  customer_role?: string | null;
  media_gallery?: CaseStudyGalleryItem[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "smb-retail-cloud-migration",
    client: "Northwind Outfitters",
    title: "An indie retailer goes omni-channel in 6 weeks",
    segment: "smb",
    industry: "Retail & e-commerce",
    summary:
      "A 30-store outdoor retailer needed to unify in-store and online sales without a multi-year SAP project.",
    challenge:
      "Stock sat in spreadsheets, the website ran on a 2017 theme, and refunds took 12 days. Leadership wanted a single source of truth and 'launch this quarter, not next year'.",
    approach:
      "We rebuilt the storefront on Shopify Hydrogen, replaced the inventory layer with a lean middleware on Vercel + Supabase, and wired Stripe for omnichannel refunds and store credit.",
    outcome:
      "Launched in 6 weeks. Inventory accuracy moved from ~78% to 99.4%. Online revenue doubled within a quarter and refund time dropped to 36 hours.",
    metrics: [
      { label: "Revenue growth", value: "+112%" },
      { label: "Inventory accuracy", value: "99.4%" },
      { label: "Refund time", value: "12d → 36h" },
    ],
    services: ["web-mobile", "commerce-payments", "analytics-growth"],
    orb: "peach",
  },
  {
    slug: "enterprise-bank-data-platform",
    client: "Meridian Financial Group",
    title: "A regional bank's data backbone, modernised without a freeze",
    segment: "enterprise",
    industry: "Financial services",
    summary:
      "A 2,000-employee bank needed a unified customer data layer feeding 14 downstream systems without a service interruption.",
    challenge:
      "Customer data lived in 6 source systems. Compliance reporting took 3 weeks. Marketing personalisation was effectively impossible.",
    approach:
      "We designed a domain-driven data platform on AWS with event streaming (Kinesis), a governed lakehouse, and identity resolution. Migration ran on shadow infrastructure for 4 months before cutover.",
    outcome:
      "Compliance reporting dropped from 21 days to 4 hours. Marketing personalisation drove a 23% uplift on key campaigns. Zero customer-facing downtime during cutover.",
    metrics: [
      { label: "Compliance reporting", value: "21d → 4h" },
      { label: "Campaign uplift", value: "+23%" },
      { label: "Customer downtime", value: "0 minutes" },
    ],
    services: ["digital-strategy", "automation-ai", "hosting-ops"],
    orb: "sky",
  },
  {
    slug: "manufacturing-iot-operations",
    client: "Forge & Field Manufacturing",
    title: "Shop-floor IoT, finally connected to the boardroom",
    segment: "midmarket",
    industry: "Manufacturing",
    summary:
      "A 450-person components manufacturer wanted real-time machine data on a single dashboard — without re-tooling.",
    challenge:
      "Machine data lived in PLCs from four vendors. Quality issues showed up days after they occurred. Ops leadership flew blind.",
    approach:
      "We installed lightweight edge collectors, streamed events through a managed broker, and built a real-time ops dashboard with PostHog and a custom React layer. AI anomaly alerts flag drift within minutes.",
    outcome:
      "Defect rates dropped 34%. Mean time to detect a quality issue went from 3.1 days to 19 minutes. Maintenance shifted from reactive to predictive.",
    metrics: [
      { label: "Defect rate", value: "-34%" },
      { label: "Time to detect", value: "3.1d → 19m" },
      { label: "Unplanned downtime", value: "-41%" },
    ],
    services: ["automation-ai", "analytics-growth", "hosting-ops"],
    orb: "mint",
  },
  {
    slug: "healthcare-patient-portal",
    client: "Cedar Health Network",
    title: "A patient portal that patients actually open",
    segment: "midmarket",
    industry: "Healthcare",
    summary:
      "A 12-clinic network's existing portal had 4% adoption. The new one hit 71% in 4 months.",
    challenge:
      "Patients ignored the portal. Front desks were buried in calls. Clinical staff still printed forms.",
    approach:
      "We rebuilt the portal as a fast PWA, added SMS-based onboarding, redesigned intake to mobile-first, and integrated to the EHR via FHIR. Compliance was baked in from day one.",
    outcome:
      "Portal adoption hit 71%. Inbound call volume dropped 38%. Average intake time fell from 14 minutes to 4.",
    metrics: [
      { label: "Adoption", value: "4% → 71%" },
      { label: "Inbound calls", value: "-38%" },
      { label: "Intake time", value: "14m → 4m" },
    ],
    services: ["digital-strategy", "web-mobile", "design-branding"],
    orb: "lavender",
  },
  {
    slug: "saas-onboarding-automation",
    client: "Loop Analytics",
    title: "Doubling activation with a smarter onboarding engine",
    segment: "smb",
    industry: "Professional services",
    summary:
      "A 14-person SaaS startup automated onboarding and doubled activation in eight weeks.",
    challenge:
      "Trial users dropped off in week one. Founders were manually shipping onboarding emails and demo calls.",
    approach:
      "We mapped the activation funnel, built a behavioural automation layer (Customer.io + custom events), and added an AI co-pilot for in-app guidance.",
    outcome:
      "Activation rate moved from 18% to 41%. Founders reclaimed ~14 hours per week. NPS rose 19 points.",
    metrics: [
      { label: "Activation", value: "18% → 41%" },
      { label: "Founder hours saved", value: "14h/week" },
      { label: "NPS uplift", value: "+19" },
    ],
    services: ["automation-ai", "analytics-growth", "crm-sales"],
    orb: "rose",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
