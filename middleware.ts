// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pre-compile regex patterns for better performance
const STATIC_FILE_REGEX =
  /\.(png|jpg|jpeg|gif|svg|css|js|ico|woff|woff2|ttf|map|webp|avif)$/;
const SKIP_PATHS = ["/api", "/_next", "/_vercel", "/favicon.ico"];

// Define routes as Sets for O(1) lookup performance
const PUBLIC_ROUTES = new Set([
  "/",
  "/home",
  "/pricing",
  "/signin",
  "/signup",
  "/about",
  "/legal/privacy-policy",
  "/legal/terms-of-service",
]);

const AUTH_ROUTE_PREFIXES = [
  "/auth/callback",
  "/auth/callback-handler",
  "/auth/auth-code-error",
];

// Cache security headers to avoid recreating them
const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
} as const;

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Early return for performance - check static files first
  if (
    SKIP_PATHS.some((path) => pathname.startsWith(path)) ||
    STATIC_FILE_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Fast public route check using Set
  if (
    PUBLIC_ROUTES.has(pathname) ||
    AUTH_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  // Only log in development for performance
  if (process.env.NODE_ENV === "development") {
    console.log("🔒 Processing protected route:", pathname);
  }

  // Create response with optimized headers
  const response = NextResponse.next({
    request: { headers: req.headers },
  });

  // Add security headers early
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Optimized Supabase auth check
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              req.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log("👤 Auth check:", {
        hasUser: !!user,
        userId: user?.id?.substring(0, 8) + "...",
        error: error?.message,
      });
    }

    if (user) {
      return response;
    }

    if (error && process.env.NODE_ENV === "development") {
      console.log("❌ Supabase auth error:", error.message);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("❌ Supabase auth exception:", error);
    }
  }

  // Redirect to signin with optimized URL construction
  const loginUrl = new URL("/signin", req.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
