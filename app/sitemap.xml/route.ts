import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 3600;

export async function GET() {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://sreeyambeherafilms.com";

  const staticPages = [
    { url: base, priority: "1.0", changefreq: "monthly" },
    { url: `${base}/portfolio`, priority: "0.9", changefreq: "weekly" },
  ];

  // Include public invite pages
  let inviteUrls: string[] = [];
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("wedding_invites")
      .select("unique_slug, updated_at")
      .order("created_at", { ascending: false })
      .limit(200);

    inviteUrls = (data ?? []).map(
      (inv: { unique_slug: string; updated_at: string }) =>
        `  <url>
    <loc>${base}/invites/${inv.unique_slug}</loc>
    <lastmod>${new Date(inv.updated_at).toISOString().split("T")[0]}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.6</priority>
  </url>`
    );
  } catch {
    // Non-fatal — sitemap still works without invite URLs
  }

  const staticEntries = staticPages
    .map(
      (p) => `  <url>
    <loc>${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${inviteUrls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
