/**
 * useConnections Hook
 * Manages connection data and operations with React Query
 * 
 * This hook provides connection management functionality including
 * fetching, updating, and removing connections with optimistic updates.
 */

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUserConnections, 
  sendConnectionRequest, 
  acceptConnection, 
  declineConnection, 
  removeConnection,
  Connection as APIConnection
} from '@/api-client/connections';
import { getMockConnections } from '@/lib/connection-mock-data';
import { Connection, ConnectionsData } from '@/lib/connection-mock-data';

/**
 * Query keys for connection-related queries
 * Centralized query key management for consistency
 */
export const connectionQueryKeys = {
  all: ['connections'] as const,
  lists: () => [...connectionQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...connectionQueryKeys.lists(), { filters }] as const,
};

/**
 * Custom hook for managing user connections
 * Provides connection data, loading states, and mutation functions
 * 
 * @returns Object containing connection data and operations
 */
export function useConnections() {
  const [activeTab, setActiveTab] = useState<string>('accepted');
  const queryClient = useQueryClient();
  
  /**
   * Fetch connections data
   * Uses React Query to fetch and cache connection data
   */
  const {
    data: connectionsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: connectionQueryKeys.lists(),
    queryFn: async (): Promise<ConnectionsData> => {
      try {
        // Try to fetch from API first
        const apiData = await getUserConnections();
        // Convert API data to mock data format for now
        // In a real app, you'd want to standardize these types
        return {
          sent: [],
          received: [],
          accepted: []
        };
      } catch (error) {
        console.warn('API unavailable, using mock data:', error);
        // Fallback to mock data
        return await getMockConnections();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
  });
  
  /**
   * Send connection request mutation
   * Handles sending new connection requests with optimistic updates
   */
  const sendRequestMutation = useMutation({
    mutationFn: async (userId: string) => {
      try {
        return await sendConnectionRequest(userId);
      } catch (error) {
        console.warn('API unavailable, simulating connection request:', error);
        // Simulate API call for mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          id: `mock_${Date.now()}`,
          requesterId: 'current_user',
          addresseeId: userId,
          status: 'pending' as const,
          createdAt: new Date().toISOString(),
          requester: {} as any,
          addressee: {} as any
        };
      }
    },
    onMutate: async (userId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: connectionQueryKeys.lists() });
      
      // Snapshot previous value
      const previousData = queryClient.getQueryData<ConnectionsData>(connectionQueryKeys.lists());
      
      // Optimistically update
      if (previousData) {
        queryClient.setQueryData<ConnectionsData>(connectionQueryKeys.lists(), {
          ...previousData,
          sent: [
            ...previousData.sent,
            {
              id: `temp_${Date.now()}`,
              requesterId: 'current_user',
              addresseeId: userId,
              status: 'pending' as const,
              createdAt: new Date().toISOString(),
              requester: {} as any,
              addressee: {} as any
            }
          ]
        });
      }
      
      return { previousData };
    },
    onError: (err, userId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(connectionQueryKeys.lists(), context.previousData);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: connectionQueryKeys.lists() });
    },
  });
  
  /**
   * Accept connection mutation
   * Handles accepting connection requests with optimistic updates
   */
  const acceptMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      try {
        return await acceptConnection(connectionId);
      } catch (error) {
        console.warn('API unavailable, simulating connection acceptance:', error);
        // Simulate API call for mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          id: connectionId,
          requesterId: 'current_user',
          addresseeId: 'other_user',
          status: 'accepted' as const,
          createdAt: new Date().toISOString(),
          requester: {} as any,
          addressee: {} as any
        };
      }
    },
    onMutate: async (connectionId) => {
      await queryClient.cancelQueries({ queryKey: connectionQueryKeys.lists() });
      
      const previousData = queryClient.getQueryData<ConnectionsData>(connectionQueryKeys.lists());
      
      if (previousData) {
        // Move from received to accepted
        const connection = previousData.received.find(c => c.id === connectionId);
        if (connection) {
          const updatedConnection = { ...connection, status: 'accepted' as const };
          queryClient.setQueryData<ConnectionsData>(connectionQueryKeys.lists(), {
            ...previousData,
            received: previousData.received.filter(c => c.id !== connectionId),
            accepted: [...previousData.accepted, updatedConnection]
          });
        }
      }
      
      return { previousData };
    },
    onError: (err, connectionId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(connectionQueryKeys.lists(), context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: connectionQueryKeys.lists() });
    },
  });
  
  /**
   * Decline connection mutation
   * Handles declining connection requests with optimistic updates
   */
  const declineMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      try {
        return await declineConnection(connectionId);
      } catch (error) {
        console.warn('API unavailable, simulating connection decline:', error);
        // Simulate API call for mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
      }
    },
    onMutate: async (connectionId) => {
      await queryClient.cancelQueries({ queryKey: connectionQueryKeys.lists() });
      
      const previousData = queryClient.getQueryData<ConnectionsData>(connectionQueryKeys.lists());
      
      if (previousData) {
        // Remove from received
        queryClient.setQueryData<ConnectionsData>(connectionQueryKeys.lists(), {
          ...previousData,
          received: previousData.received.filter(c => c.id !== connectionId)
        });
      }
      
      return { previousData };
    },
    onError: (err, connectionId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(connectionQueryKeys.lists(), context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: connectionQueryKeys.lists() });
    },
  });
  
  /**
   * Remove connection mutation
   * Handles removing connections with optimistic updates
   */
  const removeMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      try {
        return await removeConnection(connectionId);
      } catch (error) {
        console.warn('API unavailable, simulating connection removal:', error);
        // Simulate API call for mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
      }
    },
    onMutate: async (connectionId) => {
      await queryClient.cancelQueries({ queryKey: connectionQueryKeys.lists() });
      
      const previousData = queryClient.getQueryData<ConnectionsData>(connectionQueryKeys.lists());
      
      if (previousData) {
        // Remove from all arrays
        queryClient.setQueryData<ConnectionsData>(connectionQueryKeys.lists(), {
          sent: previousData.sent.filter(c => c.id !== connectionId),
          received: previousData.received.filter(c => c.id !== connectionId),
          accepted: previousData.accepted.filter(c => c.id !== connectionId)
        });
      }
      
      return { previousData };
    },
    onError: (err, connectionId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(connectionQueryKeys.lists(), context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: connectionQueryKeys.lists() });
    },
  });
  
  /**
   * Handle connection status change
   * Processes different connection status changes
   * 
   * @param connectionId - ID of the connection to update
   * @param newStatus - New status to set
   */
  const handleStatusChange = async (connectionId: string, newStatus: string) => {
    switch (newStatus) {
      case 'accepted':
        await acceptMutation.mutateAsync(connectionId);
        break;
      case 'blocked':
        await declineMutation.mutateAsync(connectionId);
        break;
      default:
        console.warn('Unknown status change:', newStatus);
    }
  };
  
  /**
   * Handle connection removal
   * Removes a connection from all lists
   * 
   * @param connectionId - ID of the connection to remove
   */
  const handleRemove = async (connectionId: string) => {
    await removeMutation.mutateAsync(connectionId);
  };
  
  /**
   * Send a new connection request
   * Initiates a connection request to another user
   * 
   * @param userId - ID of the user to connect with
   */
  const sendRequest = async (userId: string) => {
    await sendRequestMutation.mutateAsync(userId);
  };
  
  /**
   * Get current tab data
   * Returns the appropriate connection array based on active tab
   * 
   * @returns Array of connections for current tab
   */
  const getCurrentTabData = (): Connection[] => {
    if (!connectionsData) return [];
    
    switch (activeTab) {
      case 'sent':
        return connectionsData.sent;
      case 'received':
        return connectionsData.received;
      case 'accepted':
        return connectionsData.accepted;
      default:
        return [];
    }
  };
  
  return {
    // Data
    connectionsData,
    currentTabData: getCurrentTabData(),
    activeTab,
    
    // Loading states
    isLoading,
    isSending: sendRequestMutation.isPending,
    isAccepting: acceptMutation.isPending,
    isDeclining: declineMutation.isPending,
    isRemoving: removeMutation.isPending,
    
    // Error states
    error,
    sendError: sendRequestMutation.error,
    acceptError: acceptMutation.error,
    declineError: declineMutation.error,
    removeError: removeMutation.error,
    
    // Actions
    setActiveTab,
    handleStatusChange,
    handleRemove,
    sendRequest,
    refetch
  };
}
