// Database types — manually authored to mirror the migrations.
// Once the project is live, `supabase gen types typescript` can replace this file.

export type ContentStatus = "draft" | "published" | "archived";
export type SegmentKind = "smb" | "midmarket" | "enterprise";
export type OrbColor = "mint" | "peach" | "lavender" | "sky" | "rose";
export type LeadKind = "contact" | "consultation" | "newsletter" | "guide" | "quick_start";

export type BudgetCurrency = "RWF" | "USD";
export type PreferredChannel = "email" | "whatsapp" | "phone";
export type LeadAttachmentKind = "image" | "document" | "link" | "voice";
export type LeadStatus =
  | "new"
  | "in_progress"
  | "replied"
  | "closed"
  | "qualified"
  | "contacted"
  | "won"
  | "lost";
export type UserRole = "admin" | "editor" | "viewer";

export type Service = {
  id: string;
  slug: string;
  title: string;
  short: string;
  long: string;
  outcomes: string[];
  deliverables: string[];
  capabilities: string[];
  orb: OrbColor;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Industry = {
  id: string;
  slug: string;
  name: string;
  short: string;
  challenges: string[];
  solutions: string[];
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CaseStudyMetric = { label: string; value: string };

export type CaseStudyMediaItem = {
  url: string;
  mime?: string;
  alt?: string;
  caption?: string;
};

export type CaseStudy = {
  id: string;
  slug: string;
  client: string;
  title: string;
  segment: SegmentKind;
  industry: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  metrics: CaseStudyMetric[];
  service_slugs: string[];
  cover_url: string | null;
  orb: OrbColor;
  status: ContentStatus;
  featured: boolean;
  sort_order: number;
  project_url: string | null;
  show_project_url: boolean;
  customer_quote: string | null;
  customer_name: string | null;
  customer_role: string | null;
  media_gallery: CaseStudyMediaItem[];
  created_at: string;
  updated_at: string;
};

export type Insight = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  author: string;
  author_role: string;
  category: string;
  read_time: string;
  cover_url: string | null;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Guide = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  format: string;
  pages: number;
  file_url: string | null;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar_url: string | null;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type OpenRole = {
  id: string;
  slug: string;
  title: string;
  team: string;
  location: string;
  employment_type: string;
  description: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  kind: LeadKind;
  name: string | null;
  email: string;
  company: string | null;
  role: string | null;
  company_size: string | null;
  timeline: string | null;
  intent: string | null;
  message: string | null;
  payload: Record<string, unknown>;
  status: LeadStatus;
  notes: string | null;
  assigned_to: string | null;
  replied_at: string | null;
  closed_at: string | null;
  first_response_at: string | null;
  phone: string | null;
  country_code: string | null;
  phone_dial_code: string | null;
  budget_min: number | null;
  budget_max: number | null;
  budget_currency: BudgetCurrency | null;
  budget_unsure: boolean;
  preferred_channel: PreferredChannel | null;
  preferred_window: string | null;
  service_slugs: string[];
  custom_request: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadAttachment = {
  id: string;
  lead_id: string;
  kind: LeadAttachmentKind;
  storage_path: string | null;
  url: string | null;
  original_name: string | null;
  mime: string | null;
  size_bytes: number | null;
  duration_ms: number | null;
  created_at: string;
};

export type LeadMessage = {
  id: string;
  lead_id: string;
  direction: "outbound" | "inbound" | "note";
  channel: "email" | "internal";
  subject: string | null;
  body: string;
  to_email: string | null;
  from_email: string | null;
  provider: "mock" | "resend";
  provider_id: string | null;
  created_by: string | null;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  brand: { name?: string; legal?: string; tagline?: string; description?: string };
  contact: { email?: string; phone?: string };
  social: { linkedin?: string; x?: string; instagram?: string; youtube?: string };
  seo_defaults: { keywords?: string[] };
  pricing_tiers: { name: string; price: string; cadence: string; featured?: boolean }[];
  integrations: Record<string, unknown>;
  updated_at: string;
};

export type MediaItem = {
  id: string;
  path: string;
  mime: string;
  width: number | null;
  height: number | null;
  bytes: number;
  alt: string | null;
  uploaded_by: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatar_url: string | null;
  permissions: Record<string, string[]> | null;
  created_at: string;
  updated_at: string;
};

export type ActivityLog = {
  id: string;
  actor_id: string | null;
  entity: string;
  entity_id: string | null;
  action: string;
  diff: Record<string, unknown> | null;
  created_at: string;
};
