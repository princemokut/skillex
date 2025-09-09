import { getReferralsData } from "@/lib/referral-server-data";
import { ReferralsClient } from "@/components/referral/referrals-client";
import { ReferralWithType } from "@/lib/referral-mock-data";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Referrals page showing user's referrals and requests
 * Server-side rendered with data fetched at request time
 */
export default async function ReferralsPage() {
  // TODO: Add proper authentication check here
  // For now, we'll assume user is authenticated and fetch data
  const userId = "user-1"; // Mock user ID for development
  
  let givenReferrals: ReferralWithType[] = [];
  let receivedReferrals: ReferralWithType[] = [];
  let requests: ReferralWithType[] = [];
  let stats = {
    totalReferrals: 0,
    acceptedReferrals: 0,
    pendingReferrals: 0,
    responseRate: 0
  };
  let error: Error | null = null;
  
  try {
    const data = await getReferralsData(userId);
    givenReferrals = data.given;
    receivedReferrals = data.received;
    requests = data.requests;
    
    // Transform stats to match expected format
    stats = {
      totalReferrals: data.stats.sent.total + data.stats.received.total,
      acceptedReferrals: data.stats.sent.accepted + data.stats.received.accepted,
      pendingReferrals: data.stats.sent.sent + data.stats.received.pending,
      responseRate: data.stats.sent.total > 0 ? Math.round((data.stats.sent.accepted / data.stats.sent.total) * 100) : 0
    };
  } catch (err) {
    error = err as Error;
  }

  return (
    <ReferralsClient
      givenReferrals={givenReferrals}
      receivedReferrals={receivedReferrals}
      requests={requests}
      stats={stats}
      userId={userId}
    />
  );
}