import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "../ui/badge";
import type { CaseStudy } from "@/lib/content/work";
import { cn } from "@/lib/utils";

const orbBg: Record<CaseStudy["orb"], string> = {
  mint: "from-orb-mint/60",
  peach: "from-orb-peach/60",
  lavender: "from-orb-lavender/60",
  sky: "from-orb-sky/60",
  rose: "from-orb-rose/60",
};

export function CaseStudyCard({ study, featured }: { study: CaseStudy; featured?: boolean }) {
  return (
    <Link
      href={`/work/${study.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-card transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift",
        featured && "lg:col-span-2"
      )}
    >
      <div className={cn("relative aspect-[16/9] overflow-hidden bg-canvas-soft", featured && "aspect-[21/9]")}>
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 bg-gradient-to-br to-transparent opacity-90 transition-transform duration-700 group-hover:scale-110",
            orbBg[study.orb]
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        <div className="absolute left-6 top-6 flex gap-2">
          <Badge variant="outline" className="bg-white/70 backdrop-blur">
            {study.segment === "smb" ? "Small business" : study.segment === "midmarket" ? "Mid-market" : "Enterprise"}
          </Badge>
          <Badge variant="outline" className="bg-white/70 backdrop-blur">
            {study.industry}
          </Badge>
        </div>
        <div className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full glass">
          <ArrowUpRight className="h-4 w-4 text-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 lg:p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">{study.client}</p>
        <h3 className="mt-2 font-display text-[28px] leading-tight text-ink">{study.title}</h3>
        <p className="mt-3 text-[15px] text-muted leading-relaxed">{study.summary}</p>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-hairline pt-5">
          {study.metrics.map((m) => (
            <div key={m.label}>
              <p className="font-display text-[24px] text-ink leading-none">{m.value}</p>
              <p className="mt-1 text-[12px] uppercase tracking-wider text-muted">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
