import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next =
    searchParams.get("next") || searchParams.get("redirect") || "/dashboard";

  // Smart environment detection for base URL
  const getBaseUrl = () => {
    const configured =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.PAGE_URL;
    if (configured) return configured.replace(/\/$/, "");
    const requestUrl = new URL(request.url);
    return requestUrl.origin.replace(/\/$/, "");
  };

  const origin = getBaseUrl();

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(`${origin}/signin?error=auth_failed`);
      }
    } catch (error) {
      console.error("Error in code exchange:", error);
      return NextResponse.redirect(`${origin}/signin?error=auth_failed`);
    }
  }

  // URL to redirect to after sign up process completes
  // Forward the desired redirect (if not default dashboard) to the handler so it can route correctly
  const redirectSuffix =
    next && next !== "/dashboard"
      ? `&redirect=${encodeURIComponent(next)}`
      : "";
  return NextResponse.redirect(
    `${origin}/auth/callback-handler?action=signin${redirectSuffix}`
  );
}
