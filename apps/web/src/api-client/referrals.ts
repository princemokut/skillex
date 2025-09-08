/**
 * Referrals API Client
 * Handles all referral-related API calls with type safety
 * 
 * This module provides functions for interacting with the referrals API,
 * including CRUD operations and cohort validation.
 */

import { Referral, ReferralCreate, ReferralUpdate, ReferralStatus } from '@skillex/types';

/**
 * Base URL for referrals API
 * Centralized API endpoint configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Referral API response interface
 * Defines the structure of API responses
 */
export interface ReferralAPIResponse {
  success: boolean;
  data?: Referral;
  error?: string;
}

/**
 * Referrals list API response interface
 * Defines the structure of referrals list API responses
 */
export interface ReferralsListAPIResponse {
  success: boolean;
  data?: Referral[];
  error?: string;
}

/**
 * Get authentication headers
 * Returns headers with JWT token for authenticated requests
 * 
 * @returns Headers object with authorization
 */
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

/**
 * Handle API response errors
 * Throws appropriate errors for API responses
 * 
 * @param response - API response to check
 * @throws Error if response indicates failure
 */
async function handleAPIError(response: Response): Promise<void> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
}

/**
 * Get user referrals
 * Fetches all referrals for a specific user
 * 
 * @param userId - User ID to get referrals for
 * @returns Promise resolving to user referrals
 */
export async function getUserReferrals(userId: string): Promise<Referral[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/referrals?userId=${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    await handleAPIError(response);
    const result: ReferralsListAPIResponse = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch referrals');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching user referrals:', error);
    throw error;
  }
}

/**
 * Get sent referrals
 * Fetches referrals sent by a specific user
 * 
 * @param userId - User ID to get sent referrals for
 * @returns Promise resolving to sent referrals
 */
export async function getSentReferrals(userId: string): Promise<Referral[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/referrals?userId=${userId}&type=sent`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    await handleAPIError(response);
    const result: ReferralsListAPIResponse = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch sent referrals');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching sent referrals:', error);
    throw error;
  }
}

/**
 * Get received referrals
 * Fetches referrals received by a specific user
 * 
 * @param userId - User ID to get received referrals for
 * @returns Promise resolving to received referrals
 */
export async function getReceivedReferrals(userId: string): Promise<Referral[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/referrals?userId=${userId}&type=received`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    await handleAPIError(response);
    const result: ReferralsListAPIResponse = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch received referrals');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching received referrals:', error);
    throw error;
  }
}

/**
 * Get cohort referrals
 * Fetches referrals for a specific cohort
 * 
 * @param cohortId - Cohort ID to get referrals for
 * @returns Promise resolving to cohort referrals
 */
export async function getCohortReferrals(cohortId: string): Promise<Referral[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/referrals?cohortId=${cohortId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    await handleAPIError(response);
    const result: ReferralsListAPIResponse = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch cohort referrals');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching cohort referrals:', error);
    throw error;
  }
}

/**
 * Get referrals by status
 * Fetches referrals filtered by status
 * 
 * @param userId - User ID to get referrals for
 * @param status - Status to filter by
 * @returns Promise resolving to filtered referrals
 */
export async function getReferralsByStatus(userId: string, status: ReferralStatus): Promise<Referral[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/referrals?userId=${userId}&status=${status}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    await handleAPIError(response);
    const result: ReferralsListAPIResponse = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch referrals by status');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching referrals by status:', error);
    throw error;
  }
}

/**
 * Create a new referral
 * Creates a referral with cohort validation
 * 
 * @param referralData - Referral data to create
 * @returns Promise resolving to created referral
 */
export async function createReferral(referralData: ReferralCreate & { cohortId: string }): Promise<Referral> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/referrals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(referralData),
    });

    await handleAPIError(response);
    const result: ReferralAPIResponse = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to create referral');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating referral:', error);
    throw error;
  }
}

/**
 * Update referral status
 * Updates the status of an existing referral
 * 
 * @param referralId - Referral ID to update
 * @param status - New status
 * @returns Promise resolving to updated referral
 */
export async function updateReferralStatus(referralId: string, status: ReferralStatus): Promise<Referral> {
  try {
    const updateData: ReferralUpdate = { status };
    
    const response = await fetch(`${API_BASE_URL}/v1/referrals/${referralId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    await handleAPIError(response);
    const result: ReferralAPIResponse = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to update referral status');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating referral status:', error);
    throw error;
  }
}

/**
 * Delete a referral
 * Deletes an existing referral
 * 
 * @param referralId - Referral ID to delete
 * @returns Promise resolving to success status
 */
export async function deleteReferral(referralId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/referrals/${referralId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleAPIError(response);
    const result: { success: boolean; error?: string } = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete referral');
    }

    return true;
  } catch (error) {
    console.error('Error deleting referral:', error);
    throw error;
  }
}

/**
 * Get referral statistics
 * Fetches referral statistics for a user
 * 
 * @param userId - User ID to get statistics for
 * @returns Promise resolving to referral statistics
 */
export async function getReferralStats(userId: string): Promise<{
  sent: {
    total: number;
    draft: number;
    sent: number;
    accepted: number;
    declined: number;
  };
  received: {
    total: number;
    pending: number;
    accepted: number;
    declined: number;
  };
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/referrals/stats?userId=${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    await handleAPIError(response);
    const result = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch referral statistics');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching referral statistics:', error);
    throw error;
  }
}

/**
 * Get cohort referral statistics
 * Fetches referral statistics for a cohort
 * 
 * @param cohortId - Cohort ID to get statistics for
 * @returns Promise resolving to cohort referral statistics
 */
export async function getCohortReferralStats(cohortId: string): Promise<{
  totalReferrals: number;
  sessionCompletionPercentage: number;
  isEligible: boolean;
  byStatus: {
    draft: number;
    sent: number;
    accepted: number;
    declined: number;
  };
  byType: {
    job: number;
    project: number;
    collaboration: number;
    mentorship: number;
    freelance: number;
  };
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/referrals/cohort-stats?cohortId=${cohortId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    await handleAPIError(response);
    const result = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch cohort referral statistics');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching cohort referral statistics:', error);
    throw error;
  }
}

/**
 * Validate referral creation
 * Validates if a referral can be created for given parameters
 * 
 * @param fromUserId - User ID sending the referral
 * @param toUserId - User ID receiving the referral
 * @param cohortId - Cohort ID for the referral
 * @returns Promise resolving to validation result
 */
export async function validateReferralCreation(
  fromUserId: string, 
  toUserId: string, 
  cohortId: string
): Promise<{ isValid: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/referrals/validate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ fromUserId, toUserId, cohortId }),
    });

    await handleAPIError(response);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to validate referral creation');
    }

    return result.data;
  } catch (error) {
    console.error('Error validating referral creation:', error);
    throw error;
  }
}