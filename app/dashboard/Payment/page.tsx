"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  MdWorkspacePremium,
  MdSecurity,
  MdSpeed,
  MdStars,
} from "react-icons/md";
import { FaCreditCard, FaCheck, FaArrowLeft } from "react-icons/fa";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedPlan = searchParams.get("plan") || "credits";

  // Check if Stripe is properly configured
  const isStripeConfigured = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!isStripeConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mb-4 text-6xl text-red-500">⚠️</div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Payment System Not Configured
          </h1>
          <p className="mb-6 text-gray-600">
            Stripe payment system is not properly configured. Please contact
            support.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const plans = {
    credits: {
      name: "Extra Credits",
      price: "$9.99",
      description: "Perfect for casual users who need more credits",
      features: [
        "100 additional credits",
        "No expiration date",
        "Instant activation",
        "Use anytime",
      ],
      stripePrice: "price_credits_id", // Replace with actual Stripe price ID
      amount: 999, // $9.99 in cents
    },
    pro: {
      name: "Pro Plan",
      price: "$19.99",
      description: "Unlimited access for power users",
      features: [
        "Unlimited generations",
        "Priority processing",
        "Advanced AI models",
        "Premium support",
        "Early access to new features",
      ],
      stripePrice: "price_pro_id", // Replace with actual Stripe price ID
      amount: 1999, // $19.99 in cents
    },
  };

  const currentPlan =
    plans[selectedPlan as keyof typeof plans] || plans.credits;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
          amount: currentPlan.amount,
          planName: currentPlan.name,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-800"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Unlock the full potential of ReRoom AI
          </p>
        </div>

        {/* Plan Selection */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`relative cursor-pointer rounded-2xl border-2 p-8 transition-all ${
                selectedPlan === key
                  ? "scale-105 border-orange-500 bg-white shadow-xl"
                  : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-lg"
              }`}
              onClick={() => router.push(`/dashboard/Payment?plan=${key}`)}
            >
              {key === "pro" && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <span className="rounded-full bg-orange-500 px-4 py-1 text-sm font-medium text-white">
                    RECOMMENDED
                  </span>
                </div>
              )}

              <div className="mb-6 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  {key === "pro" ? (
                    <MdWorkspacePremium className="text-2xl text-orange-600" />
                  ) : (
                    <FaCreditCard className="text-2xl text-orange-600" />
                  )}
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mb-2 text-4xl font-bold text-orange-600">
                  {plan.price}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="mb-6 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <FaCheck className="flex-shrink-0 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {selectedPlan === key && (
                <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-orange-500"></div>
              )}
            </div>
          ))}
        </div>

        {/* Selected Plan Details */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Order Summary
          </h2>

          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                {currentPlan.name}
              </h3>
              <p className="text-gray-600">{currentPlan.description}</p>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {currentPlan.price}
            </div>
          </div>

          <div className="py-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-orange-600">{currentPlan.price}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="text-center">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-600">Payment Error</p>
              <p className="mt-1 text-sm text-red-500">{error}</p>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className={`inline-flex items-center gap-3 rounded-xl px-8 py-4 text-lg font-semibold transition-all ${
              loading
                ? "cursor-not-allowed bg-gray-400"
                : "transform bg-orange-600 hover:scale-105 hover:bg-orange-700"
            } text-white shadow-lg`}
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <FaCreditCard />
                Complete Payment
              </>
            )}
          </button>

          {/* Security badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-gray-500">
            <div className="flex items-center gap-2">
              <MdSecurity />
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <MdSpeed />
              <span className="text-sm">Instant Activation</span>
            </div>
            <div className="flex items-center gap-2">
              <MdStars />
              <span className="text-sm">Premium Support</span>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Secured by Stripe • Your payment information is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}
