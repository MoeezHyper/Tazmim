import { supabase, supabaseAdmin } from "./supabase";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  provider: "google" | "email";
};

/**
 * Get current authenticated user with unified data structure
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // First check if user is authenticated via Supabase Auth (Google OAuth)
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      return null;
    }

    if (session?.user) {
      // User authenticated via Google OAuth
      const user = session.user;
      return {
        id: user.id,
        email: user.email!,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email!.split("@")[0],
        avatar_url:
          user.user_metadata?.avatar_url || user.user_metadata?.picture,
        provider: "google",
      };
    }

    // If no Supabase Auth session, check for custom JWT token (email/password auth)
    // This would need to be implemented based on your JWT token storage
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Sign out user (handles both Google OAuth and email/password)
 */
export async function signOut() {
  try {
    // Sign out from Supabase Auth (Google OAuth)
    await supabase.auth.signOut();

    // Clear any custom JWT tokens (for email/password auth)
    // Add your custom token clearing logic here if needed
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

/**
 * Check if user is authenticated (either via Google OAuth or email/password)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
