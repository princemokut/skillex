/**
 * useReferrals Hook
 * Manages referral data and operations with React Query
 * 
 * This hook provides referral management functionality including
 * fetching, creating, updating, and deleting referrals with optimistic updates.
 */

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ReferralWithType, 
  ReferralContextType,
  getUserReferrals,
  getGivenReferrals,
  getReceivedReferrals,
  getReferralRequests,
  getCohortReferrals,
  getReferralStats,
  getCohortReferralStats,
  createReferral,
  updateReferralStatus,
  deleteReferral
} from '@/lib/referral-mock-data';
import { ReferralStatus } from '@skillex/types';

/**
 * Query keys for referral-related queries
 * Centralized query key management for consistency
 */
export const referralQueryKeys = {
  all: ['referrals'] as const,
  lists: () => [...referralQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...referralQueryKeys.lists(), { filters }] as const,
  user: (userId: string) => [...referralQueryKeys.all, 'user', userId] as const,
  cohort: (cohortId: string) => [...referralQueryKeys.all, 'cohort', cohortId] as const,
  stats: (userId: string) => [...referralQueryKeys.all, 'stats', userId] as const,
};

/**
 * Custom hook for managing user referrals
 * Provides referral data, loading states, and mutation functions
 * 
 * @param userId - The user ID to manage referrals for
 * @returns Object containing referral data and operations
 */
