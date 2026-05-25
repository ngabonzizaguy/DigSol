import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Boxes,
  Calendar,
  Check,
  Clock,
  DollarSign,
  Layers,
  LayoutDashboard,
  LineChart,
  Shield,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CmsSectionHeading } from "@/components/marketing/cms-section-heading";
import { StaggerChildren, StaggerItem } from "@/components/marketing/fade-in";
import type { SectionHeadingContent } from "@/lib/marketing/home-content";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  clock: Clock,
  shield: Shield,
  dollar: DollarSign,
  dollarsign: DollarSign,
  sparkles: Sparkles,
  users: Users,
  layers: Layers,
  workflow: Workflow,
  boxes: Boxes,
  "layout-dashboard": LayoutDashboard,
  layoutdashboard: LayoutDashboard,
  "line-chart": LineChart,
  linechart: LineChart,
};

function resolveIcon(key?: string): LucideIcon | null {
  if (!key?.trim()) return null;
  return ICON_MAP[key.trim().toLowerCase()] ?? null;
}

export type SectionHeadingFields = SectionHeadingContent;

function headingFromContent(content: SectionHeadingFields): SectionHeadingContent {
  return {
    eyebrow: content.eyebrow,
    title: content.title,
    subtitle: content.subtitle,
  };
}

