import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const {
      userId,
      stripeCustomerId,
      subscriptionStatus,
      subscriptionTier,
      subscriptionStartDate,
      subscriptionEndDate,
    } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Update user subscription in our custom table
    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .update({
        stripe_customer_id: stripeCustomerId,
        subscription_status: subscriptionStatus,
        subscription_tier: subscriptionTier,
        subscription_start_date: subscriptionStartDate,
        subscription_end_date: subscriptionEndDate,
        updated_at: new Date().toISOString(),
      })
      .eq("auth_user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating subscription:", error);
      return NextResponse.json(
        { message: "Error updating subscription", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Subscription updated successfully",
        profile: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user subscription info
    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("auth_user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching subscription:", error);
      return NextResponse.json(
        { message: "Error fetching subscription", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: data }, { status: 200 });
  } catch (error) {
    console.error("Subscription fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
