import { services } from "./services";
import { industries } from "./industries";

export const primaryNav = [
  {
    label: "Solutions",
    href: "/solutions",
    children: services.map((s) => ({
      label: s.title,
      href: `/solutions/${s.slug}`,
      description: s.short,
    })),
  },
  { label: "For SMB", href: "/for-smb" },
  { label: "For Enterprise", href: "/for-enterprise" },
  {
    label: "Industries",
    href: "/industries",
    children: industries.map((i) => ({
      label: i.name,
      href: `/industries/${i.slug}`,
      description: i.short,
    })),
  },
  { label: "Work", href: "/work" },
  { label: "Insights", href: "/insights" },
  {
    label: "Company",
    href: "/about",
    children: [
      { label: "About", href: "/about", description: "Who we are and what we believe." },
      { label: "How we work", href: "/how-we-work", description: "Engagement models and methodology." },
      { label: "Leadership", href: "/about/leadership", description: "The people behind DigSolutions." },
      { label: "Careers", href: "/about/careers", description: "Open roles and culture." },
      { label: "Partners", href: "/about/partners", description: "Our technology and alliance partners." },
    ],
  },
];

export const footerNav = {
  Solutions: services.map((s) => ({ label: s.title, href: `/solutions/${s.slug}` })),
  "Who we serve": [
    { label: "Small business", href: "/for-smb" },
    { label: "Enterprise", href: "/for-enterprise" },
    { label: "Industries", href: "/industries" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "How we work", href: "/how-we-work" },
    { label: "Leadership", href: "/about/leadership" },
    { label: "Careers", href: "/about/careers" },
    { label: "Partners", href: "/about/partners" },
  ],
  Resources: [
    { label: "Insights", href: "/insights" },
    { label: "Guides", href: "/insights/guides" },
    { label: "Work", href: "/work" },
    { label: "FAQ", href: "/faq" },
  ],
  Legal: [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Cookies", href: "/legal/cookies" },
  ],
};
