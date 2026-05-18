export function GET() {
  const body = `User-agent: *
Allow: /
Allow: /portfolio
Allow: /invites/

Disallow: /admin/
Disallow: /api/
Disallow: /login

Sitemap: ${process.env.NEXT_PUBLIC_APP_URL ?? "https://sreeyambeherafilms.com"}/sitemap.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
