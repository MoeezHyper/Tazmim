"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaCheckCircle, FaHome, FaCreditCard } from "react-icons/fa";
import { MdWorkspacePremium } from "react-icons/md";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan") || "credits";

  const planDetails = {
    credits: {
      title: "Credits Purchase Successful!",
      description: "100 additional credits have been added to your account.",
      icon: <FaCreditCard className="text-4xl text-green-500" />,
    },
    pro: {
      title: "Welcome to Pro!",
      description:
        "Your Pro subscription is now active. Enjoy unlimited generations!",
      icon: <MdWorkspacePremium className="text-4xl text-green-500" />,
    },
  };

  const currentPlan =
    planDetails[plan as keyof typeof planDetails] || planDetails.credits;

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mb-6">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            {currentPlan.icon}
          </div>
          <FaCheckCircle className="mx-auto mb-4 text-6xl text-green-500" />
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          {currentPlan.title}
        </h1>

        <p className="mb-8 text-gray-600">{currentPlan.description}</p>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
            <FaHome />
            Return to Dashboard
          </button>

          <button
            onClick={() => router.push("/home")}
            className="w-full rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
          >
            Start Creating
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Redirecting to dashboard in 5 seconds...
        </p>
      </div>
    </div>
  );
}
