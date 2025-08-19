import Link from "next/link";

export default function AuthCodeError() {
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

        <p className="mb-6 text-sm text-gray-600">
          There was an error during the authentication process. Please try
          signing in again.
        </p>

        <div className="space-y-3">
          <Link
            href="/signin"
            className="block w-full rounded-md bg-orange-600 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
          >
            Try Again
          </Link>

          <Link
            href="/"
            className="block w-full rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