export function CmsCardGrid({
  content,
  className,
  headingClassName,
  columns = "md:grid-cols-2",
}: {
  content: SectionHeadingFields & { items?: { title?: string; body?: string }[] };
  className?: string;
  headingClassName?: string;
  columns?: string;
}) {
  const items = (content.items ?? []).filter((i) => i.title?.trim());
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <CmsSectionHeading content={headingFromContent(content)} className={headingClassName} />
      <StaggerChildren className={cn("grid grid-cols-1 gap-5", columns)}>
        {items.map((item) => (
          <StaggerItem key={item.title}>
            <Card>
              <CardTitle>{item.title}</CardTitle>
              {item.body?.trim() ? (
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.body}</p>
              ) : null}
            </Card>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </div>
  );
}

export function CmsIconCardGrid({
  content,
  className,
  headingClassName,
  columns = "md:grid-cols-3",
}: {
  content: SectionHeadingFields & { items?: { icon_key?: string; title?: string; body?: string }[] };
  className?: string;
  headingClassName?: string;
  columns?: string;
}) {
  const items = (content.items ?? []).filter((i) => i.title?.trim());
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <CmsSectionHeading content={headingFromContent(content)} className={headingClassName} />
      <StaggerChildren className={cn("grid grid-cols-1 gap-5", columns)}>
        {items.map((item) => {
          const Icon = resolveIcon(item.icon_key);
          return (
            <StaggerItem key={item.title}>
              <Card>
                {Icon ? (
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-strong text-ink">
                    <Icon className="h-5 w-5" />
                  </div>
                ) : null}
                <CardTitle className={Icon ? "mt-4" : undefined}>{item.title}</CardTitle>
                {item.body?.trim() ? <p className="mt-2 text-[15px] text-muted">{item.body}</p> : null}
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </div>
  );
}

export function CmsLocationGrid({
  content,
  className,
  headingClassName,
}: {
  content: SectionHeadingFields & { items?: { city?: string; country?: string }[] };
  className?: string;
  headingClassName?: string;
}) {
  const items = (content.items ?? []).filter((i) => i.city?.trim());
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <CmsSectionHeading content={headingFromContent(content)} className={headingClassName} />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((loc) => (
          <Card key={loc.city}>
            <CardTitle>{loc.city}</CardTitle>
            {loc.country?.trim() ? <p className="mt-2 text-[15px] text-muted">{loc.country}</p> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CmsPartnerGrid({
  content,
  className,
}: {
  content: { items?: { tier?: string; names?: string }[] };
  className?: string;
}) {
  const groups = (content.items ?? [])
    .map((g) => ({
      tier: g.tier?.trim() ?? "",
      names: (g.names ?? "")
        .split("\n")
        .map((n) => n.trim())
        .filter(Boolean),
    }))
    .filter((g) => g.tier && g.names.length > 0);

  if (groups.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-1 gap-5 lg:grid-cols-3", className)}>
      {groups.map((t) => (
        <Card key={t.tier}>
          <CardTitle>{t.tier}</CardTitle>
          <ul className="mt-4 space-y-2">
            {t.names.map((n) => (
              <li key={n} className="text-[15px] text-body">
                {n}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

export function CmsPhaseGrid({
  content,
  className,
  headingClassName,
}: {
  content: SectionHeadingFields & { items?: { phase?: string; title?: string; body?: string }[] };
  className?: string;
  headingClassName?: string;
}) {
  const items = (content.items ?? []).filter((i) => i.title?.trim());
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <CmsSectionHeading content={headingFromContent(content)} className={headingClassName} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {items.map((b) => (
          <Card key={b.phase ?? b.title}>
            {b.phase?.trim() ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{b.phase}</p>
            ) : null}
            <CardTitle className={b.phase?.trim() ? "mt-2" : undefined}>{b.title}</CardTitle>
            {b.body?.trim() ? (
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{b.body}</p>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CmsChecklist({
  content,
  className,
  headingClassName,
  columns = "lg:grid-cols-2",
}: {
  content: SectionHeadingFields & { items?: { text?: string }[] };
  className?: string;
  headingClassName?: string;
  columns?: string;
}) {
  const items = (content.items ?? []).map((i) => i.text?.trim()).filter(Boolean) as string[];
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <CmsSectionHeading content={headingFromContent(content)} className={headingClassName} />
      <div className={cn("grid grid-cols-1 gap-3", columns)}>
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-xl border border-hairline bg-surface-card p-4 text-[15px] text-body"
          >
            <Check className="mt-1 h-4 w-4 flex-shrink-0 text-success" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CmsEventGrid({
  content,
  className,
}: {
  content: { items?: { date?: string; title?: string; type?: string; spots?: string }[] };
  className?: string;
}) {
  const events = (content.items ?? []).filter((e) => e.title?.trim());
  if (events.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-1 gap-5 md:grid-cols-3", className)}>
      {events.map((e) => (
        <Card key={e.title}>
          {e.type?.trim() ? <Badge>{e.type}</Badge> : null}
          {e.date?.trim() ? (
            <div className="mt-4 flex items-center gap-2 text-[13px] text-muted">
              <Calendar className="h-3.5 w-3.5" /> {e.date}
            </div>
          ) : null}
          <CardTitle className="mt-3">{e.title}</CardTitle>
          {e.spots?.trim() ? (
            <p className="mt-4 text-[13px] uppercase tracking-wider text-muted">{e.spots}</p>
          ) : null}
        </Card>
      ))}
    </div>
  );
}

export function CmsTextBlock({
  content,
  titleClassName = "max-w-3xl text-balance font-display text-display-xl text-ink",
  bodyClassName = "mt-4 max-w-2xl text-[17px] leading-relaxed text-body",
}: {
  content: { title?: string; body?: string };
  titleClassName?: string;
  bodyClassName?: string;
}) {
  const title = content.title?.trim();
  const body = content.body?.trim();
  if (!title && !body) return null;

  return (
    <>
      {title ? <h2 className={titleClassName}>{title}</h2> : null}
      {body ? <p className={bodyClassName}>{body}</p> : null}
    </>
  );
}

/** Home differentiators — premium card styling; returns null when no items. */
export function CmsHomeFeaturesGrid({
  content,
}: {
  content: SectionHeadingFields & { items?: { icon_key?: string; title?: string; body?: string }[] };
}) {
  const items = (content.items ?? []).filter((i) => i.title?.trim());
  if (items.length === 0) return null;

  return (
    <StaggerChildren className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
      {items.map((item) => {
        const Icon = resolveIcon(item.icon_key);
        return (
          <StaggerItem key={item.title}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-hairline bg-surface-card p-7 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift">
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-orb-lavender/30 to-transparent opacity-60 blur-2xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
              />
              <div className="relative">
                {Icon ? (
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-strong text-ink">
                    <Icon className="h-5 w-5" />
                  </div>
                ) : null}
                <h3 className="mt-5 font-sans text-[19px] font-medium text-ink">{item.title}</h3>
                {item.body?.trim() ? (
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.body}</p>
                ) : null}
              </div>
            </div>
          </StaggerItem>
        );
      })}
    </StaggerChildren>
  );
}

export function CmsProcessStepper({
  content,
  showLink = false,
  className,
}: {
  content: SectionHeadingFields & {
    items?: { step?: string; title?: string; body?: string }[];
    link_label?: string;
    link_href?: string;
  };
  showLink?: boolean;
  className?: string;
}) {
  const steps = (content.items ?? []).filter((s) => s.title?.trim());
  if (steps.length === 0) return null;

  const linkLabel = content.link_label?.trim();
  const linkHref = content.link_href?.trim();

  return (
    <div className={className}>
      <div className="relative">
        <div
          aria-hidden
          className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-hairline-strong to-transparent lg:block"
        />
        <ol className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, idx) => (
            <li key={`${step.step ?? idx}-${step.title}`} className="relative">
              <div className="relative mb-5 grid h-14 w-14 place-items-center rounded-full border border-hairline-strong bg-surface-card shadow-soft">
                <span className="font-display text-[20px] text-ink">{step.step?.trim() || String(idx + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="font-sans text-[18px] font-medium text-ink">{step.title}</h3>
              {step.body?.trim() ? (
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.body}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      {showLink && linkLabel && linkHref ? (
        <div className="mt-10">
          <Button href={linkHref} variant="ghost">
            {linkLabel} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
