"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { adminNav } from "@/lib/admin/nav";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/admin/shell/sidebar-context";

export function AdminSidebar() {
  const pathname = usePathname();
  const { collapsed, mobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-admin-border bg-admin-surface transition-[transform,width] duration-200 ease-out md:sticky md:top-0 md:h-screen md:translate-x-0",
          collapsed ? "md:w-[60px]" : "md:w-60",
          "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-12 items-center gap-2 border-b border-admin-border px-3 text-[13px] font-semibold tracking-tight">
          <Link href="/admin" className="flex min-w-0 items-center gap-2">
            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-admin-accent text-[11px] font-bold text-admin-accent-fg">
              D
            </span>
            {!collapsed ? (
              <>
                <span className="truncate">DigSolutions</span>
                <span className="ml-1 rounded bg-admin-border-soft px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-admin-fg-subtle">
                  Admin
                </span>
              </>
            ) : null}
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMobile}
            className="ml-auto rounded-md p-1 text-admin-fg-subtle hover:bg-admin-hover hover:text-admin-fg md:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 text-[13px]">
          {adminNav.map((group) => (
            <div key={group.label} className="mb-4">
              {!collapsed ? (
                <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-admin-fg-subtle">
                  {group.label}
                </div>
              ) : (
                <div className="mx-2 mb-1.5 h-px bg-admin-border-soft" aria-hidden />
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "group flex items-center gap-2 rounded-md py-1.5 text-admin-fg-muted transition-colors",
                          collapsed ? "justify-center px-0" : "px-2",
                          active
                            ? "bg-admin-hover text-admin-fg"
                            : "hover:bg-admin-hover hover:text-admin-fg"
                        )}
                      >
                        <Icon className={cn("size-3.5 shrink-0", active ? "text-admin-fg" : "text-admin-fg-subtle")} />
                        {!collapsed ? (
                          <>
                            <span className="truncate">{item.label}</span>
                            {item.badge ? (
                              <span className="ml-auto rounded bg-admin-accent px-1.5 py-0.5 text-[10px] font-medium text-admin-accent-fg">
                                {item.badge}
                              </span>
                            ) : null}
                          </>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {!collapsed ? (
          <div className="border-t border-admin-border px-4 py-2.5 text-[11px] text-admin-fg-subtle">
            v0.1 · build {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local"}
          </div>
        ) : null}
      </aside>
    </>
  );
}
