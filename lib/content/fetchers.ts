// Server-side content fetchers — try Supabase first, fall back to local static data.
// Returns shape compatible with the existing marketing pages (which consume the local exports).
import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { services as _services } from "@/lib/content/services";
import { industries as _industries } from "@/lib/content/industries";
import { caseStudies as _caseStudies } from "@/lib/content/work";
import { insights as _insights, guides as _guides } from "@/lib/content/insights";
import { testimonials as _testimonials } from "@/lib/content/testimonials";
import { leadership as _leadership, openRoles as _openRoles } from "@/lib/content/team";

const hasSupabase = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

type Service = (typeof _services)[number];
type CaseStudy = (typeof _caseStudies)[number];

function getClient() {
  return createPublicClient();
}

function normalizeService(row: Service): Service {
  return {
    ...row,
    outcomes: Array.isArray(row.outcomes) ? row.outcomes : [],
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    capabilities: Array.isArray(row.capabilities) ? row.capabilities : [],
  };
}

function normalizeCaseStudy(row: CaseStudy): CaseStudy {
  return {
    ...row,
    services: Array.isArray(row.services) ? row.services : [],
    metrics: Array.isArray(row.metrics) ? row.metrics : [],
  };
}

async function tryFetch<T>(thenable: PromiseLike<{ data: unknown[] | null; error: unknown }>, fallback: T[]): Promise<T[]> {
  if (!hasSupabase()) return fallback;
  const supabase = getClient();
  if (!supabase) return fallback;
  try {
    const { data, error } = await thenable;
    if (error || !data || data.length === 0) return fallback;
    return data as T[];
  } catch {
    return fallback;
  }
}

// ---------- Services ----------
export async function getServices() {
  const supabase = getClient()!;
  const rows = await tryFetch(
    supabase.from("services").select("*").eq("status", "published").order("sort_order").order("title"),
    _services,
  );
  return rows.map(normalizeService);
}
export async function getService(slug: string) {
  const list = await getServices();
  return list.find((s) => s.slug === slug);
}

// ---------- Industries ----------
export async function getIndustries() {
  const supabase = getClient()!;
  return tryFetch(
    supabase.from("industries").select("*").eq("status", "published").order("sort_order").order("name"),
    _industries,
  );
}
export async function getIndustry(slug: string) {
  const list = await getIndustries();
  return list.find((i) => i.slug === slug);
}

// ---------- Case studies ----------
export async function getCaseStudies() {
  const supabase = getClient()!;
  const rows = await tryFetch(
    supabase
      .from("case_studies")
      .select("*")
      .eq("status", "published")
      .order("sort_order")
      .order("created_at", { ascending: false }),
    _caseStudies,
  );
  return rows.map(normalizeCaseStudy);
}
export async function getCaseStudy(slug: string) {
  const list = await getCaseStudies();
  return list.find((c) => c.slug === slug);
}

// ---------- Insights ----------
type LocalInsight = (typeof _insights)[number];
type SupabaseInsightRow = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  author: string;
  author_role: string;
  category: string;
  read_time: string;
  published_at: string | null;
  created_at: string;
  cover_url: string | null;
};

function normalizeInsight(row: SupabaseInsightRow): LocalInsight {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    author: row.author,
    role: row.author_role,
    readTime: row.read_time,
    category: row.category as LocalInsight["category"],
    date: row.published_at ?? row.created_at,
    cover_url: row.cover_url,
  };
}

export async function getInsights(): Promise<LocalInsight[]> {
  if (!hasSupabase()) return _insights;
  try {
    const supabase = getClient();
    if (!supabase) return _insights;
    const { data, error } = await supabase
      .from("insights")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });
    if (error || !data || data.length === 0) return _insights;
    return (data as SupabaseInsightRow[]).map(normalizeInsight);
  } catch {
    return _insights;
  }
}
export async function getInsight(slug: string) {
  const list = await getInsights();
  return list.find((p) => p.slug === slug);
}

// ---------- Guides ----------
export async function getGuides() {
  const supabase = getClient()!;
  return tryFetch(
    supabase.from("guides").select("*").eq("status", "published").order("sort_order"),
    _guides,
  );
}

// ---------- Testimonials ----------
export async function getTestimonials() {
  const supabase = getClient()!;
  return tryFetch(
    supabase.from("testimonials").select("*").eq("status", "published").order("sort_order"),
    _testimonials,
  );
}

// ---------- Team ----------
type LocalTeamMember = (typeof _leadership)[number];
export async function getLeadership(): Promise<LocalTeamMember[]> {
  if (!hasSupabase()) return _leadership;
  try {
    const supabase = getClient();
    if (!supabase) return _leadership;
    const { data, error } = await supabase
      .from("team_members")
      .select("name, role, bio")
      .eq("status", "published")
      .order("sort_order");
    if (error || !data || data.length === 0) return _leadership;
    return data as LocalTeamMember[];
  } catch {
    return _leadership;
  }
}

// ---------- Open roles ----------
type LocalOpenRole = (typeof _openRoles)[number];
type SupabaseRoleRow = { slug: string; title: string; team: string; location: string; employment_type: string };
export async function getOpenRoles(): Promise<LocalOpenRole[]> {
  if (!hasSupabase()) return _openRoles;
  try {
    const supabase = getClient();
    if (!supabase) return _openRoles;
    const { data, error } = await supabase
      .from("open_roles")
      .select("slug, title, team, location, employment_type")
      .eq("status", "published");
    if (error || !data || data.length === 0) return _openRoles;
    return (data as SupabaseRoleRow[]).map((r) => ({
      slug: r.slug,
      title: r.title,
      team: r.team,
      location: r.location,
      type: r.employment_type as LocalOpenRole["type"],
    }));
  } catch {
    return _openRoles;
  }
}
export async function getOpenRole(slug: string) {
  const list = await getOpenRoles();
  return list.find((r) => r.slug === slug);
}
