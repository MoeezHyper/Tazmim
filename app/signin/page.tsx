"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabase } from "@/lib/supabase-provider";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget =
    searchParams.get("redirect") || searchParams.get("next") || "/dashboard";
  const { supabase } = useSupabase();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const form = e.currentTarget;
    const email =
      (form.elements.namedItem("email") as HTMLInputElement)?.value || "";
    const password =
      (form.elements.namedItem("password") as HTMLInputElement)?.value || "";

    console.log("Email:", email);

    try {
      // Use Supabase Auth directly for better session handling
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase signin error:", error);
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user && data.session) {
        console.log("Login successful:", data.user.id);

        // Create/update user profile
        try {
          const response = await fetch("/api/auth/create-user-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: data.user }),
          });

          if (!response.ok) {
            console.error("Failed to create/update user profile");
            // Don't fail login if profile creation fails
          } else {
            console.log("User profile created/updated successfully");
          }
        } catch (profileError) {
          console.error("Error creating user profile:", profileError);
          // Continue without failing
        }

        // Redirect to intended destination (defaults to /dashboard)
        router.push(
          redirectTarget.startsWith("/") ? redirectTarget : "/dashboard"
        );
      } else {
        setError("Login failed");
      }
    } catch (err) {
      console.error("Request failed:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Smart environment detection for redirect URL
      const getBaseUrl = () => {
        const configured =
          process.env.NEXT_PUBLIC_APP_URL ||
          process.env.NEXT_PUBLIC_BASE_URL ||
          process.env.PAGE_URL;
        if (configured) return configured.replace(/\/$/, "");
        return window.location.origin.replace(/\/$/, "");
      };

      const baseUrl = getBaseUrl();

      // Debug logging to see what URL is being used
      console.log("🔍 OAuth Debug Info:", {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        windowOrigin: window.location.origin,
        finalBaseUrl: baseUrl,
        redirectTo: `${baseUrl}/auth/callback`,
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
        },
      });

      if (error) {
        console.error("Google login error:", error.message);
        setError(error.message);
        setIsLoading(false);
      }
      // If successful, user will be redirected to Google OAuth flow
    } catch (err) {
      console.error("Google login failed:", err);
      setError("Google login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-gray-800">
      <div className="shagidow-lg w-full max-w-md rounded-xl bg-white px-8 py-10 ring-1 ring-gray-200">
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-900">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="••••••••"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-orange-600 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading ? "Connecting..." : "Sign In With Google"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-orange-600 hover:text-orange-500 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
