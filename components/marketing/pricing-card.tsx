import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export type PricingTier = {
  name: string;
  description: string;
  price: string;
  cadence: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
  badge?: string;
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Launch",
    description: "For SMBs ready to ship their first credible digital presence.",
    price: "From $4,900",
    cadence: "project",
    features: [
      "Marketing site (up to 8 pages)",
      "Brand identity refresh",
      "Analytics + SEO setup",
      "30 days of post-launch support",
    ],
    ctaLabel: "Start a Launch project",
    ctaHref: "/book-consultation?tier=launch",
  },
  {
    name: "Growth",
    description: "For mid-market teams scaling product, marketing, and operations.",
    price: "From $9,800",
    cadence: "/ month",
    features: [
      "Dedicated squad (design, eng, growth)",
      "CRM + automation builds",
      "Monthly experimentation roadmap",
      "Priority support + Slack channel",
    ],
    ctaLabel: "Talk about Growth",
    ctaHref: "/book-consultation?tier=growth",
    featured: true,
    badge: "Most popular",
  },
  {
    name: "Enterprise",
    description: "For organisations running multi-workstream transformation programs.",
    price: "Custom",
    cadence: "MSA",
    features: [
      "Multi-disciplinary delivery pods",
      "Governance, security, compliance",
      "Custom SLAs + executive sponsor",
      "Migration + change management",
    ],
    ctaLabel: "Request enterprise briefing",
    ctaHref: "/contact?intent=enterprise",
  },
];

export function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-8 transition-all duration-500 ease-expo hover:-translate-y-1",
        tier.featured
          ? "bg-surface-dark text-on-dark border-transparent shadow-lift"
          : "bg-surface-card border-hairline shadow-soft hover:shadow-lift"
      )}
    >
      {tier.badge && (
        <Badge variant={tier.featured ? "outline" : "default"} className={tier.featured ? "absolute right-6 top-6 border-on-dark-soft text-on-dark" : "absolute right-6 top-6"}>
          {tier.badge}
        </Badge>
      )}
      <div>
        <h3 className={cn("font-sans text-[22px] font-medium", tier.featured ? "text-on-dark" : "text-ink")}>
          {tier.name}
        </h3>
        <p className={cn("mt-2 text-[15px] leading-relaxed", tier.featured ? "text-on-dark-soft" : "text-muted")}>
          {tier.description}
        </p>
        <div className="mt-6 flex items-baseline gap-2">
          <span className={cn("font-display text-display-md", tier.featured ? "text-on-dark" : "text-ink")}>
            {tier.price}
          </span>
          <span className={cn("text-[13px]", tier.featured ? "text-on-dark-soft" : "text-muted")}>
            {tier.cadence}
          </span>
        </div>
      </div>
      <ul className="mt-8 space-y-3 flex-1">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-[15px]">
            <Check className={cn("h-4 w-4 mt-1 flex-shrink-0", tier.featured ? "text-orb-mint" : "text-success")} />
            <span className={tier.featured ? "text-on-dark" : "text-body"}>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button
          href={tier.ctaHref}
          variant={tier.featured ? "dark" : "primary"}
          className="w-full"
        >
          {tier.ctaLabel}
        </Button>
      </div>
    </div>
  );
}
