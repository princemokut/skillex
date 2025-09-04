"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MatchCard, MatchData } from "@/components/match-card";
import { MatchFilters } from "@/components/match-filters";
import { MatchGridSkeleton } from "@/components/match-skeleton";
import { useMatches } from "@/hooks/use-matches";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Users, Filter } from "lucide-react";

/**
 * Matches page component
 * Displays a list of potential skill exchange matches for the authenticated user.
 * Includes filtering, search, and pagination functionality.
 */
export default function MatchesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const {
    matches,
    availableSkills,
    totalMatches,
    hasMore,
    filters,
    isLoading,
    isConnecting,
    error,
    handleFiltersChange,
    handleConnect,
    clearFilters,
    refreshMatches,
    loadMore,
  } = useMatches();

  // Redirect to sign-in if not authenticated and not loading
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading matches...</p>
        </div>
      </div>
    );
  }

  const handleViewProfile = (matchId: string) => {
    // TODO: Navigate to profile page
    console.log('View profile for match:', matchId);
  };

  const handleMessage = (matchId: string) => {
    // TODO: Navigate to messaging
    console.log('Message match:', matchId);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Matches</h1>
          <p className="text-slate-600 mb-4">
            Discover professionals who match your skills and learning goals.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {totalMatches} matches found
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshMatches}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <MatchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              availableSkills={availableSkills}
            />
          </div>

          {/* Matches Content */}
          <div className="lg:col-span-3">
            {/* Error State */}
            {error && (
              <Alert className="mb-6">
                <AlertDescription>
                  Failed to load matches. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && matches.length === 0 ? (
              <MatchGridSkeleton count={6} />
            ) : (
              <>
                {/* Matches Grid */}
                {matches.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
                    {matches.map((match: MatchData) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onConnect={handleConnect}
                        onViewProfile={handleViewProfile}
                        onMessage={handleMessage}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Filter className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      No matches found
                    </h3>
                    <p className="text-slate-500 mb-4 max-w-md mx-auto">
                      Try adjusting your filters or complete your profile to get better matches.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                      <Button onClick={() => router.push('/onboarding')}>
                        Complete Profile
                      </Button>
                    </div>
                  </div>
                )}

                {/* Load More Button */}
                {hasMore && matches.length > 0 && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={loadMore}
                      disabled={isLoading}
                      variant="outline"
                      className="min-w-32"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          Loading...
                        </div>
                      ) : (
                        'Load More'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}