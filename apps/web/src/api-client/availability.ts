/**
 * Availability API client for the skillex application
 * Provides methods for user availability operations
 */

import { apiGet, apiPut } from './fetcher';
import { apiConfig } from '../lib/env';
import type { AvailabilityResponse, AvailabilityUpdate } from '@skillex/types';

/**
 * Get the current user's availability
 * 
 * @returns Promise resolving to the user's availability
 */
export async function getUserAvailability(): Promise<AvailabilityResponse> {
  return apiGet<AvailabilityResponse>(apiConfig.endpoints.availability);
}

/**
 * Update the current user's availability
 * 
 * @param availabilityData - Availability data (weekMask array)
 * @returns Promise resolving to the updated availability
 */
export async function updateUserAvailability(
  availabilityData: AvailabilityUpdate
): Promise<AvailabilityResponse> {
  return apiPut<AvailabilityResponse>(apiConfig.endpoints.availability, availabilityData);
}

/**
 * Get availability overlap with another user
 * This would be used for matching
 * 
 * @param userId - User ID to check overlap with
 * @returns Promise resolving to availability overlap data
 */
export async function getAvailabilityOverlap(userId: string): Promise<{
  overlap: number[];
  totalOverlap: number;
  percentage: number;
}> {
  return apiGet<{
    overlap: number[];
    totalOverlap: number;
    percentage: number;
  }>(`${apiConfig.endpoints.availability}/overlap/${userId}`);
}
