/**
 * Referrals API client for the skillex application
 * Provides methods for referral operations
 */

import { apiGet, apiPost, apiPut } from './fetcher';
import { apiConfig } from '../lib/env';

/**
 * Referral interface
 */
export interface Referral {
  id: string;
  fromUserId: string;
  toUserId: string;
  context: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  createdAt: string;
  fromUser: {
    id: string;
    handle: string;
    fullName: string;
    avatarUrl?: string;
  };
  toUser: {
    id: string;
    handle: string;
    fullName: string;
    avatarUrl?: string;
  };
}

/**
 * Get all referrals for the current user
 * 
 * @returns Promise resolving to user's referrals
 */
export async function getUserReferrals(): Promise<{
  sent: Referral[];
  received: Referral[];
  pending: Referral[];
  completed: Referral[];
}> {
  return apiGet<{
    sent: Referral[];
    received: Referral[];
    pending: Referral[];
    completed: Referral[];
  }>(apiConfig.endpoints.referrals);
}

/**
 * Create a new referral
 * 
 * @param referralData - Referral data
 * @returns Promise resolving to created referral
 */
export async function createReferral(referralData: {
  toUserId: string;
  context: string;
}): Promise<Referral> {
  return apiPost<Referral>(apiConfig.endpoints.referrals, referralData);
}

/**
 * Send a referral
 * 
 * @param referralId - Referral ID to send
 * @returns Promise resolving to updated referral
 */
export async function sendReferral(referralId: string): Promise<Referral> {
  return apiPut<Referral>(`${apiConfig.endpoints.referrals}/${referralId}/send`);
}

/**
 * Accept a referral
 * 
 * @param referralId - Referral ID to accept
 * @returns Promise resolving to updated referral
 */
export async function acceptReferral(referralId: string): Promise<Referral> {
  return apiPut<Referral>(`${apiConfig.endpoints.referrals}/${referralId}/accept`);
}

/**
 * Decline a referral
 * 
 * @param referralId - Referral ID to decline
 * @returns Promise resolving to updated referral
 */
export async function declineReferral(referralId: string): Promise<Referral> {
  return apiPut<Referral>(`${apiConfig.endpoints.referrals}/${referralId}/decline`);
}

/**
 * Request a referral from a connection
 * 
 * @param userId - User ID to request referral from
 * @param context - Context for the referral request
 * @returns Promise resolving to created referral
 */
export async function requestReferral(
  userId: string,
  context: string
): Promise<Referral> {
  return apiPost<Referral>(`${apiConfig.endpoints.referrals}/request`, {
    toUserId: userId,
    context,
  });
}
