import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/admin/ui/card";

export const metadata = { title: "Activity" };
export const dynamic = "force-dynamic";

const ENTITY_FILTERS = [
  { key: "leads", label: "Leads" },
  { key: "case_studies", label: "Work" },
  { key: "services", label: "Services" },
  { key: "industries", label: "Industries" },
  { key: "insights", label: "Insights" },
  { key: "guides", label: "Guides" },
  { key: "testimonials", label: "Testimonials" },
  { key: "team_members", label: "Team" },
  { key: "open_roles", label: "Roles" },
  { key: "media", label: "Media" },
  { key: "page_sections", label: "Pages" },
  { key: "site_settings", label: "Settings" },
  { key: "page_views", label: "Analytics" },
  { key: "profiles", label: "Users" },
] as const;

const ACTION_LABELS: Record<string, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  publish: "Published",
  unpublish: "Unpublished",
  upload: "Uploaded",
  reply: "Replied",
  note: "Added note",
  status: "Changed status",
  reset: "Reset",
  "create:contact": "New contact submission",
  "create:consultation": "New consultation request",
  "create:newsletter": "Newsletter signup",
  "create:guide": "Guide download",
  "create:quick_start": "Quick Start submission",
};

function actionLabel(action: string) {
  if (ACTION_LABELS[action]) return ACTION_LABELS[action];
  if (action.startsWith("create:")) return `New ${action.slice(7)} submission`;
  return action.charAt(0).toUpperCase() + action.slice(1);
}

function entityLabel(entity: string) {
  const match = ENTITY_FILTERS.find((e) => e.key === entity);
  return match?.label ?? entity;
}

function deepLink(entity: string, entityId: string | null, caseStudySlugs: Map<string, string>): string | null {
  if (!entityId) {
    if (entity === "media") return "/admin/media";
    if (entity === "site_settings") return "/admin/settings";
    if (entity === "page_sections") return "/admin/page-sections";
    if (entity === "page_views") return "/admin/analytics";
    return null;
  }
  switch (entity) {
    case "leads":
      return `/admin/leads/${entityId}`;
    case "case_studies": {
      const slug = caseStudySlugs.get(entityId);
      return slug ? `/admin/work/${slug}` : "/admin/work";
    }
    case "services":
      return "/admin/services";
    case "industries":
      return "/admin/industries";
    case "insights":
      return "/admin/insights";
    case "guides":
      return "/admin/guides";
    case "testimonials":
      return "/admin/testimonials";
    case "team_members":
      return "/admin/team";
    case "open_roles":
      return "/admin/careers";
    case "media":
      return "/admin/media";
    case "profiles":
      return "/admin/users";
    case "site_settings":
      return "/admin/settings";
    case "page_sections":
      return "/admin/page-sections";
    default:
      return null;
  }
}

