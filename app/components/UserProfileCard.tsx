import { useUserProfile } from "@/lib/useUserProfile";

export default function UserProfileCard() {
  const {
    profile,
    loading,
    error,
    hasActiveSubscription,
    hasCredits,
    isGoogleUser,
  } = useUserProfile();

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
          <div className="h-4 w-1/4 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6">
        <p className="text-red-600">Error loading profile: {error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-lg bg-yellow-50 p-6">
        <p className="text-yellow-600">
          No profile found. Please sign in again.
        </p>
      </div>
    );
  }

  const getSubscriptionBadgeColor = () => {
    switch (profile.subscription_status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "past_due":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTierBadgeColor = () => {
    switch (profile.subscription_tier) {
      case "premium":
        return "bg-purple-100 text-purple-800";
      case "pro":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center space-x-4">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.name}
            className="h-16 w-16 rounded-full"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <span className="text-xl font-semibold text-gray-500">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {profile.name}
          </h2>
          <p className="text-gray-600">{profile.email}</p>
          <div className="mt-1 flex items-center space-x-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                isGoogleUser
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {isGoogleUser ? "Google" : "Email"}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-1 text-sm font-medium text-gray-500">
            Subscription
          </h3>
          <div className="flex items-center space-x-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${getSubscriptionBadgeColor()}`}
            >
              {profile.subscription_status.charAt(0).toUpperCase() +
                profile.subscription_status.slice(1)}
            </span>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${getTierBadgeColor()}`}
            >
              {profile.subscription_tier.charAt(0).toUpperCase() +
                profile.subscription_tier.slice(1)}
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-1 text-sm font-medium text-gray-500">Credits</h3>
          <div className="flex items-center space-x-2">
            <span
              className={`text-lg font-bold ${
                hasCredits ? "text-green-600" : "text-red-600"
              }`}
            >
              {profile.credits_remaining}
            </span>
            <span className="text-sm text-gray-500">remaining</span>
          </div>
        </div>
      </div>

      {profile.subscription_start_date && (
        <div className="mb-4 rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-blue-900">
            Subscription Details
          </h3>
          <div className="space-y-1 text-sm text-blue-800">
            <p>
              Started:{" "}
              {new Date(profile.subscription_start_date).toLocaleDateString()}
            </p>
            {profile.subscription_end_date && (
              <p>
                Ends:{" "}
                {new Date(profile.subscription_end_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-500">
          Account Stats
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Credits Purchased:</span>
            <span className="ml-2 font-medium">
              {profile.total_credits_purchased}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Member Since:</span>
            <span className="ml-2 font-medium">
              {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {!hasActiveSubscription && hasCredits && (
        <div className="mt-4 rounded-lg bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ You're using free credits. Consider upgrading for unlimited
            access.
          </p>
        </div>
      )}

      {!hasCredits && !hasActiveSubscription && (
        <div className="mt-4 rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">
            ❌ No credits remaining. Please purchase a subscription or buy more
            credits.
          </p>
        </div>
      )}
    </div>
  );
}
