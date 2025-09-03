/**
 * React Query provider for the skillex application
 * Provides data fetching and caching capabilities
 */

"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Create a new QueryClient instance
 * Configured with default options for the skillex application
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

/**
 * Query provider props
 */
interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Query provider component
 * Wraps the app and provides React Query functionality
 * 
 * @param children - Child components
 * @returns QueryProvider JSX
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Export the query client for use in other parts of the app
 */
export { queryClient };
