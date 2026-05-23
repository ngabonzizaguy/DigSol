import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Events",
  description: "Webinars, briefings, and meetups hosted by DigSolutions.",
};

const events = [
  { date: "Jun 12, 2026", title: "AI agents in production — the operating model", type: "Webinar", spots: "Free" },
  { date: "Jul 03, 2026", title: "Executive briefing: regional digital transformation", type: "Briefing", spots: "Invite only" },
  { date: "Aug 21, 2026", title: "Designing B2B products that feel consumer-grade", type: "Meetup", spots: "Kigali" },
];

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Where we'll be next."
        subtitle="A small, deliberate calendar of webinars, executive briefings, and in-person meetups."
      />
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: "Events" }]} />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {events.map((e) => (
              <Card key={e.title}>
                <Badge>{e.type}</Badge>
                <div className="mt-4 flex items-center gap-2 text-[13px] text-muted">
                  <Calendar className="h-3.5 w-3.5" /> {e.date}
                </div>
                <CardTitle className="mt-3">{e.title}</CardTitle>
                <p className="mt-4 text-[13px] uppercase tracking-wider text-muted">{e.spots}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
