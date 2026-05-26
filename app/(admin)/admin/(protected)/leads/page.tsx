import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/ui/data-table";
import { Badge, StatusBadge } from "@/components/admin/ui/badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import type { Lead, LeadKind } from "@/lib/supabase/types";

export const metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

const TABS: { label: string; status: string | "all" }[] = [
  { label: "All", status: "all" },
  { label: "New", status: "new" },
  { label: "In progress", status: "in_progress" },
  { label: "Replied", status: "replied" },
  { label: "Closed", status: "closed" },
  { label: "Qualified", status: "qualified" },
];

const KINDS: { label: string; value: LeadKind | "all" }[] = [
  { label: "All types", value: "all" },
  { label: "Contact", value: "contact" },
  { label: "Consultation", value: "consultation" },
  { label: "Newsletter", value: "newsletter" },
];

const PAGE_SIZE = 50;

export default async function LeadsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; kind?: string; q?: string; page?: string }>;
}) {
  const { status, kind, q, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();

  const counts: Record<string, number> = { all: 0 };
  for (const t of TABS) {
    if (t.status === "all") continue;
    const { count } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", t.status);
    counts[t.status] = count ?? 0;
  }
  const { count: allCount } = await supabase.from("leads").select("*", { count: "exact", head: true });
  counts.all = allCount ?? 0;

  let query = supabase.from("leads").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (status && status !== "all") query = query.eq("status", status);
  if (kind && kind !== "all") query = query.eq("kind", kind);
  if (q?.trim()) {
    const term = `%${q.trim()}%`;
    query = query.or(`email.ilike.${term},name.ilike.${term},company.ilike.${term},message.ilike.${term}`);
  }
  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data, count } = await query;
  const leads = (data ?? []) as Lead[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function hrefFor(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    const s = overrides.status ?? status ?? "all";
    const k = overrides.kind ?? kind ?? "all";
    const query = overrides.q ?? q ?? "";
    const pg = overrides.page ?? String(page);
    if (s !== "all") p.set("status", s);
    if (k && k !== "all") p.set("kind", k);
    if (query.trim()) p.set("q", query.trim());
    if (pg !== "1") p.set("page", pg);
    const qs = p.toString();
    return qs ? `/admin/leads?${qs}` : "/admin/leads";
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Leads</h1>
        <p className="text-[13px] text-admin-fg-subtle">Form submissions with reply thread and pipeline status.</p>
      </header>

      <Card>
        <CardContent className="!p-0">
          <nav className="flex flex-wrap items-center gap-1 border-b border-admin-border-soft px-2 py-1.5">
            {TABS.map((t) => {
              const active = (status ?? "all") === t.status;
              const n = counts[t.status] ?? 0;
              return (
                <Link
                  key={t.status}
                  href={hrefFor({ status: t.status, page: "1" })}
                  className={`rounded-md px-2.5 py-1 text-[12px] ${active ? "bg-admin-hover text-admin-fg" : "text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg"}`}
                >
                  {t.label}
                  <span className="ml-1.5 text-admin-fg-subtle">{n}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-3 border-b border-admin-border-soft px-3 py-3 sm:flex-row sm:items-center">
            <form className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center" action="/admin/leads" method="get">
              {status && status !== "all" ? <input type="hidden" name="status" value={status} /> : null}
              {kind && kind !== "all" ? <input type="hidden" name="kind" value={kind} /> : null}
              <Input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search email, name, company…"
                className="max-w-md"
              />
              <select
                name="kind"
                defaultValue={kind ?? "all"}
                className="h-8 rounded-md border border-admin-border bg-admin-bg px-2 text-[12px] text-admin-fg"
              >
                {KINDS.map((k) => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
              <button
                type="submit"
                className="h-8 rounded-md bg-admin-accent px-3 text-[12px] font-medium text-admin-accent-fg"
              >
                Filter
              </button>
            </form>
          </div>

          {leads.length === 0 ? (
            <EmptyState title="No leads yet" description="Form submissions will appear here." />
          ) : (
            <>
              <DataTable<Lead>
                data={leads}
                rowHref={(r) => `/admin/leads/${r.id}`}
                columns={[
                  {
                    key: "who",
                    header: "Person",
                    cell: (r) => (
                      <div>
                        <div className="font-medium text-admin-fg">{r.name ?? r.email}</div>
                        <div className="text-[11px] text-admin-fg-subtle">{r.email}{r.company ? ` · ${r.company}` : ""}</div>
                      </div>
                    ),
                  },
                  { key: "kind", header: "Type", width: "120px", cell: (r) => <Badge>{r.kind}</Badge> },
                  { key: "msg", header: "Message", cell: (r) => <span className="text-admin-fg-muted line-clamp-1">{r.message ?? r.intent ?? "—"}</span> },
                  { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} />, width: "120px" },
                  { key: "when", header: "Received", align: "right", width: "140px", cell: (r) => <span className="text-[11px] text-admin-fg-subtle">{new Date(r.created_at).toLocaleString()}</span> },
                ]}
              />
              {totalPages > 1 ? (
                <div className="flex items-center justify-between border-t border-admin-border-soft px-4 py-2 text-[12px] text-admin-fg-subtle">
                  <span>
                    Page {page} of {totalPages} ({total} leads)
                  </span>
                  <div className="flex gap-2">
                    {page > 1 ? (
                      <Link href={hrefFor({ page: String(page - 1) })} className="text-admin-fg hover:underline">
                        Previous
                      </Link>
                    ) : null}
                    {page < totalPages ? (
                      <Link href={hrefFor({ page: String(page + 1) })} className="text-admin-fg hover:underline">
                        Next
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
