import { redirect } from "next/navigation";
import { getCohortsData } from "@/lib/cohort-server-data";
import { CohortsClient } from "@/components/cohort/cohorts-client";
import { CohortWithMembers } from "@/api-client/cohorts";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Cohorts page showing user's cohorts and available cohorts to join
 * Server-side rendered with data fetched at request time
 */
export default async function CohortsPage() {
  // TODO: Add proper authentication check here
  // For now, we'll assume user is authenticated and fetch data
  
  let cohorts: CohortWithMembers[] = [];
  let error: Error | null = null;
  
  try {
    cohorts = await getCohortsData();
  } catch (err) {
    error = err as Error;
    cohorts = [];
  }

  return <CohortsClient cohorts={cohorts} error={error} />;
}
