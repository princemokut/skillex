import { notFound } from "next/navigation";
import { getCohortData } from "@/lib/cohort-server-data";
import { CohortDetailClient } from "@/components/cohort/cohort-detail-client";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Individual cohort page showing detailed cohort information
 * Server-side rendered with data fetched at request time
 */
export default async function CohortPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: cohortId } = await params;
  
  // TODO: Add proper authentication check here
  // For now, we'll assume user is authenticated and fetch data
  
  const cohort = await getCohortData(cohortId);
  
  if (!cohort) {
    notFound();
  }

  return <CohortDetailClient cohort={cohort} cohortId={cohortId} />;
}