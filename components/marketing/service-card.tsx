import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/content/services";

const orbBg: Record<Service["orb"], string> = {
  mint: "from-orb-mint/40",
  peach: "from-orb-peach/40",
  lavender: "from-orb-lavender/40",
  sky: "from-orb-sky/40",
  rose: "from-orb-rose/40",
};

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  return (
    <Link
      href={`/solutions/${service.slug}`}
      className={cn(
        "group relative block h-full overflow-hidden rounded-2xl border border-hairline bg-surface-card p-6 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift",
        className
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl transition-all duration-700 group-hover:opacity-90 group-hover:scale-110",
          orbBg[service.orb]
        )}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-sans text-[19px] font-medium text-ink leading-snug">{service.title}</h3>
          <ArrowUpRight className="h-5 w-5 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
        </div>
        <p className="mt-3 text-[15px] text-muted leading-relaxed">{service.short}</p>
      </div>
    </Link>
  );
}
