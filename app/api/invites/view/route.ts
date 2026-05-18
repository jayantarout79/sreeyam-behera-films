import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return Response.json({ error: "slug required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Atomic increment via RPC — falls back to direct update if RPC not yet created
    const { error: rpcError } = await supabase.rpc("increment_view_count", {
      invite_slug: slug,
    });

    if (rpcError) {
      // Fallback: direct increment
      await supabase.rpc("increment_view_count_fallback" as never, { invite_slug: slug });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[api/invites/view]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
