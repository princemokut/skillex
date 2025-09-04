/**
 * API client fetcher for the skillex application
 * Handles JWT authentication and provides a consistent interface for API calls
 */

import { getAuthToken } from '@/lib/auth';
import { apiConfig } from '@/lib/env';

/**
 * API error class for handling API-specific errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API response interface
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Fetch options interface extending the standard RequestInit
 */
export interface FetchOptions extends RequestInit {
  /** Whether to include authentication headers */
  requireAuth?: boolean;
  /** Custom headers to include */
  headers?: Record<string, string>;
}

/**
 * Base API fetcher function
 * Handles authentication, error handling, and response parsing
 * 
 * @param endpoint - API endpoint path (e.g., '/users/me')
 * @param options - Fetch options
 * @returns Promise resolving to the parsed response data
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    requireAuth = true,
    headers = {},
    ...fetchOptions
  } = options;

  // Build the full URL
  const url = `${apiConfig.baseUrl}${endpoint}`;

  // Prepare headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authentication header if required
  if (requireAuth) {
    const token = await getAuthToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    } else {
      throw new ApiError('Authentication required', 401, 'UNAUTHORIZED');
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    // Parse response
    let responseData: ApiResponse<T>;
    
    try {
      responseData = await response.json();
    } catch (parseError) {
      throw new ApiError(
        'Invalid response format',
        response.status,
        'INVALID_RESPONSE'
      );
    }

    // Handle non-2xx responses
    if (!response.ok) {
      const error = responseData.error || {
        code: 'UNKNOWN_ERROR',
        message: `HTTP ${response.status}: ${response.statusText}`,
      };

      throw new ApiError(
        error.message,
        response.status,
        error.code,
        error.details
      );
    }

    // Return the data
    return responseData.data || responseData as T;

  } catch (error) {
    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Network error - please check your connection',
        0,
        'NETWORK_ERROR'
      );
    }

    // Handle other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500,
      'UNKNOWN_ERROR'
    );
  }
}

/**
 * GET request helper
 * 
 * @param endpoint - API endpoint path
 * @param options - Fetch options
 * @returns Promise resolving to the response data
 */
export async function apiGet<T = any>(
  endpoint: string,
  options: Omit<FetchOptions, 'method'> = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST request helper
 * 
 * @param endpoint - API endpoint path
 * @param data - Request body data
 * @param options - Fetch options
 * @returns Promise resolving to the response data
 */
export async function apiPost<T = any>(
  endpoint: string,
  data?: any,
  options: Omit<FetchOptions, 'method' | 'body'> = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request helper
 * 
 * @param endpoint - API endpoint path
 * @param data - Request body data
 * @param options - Fetch options
 * @returns Promise resolving to the response data
 */
export async function apiPut<T = any>(
  endpoint: string,
  data?: any,
  options: Omit<FetchOptions, 'method' | 'body'> = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request helper
 * 
 * @param endpoint - API endpoint path
 * @param data - Request body data
 * @param options - Fetch options
 * @returns Promise resolving to the response data
 */
export async function apiPatch<T = any>(
  endpoint: string,
  data?: any,
  options: Omit<FetchOptions, 'method' | 'body'> = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request helper
 * 
 * @param endpoint - API endpoint path
 * @param options - Fetch options
 * @returns Promise resolving to the response data
 */
export async function apiDelete<T = any>(
  endpoint: string,
  options: Omit<FetchOptions, 'method'> = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
}

/**
 * Generic fetcher function for backward compatibility
 * @deprecated Use apiFetch, apiGet, apiPost, etc. instead
 */
export const fetcher = apiFetch;
