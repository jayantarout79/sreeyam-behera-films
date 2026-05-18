import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviteSchema } from "@/lib/validators/invite";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = inviteSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 422 }
      );
    }

    const {
      unique_slug,
      photo_1_url,
      photo_2_url,
      slide_1_url,
      slide_2_url,
      slide_3_url,
      slide_4_url,
      custom_colors,
      rsvp_info,
    } = body as {
      unique_slug: string;
      photo_1_url?: string;
      photo_2_url?: string;
      slide_1_url?: string;
      slide_2_url?: string;
      slide_3_url?: string;
      slide_4_url?: string;
      custom_colors?: { primary: string; secondary: string; accent: string };
      rsvp_info?: { phone?: string; email?: string } | null;
    };

    if (!unique_slug || unique_slug.length < 8) {
      return Response.json({ error: "Invalid slug" }, { status: 422 });
    }

    // Use admin client for all writes — bypasses RLS, avoids FK issues
    const admin = createAdminClient();

    // Ensure photographer_profiles row exists for this user
    const { error: profileError } = await admin
      .from("photographer_profiles")
      .upsert(
        {
          id: user.id,
          email: user.email ?? "",
          business_name: "Sreeyam Behera Films",
        },
        { onConflict: "id" }
      );

    if (profileError) {
      console.error("[api/invites] profile upsert error:", profileError.message, profileError.details);
      return Response.json(
        { error: "Failed to initialize profile: " + profileError.message },
        { status: 500 }
      );
    }

    // Check slug uniqueness
    const { data: existing } = await admin
      .from("wedding_invites")
      .select("id")
      .eq("unique_slug", unique_slug)
      .single();

    const slug = existing
      ? Array.from(crypto.getRandomValues(new Uint8Array(8)))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
      : unique_slug;

    const { data, error } = await admin
      .from("wedding_invites")
      .insert({
        unique_slug: slug,
        created_by: user.id,
        bride_name: parsed.data.bride_name,
        groom_name: parsed.data.groom_name,
        event_date: parsed.data.event_date,
        event_time: parsed.data.event_time ?? null,
        event_location: parsed.data.event_location ?? null,
        venue_name: parsed.data.venue_name ?? null,
        couple_story: parsed.data.couple_story ?? null,
        photo_1_url: photo_1_url ?? null,
        photo_2_url: photo_2_url ?? null,
        slide_1_url: slide_1_url ?? null,
        slide_2_url: slide_2_url ?? null,
        slide_3_url: slide_3_url ?? null,
        slide_4_url: slide_4_url ?? null,
        rsvp_info: rsvp_info ?? null,
        custom_colors: custom_colors ?? null,
        template_id: parsed.data.template_id ?? null,
        shared_at: null,
      })
      .select()
      .single();

    if (error) {
      console.error("[api/invites] insert error:", error.message, error.details, error.hint);
      return Response.json(
        { error: "Failed to create invite: " + error.message },
        { status: 500 }
      );
    }

    return Response.json({ invite: data }, { status: 201 });
  } catch (err) {
    console.error("[api/invites] unexpected error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("wedding_invites")
      .select("*")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api/invites GET] error:", error.message);
      return Response.json({ error: "Failed to fetch invites" }, { status: 500 });
    }

    return Response.json({ invites: data });
  } catch (err) {
    console.error("[api/invites GET]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
