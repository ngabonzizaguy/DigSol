export type Insight = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  author: string;
  role: string;
  readTime: string;
  category: "Strategy" | "Engineering" | "Design" | "AI" | "Operations";
  date: string;
  cover_url?: string | null;
};

export const insights: Insight[] = [
  {
    slug: "the-new-shape-of-digital-transformation",
    title: "The new shape of digital transformation",
    excerpt:
      "Five-year ERP programs are dead. Here's what's replacing them — and why your roadmap probably needs a rewrite.",
    body: [
      "For two decades, 'digital transformation' meant signing a multi-year contract with a giant consultancy and hoping the org survived the ride. That model is collapsing under its own weight.",
      "The companies winning today are running 90-day strike teams: small, multidisciplinary squads with executive air cover. They ship something useful within a quarter, measure it, and decide what to scale.",
      "The transformation roadmap of 2026 is a portfolio of bets — not a Gantt chart. We help leadership teams put one together and execute on it.",
    ],
    author: "Lena Okafor",
    role: "Head of Strategy",
    readTime: "6 min read",
    category: "Strategy",
    date: "2026-04-18",
  },
  {
    slug: "ai-agents-that-actually-pay-back",
    title: "AI agents that actually pay back",
    excerpt:
      "Most AI 'pilots' never reach production. Here's the operating model we use to ship AI agents that survive contact with reality.",
    body: [
      "There are four reasons AI projects die: unclear ownership, fuzzy success criteria, brittle integrations, and zero monitoring. We've shipped over thirty production AI workflows. The pattern that works is boring.",
      "Start narrow. Pick one process, measure baseline cycle time and quality, build the agent against a clear evaluation set, ship it behind a feature flag, monitor everything.",
      "If it can't survive a week in production with a junior on call, it isn't real software yet.",
    ],
    author: "Marcus Tan",
    role: "AI Lead",
    readTime: "8 min read",
    category: "AI",
    date: "2026-04-05",
  },
  {
    slug: "designing-b2b-products-that-feel-consumer",
    title: "Designing B2B products that feel consumer-grade",
    excerpt:
      "The aesthetic gap between consumer and enterprise software is closing fast. Here's the design system playbook.",
    body: [
      "Buyers of enterprise software are also the people who use Spotify, Notion, and Linear at home. Tolerance for ugly enterprise UI has collapsed.",
      "We treat every B2B product as a consumer product with extra constraints — security, compliance, multi-tenancy. The aesthetic bar is the same.",
      "Design systems are the cheat code. A small, well-built token system pays back across every screen for years.",
    ],
    author: "Priya Shah",
    role: "Design Director",
    readTime: "5 min read",
    category: "Design",
    date: "2026-03-22",
  },
  {
    slug: "the-rise-of-the-business-operating-system",
    title: "The rise of the business operating system",
    excerpt:
      "SaaS sprawl is a tax. The next decade belongs to companies that build a coherent operating layer across CRM, ops, finance, and AI.",
    body: [
      "Mid-market companies now run on an average of 137 SaaS products. The cost isn't just the licenses — it's the cognitive load of orchestrating them.",
      "We're seeing a new pattern emerge: a thin operating layer (built on workflow engines, AI agents, and shared data) that sits above the SaaS stack and presents one coherent surface to the business.",
      "This is where DigSolutions is heading — and it's why our client portal is the start of something bigger.",
    ],
    author: "Lena Okafor",
    role: "Head of Strategy",
    readTime: "9 min read",
    category: "Operations",
    date: "2026-03-08",
  },
  {
    slug: "stop-shipping-marketing-sites-without-instrumentation",
    title: "Stop shipping marketing sites without instrumentation",
    excerpt:
      "If you can't tell a useful story about which page changed which deal, your marketing site is decoration.",
    body: [
      "Every site we ship leaves the building with PostHog, GA4, server-side events, and a clear funnel definition in place.",
      "It costs almost nothing to set up on launch day and is painful to retrofit six months later. Do it now.",
      "The point isn't dashboards — it's the conversations they enable between marketing, sales, and product.",
    ],
    author: "Jordan Reyes",
    role: "Growth Engineer",
    readTime: "4 min read",
    category: "Engineering",
    date: "2026-02-19",
  },
];

export function getInsight(slug: string) {
  return insights.find((i) => i.slug === slug);
}

export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  format: "PDF" | "Worksheet" | "Checklist";
  pages: number;
};

export const guides: Guide[] = [
  {
    slug: "digital-transformation-audit",
    title: "The 30-minute digital transformation audit",
    excerpt: "A self-serve scorecard to identify the three highest-leverage initiatives in your business.",
    format: "Worksheet",
    pages: 12,
  },
  {
    slug: "ai-readiness-checklist",
    title: "AI readiness checklist for mid-market companies",
    excerpt: "Fourteen prerequisites your data, ops, and team need before AI can deliver real ROI.",
    format: "Checklist",
    pages: 8,
  },
  {
    slug: "vendor-evaluation-framework",
    title: "Vendor evaluation framework",
    excerpt: "The same scorecard we use internally when evaluating CRMs, CMSs, and infrastructure providers.",
    format: "PDF",
    pages: 18,
  },
];
