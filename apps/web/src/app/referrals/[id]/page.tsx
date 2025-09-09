import { notFound } from "next/navigation";
import { getReferralData } from "@/lib/referral-server-data";
import { ReferralDetailClient } from "@/components/referral/referral-detail-client";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Referral detail page showing specific referral information
 * Server-side rendered with data fetched at request time
 */
export default async function ReferralDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: referralId } = await params;
  
  // TODO: Add proper authentication check here
  // For now, we'll assume user is authenticated and fetch data
  const currentUserId = "user-1"; // Mock user ID for development
  
  const referral = await getReferralData(referralId);
  
  if (!referral) {
    notFound();
  }

  return (
    <ReferralDetailClient
              referral={referral}
      referralId={referralId}
      currentUserId={currentUserId}
    />
  );
}