export function useReferrals(userId: string) {
  const [activeTab, setActiveTab] = useState<'given' | 'received' | 'requests'>('received');
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'all'>('all');
  const [cohortFilter, setCohortFilter] = useState<string | 'all'>('all');
  const queryClient = useQueryClient();
  
  /**
   * Fetch user referrals data
   * Uses React Query to fetch and cache referral data
   */
  const {
    data: referralsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: referralQueryKeys.user(userId),
    queryFn: async () => {
      try {
        // Try to fetch from API first (when implemented)
        // const response = await getUserReferrals(userId);
        // return response;
        
        // For now, use mock data
        const mockData = getUserReferrals(userId);
        return {
          given: getGivenReferrals(userId),
          received: getReceivedReferrals(userId),
          requests: getReferralRequests(userId),
          all: mockData
        };
      } catch (error) {
        console.error('Error fetching referrals:', error);
        // Fallback to mock data
        return {
          given: getGivenReferrals(userId),
          received: getReceivedReferrals(userId),
          requests: getReferralRequests(userId),
          all: getUserReferrals(userId)
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  /**
   * Fetch referral statistics
   * Uses React Query to fetch and cache referral statistics
   */
  const {
    data: stats,
    isLoading: isStatsLoading
  } = useQuery({
    queryKey: referralQueryKeys.stats(userId),
    queryFn: async () => {
      try {
        // Try to fetch from API first (when implemented)
        // const response = await getReferralStats(userId);
        // return response;
        
        // For now, use mock data
        return getReferralStats(userId);
      } catch (error) {
        console.error('Error fetching referral stats:', error);
        return getReferralStats(userId);
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  /**
   * Create referral mutation
   * Handles creating new referrals with optimistic updates
   */
  const createReferralMutation = useMutation({
    mutationFn: async (referralData: {
      toUserId: string;
      context: string;
      contextType: ReferralContextType;
      companyName?: string;
      projectTitle?: string;
      urgency: 'low' | 'medium' | 'high';
      cohortId: string;
    }) => {
      try {
        // Try to create via API first (when implemented)
        // const response = await createReferralAPI(referralData);
        // return response;
        
        // For now, use mock data
        const newReferral = createReferral({
          ...referralData,
          fromUserId: userId,
          status: 'draft',
          cohortId: referralData.cohortId,
          cohortTitle: 'Mock Cohort', // This would come from cohort data
          sessionCompletionPercentage: 87, // This would be calculated
          isEligible: true,
          direction: 'send', // This is a referral being sent by the current user
          fromUser: {
            id: userId,
            name: 'Current User',
            handle: 'currentuser',
            avatar: '/avatars/current.jpg',
            title: 'Software Engineer',
            skills: ['React', 'TypeScript', 'Node.js']
          },
          toUser: {
            id: referralData.toUserId,
            name: 'Referred User',
            handle: 'referreduser',
            avatar: '/avatars/referred.jpg',
            title: 'Developer',
            skills: ['JavaScript', 'Python', 'SQL']
          }
        });
        return newReferral;
      } catch (error) {
        console.error('Error creating referral:', error);
        throw error;
      }
    },
    onSuccess: (newReferral) => {
      // Invalidate and refetch referral queries
      queryClient.invalidateQueries({ queryKey: referralQueryKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: referralQueryKeys.stats(userId) });
      queryClient.invalidateQueries({ queryKey: referralQueryKeys.cohort(newReferral.cohortId) });
    },
    onError: (error) => {
      console.error('Error creating referral:', error);
    }
  });

  /**
   * Update referral status mutation
   * Handles updating referral status with optimistic updates
   */
  const updateReferralStatusMutation = useMutation({
    mutationFn: async ({ referralId, status }: { referralId: string; status: ReferralStatus }) => {
      try {
        // Try to update via API first (when implemented)
        // const response = await updateReferralStatusAPI(referralId, status);
        // return response;
        
        // For now, use mock data
        const updatedReferral = updateReferralStatus(referralId, status);
        if (!updatedReferral) {
          throw new Error('Referral not found');
        }
        return updatedReferral;
      } catch (error) {
        console.error('Error updating referral status:', error);
        throw error;
      }
    },
    onSuccess: (updatedReferral) => {
      // Invalidate and refetch referral queries
      queryClient.invalidateQueries({ queryKey: referralQueryKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: referralQueryKeys.stats(userId) });
      queryClient.invalidateQueries({ queryKey: referralQueryKeys.cohort(updatedReferral.cohortId) });
    },
    onError: (error) => {
      console.error('Error updating referral status:', error);
    }
  });

  /**
   * Delete referral mutation
   * Handles deleting referrals with optimistic updates
   */
  const deleteReferralMutation = useMutation({
    mutationFn: async (referralId: string) => {
      try {
        // Try to delete via API first (when implemented)
        // await deleteReferralAPI(referralId);
        
        // For now, use mock data
        const success = deleteReferral(referralId);
        if (!success) {
          throw new Error('Referral not found');
        }
        return referralId;
      } catch (error) {
        console.error('Error deleting referral:', error);
        throw error;
      }
    },
    onSuccess: (referralId) => {
      // Invalidate and refetch referral queries
      queryClient.invalidateQueries({ queryKey: referralQueryKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: referralQueryKeys.stats(userId) });
    },
    onError: (error) => {
      console.error('Error deleting referral:', error);
    }
  });

  /**
   * Get filtered referrals based on current filters
   * Returns referrals filtered by tab, status, and cohort
   */
  const getFilteredReferrals = (): ReferralWithType[] => {
    if (!referralsData) return [];

    let referrals: ReferralWithType[] = [];
    
    // Use abstract functions for cleaner, more maintainable code
    if (activeTab === 'given') {
      referrals = referralsData.given || [];
    } else if (activeTab === 'received') {
      referrals = referralsData.received || [];
    } else if (activeTab === 'requests') {
      referrals = referralsData.requests || [];
    }
    
    let filtered = referrals;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(referral => referral.status === statusFilter);
    }

    // Filter by cohort
    if (cohortFilter !== 'all') {
      filtered = filtered.filter(referral => referral.cohortId === cohortFilter);
    }

    return filtered;
  };

  /**
   * Get available cohorts for filtering
   * Returns unique cohorts from user's referrals
   */
  const getAvailableCohorts = () => {
    if (!referralsData) return [];

    const cohortMap = new Map();
    
    referralsData.all.forEach(referral => {
      if (!cohortMap.has(referral.cohortId)) {
        cohortMap.set(referral.cohortId, {
          id: referral.cohortId,
          title: referral.cohortTitle,
          sessionCompletionPercentage: referral.sessionCompletionPercentage
        });
      }
    });

    return Array.from(cohortMap.values());
  };

  /**
   * Handle tab change
   * Updates active tab and resets filters
   * 
   * @param tab - New active tab
   */
  const handleTabChange = (tab: 'given' | 'received' | 'requests') => {
    setActiveTab(tab);
    setStatusFilter('all');
  };

  /**
   * Handle status filter change
   * Updates status filter
   * 
   * @param status - New status filter
   */
  const handleStatusFilterChange = (status: ReferralStatus | 'all') => {
    setStatusFilter(status);
  };

  /**
   * Handle cohort filter change
   * Updates cohort filter
   * 
   * @param cohortId - New cohort filter
   */
  const handleCohortFilterChange = (cohortId: string | 'all') => {
    setCohortFilter(cohortId);
  };

  /**
   * Handle referral creation
   * Creates a new referral
   * 
   * @param referralData - Referral data to create
   */
  const handleCreateReferral = async (referralData: {
    toUserId: string;
    context: string;
    contextType: ReferralContextType;
    companyName?: string;
    projectTitle?: string;
    urgency: 'low' | 'medium' | 'high';
    cohortId: string;
  }) => {
    return createReferralMutation.mutateAsync(referralData);
  };

  /**
   * Handle referral status update
   * Updates referral status
   * 
   * @param referralId - Referral ID to update
   * @param status - New status
   */
  const handleUpdateReferralStatus = async (referralId: string, status: ReferralStatus) => {
    return updateReferralStatusMutation.mutateAsync({ referralId, status });
  };

  /**
   * Handle referral deletion
   * Deletes a referral
   * 
   * @param referralId - Referral ID to delete
   */
  const handleDeleteReferral = async (referralId: string) => {
    return deleteReferralMutation.mutateAsync(referralId);
  };

  return {
    // Data
    referrals: getFilteredReferrals(),
    allReferrals: referralsData?.all || [],
    givenReferrals: referralsData?.given || [],
    receivedReferrals: referralsData?.received || [],
    requestReferrals: referralsData?.requests || [],
    stats: stats || { 
      sent: { total: 0, draft: 0, sent: 0, accepted: 0, declined: 0 }, 
      received: { total: 0, pending: 0, accepted: 0, declined: 0 },
      requests: { total: 0, pending: 0, accepted: 0, declined: 0 }
    },
    availableCohorts: getAvailableCohorts(),
    
    // Loading states
    isLoading,
    isStatsLoading,
    isCreating: createReferralMutation.isPending,
    isUpdating: updateReferralStatusMutation.isPending,
    isDeleting: deleteReferralMutation.isPending,
    
    // Error states
    error,
    createError: createReferralMutation.error,
    updateError: updateReferralStatusMutation.error,
    deleteError: deleteReferralMutation.error,
    
    // Filters
    activeTab,
    statusFilter,
    cohortFilter,
    
    // Actions
    handleTabChange,
    handleStatusFilterChange,
    handleCohortFilterChange,
    handleCreateReferral,
    handleUpdateReferralStatus,
    handleDeleteReferral,
    refetch
  };
}

/**
 * Custom hook for managing cohort referrals
 * Provides cohort-specific referral data and operations
 * 
 * @param cohortId - The cohort ID to manage referrals for
 * @returns Object containing cohort referral data and operations
 */
export function useCohortReferrals(cohortId: string) {
  const queryClient = useQueryClient();
  
  /**
   * Fetch cohort referrals data
   * Uses React Query to fetch and cache cohort referral data
   */
  const {
    data: cohortReferrals,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: referralQueryKeys.cohort(cohortId),
    queryFn: async () => {
      try {
        // Try to fetch from API first (when implemented)
        // const response = await getCohortReferralsAPI(cohortId);
        // return response;
        
        // For now, use mock data
        return {
          referrals: getCohortReferrals(cohortId),
          stats: getCohortReferralStats(cohortId)
        };
      } catch (error) {
        console.error('Error fetching cohort referrals:', error);
        return {
          referrals: getCohortReferrals(cohortId),
          stats: getCohortReferralStats(cohortId)
        };
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    referrals: cohortReferrals?.referrals || [],
    stats: cohortReferrals?.stats || null,
    isLoading,
    error,
    refetch
  };
}
