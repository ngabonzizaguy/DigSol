import { Boxes, Sparkles, LayoutDashboard, LineChart } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "./fade-in";

const features = [
  {
    icon: Boxes,
    title: "Unified delivery",
    body: "Strategy, design, engineering, growth — one team, one Slack channel, one accountable lead. No vendor relay race.",
  },
  {
    icon: Sparkles,
    title: "AI-native by default",
    body: "Every engagement ships at least one production AI workflow. We treat AI as boring software with monitoring, not a demo.",
  },
  {
    icon: LayoutDashboard,
    title: "A real client portal",
    body: "Project status, deliverables, invoices, analytics — in one place. Coming Q3. Built on the same stack we sell.",
  },
  {
    icon: LineChart,
    title: "Ongoing optimisation",
    body: "Most agencies leave after launch. We stay — measuring, experimenting, and shipping monthly improvements.",
  },
];

export function FeaturesGrid() {
  return (
    <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
      {features.map(({ icon: Icon, title, body }) => (
        <StaggerItem key={title}>
          <div className="group relative h-full rounded-2xl border border-hairline bg-surface-card p-7 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift overflow-hidden">
            <div
              aria-hidden
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-orb-lavender/30 to-transparent blur-2xl opacity-60 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
            />
            <div className="relative">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-strong text-ink">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-sans text-[19px] font-medium text-ink">{title}</h3>
              <p className="mt-2 text-[15px] text-muted leading-relaxed">{body}</p>
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
