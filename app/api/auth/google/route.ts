import { NextResponse } from "next/server";

// Initiate Google OAuth
export async function GET(req: Request) {
  const url = new URL(req.url);
  const originEnv =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.PAGE_URL ||
    url.origin;

  const redirectUri = `${originEnv.replace(
    /\/$/,
    ""
  )}/api/auth/google/callback`;
  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;

  console.log("Google OAuth init:", {
    originEnv,
    redirectUri,
    clientId: clientId ? "***set***" : "not set",
  });

  if (!clientId) {
    return NextResponse.json(
      { message: "Missing GOOGLE_CLIENT_ID (or NEXT_PUBLIC_GOOGLE_CLIENT_ID)" },
      { status: 500 }
    );
  }

  const state =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  const scope = encodeURIComponent("openid email profile");
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId
    )}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${scope}` +
    `&state=${encodeURIComponent(state)}` +
    `&access_type=offline&prompt=consent`;

  const res = NextResponse.redirect(authUrl);
  // Store state for CSRF protection
  res.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });
  return res;
}
