import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { userId, action, amount, description } = await req.json();

    if (!userId || !action || amount === undefined) {
      return NextResponse.json(
        { message: "userId, action, and amount are required" },
        { status: 400 }
      );
    }

    // Get current user profile
    const { data: currentProfile, error: fetchError } = await supabaseAdmin
      .from("user_profiles")
      .select("credits_remaining, total_credits_purchased")
      .eq("auth_user_id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching user profile:", fetchError);
      return NextResponse.json(
        { message: "User not found", error: fetchError.message },
        { status: 404 }
      );
    }

    let newCreditsRemaining = currentProfile.credits_remaining;
    let newTotalPurchased = currentProfile.total_credits_purchased;

    switch (action) {
      case "add":
        newCreditsRemaining += amount;
        newTotalPurchased += amount;
        break;
      case "deduct":
        newCreditsRemaining = Math.max(0, newCreditsRemaining - amount);
        break;
      case "set":
        newCreditsRemaining = amount;
        break;
      default:
        return NextResponse.json(
          { message: "Invalid action. Use 'add', 'deduct', or 'set'" },
          { status: 400 }
        );
    }

    // Update user credits
    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .update({
        credits_remaining: newCreditsRemaining,
        total_credits_purchased: newTotalPurchased,
        updated_at: new Date().toISOString(),
      })
      .eq("auth_user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating credits:", error);
      return NextResponse.json(
        { message: "Error updating credits", error: error.message },
        { status: 500 }
      );
    }

    // Log the credit transaction (optional - you can create a credits_log table)
    const logEntry = {
      user_id: userId,
      action,
      amount,
      description: description || `Credits ${action}ed`,
      credits_before: currentProfile.credits_remaining,
      credits_after: newCreditsRemaining,
      created_at: new Date().toISOString(),
    };

    // Insert into credits_log table if it exists
    const { error: logError } = await supabaseAdmin
      .from("credits_log")
      .insert([logEntry]);

    // Don't fail the request if logging fails
    if (logError) {
      console.warn("Could not log credit transaction:", logError);
    }

    return NextResponse.json(
      {
        message: `Credits ${action}ed successfully`,
        profile: data,
        transaction: logEntry,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Credits management error:", error);
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

    // Get user credits info
    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .select("credits_remaining, total_credits_purchased")
      .eq("auth_user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching credits:", error);
      return NextResponse.json(
        { message: "Error fetching credits", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ credits: data }, { status: 200 });
  } catch (error) {
    console.error("Credits fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
