import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export async function POST(request: Request) {
  try {
    // Verify authenticated session
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const slug = formData.get("slug") as string | null;
    const index = formData.get("index") as string | null;

    if (!file || !slug || !index) {
      return Response.json({ error: "file, slug, and index are required" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return Response.json({ error: "File too large (max 5 MB)" }, { status: 413 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ error: "Invalid file type. Use JPEG, PNG, or WebP." }, { status: 415 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `invites/${slug}/photo-${index}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Use service role client to bypass storage RLS
    const admin = createAdminClient();
    const { error: uploadError } = await admin.storage
      .from("invite-photos")
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("[api/upload] storage error:", uploadError);
      return Response.json({ error: "Upload failed: " + uploadError.message }, { status: 500 });
    }

    const { data } = admin.storage.from("invite-photos").getPublicUrl(path);

    return Response.json({ url: data.publicUrl });
  } catch (err) {
    console.error("[api/upload] unexpected error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
