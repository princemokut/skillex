/**
 * Server-side data fetching functions for referrals
 * Used in SSR components to fetch data at request time
 */

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
  mockReferrals
} from '@/lib/referral-mock-data';

/**
 * Fetch user referrals data on the server side
 * Falls back to mock data if API is not available
 */
export async function getReferralsData(userId: string) {
  try {
    // TODO: Replace with actual API calls when available
    const [given, received, requests, stats] = await Promise.all([
      getGivenReferrals(userId),
      getReceivedReferrals(userId),
      getReferralRequests(userId),
      getReferralStats(userId)
    ]);

    return {
      given,
      received,
      requests,
      stats
    };
  } catch (error) {
    console.warn('API not available, using mock data:', error);
    
    // Fallback to mock data
    const [given, received, requests, stats] = await Promise.all([
      getGivenReferrals(userId),
      getReceivedReferrals(userId),
      getReferralRequests(userId),
      getReferralStats(userId)
    ]);

    return {
      given,
      received,
      requests,
      stats
    };
  }
}

/**
 * Fetch specific referral data on the server side
 * Falls back to mock data if API is not available
 */
export async function getReferralData(referralId: string): Promise<ReferralWithType | null> {
  try {
    // TODO: Replace with actual API call when available
    const referral = mockReferrals.find(r => r.id === referralId);
    return referral || null;
  } catch (error) {
    console.warn('API not available, using mock data:', error);
    const referral = mockReferrals.find(r => r.id === referralId);
    return referral || null;
  }
}

/**
 * Fetch cohort referrals data on the server side
 * Falls back to mock data if API is not available
 */
export async function getCohortReferralsData(cohortId: string) {
  try {
    // TODO: Replace with actual API calls when available
    const [referrals, stats] = await Promise.all([
      getCohortReferrals(cohortId),
      getCohortReferralStats(cohortId)
    ]);

    return {
      referrals,
      stats
    };
  } catch (error) {
    console.warn('API not available, using mock data:', error);
    
    // Fallback to mock data
    const [referrals, stats] = await Promise.all([
      getCohortReferrals(cohortId),
      getCohortReferralStats(cohortId)
    ]);

    return {
      referrals,
      stats
    };
  }
}
