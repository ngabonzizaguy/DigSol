import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseUserAgent } from "@/lib/admin/parse-user-agent";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path : null;
    if (!path) return NextResponse.json({ ok: false }, { status: 400 });

    const ua = request.headers.get("user-agent");
    const parsed = parseUserAgent(ua);
    const country =
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry") ??
      null;
    const region =
      request.headers.get("x-vercel-ip-country-region") ?? null;

    const supabase = await createClient();
    await supabase.from("page_views").insert({
      path,
      referrer: typeof body.referrer === "string" ? body.referrer : null,
      user_agent: ua,
      session_id: typeof body.session_id === "string" ? body.session_id : null,
      country,
      region,
      utm_source: typeof body.utm_source === "string" ? body.utm_source : null,
      utm_medium: typeof body.utm_medium === "string" ? body.utm_medium : null,
      utm_campaign: typeof body.utm_campaign === "string" ? body.utm_campaign : null,
      device_type: parsed.device_type,
      browser: parsed.browser,
      os: parsed.os,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
