/**
 * Users API client for the skillex application
 * Provides methods for user profile operations
 */

import { apiGet, apiPatch } from './fetcher';
import { apiConfig } from '../lib/env';
import type { UserResponse, UserUpdate } from '@skillex/types';

/**
 * Get the current user's profile
 * 
 * @returns Promise resolving to the user profile
 */
export async function getCurrentUser(): Promise<UserResponse> {
  return apiGet<UserResponse>(`${apiConfig.endpoints.users}/me`);
}

/**
 * Get a user's profile by handle
 * 
 * @param handle - User's handle
 * @returns Promise resolving to the user profile
 */
export async function getUserByHandle(handle: string): Promise<UserResponse> {
  return apiGet<UserResponse>(`${apiConfig.endpoints.users}/${handle}`);
}

/**
 * Update the current user's profile
 * 
 * @param userId - User ID
 * @param updates - Profile updates
 * @returns Promise resolving to the updated user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: UserUpdate
): Promise<UserResponse> {
  return apiPatch<UserResponse>(`${apiConfig.endpoints.users}/${userId}`, updates);
}

/**
 * Create a new user profile
 * This would typically be called during onboarding
 * 
 * @param userData - User profile data
 * @returns Promise resolving to the created user profile
 */
export async function createUserProfile(userData: {
  handle: string;
  fullName: string;
  bio?: string;
  timezone: string;
  languages: string[];
  locationCity?: string;
  locationCountry?: string;
}): Promise<UserResponse> {
  return apiPatch<UserResponse>(`${apiConfig.endpoints.users}/me`, userData);
}
