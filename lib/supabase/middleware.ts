import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const isAdminRoute = url.pathname.startsWith("/admin");
  const isAdminLogin = url.pathname === "/admin/login";

  let role: string | null = null;
  let permissions: Record<string, unknown> | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, permissions")
      .eq("id", user.id)
      .maybeSingle();
    role = profile?.role ?? null;
    permissions = (profile?.permissions as Record<string, unknown> | null) ?? null;
  }

  const canAccessAdmin = role === "admin" || role === "editor" || role === "viewer";

  if (isAdminRoute && !isAdminLogin && !user) {
    url.pathname = "/admin/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && !isAdminLogin && user && !canAccessAdmin) {
    url.pathname = "/admin/login";
    url.searchParams.set("error", "unauthorized");
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && !isAdminLogin && user && role && role !== "admin") {
    const { canAccessRoute } = await import("@/lib/admin/permissions");
    const overrides = permissions as import("@/lib/admin/permissions").PermissionOverrides | null;
    if (
      !canAccessRoute(
        role as "editor" | "viewer",
        url.pathname,
        overrides
      )
    ) {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  if (isAdminLogin && user && canAccessAdmin) {
    url.pathname = "/admin";
    url.searchParams.delete("next");
    url.searchParams.delete("error");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
