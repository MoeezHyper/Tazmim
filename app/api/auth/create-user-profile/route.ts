import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    console.log("Creating user profile - start");
    console.log("Environment check:", {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });

    const { user } = await req.json();

    console.log("User data received:", {
      id: user?.id,
      email: user?.email,
      metadata: user?.user_metadata,
    });

    if (!user || !user.email) {
      console.error("Invalid user data - missing user or email");
      return NextResponse.json(
        { message: "Invalid user data" },
        { status: 400 }
      );
    }

    // Create user profile linking auth to business data
    const userProfile = {
      auth_user_id: user.id, // Link to Supabase auth user
      email: user.email,
      name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email.split("@")[0],
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      provider: user.app_metadata?.provider || "email", // Handle both Google OAuth and email/password

      // Payment & Subscription fields
      stripe_customer_id: null,
      subscription_status: "free", // free, active, cancelled, past_due
      subscription_tier: "basic", // basic, pro, premium
      subscription_start_date: null,
      subscription_end_date: null,
      credits_remaining: 5, // Free credits for new users
      total_credits_purchased: 0,
    };

    console.log("Profile to create/update:", userProfile);

    // Check if user profile already exists
    console.log("Checking for existing profile...");
    const { data: existingProfile, error: selectError } = await supabaseAdmin
      .from("user_profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no rows

    if (selectError) {
      console.error("Error checking existing profile:", selectError);
      return NextResponse.json(
        { message: "Database error", error: selectError.message },
        { status: 500 }
      );
    }

    console.log("Existing profile check result:", existingProfile);

    let error;
    let message;
    let result;

    if (existingProfile) {
      console.log("Updating existing profile...");
      // Update existing profile
      const { data, error: updateError } = await supabaseAdmin
        .from("user_profiles")
        .update({
          name: userProfile.name,
          avatar_url: userProfile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_user_id", user.id)
        .select()
        .single();

      error = updateError;
      result = data;
      message = "User profile updated successfully";
    } else {
      console.log("Creating new profile...");
      // Create new profile with upsert to handle duplicates
      const { data, error: insertError } = await supabaseAdmin
        .from("user_profiles")
        .upsert([userProfile], {
          onConflict: "auth_user_id",
          ignoreDuplicates: false,
        })
        .select()
        .single();

      error = insertError;
      result = data;
      message = "User profile created successfully";
    }

    if (error) {
      console.error("User profile operation error:", error);
      return NextResponse.json(
        {
          message: "Error managing user profile",
          error: error.message,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    console.log("Profile operation successful:", result);
    return NextResponse.json({ message, profile: result }, { status: 200 });
  } catch (error) {
    console.error("User profile API error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
