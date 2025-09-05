"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCohorts, 
  getCohortById, 
  createCohort, 
  updateCohort, 
  deleteCohort,
  CohortWithMembers,
} from '../api-client/cohorts';
import { 
  getCohortMembers, 
  getCohortSessions, 
  getCohortArtifacts, 
  getCohortChatMessages,
  getUserCohorts,
  mockCohorts
} from '../lib/cohort-mock-data';
import { toast } from 'sonner';

/**
 * Custom hook for managing cohorts data and operations
 * Provides cohort fetching, creation, and management functionality
 */
export function useCohorts() {
  const queryClient = useQueryClient();

  // Fetch user's cohorts
  const {
    data: cohorts = [],
    isLoading,
    error,
    refetch: refetchCohorts,
  } = useQuery<CohortWithMembers[]>({
    queryKey: ['cohorts'],
    queryFn: async () => {
      try {
        const response = await getCohorts();
        return response.cohorts;
      } catch (error) {
        console.warn('API not available, using mock data:', error);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Transform mock data to match API response format
        const mockCohortsWithMembers = mockCohorts
          .filter(cohort => cohort.id) // Filter out any cohorts without IDs
          .map(cohort => ({
            ...cohort,
            members: getCohortMembers(cohort.id!),
            sessionCount: getCohortSessions(cohort.id!).length,
            artifactCount: getCohortArtifacts(cohort.id!).length,
            lastMessageAt: getCohortChatMessages(cohort.id!).length > 0 
              ? getCohortChatMessages(cohort.id!)[getCohortChatMessages(cohort.id!).length - 1].timestamp
              : undefined,
          }));
        
        return mockCohortsWithMembers;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once, then fall back to mock data
  });

  // Create cohort mutation
  const createCohortMutation = useMutation({
    mutationFn: createCohort,
    onSuccess: (newCohort) => {
      toast.success('Cohort created successfully!');
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
    },
    onError: (error) => {
      toast.error(`Failed to create cohort: ${error.message}`);
    },
  });

  // Update cohort mutation
  const updateCohortMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCohort(id, data),
    onSuccess: () => {
      toast.success('Cohort updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
    },
    onError: (error) => {
      toast.error(`Failed to update cohort: ${error.message}`);
    },
  });

  // Delete cohort mutation
  const deleteCohortMutation = useMutation({
    mutationFn: deleteCohort,
    onSuccess: () => {
      toast.success('Cohort deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete cohort: ${error.message}`);
    },
  });

  return {
    cohorts,
    isLoading,
    error,
    refetchCohorts,
    createCohortMutation,
    updateCohortMutation,
    deleteCohortMutation,
  };
}

/**
 * Custom hook for managing a specific cohort
 * Provides detailed cohort data and operations
 */
export function useCohort(cohortId: string) {
  const queryClient = useQueryClient();

  // Fetch specific cohort
  const {
    data: cohort,
    isLoading,
    error,
    refetch: refetchCohort,
  } = useQuery<CohortWithMembers>({
    queryKey: ['cohort', cohortId],
    queryFn: async () => {
      try {
        return await getCohortById(cohortId);
      } catch (error) {
        console.warn('API not available, using mock data:', error);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const mockCohort = mockCohorts.find(c => c.id === cohortId);
        if (!mockCohort) {
          throw new Error('Cohort not found');
        }
        
        return {
          ...mockCohort,
          members: getCohortMembers(cohortId),
          sessionCount: getCohortSessions(cohortId).length,
          artifactCount: getCohortArtifacts(cohortId).length,
          lastMessageAt: getCohortChatMessages(cohortId).length > 0 
            ? getCohortChatMessages(cohortId)[getCohortChatMessages(cohortId).length - 1].timestamp
            : undefined,
        };
      }
    },
    enabled: !!cohortId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });

  // Fetch cohort sessions
  const {
    data: sessions = [],
    isLoading: isLoadingSessions,
  } = useQuery({
    queryKey: ['cohort-sessions', cohortId],
    queryFn: async () => {
      try {
        return await getCohortSessions(cohortId);
      } catch (error) {
        console.warn('API not available, using mock sessions:', error);
        // Transform mock sessions to match expected format
        const mockSessions = getCohortSessions(cohortId);
        return mockSessions.map(session => ({
          ...session,
          attendeeCount: Math.floor(Math.random() * 5) + 1, // Random attendee count
          status: 'upcoming' as const, // Default status
        }));
      }
    },
    enabled: !!cohortId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Fetch cohort artifacts
  const {
    data: artifacts = [],
    isLoading: isLoadingArtifacts,
  } = useQuery({
    queryKey: ['cohort-artifacts', cohortId],
    queryFn: async () => {
      try {
        return await getCohortArtifacts(cohortId);
      } catch (error) {
        console.warn('API not available, using mock artifacts:', error);
        return getCohortArtifacts(cohortId);
      }
    },
    enabled: !!cohortId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Fetch cohort chat messages
  const {
    data: messages = [],
    isLoading: isLoadingMessages,
  } = useQuery({
    queryKey: ['cohort-chat', cohortId],
    queryFn: async () => {
      try {
        return await getCohortChatMessages(cohortId);
      } catch (error) {
        console.warn('API not available, using mock messages:', error);
        return getCohortChatMessages(cohortId);
      }
    },
    enabled: !!cohortId,
    staleTime: 30 * 1000, // 30 seconds for chat
    retry: 1,
  });

  return {
    cohort,
    sessions,
    artifacts,
    messages,
    isLoading: isLoading || isLoadingSessions || isLoadingArtifacts || isLoadingMessages,
    error,
    refetchCohort,
  };
}
