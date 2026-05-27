import type { ContentStatus } from "@/lib/supabase/types";

export type ContentListItem = {
  id: string;
  href: string;
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  featured?: boolean;
  pills?: { label: string; tone?: "accent" | "neutral" }[];
  detail?: string;
  status: ContentStatus;
  updatedAt?: string | null;
  /** Values used by filter dropdowns (e.g. segment, industry, category). */
  filterValues?: Record<string, string>;
};

export type ContentListFilterDef = {
  id: string;
  allLabel: string;
};

export type ContentListSort = "newest" | "oldest" | "title-az" | "title-za";
