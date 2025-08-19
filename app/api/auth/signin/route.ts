import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Handle POST request (login)
export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/auth/signin called - Using Supabase Auth");

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

    const { email, password } = await req.json();
    console.log("Received email:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Attempting Supabase Auth signin...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase Auth signin error:", error);
      return NextResponse.json(
        { message: error.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    if (data.user && data.session) {
      console.log("Login successful for user:", data.user.id);

      // Create/update user profile if it doesn't exist
      try {
        const profileResponse = await fetch(
          `${req.nextUrl.origin}/api/auth/create-user-profile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: data.user }),
          }
        );

        if (!profileResponse.ok) {
          console.error(
            "Failed to create/update user profile, but login successful"
          );
          // Don't fail the login if profile creation fails
        } else {
          console.log("User profile created/updated successfully");
        }
      } catch (profileError) {
        console.error("Error creating user profile:", profileError);
        // Continue without failing
      }

      return NextResponse.json({
        message: "Logged in successfully",
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      });
    }

    return NextResponse.json({ message: "Login failed" }, { status: 401 });
  } catch (error) {
    console.error("SIGNIN ERROR:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error:
          process.env.NODE_ENV === "development"
            ? String(error)
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS (CORS Preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
