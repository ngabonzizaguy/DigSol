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
    slug: "greenride-africa-mobility",
    client: "Greenride Africa",
    title: "Rwanda's electric ride platform — app, web, and ops shipped together",
    segment: "smb",
    industry: "Mobility & ride-hailing",
    summary:
      "Greenride Africa, a fully electric mobility startup in Kigali, needed a passenger app, marketing website, and booking backbone before launching on city streets — without cloning legacy fuel-based taxi stacks.",
    challenge:
      "Riders expected reliable EV trips booked in seconds; operations still ran on spreadsheets and chat threads. The brand had to earn trust as a local, sustainable alternative — not a generic ride template. Leadership wanted mobile, web, and backend delivered by one accountable team ahead of a public launch.",
    approach:
      "We designed and built the passenger mobile experience and responsive web presence, unified ride requests and trip status on Supabase + Vercel, and added an operations-friendly admin layer for bookings and fleet visibility. Notifications, payments, and analytics were wired for day-one service across Kigali — ride-hailing, VIP, corporate, and airport runs on one platform.",
    outcome:
      "Greenride launched with a 100% electric fleet on Kigali streets — clean, quiet rides built for local riders. Bookings flow through the app; corporate and VIP programs share the same core. The stack is ready to extend into delivery and charging as the network grows across Rwanda.",
    metrics: [
      { label: "Fleet", value: "100% electric" },
      { label: "Services live", value: "Ride · VIP · Corp" },
      { label: "Market", value: "Kigali, Rwanda" },
    ],
    services: ["web-mobile", "digital-strategy", "automation-ai"],
    orb: "mint",
    featured: true,
    project_url: "https://play.google.com/store/apps/details?id=com.greenrideafrica.passenger",
    show_project_url: true,
    customer_quote:
      "No fuel. No noise. No pollution — just clean, electric rides made for our people, with software we can actually run the business on.",
    customer_name: "Greenride Africa team",
    customer_role: "Founding team",
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
