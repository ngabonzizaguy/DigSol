import { adminNav } from "@/lib/admin/nav";

export type AdminRole = "admin" | "editor" | "viewer";

export type AdminResource =
  | "dashboard"
  | "analytics"
  | "activity"
  | "content"
  | "leads"
  | "media"
  | "page_sections"
  | "users"
  | "settings"
  | "ai"
  | "account";

export type AdminAction = "read" | "create" | "update" | "delete" | "reply" | "publish" | "manage";

const ALL_ACTIONS: AdminAction[] = ["read", "create", "update", "delete", "reply", "publish", "manage"];

export const ROLE_PRESETS: Record<AdminRole, Partial<Record<AdminResource, AdminAction[]>>> = {
  admin: {
    dashboard: ALL_ACTIONS,
    analytics: ALL_ACTIONS,
    activity: ALL_ACTIONS,
    content: ALL_ACTIONS,
    leads: ALL_ACTIONS,
    media: ALL_ACTIONS,
    page_sections: ALL_ACTIONS,
    users: ALL_ACTIONS,
    settings: ALL_ACTIONS,
    ai: ALL_ACTIONS,
    account: ALL_ACTIONS,
  },
  editor: {
    dashboard: ["read"],
    analytics: ["read"],
    activity: ["read"],
    content: ["read", "create", "update", "delete", "publish"],
    leads: ["read", "update", "reply"],
    media: ["read", "create", "update", "delete"],
    page_sections: ["read", "update"],
    users: [],
    settings: [],
    ai: ["read"],
    account: ["read", "update"],
  },
  viewer: {
    dashboard: ["read"],
    analytics: ["read"],
    activity: ["read"],
    leads: ["read"],
    content: ["read"],
    media: ["read"],
    page_sections: ["read"],
    users: [],
    settings: [],
    ai: ["read"],
    account: ["read", "update"],
  },
};

export type PermissionOverrides = Partial<Record<AdminResource, AdminAction[]>>;

/** Human labels for the permissions matrix UI */
export const PERMISSION_RESOURCES: { key: AdminResource; label: string; actions: AdminAction[] }[] = [
  { key: "dashboard", label: "Dashboard", actions: ["read"] },
  { key: "analytics", label: "Analytics", actions: ["read"] },
  { key: "activity", label: "Activity log", actions: ["read"] },
  { key: "content", label: "Content (services, insights, …)", actions: ["read", "create", "update", "delete", "publish"] },
  { key: "leads", label: "Leads", actions: ["read", "update", "reply"] },
  { key: "media", label: "Media library", actions: ["read", "create", "update", "delete"] },
  { key: "page_sections", label: "Page sections", actions: ["read", "update"] },
  { key: "users", label: "Users & roles", actions: ["read", "manage"] },
  { key: "settings", label: "Site settings", actions: ["read", "update"] },
  { key: "ai", label: "AI features", actions: ["read", "update"] },
  { key: "account", label: "Account (own profile)", actions: ["read", "update"] },
];

export function getEffectivePermissions(
  role: AdminRole,
  overrides: PermissionOverrides | null | undefined
): Partial<Record<AdminResource, AdminAction[]>> {
  const base = ROLE_PRESETS[role] ?? {};
  if (!overrides || typeof overrides !== "object") return base;
  return { ...base, ...overrides };
}

export function canAccessRoute(
  role: AdminRole,
  pathname: string,
  overrides?: PermissionOverrides | null
): boolean {
  const perms = getEffectivePermissions(role, overrides);
  const has = (resource: AdminResource) => (perms[resource]?.includes("read") ?? false);

  if (pathname === "/admin" || pathname.startsWith("/admin/dashboard")) return has("dashboard");
  if (pathname.startsWith("/admin/analytics")) return has("analytics");
  if (pathname.startsWith("/admin/activity")) return has("activity");
  if (pathname.startsWith("/admin/leads")) return has("leads");
  if (pathname.startsWith("/admin/media")) return has("media");
  if (pathname.startsWith("/admin/users")) return has("users");
  if (pathname.startsWith("/admin/settings")) return has("settings");
  if (pathname.startsWith("/admin/ai")) return has("ai");
  if (pathname.startsWith("/admin/account")) return has("account");
  if (pathname.startsWith("/admin/page-sections")) return has("page_sections");
  if (
    pathname.startsWith("/admin/services") ||
    pathname.startsWith("/admin/industries") ||
    pathname.startsWith("/admin/work") ||
    pathname.startsWith("/admin/insights") ||
    pathname.startsWith("/admin/guides") ||
    pathname.startsWith("/admin/testimonials") ||
    pathname.startsWith("/admin/team") ||
    pathname.startsWith("/admin/careers")
  ) {
    return has("content");
  }
  return role === "admin";
}

export function canPerform(
  role: AdminRole,
  resource: AdminResource,
  action: AdminAction,
  overrides?: PermissionOverrides | null
): boolean {
  if (role === "admin") return true;
  const perms = getEffectivePermissions(role, overrides);
  return perms[resource]?.includes(action) ?? false;
}

export async function requirePermission(
  profile: { role: AdminRole; permissions?: PermissionOverrides | null },
  resource: AdminResource,
  action: AdminAction
) {
  if (!canPerform(profile.role, resource, action, profile.permissions ?? null)) {
    throw new Error("You do not have permission for this action.");
  }
}

export function filterNavForProfile(role: AdminRole, overrides?: PermissionOverrides | null) {
  return adminNav
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessRoute(role, item.href, overrides)),
    }))
    .filter((g) => g.items.length > 0);
}
