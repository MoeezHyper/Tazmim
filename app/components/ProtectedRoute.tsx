import React, { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/signin",
  loadingComponent,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, session, loading } = useSupabaseAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.push(redirectTo);
    }
  }, [loading, session, router, redirectTo]);

  // Show loading while checking authentication
  if (loading) {
    return (
      loadingComponent || (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
            <p className="mt-2 text-gray-600">Checking authentication...</p>
          </div>
        </div>
      )
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session || !user) {
    return null;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
