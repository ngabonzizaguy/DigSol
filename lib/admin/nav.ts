import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Folder,
  FileText,
  BookOpen,
  MessageSquareQuote,
  Users,
  UserCog,
  Inbox,
  Image as ImageIcon,
  Settings,
  Activity,
  BarChart3,
  PanelsTopLeft,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const adminNav: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/activity", label: "Activity", icon: Activity },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/services", label: "Services", icon: Briefcase },
      { href: "/admin/industries", label: "Industries", icon: Building2 },
      { href: "/admin/work", label: "Case studies", icon: Folder },
      { href: "/admin/insights", label: "Insights", icon: FileText },
      { href: "/admin/guides", label: "Guides", icon: BookOpen },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/careers", label: "Open roles", icon: UserCog },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/leads", label: "Leads", icon: Inbox },
      { href: "/admin/media", label: "Media", icon: ImageIcon },
    ],
  },
  {
    label: "Workspace",
    items: [
      { href: "/admin/page-sections", label: "Page sections", icon: PanelsTopLeft },
      { href: "/admin/users", label: "Users & roles", icon: UserCog },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];