type Row = {
  id: string;
  entity: string;
  entity_id: string | null;
  action: string;
  diff: Record<string, unknown> | null;
  created_at: string;
  actor_id: string | null;
  profiles: { email: string } | null;
};

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ entity?: string; from?: string; to?: string }>;
}) {
  const { entity, from, to } = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("activity_log")
    .select(
      "id, entity, entity_id, action, diff, created_at, actor_id, profiles:profiles!activity_log_actor_id_fkey(email)"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (entity?.trim()) query = query.eq("entity", entity.trim());
  if (from && /^\d{4}-\d{2}-\d{2}$/.test(from)) {
    query = query.gte("created_at", `${from}T00:00:00.000Z`);
  }
  if (to && /^\d{4}-\d{2}-\d{2}$/.test(to)) {
    query = query.lt("created_at", `${to}T23:59:59.999Z`);
  }

  const { data: rows, error } = await query;
  const items = (rows ?? []) as unknown as Row[];

  // Resolve case study slugs in one batch for deep links.
  const caseStudyIds = Array.from(
    new Set(items.filter((r) => r.entity === "case_studies" && r.entity_id).map((r) => r.entity_id as string))
  );
  const caseStudySlugs = new Map<string, string>();
  if (caseStudyIds.length > 0) {
    const { data: cs } = await supabase
      .from("case_studies")
      .select("id, slug")
      .in("id", caseStudyIds);
    for (const row of cs ?? []) caseStudySlugs.set(row.id, row.slug);
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Activity</h1>
        <p className="text-[13px] text-admin-fg-subtle">Audit trail of creates, updates, replies, and deletes.</p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <nav className="flex flex-wrap gap-1">
          <FilterLink href={buildHref({ from, to })} active={!entity}>
            All
          </FilterLink>
          {ENTITY_FILTERS.map((e) => (
            <FilterLink
              key={e.key}
              href={buildHref({ entity: e.key, from, to })}
              active={entity === e.key}
            >
              {e.label}
            </FilterLink>
          ))}
        </nav>
      </div>

      <form className="flex flex-wrap items-center gap-2 rounded-lg border border-admin-border-soft bg-admin-surface p-2">
        {entity ? <input type="hidden" name="entity" value={entity} /> : null}
        <label className="text-[11px] text-admin-fg-subtle">From</label>
        <input
          type="date"
          name="from"
          defaultValue={from ?? ""}
          className="h-7 rounded border border-admin-border bg-admin-bg px-2 text-[12px]"
        />
        <label className="text-[11px] text-admin-fg-subtle">To</label>
        <input
          type="date"
          name="to"
          defaultValue={to ?? ""}
          className="h-7 rounded border border-admin-border bg-admin-bg px-2 text-[12px]"
        />
        <button
          type="submit"
          className="rounded-md bg-admin-accent px-2.5 py-1 text-[11px] font-medium text-admin-accent-fg"
        >
          Apply
        </button>
        {from || to ? (
          <Link
            href={buildHref({ entity })}
            className="text-[11px] text-admin-fg-subtle underline-offset-2 hover:underline"
          >
            Clear dates
          </Link>
        ) : null}
      </form>

      {error ? (
        <Card className="border-error/40">
          <CardContent className="flex items-start gap-2 p-4 text-[13px] text-error">
            <AlertCircle className="mt-0.5 size-4" />
            <div>
              <p className="font-medium">Couldn&apos;t load activity</p>
              <p className="text-[12px] opacity-80">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent className="!p-0">
          {items.length === 0 ? (
            <div className="px-4 py-10 text-center text-[13px] text-admin-fg-subtle">
              No activity in this range yet. Make a change in the admin and refresh.
            </div>
          ) : (
            <ul className="divide-y divide-admin-border-soft">
              {items.map((r) => {
                const link = deepLink(r.entity, r.entity_id, caseStudySlugs);
                return (
                  <li key={r.id} className="px-4 py-3 text-[13px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] text-admin-fg-subtle">
                        {r.profiles?.email ?? (r.actor_id ? r.actor_id.slice(0, 8) : "system")}
                      </span>
                      <span className="font-medium text-admin-fg">{actionLabel(r.action)}</span>
                      <span className="text-admin-fg-subtle">in</span>
                      {link ? (
                        <Link href={link} className="text-admin-accent hover:underline">
                          {entityLabel(r.entity)}
                        </Link>
                      ) : (
                        <span className="text-admin-fg-muted">{entityLabel(r.entity)}</span>
                      )}
                      {r.entity_id ? (
                        <span className="font-mono text-[11px] text-admin-fg-subtle">
                          {r.entity_id.slice(0, 8)}
                        </span>
                      ) : null}
                      <span className="ml-auto text-[11px] text-admin-fg-subtle">
                        {new Date(r.created_at).toLocaleString()}
                      </span>
                    </div>
                    {r.diff && Object.keys(r.diff).length > 0 ? (
                      <details className="mt-2 text-[11px] text-admin-fg-muted">
                        <summary className="cursor-pointer text-admin-fg-subtle">Show diff</summary>
                        <pre className="mt-1 max-h-40 overflow-auto rounded border border-admin-border-soft bg-admin-elevated p-2 font-mono text-[10px]">
                          {JSON.stringify(r.diff, null, 2)}
                        </pre>
                      </details>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function buildHref(params: { entity?: string; from?: string; to?: string }): string {
  const search = new URLSearchParams();
  if (params.entity) search.set("entity", params.entity);
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);
  const qs = search.toString();
  return qs ? `/admin/activity?${qs}` : "/admin/activity";
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-md px-2.5 py-1 text-[12px] ${
        active ? "bg-admin-hover text-admin-fg" : "text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg"
      }`}
    >
      {children}
    </Link>
  );
}
