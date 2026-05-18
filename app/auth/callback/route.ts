import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/dashboard";

  // Supabase sends errors back as query params when a link is invalid/expired
  const supabaseError = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  if (supabaseError) {
    const params = new URLSearchParams({ error: errorCode ?? supabaseError });
    return NextResponse.redirect(`${origin}/login?${params}`);
  }

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    const params = new URLSearchParams({ error: error.code ?? "auth_failed" });
    return NextResponse.redirect(`${origin}/login?${params}`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
