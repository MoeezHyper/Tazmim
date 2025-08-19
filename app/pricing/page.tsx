"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";

/**
 * Pricing page behavior:
 * - Publicly accessible (middleware allows it)
 * - If user is logged in, immediately redirect to /dashboard (or could be /home if preferred)
 */
export default function PricingPage() {
  const router = useRouter();
  const { user, session, loading } = useSupabaseAuth();

  useEffect(() => {
    if (!loading && session && user) {
      router.replace("/dashboard");
    }
  }, [loading, session, user, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-gray-800">
        <div className="text-sm text-gray-500">Loading...</div>
      </main>
    );
  }

  if (session && user) {
    // Brief flash protection
    return null;
  }

  return (
    <main className="mx-auto mt-24 max-w-5xl px-4 pb-24 text-gray-800">
      <header className="mb-12 text-center">
        <h1 className="font-heading mb-3 text-4xl font-extrabold tracking-tight text-gray-900">
          Pricing
        </h1>
        <p className="text-md mx-auto max-w-xl text-gray-600">
          Choose the plan that fits your creative workflow. Sign in to start
          generating AI-powered room designs.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Free / Trial */}
        <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Free</h2>
          <p className="mb-4 text-sm text-gray-600">
            Explore the basics and try image generation.
          </p>
          <div className="mb-6 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">$0</span>
            <span className="text-sm text-gray-500">/ forever</span>
          </div>
          <ul className="mb-6 space-y-2 text-sm text-gray-600">
            <li>• Limited daily generations</li>
            <li>• Standard themes</li>
            <li>• Community gallery access</li>
          </ul>
          <a
            href="/signup?redirect=/home"
            className="mt-auto inline-flex w-full items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
          >
            Get Started
          </a>
        </div>

        {/* Credits */}
        <div className="relative flex flex-col rounded-2xl border border-orange-400 bg-orange-50 p-6 shadow-sm ring-1 ring-orange-200">
          <div className="absolute -top-3 right-4 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white shadow">
            Popular
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Credits Pack
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Pay as you go with flexible credit bundles.
          </p>
          <div className="mb-6 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">$15+</span>
            <span className="text-sm text-gray-500">/ bundle</span>
          </div>
          <ul className="mb-6 space-y-2 text-sm text-gray-600">
            <li>• Higher resolution outputs</li>
            <li>• Faster queue priority</li>
            <li>• Unused credits roll over</li>
          </ul>
          <a
            href="/signin?redirect=/dashboard/Payment?plan=credits"
            className="mt-auto inline-flex w-full items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
          >
            Purchase Credits
          </a>
        </div>

        {/* Pro Subscription */}
        <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Pro</h2>
          <p className="mb-4 text-sm text-gray-600">
            For power users generating designs daily.
          </p>
          <div className="mb-6 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">$29</span>
            <span className="text-sm text-gray-500">/ month</span>
          </div>
          <ul className="mb-6 space-y-2 text-sm text-gray-600">
            <li>• Unlimited generations (fair use)</li>
            <li>• All premium themes</li>
            <li>• Priority rendering</li>
            <li>• Commercial usage license</li>
          </ul>
          <a
            href="/signin?redirect=/dashboard/Payment?plan=pro"
            className="mt-auto inline-flex w-full items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
          >
            Go Pro
          </a>
        </div>
      </div>

      <p className="mt-12 text-center text-xs text-gray-500">
        Prices are illustrative. Integrate with Stripe for live billing.
      </p>
    </main>
  );
}
