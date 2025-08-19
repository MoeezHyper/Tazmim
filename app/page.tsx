"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";

/**
 * Default function that redirects users based on authentication status
 * - If user has session: redirect to /home page
 * - If user has no session: redirect to /signin page
 */
export default function AuthRedirect() {
  const router = useRouter();
  const { user, session, loading } = useSupabaseAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted on client side to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle authentication-based redirects
  useEffect(() => {
    if (isMounted && !loading) {
      if (session && user) {
        // User has valid session, redirect to home page
        router.push("/home");
      } else {
        // User has no session, redirect to login page
        router.push("/signin");
      }
    }
  }, [isMounted, loading, session, user, router]);

  // Show loading state while checking authentication or mounting
  if (!isMounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-4 text-sm text-gray-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Show redirecting message during navigation
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
        <p className="mt-4 text-sm text-gray-600">
          {session ? "Redirecting to home..." : "Redirecting to login..."}
        </p>
      </div>
    </div>
  );
}
