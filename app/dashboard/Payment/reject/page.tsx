"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";

export default function RejectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan") || "credits";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mb-6">
          <FaTimesCircle className="mx-auto mb-4 text-6xl text-red-500" />
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Payment Cancelled
        </h1>

        <p className="mb-8 text-gray-600">
          Your payment was cancelled. No charges have been made to your account.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push(`/dashboard/Payment?plan=${plan}`)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-700"
          >
            <MdRefresh />
            Try Again
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
        </div>

        <div className="mt-8 rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold text-gray-900">Need Help?</h3>
          <p className="text-sm text-gray-600">
            If you're experiencing issues with payment, please contact our
            support team.
          </p>
        </div>
      </div>
    </div>
  );
}
