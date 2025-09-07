"use client";

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMatchPreview, getAvailableSkills, connectWithMatch, MatchPreviewRequest, MatchPreviewResponse } from '../api-client/match';
import { MatchFilters } from '../components/match-filters';
import { getMockMatchPreview, mockSkills } from '../lib/mock-data';
import { toast } from 'sonner';

/**
 * Custom hook for managing matches data and operations
 * Provides match fetching, filtering, and connection functionality
 */
export function useMatches() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<MatchFilters>({
    search: '',
    skillLevel: '',
    location: '',
    availability: '',
    sortBy: 'match_score',
    selectedSkills: [],
  });
  const [page, setPage] = useState(0);
  const limit = 12;

  // Convert filters to API request format
  const apiRequest: MatchPreviewRequest = {
    filters: {
      search: filters.search || undefined,
      skill_level: (filters.skillLevel && filters.skillLevel !== 'any') ? filters.skillLevel : undefined,
      location: filters.location || undefined,
      availability: (filters.availability && filters.availability !== 'any') ? filters.availability : undefined,
      skills: filters.selectedSkills.length > 0 ? filters.selectedSkills : undefined,
    },
    limit,
    offset: page * limit,
    sort_by: filters.sortBy as any,
  };

  // Fetch matches
  const {
    data: matchesData,
    isLoading: isLoadingMatches,
    error: matchesError,
    refetch: refetchMatches,
  } = useQuery<MatchPreviewResponse>({
    queryKey: ['matches', filters, page],
    queryFn: async () => {
      try {
        return await getMatchPreview(apiRequest);
      } catch (error) {
        console.warn('API not available, using mock data:', error);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return getMockMatchPreview(apiRequest);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once, then fall back to mock data
  });

  // Fetch available skills
  const {
    data: availableSkills = [],
    isLoading: isLoadingSkills,
  } = useQuery<string[]>({
    queryKey: ['available-skills'],
    queryFn: async () => {
      try {
        return await getAvailableSkills();
      } catch (error) {
        console.warn('API not available, using mock skills:', error);
        return mockSkills;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  // Connect with match mutation
  const connectMutation = useMutation({
    mutationFn: connectWithMatch,
    onSuccess: (data, matchId) => {
      toast.success('Connection request sent successfully!');
      // Invalidate matches to refresh the data
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
    onError: (error: any) => {
      console.error('Connection error:', error);
      toast.error(error.message || 'Failed to send connection request');
    },
  });

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: MatchFilters) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page when filters change
  }, []);

  // Handle page changes
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Handle connecting with a match
  const handleConnect = useCallback((matchId: string) => {
    connectMutation.mutate(matchId);
  }, [connectMutation]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      skillLevel: '',
      location: '',
      availability: '',
      sortBy: 'match_score',
      selectedSkills: [],
    });
    setPage(0);
  }, []);

  // Refresh matches
  const refreshMatches = useCallback(() => {
    refetchMatches();
  }, [refetchMatches]);

  // Load more matches (pagination)
  const loadMore = useCallback(() => {
    if (matchesData?.has_more) {
      setPage(prev => prev + 1);
    }
  }, [matchesData?.has_more]);

  // Check if there are more matches to load
  const hasMore = matchesData?.has_more || false;
  const totalMatches = matchesData?.total || 0;
  const matches = matchesData?.matches || [];

  return {
    // Data
    matches,
    availableSkills,
    totalMatches,
    hasMore,
    
    // State
    filters,
    page,
    isLoading: isLoadingMatches || isLoadingSkills,
    isConnecting: connectMutation.isPending,
    error: matchesError,
    
    // Actions
    handleFiltersChange,
    handlePageChange,
    handleConnect,
    clearFilters,
    refreshMatches,
    loadMore,
  };
}
