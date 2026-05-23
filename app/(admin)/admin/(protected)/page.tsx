import Link from "next/link";
import { ArrowUpRight, Inbox, FileText, Briefcase, Folder } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { StatusBadge } from "@/components/admin/ui/badge";

export const metadata = { title: "Dashboard" };

async function loadStats() {
  const supabase = await createClient();
  const [services, caseStudies, insights, leadsAll, leadsNew] = await Promise.all([
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("case_studies").select("id", { count: "exact", head: true }),
    supabase.from("insights").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  return {
    services: services.count ?? 0,
    caseStudies: caseStudies.count ?? 0,
    insights: insights.count ?? 0,
    leads: leadsAll.count ?? 0,
    newLeads: leadsNew.count ?? 0,
  };
}

async function loadRecentLeads() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("id, kind, name, email, company, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
}

export default async function AdminDashboardPage() {
  const [stats, recentLeads] = await Promise.all([loadStats(), loadRecentLeads()]);

  const cards = [
    { label: "Services", value: stats.services, href: "/admin/services", icon: Briefcase },
    { label: "Case studies", value: stats.caseStudies, href: "/admin/work", icon: Folder },
    { label: "Insights", value: stats.insights, href: "/admin/insights", icon: FileText },
    { label: "New leads", value: stats.newLeads, href: "/admin/leads?status=new", icon: Inbox, accent: true },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Overview</h1>
          <p className="text-[13px] text-admin-fg-subtle">A snapshot of content health and inbound demand.</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1 text-[12px] text-admin-fg-muted hover:text-admin-fg"
        >
          View live site <ArrowUpRight className="size-3" />
        </Link>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="group rounded-lg border border-admin-border bg-admin-surface p-4 transition-colors hover:bg-admin-hover"
            >
              <div className="flex items-center justify-between">
                <Icon className="size-3.5 text-admin-fg-subtle" />
                <ArrowUpRight className="size-3 text-admin-fg-subtle opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-3 font-display text-[28px] font-medium leading-none text-admin-fg">{c.value}</div>
              <div className="mt-1 text-[12px] text-admin-fg-subtle">{c.label}</div>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent leads</CardTitle>
            <Link href="/admin/leads" className="text-[12px] text-admin-fg-muted hover:text-admin-fg">
              View all
            </Link>
          </CardHeader>
          <CardContent className="!p-0">
            {recentLeads.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px] text-admin-fg-subtle">No leads yet.</div>
            ) : (
              <table className="w-full text-[13px]">
                <tbody className="divide-y divide-admin-border-soft">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-admin-fg">{lead.name ?? lead.email}</div>
                        <div className="text-[11px] text-admin-fg-subtle">
                          {lead.company ? `${lead.company} · ` : ""}
                          {lead.kind}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-admin-fg-muted">{lead.email}</td>
                      <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                      <td className="px-4 py-3 text-right text-[11px] text-admin-fg-subtle">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-[13px]">
            {[
              { href: "/admin/services/new", label: "New service" },
              { href: "/admin/work/new", label: "New case study" },
              { href: "/admin/insights/new", label: "New insight" },
              { href: "/admin/media", label: "Upload media" },
              { href: "/admin/settings", label: "Edit site settings" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center justify-between rounded-md border border-admin-border-soft px-3 py-2 text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg"
              >
                {a.label}
                <ArrowUpRight className="size-3" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
