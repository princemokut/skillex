"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { MatchCard, MatchData } from "@/components/match-card";
import { MatchFilters } from "@/components/match-filters";
import { MatchGridSkeleton } from "@/components/match-skeleton";
import { useMatches } from "@/hooks/use-matches";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Users, Filter } from "lucide-react";
import { AdSlot, AdSlotContainer } from "@/components/AdSlot";
import { getAdTargeting } from "@/lib/ad-context";
import { trackPageView, trackAdInteraction } from "@/lib/analytics";
import { NoMatchesEmptyState } from "@/components/ui/empty-state";
import { MatchCardSkeleton } from "@/components/ui/skeleton";
import { AnimationWrapper, StaggerWrapper } from "@/components/ui/animations";
import { ResponsiveGrid, ResponsiveCard } from "@/components/ui/responsive-card";
import { useIsMobile, useIsTablet } from "@/lib/responsive";

// Get the original Navigation component to override it
import { Navigation as OriginalNavigation } from "@/components/navigation";

// Create a wrapped navigation component for this page
function MatchesNavigation() {
  const {
    filters,
    availableSkills,
    handleFiltersChange,
  } = useMatches();
  
  // Create the filters component that will be attached to the navigation
  const filtersComponent = (
    <MatchFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      availableSkills={availableSkills}
      className="w-full shadow-none border-none"
    />
  );
  
  return (
    <OriginalNavigation 
      isMatchesPage={true}
      filtersComponent={filtersComponent}
      onSearch={(query) => {
        handleFiltersChange({
          ...filters,
          search: query
        });
      }}
    />
  );
}

export default function MatchesPageClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
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

  // Track page view and analytics
  useEffect(() => {
    if (user) {
      trackPageView('matches', {
        user_id: user.id,
        total_matches: totalMatches,
        has_filters: Object.keys(filters).length > 0
      });
    }
  }, [user, totalMatches, filters]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <AnimationWrapper animation="fadeIn" className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading matches...</p>
        </AnimationWrapper>
      </div>
    );
  }

  const handleViewProfile = (matchId: string) => {
    // TODO: Navigate to profile page
    console.log('View profile for match:', matchId);
  };

  return (
    <>
      {/* Custom Navigation with Filters */}
      <MatchesNavigation />
      
      <div className="min-h-[calc(100vh-100px)] bg-slate-50 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Left aligned */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Your Matches</h1>
            <p className="text-sm sm:text-base text-slate-600 mb-4">
              Discover professionals who match your skills and learning goals.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm text-slate-500">
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content Area (Left) */}
            <div className="lg:col-span-3 order-1">
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
                <AnimationWrapper animation="fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <MatchCardSkeleton key={i} />
                    ))}
                  </div>
                </AnimationWrapper>
              ) : (
                <>
                  {/* Matches Grid */}
                  {matches.length > 0 ? (
                    <StaggerWrapper staggerDelay={100}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {matches.map((match: MatchData) => (
                          <AnimationWrapper
                            key={match.id}
                            hover="hoverScale"
                            transition="standard"
                          >
                            <MatchCard
                              match={match}
                              onConnect={handleConnect}
                              onViewProfile={handleViewProfile}
                            />
                          </AnimationWrapper>
                        ))}
                      </div>
                    </StaggerWrapper>
                  ) : (
                    /* Empty State */
                    <NoMatchesEmptyState
                      onClearFilters={clearFilters}
                      onCompleteProfile={() => router.push('/onboarding')}
                    />
                  )}

                  {/* Load More Button */}
                  {hasMore && matches.length > 0 && (
                    <AnimationWrapper animation="fadeInUp" className="text-center mt-6 sm:mt-8">
                      <Button
                        onClick={loadMore}
                        disabled={isLoading}
                        variant="outline"
                        className="min-w-32 hover:scale-105 transition-transform duration-200"
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
                    </AnimationWrapper>
                  )}
                </>
              )}
            </div>
            
            {/* Right Sidebar with Ad */}
            <div className="lg:col-span-1 order-2">
              <AdSlot
                slotId="matches-sidebar"
                size="sidebar"
                context="matches"
                targeting={getAdTargeting({
                  skills: ['React', 'TypeScript', 'JavaScript'],
                  location: 'San Francisco',
                  timezone: 'America/Los_Angeles',
                  cohortTopics: ['React & TypeScript Mastery'],
                  referralActivity: 'low',
                  connectionActivity: 'moderate',
                  adCategories: ['jobs', 'learning'],
                  adFrequency: 'medium',
                  adInteractions: []
                }, 'matches')}
                onAdInteraction={(action: 'viewed' | 'clicked' | 'closed') => trackAdInteraction('matches-sidebar', action)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}