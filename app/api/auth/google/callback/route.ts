import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { signToken } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  console.log("Google OAuth callback called with:", {
    code: !!code,
    state,
    error,
  });

  // Handle OAuth errors from Google
  if (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.json(
      { message: `Google OAuth error: ${error}` },
      { status: 400 }
    );
  }

  const originEnv =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.PAGE_URL ||
    url.origin;
  const redirectUri = `${originEnv.replace(
    /\/$/,
    ""
  )}/api/auth/google/callback`;

  console.log("Using redirect URI:", redirectUri);

  // Basic CSRF check (cookie vs query param)
  const cookieStore = cookies();
  const cookieState = cookieStore.get("oauth_state")?.value;
  if (state && cookieState && state !== cookieState) {
    return NextResponse.json(
      { message: "Invalid OAuth state" },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json({ message: "Missing code" }, { status: 400 });
  }

  try {
    // Exchange code -> tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id:
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
          process.env.GOOGLE_CLIENT_ID ||
          "",
        client_secret:
          process.env.GOOGLE_CLIENT_SECRET ||
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ||
          "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    const tokenJson = await tokenRes.json();
    console.log("Token exchange response:", {
      status: tokenRes.status,
      ok: tokenRes.ok,
    });

    if (!tokenRes.ok) {
      console.error("Token exchange failed:", tokenJson);
      return NextResponse.json(
        {
          message: "Token exchange failed",
          error: tokenJson,
          redirectUri,
          clientId: process.env.GOOGLE_CLIENT_ID ? "***set***" : "not set",
        },
        { status: 400 }
      );
    }

    // Get user info
    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      }
    );
    const user = await userInfoRes.json();
    if (!userInfoRes.ok) {
      return NextResponse.json(
        { message: "Failed to fetch user info", error: user },
        { status: 400 }
      );
    }

    // Upsert into Supabase users table
    const { data: existingArr, error: selErr } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .limit(1);

    if (selErr) {
      return NextResponse.json(
        { message: "Lookup failed", error: selErr.message },
        { status: 500 }
      );
    }

    const existing = Array.isArray(existingArr)
      ? existingArr[0]
      : (existingArr as any);
    let userId = existing?.id as string | undefined;
    if (!userId) {
      const { data: inserted, error: insertErr } = await supabase
        .from("users")
        .insert([
          {
            name: user.name || user.given_name || user.email,
            email: user.email,
            // Optional fields if exist in schema; omit password for social
            // picture: user.picture ?? null,
          },
        ])
        .select("id")
        .single();
      if (insertErr) {
        return NextResponse.json(
          { message: "Failed to create user", error: insertErr.message },
          { status: 500 }
        );
      }
      userId = inserted.id;
    }

    const jwt = await signToken({ id: userId, email: user.email });
    const res = NextResponse.redirect("/dashboard");
    res.cookies.set("token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    // clear state
    res.cookies.set("oauth_state", "", { path: "/", maxAge: 0 });
    return res;
  } catch (e: any) {
    console.error("OAuth callback error:", e);
    return NextResponse.json(
      {
        message: "OAuth error",
        error: e?.message || String(e),
        stack: process.env.NODE_ENV === "development" ? e?.stack : undefined,
      },
      { status: 500 }
    );
  }
}
