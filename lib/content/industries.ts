export type Industry = {
  slug: string;
  name: string;
  short: string;
  challenges: string[];
  solutions: string[];
};

export const industries: Industry[] = [
  {
    slug: "healthcare",
    name: "Healthcare",
    short: "Patient experience, clinical workflows, and HIPAA-aware platforms.",
    challenges: ["Fragmented patient records", "Manual scheduling and intake", "Compliance overhead"],
    solutions: ["Patient portals", "Telehealth platforms", "HIPAA-compliant data layers", "Workflow automation"],
  },
  {
    slug: "financial-services",
    name: "Financial services",
    short: "Trust, compliance, and customer-grade UX for regulated finance.",
    challenges: ["Legacy core systems", "Strict compliance", "Customer experience gaps"],
    solutions: ["Customer portals", "KYC / AML automation", "Data platforms", "Mobile banking apps"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    short: "IoT, operations dashboards, and supply chain visibility.",
    challenges: ["Shop-floor data silos", "Supplier coordination", "Asset uptime"],
    solutions: ["IoT data pipelines", "Real-time dashboards", "Supplier portals", "Predictive maintenance"],
  },
  {
    slug: "retail-ecommerce",
    name: "Retail & e-commerce",
    short: "Storefronts, omni-channel, and growth instrumentation.",
    challenges: ["Fragmented checkout", "Inventory across channels", "Conversion plateaus"],
    solutions: ["Headless commerce", "Subscription billing", "Loyalty programs", "CRO programs"],
  },
  {
    slug: "professional-services",
    name: "Professional services",
    short: "Productising expertise — websites, portals, billing, automation.",
    challenges: ["Manual billing", "Document chaos", "Client onboarding"],
    solutions: ["Client portals", "Document automation", "CRM + billing", "Marketing engine"],
  },
  {
    slug: "public-sector",
    name: "Public sector",
    short: "Accessible, secure, accountable digital services for citizens.",
    challenges: ["Procurement constraints", "Accessibility mandates", "Legacy migration"],
    solutions: ["Accessible portals", "Secure cloud migration", "Citizen service platforms", "Open data dashboards"],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
