export type TeamMember = {
  name: string;
  role: string;
  bio: string;
};

export const leadership: TeamMember[] = [
  {
    name: "Lena Okafor",
    role: "Co-founder & Head of Strategy",
    bio: "Former BCG principal. Builds digital strategy roadmaps for SMB through enterprise.",
  },
  {
    name: "Marcus Tan",
    role: "Co-founder & Head of Engineering",
    bio: "Ex-Stripe, ex-Vercel. Loves boring infrastructure and AI that actually ships.",
  },
  {
    name: "Priya Shah",
    role: "Design Director",
    bio: "Built design systems at Shopify and Linear. Believes in editorial restraint.",
  },
  {
    name: "Jordan Reyes",
    role: "Head of Growth",
    bio: "Performance marketing and growth engineering for B2B SaaS.",
  },
  {
    name: "Amara Ndlovu",
    role: "Head of Delivery",
    bio: "Twenty years of program leadership in regulated industries.",
  },
  {
    name: "Toby Mackenzie",
    role: "AI Lead",
    bio: "Builds production AI agents and evaluation pipelines.",
  },
];

export type OpenRole = {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: "Full-time" | "Contract";
};

export const openRoles: OpenRole[] = [
  { slug: "senior-product-designer", title: "Senior product designer", team: "Design", location: "Remote (EU/Africa)", type: "Full-time" },
  { slug: "ai-engineer", title: "AI engineer", team: "Engineering", location: "Remote (global)", type: "Full-time" },
  { slug: "fullstack-engineer", title: "Full-stack engineer (Next.js / TS)", team: "Engineering", location: "Remote (EU)", type: "Full-time" },
  { slug: "delivery-lead", title: "Delivery lead — enterprise", team: "Delivery", location: "Hybrid (Kigali / London)", type: "Full-time" },
];
