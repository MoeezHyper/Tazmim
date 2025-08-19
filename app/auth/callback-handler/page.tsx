"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabase } from "@/lib/supabase-provider";

export default function CallbackHandler() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { supabase } = useSupabase();
  const searchParams = useSearchParams();
  const redirectTarget =
    searchParams.get("redirect") || searchParams.get("next") || "/dashboard";

  useEffect(() => {
    let hasRun = false;
    let isAborted = false;

    const handleAuthCallback = async () => {
      if (hasRun || isAborted) return;
      hasRun = true;

      try {
        // Check if we have a valid session (set by the server-side callback route)
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          if (!isAborted) setError(error.message);
          return;
        }

        if (data.session && data.session.user) {
          console.log("Google OAuth successful:", data.session.user);

          // Create user profile for payment/subscription tracking
          if (!isAborted) {
            try {
              const response = await fetch("/api/auth/create-user-profile", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ user: data.session.user }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                // Don't log duplicate key errors as they're expected
                if (!errorData.error?.includes("duplicate key")) {
                  console.error("Failed to create user profile:", errorData);
                }
                // Continue to dashboard even if profile creation fails
              } else {
                console.log("User profile created/updated successfully");
              }
            } catch (profileError) {
              console.error("Error creating user profile:", profileError);
              // Continue to dashboard even if profile creation fails
            }
          }

          console.log("Google authentication completed successfully");

          // Redirect to intended destination (supports ?redirect=/home)
          if (!isAborted) {
            router.push(
              redirectTarget.startsWith("/") ? redirectTarget : "/dashboard"
            );
          }
          return;
        } else {
          console.log("No session found");
          if (!isAborted) setError("No session found");
        }
      } catch (err) {
        console.error("Callback error:", err);
        if (!isAborted) setError("Authentication failed");
      } finally {
        if (!isAborted) setIsLoading(false);
      }
    };

    handleAuthCallback();

    // Cleanup function to prevent race conditions
    return () => {
      isAborted = true;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9fc]">
        <div className="w-full max-w-md rounded-xl bg-white px-8 py-10 text-center shadow-lg ring-1 ring-gray-200">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Completing Sign In...
          </h2>
          <p className="text-sm text-gray-600">
            Please wait while we set up your account.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9fc]">
        <div className="w-full max-w-md rounded-xl bg-white px-8 py-10 text-center shadow-lg ring-1 ring-gray-200">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Authentication Failed
          </h2>

          <p className="mb-6 text-sm text-gray-600">{error}</p>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/signin")}
              className="block w-full rounded-md bg-orange-600 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
            >
              Try Again
            </button>

            <button
              onClick={() => router.push("/")}
              className="block w-full rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
