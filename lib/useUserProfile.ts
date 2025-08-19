import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  auth_user_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  provider: string;

  // Payment & Subscription fields
  stripe_customer_id?: string;
  subscription_status: "free" | "active" | "cancelled" | "past_due";
  subscription_tier: "basic" | "pro" | "premium";
  subscription_start_date?: string;
  subscription_end_date?: string;
  credits_remaining: number;
  total_credits_purchased: number;

  // Metadata
  created_at: string;
  updated_at: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          if (mounted) {
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        // Fetch user profile from our custom table
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("auth_user_id", user.id)
          .single();

        if (mounted) {
          if (profileError) {
            console.error("Error fetching user profile:", profileError);
            setError(profileError.message);
          } else {
            setProfile(profileData);
          }
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error("Error in useUserProfile:", err);
          setError("Failed to load profile");
          setLoading(false);
        }
      }
    };

    fetchProfile();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        fetchProfile();
      } else if (event === "SIGNED_OUT") {
        if (mounted) {
          setProfile(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return null;

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };

  const updateSubscription = async (subscriptionData: {
    stripe_customer_id?: string;
    subscription_status: UserProfile["subscription_status"];
    subscription_tier: UserProfile["subscription_tier"];
    subscription_start_date?: string;
    subscription_end_date?: string;
  }) => {
    return updateProfile(subscriptionData);
  };

  const updateCredits = async (
    creditsToAdd: number,
    totalPurchased?: number
  ) => {
    if (!profile) return null;

    const updates: Partial<UserProfile> = {
      credits_remaining: profile.credits_remaining + creditsToAdd,
    };

    if (totalPurchased !== undefined) {
      updates.total_credits_purchased = totalPurchased;
    }

    return updateProfile(updates);
  };

  const deductCredits = async (creditsToDeduct: number) => {
    if (!profile) return null;

    const newCredits = Math.max(0, profile.credits_remaining - creditsToDeduct);
    return updateProfile({ credits_remaining: newCredits });
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updateSubscription,
    updateCredits,
    deductCredits,
    hasActiveSubscription: profile?.subscription_status === "active",
    hasCredits: profile ? profile.credits_remaining > 0 : false,
    isGoogleUser: profile?.provider === "google",
  };
}
