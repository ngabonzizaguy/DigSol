import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path : null;
    if (!path) return NextResponse.json({ ok: false }, { status: 400 });

    const supabase = await createClient();
    await supabase.from("page_views").insert({
      path,
      referrer: typeof body.referrer === "string" ? body.referrer : null,
      user_agent: request.headers.get("user-agent"),
      session_id: typeof body.session_id === "string" ? body.session_id : null,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
