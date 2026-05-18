import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inviteId = parseInt(id, 10);

    if (isNaN(inviteId)) {
      return Response.json({ error: "Invalid invite ID" }, { status: 400 });
    }

    // Verify session
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // Verify ownership before deleting
    const { data: rawInvite } = await admin
      .from("wedding_invites")
      .select("id, created_by")
      .eq("id", inviteId)
      .single();

    const invite = rawInvite as { id: number; created_by: string } | null;

    if (!invite) {
      return Response.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.created_by !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await admin
      .from("wedding_invites")
      .delete()
      .eq("id", inviteId);

    if (error) {
      console.error("[api/invites/[id]] delete error:", error.message);
      return Response.json({ error: "Failed to delete invite" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[api/invites/[id]] unexpected error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
