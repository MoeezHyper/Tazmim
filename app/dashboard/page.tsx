"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdWorkspacePremium } from "react-icons/md";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";
import { useUserProfile } from "@/lib/useUserProfile";

const DashboardPage = () => {
  const router = useRouter();
  const { user, session, loading: authLoading } = useSupabaseAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/signin");
    }
  }, [authLoading, session, router]);

  // Show loading while checking authentication
  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session || !user) {
    return null;
  }

  const userDisplayData = {
    name:
      profile?.name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "User",
    email: user.email,
    pro: profile?.subscription_status === "active",
    credits: profile?.credits_remaining || 0,
    provider: profile?.provider || user.app_metadata?.provider,
  };

  return (
    <div className="mt-20 flex min-h-screen flex-col text-black">
      <section className="flex flex-col items-center justify-center">
        <div className="w-full rounded-3xl bg-gray-100 p-8 sm:max-w-5xl">
          <h1 className="text-3xl font-bold text-orange-600">
            Welcome to ReRoom AI
          </h1>
          <p className="mt-4 text-gray-600">
            Transform Concepts into Stunning Renders
          </p>
          <div className="mt-6 flex items-center justify-start gap-2">
            <MdWorkspacePremium className="mt-1 text-2xl text-orange-600" />
            <span className="mt-2 flex gap-2 font-medium">
              You are a{" "}
              <p
                className={
                  userDisplayData.pro ? "text-green-600" : "text-gray-600"
                }
              >
                {userDisplayData.pro ? "Pro User" : "Basic User"}
              </p>
            </span>
          </div>

          {/* User info section */}
          <div className="mt-6 rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Account Details</h3>
                <p className="text-sm text-gray-600">{userDisplayData.email}</p>
                <p className="text-xs capitalize text-gray-500">
                  Signed in with {userDisplayData.provider}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  Credits Remaining
                </p>
                <p
                  className={`text-2xl font-bold ${
                    userDisplayData.credits > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {userDisplayData.credits}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 px-4">
        <h1 className="text-2xl font-semibold">Hi, {userDisplayData.name}!</h1>
        <p className="mt-2 text-gray-600">
          This is your dashboard where you can manage your AI-generated images.
          Thank you for using ReRoom AI!
        </p>

        {/* Quick Actions Section */}
        <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Quick Actions
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/home")}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700"
            >
              🎨 Start Creating Images
            </button>
            {userDisplayData.credits > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                ⚡ {userDisplayData.credits} credits available
              </div>
            )}
          </div>
        </div>

        {!userDisplayData.pro && userDisplayData.credits === 0 && (
          <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="font-medium text-yellow-800">
              No Credits Remaining
            </h3>
            <p className="mt-1 text-sm text-yellow-700">
              You've used all your free credits. Upgrade to Pro for unlimited
              generations or purchase more credits.
            </p>
            <button
              onClick={() => router.push("/dashboard/Payment")}
              className="mt-3 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700"
            >
              Get More Credits
            </button>
          </div>
        )}

        {/* Payment Section for all users */}
        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {userDisplayData.pro ? "Manage Subscription" : "Upgrade Your Plan"}
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Credits Package */}
            <div className="rounded-lg border p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Extra Credits</h3>
                <span className="text-2xl font-bold text-orange-600">
                  $9.99
                </span>
              </div>
              <ul className="mb-4 space-y-1 text-sm text-gray-600">
                <li>• 100 additional credits</li>
                <li>• No expiration</li>
                <li>• Perfect for casual users</li>
              </ul>
              <button
                onClick={() => router.push("/dashboard/Payment?plan=credits")}
                className="w-full rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
              >
                Buy Credits
              </button>
            </div>

            {/* Pro Package */}
            <div className="rounded-lg border bg-gradient-to-br from-orange-50 to-orange-100 p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Pro Plan</h3>
                <span className="text-2xl font-bold text-orange-600">
                  $19.99
                </span>
              </div>
              <div className="mb-2 text-xs font-medium text-orange-600">
                RECOMMENDED
              </div>
              <ul className="mb-4 space-y-1 text-sm text-gray-600">
                <li>• Unlimited generations</li>
                <li>• Priority processing</li>
                <li>• Advanced features</li>
                <li>• No credit limits</li>
              </ul>
              <button
                onClick={() => router.push("/dashboard/Payment?plan=pro")}
                className="w-full rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700"
              >
                {userDisplayData.pro ? "Manage Subscription" : "Upgrade to Pro"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
