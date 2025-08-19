"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSupabase } from "@/lib/supabase-provider";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { supabase } = useSupabase();
  const searchParams = useSearchParams();
  const redirectTarget =
    searchParams.get("redirect") || searchParams.get("next") || "/dashboard";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      // Use Supabase Auth directly for consistency with Google OAuth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name: name,
          },
        },
      });

      if (error) {
        console.error("Supabase signup error:", error);
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        console.log("User created successfully:", data.user.id);

        // Create user profile for payment tracking
        try {
          const response = await fetch("/api/auth/create-user-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: data.user }),
          });

          if (!response.ok) {
            console.error("Failed to create user profile");
            // Don't fail signup if profile creation fails
          } else {
            console.log("User profile created successfully");
          }
        } catch (profileError) {
          console.error("Error creating user profile:", profileError);
          // Continue without failing
        }

        // Check if email confirmation is required
        if (data.session) {
          // User is automatically signed in, redirect to intended page
          router.push(
            redirectTarget.startsWith("/") ? redirectTarget : "/dashboard"
          );
        } else {
          // Email confirmation required, show message and redirect to signin
          alert(
            "Please check your email to verify your account, then sign in."
          );
          router.push("/signin");
        }
      } else {
        setErrorMsg("Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMsg("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm rounded-xl bg-white p-8 text-black shadow-md ring-1 ring-gray-200"
      >
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">
          Create an Account
        </h1>

        {/* ✅ Name Input */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="John Doe"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMsg && <p className="mb-4 text-sm text-red-500">{errorMsg}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-orange-600 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-orange-600 hover:text-orange-500 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
