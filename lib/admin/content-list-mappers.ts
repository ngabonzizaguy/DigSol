import type { ContentListItem } from "@/components/admin/content/content-list-types";
import type {
  CaseStudy,
  Guide,
  Industry,
  Insight,
  OpenRole,
  SegmentKind,
  Service,
  TeamMember,
  Testimonial,
} from "@/lib/supabase/types";

function segmentLabel(segment: SegmentKind): string {
  if (segment === "midmarket") return "Midmarket";
  return segment.toUpperCase();
}

function caseStudyListImage(r: CaseStudy): string | null {
  if (r.cover_url) return r.cover_url;
  const first = r.media_gallery?.[0];
  return first?.url ?? null;
}

export function mapCaseStudies(rows: CaseStudy[]): ContentListItem[] {
  return rows.map((r) => ({
    id: r.id,
    href: `/admin/work/${r.slug}`,
    title: r.title,
    subtitle: `${r.client} · ${r.slug}`,
    imageUrl: caseStudyListImage(r),
    featured: r.featured,
    pills: [{ label: segmentLabel(r.segment), tone: "accent" }],
    detail: r.industry,
    status: r.status,
    updatedAt: r.updated_at,
    filterValues: { status: r.status, segment: segmentLabel(r.segment), industry: r.industry },
  }));
}

export function mapServices(rows: Pick<Service, "id" | "slug" | "title" | "short" | "status" | "updated_at">[]): ContentListItem[] {
  return rows.map((r) => ({
    id: r.id,
    href: `/admin/services/${r.slug}`,
    title: r.title,
    subtitle: r.slug,
    detail: r.short,
    status: r.status,
    updatedAt: r.updated_at,
    filterValues: { status: r.status },
  }));
}

export function mapIndustries(rows: Industry[]): ContentListItem[] {
  return rows.map((r) => ({
    id: r.id,
    href: `/admin/industries/${r.slug}`,
    title: r.name,
    subtitle: r.slug,
    detail: r.short,
    status: r.status,
    updatedAt: r.updated_at,
    filterValues: { status: r.status },
  }));
}

export function mapInsights(rows: Insight[]): ContentListItem[] {
  return rows.map((r) => ({
    id: r.id,
    href: `/admin/insights/${r.slug}`,
    title: r.title,
    subtitle: r.slug,
    imageUrl: r.cover_url,
    pills: [{ label: r.category, tone: "neutral" }],
    detail: r.author,
    status: r.status,
    updatedAt: r.updated_at ?? r.published_at,
    filterValues: { status: r.status, category: r.category },
  }));
}

export function mapGuides(rows: Guide[]): ContentListItem[] {
  return rows.map((r) => ({
    id: r.id,
    href: `/admin/guides/${r.slug}`,
    title: r.title,
    subtitle: r.slug,
    pills: [{ label: r.format, tone: "neutral" }],
    detail: `${r.pages} pages`,
    status: r.status,
    updatedAt: r.updated_at,
    filterValues: { status: r.status, format: r.format },
  }));
}

export function mapTestimonials(rows: Testimonial[]): ContentListItem[] {
  return rows.map((r) => ({
    id: r.id,
    href: `/admin/testimonials/${r.id}`,
    title: r.name,
    subtitle: `${r.role}, ${r.company}`,
    detail: r.quote,
    status: r.status,
    updatedAt: r.updated_at,
    filterValues: { status: r.status },
  }));
}

export function mapTeamMembers(rows: TeamMember[]): ContentListItem[] {
  return rows.map((r) => ({
    id: r.id,
    href: `/admin/team/${r.id}`,
    title: r.name,
    subtitle: r.role,
    imageUrl: r.avatar_url,
    detail: r.bio,
    status: r.status,
    updatedAt: r.updated_at,
    filterValues: { status: r.status },
  }));
}

export function mapOpenRoles(rows: OpenRole[]): ContentListItem[] {
  return rows.map((r) => ({
    id: r.id,
    href: `/admin/careers/${r.slug}`,
    title: r.title,
    subtitle: r.slug,
    pills: [{ label: r.team, tone: "neutral" }],
    detail: `${r.location} · ${r.employment_type}`,
    status: r.status,
    updatedAt: r.updated_at,
    filterValues: { status: r.status, team: r.team },
  }));
}

export const STATUS_FILTER = { id: "status", allLabel: "All status" } as const;
