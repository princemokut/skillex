"use client";

import dynamic from "next/dynamic";

/**
 * Matches page component
 * Displays a list of potential skill exchange matches for the authenticated user.
 * Includes filtering, search, and pagination functionality.
 */
export default function MatchesPage() {
  // Dynamically import the client component with no SSR
  const MatchesPageClient = dynamic(
    () => import('./page.client'),
    { ssr: false }
  );
  
  return <MatchesPageClient />;
}