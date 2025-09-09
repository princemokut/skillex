/**
 * Server-side data fetching functions for cohorts
 * Used in SSR components to fetch data at request time
 */

import { 
  getCohorts, 
  getCohortById,
  CohortWithMembers,
} from '../api-client/cohorts';
import { 
  getCohortMembers, 
  getCohortSessions, 
  getCohortArtifacts, 
  getCohortChatMessages,
  mockCohorts
} from './cohort-mock-data';

/**
 * Fetch cohorts data on the server side
 * Falls back to mock data if API is not available
 */
export async function getCohortsData(): Promise<CohortWithMembers[]> {
  try {
    const response = await getCohorts();
    return response.cohorts;
  } catch (error) {
    console.warn('API not available, using mock data:', error);
    
    // Transform mock data to match API response format
    const mockCohortsWithMembers = mockCohorts
      .filter(cohort => cohort.id) // Filter out any cohorts without IDs
      .map(cohort => ({
        ...cohort,
        members: getCohortMembers(cohort.id!),
        sessionCount: getCohortSessions(cohort.id!).length,
        artifactCount: getCohortArtifacts(cohort.id!).length,
        lastMessageAt: getCohortChatMessages(cohort.id!).length > 0 
          ? getCohortChatMessages(cohort.id!)[getCohortChatMessages(cohort.id!).length - 1].timestamp
          : undefined,
      }));
    
    return mockCohortsWithMembers;
  }
}

/**
 * Fetch specific cohort data on the server side
 * Falls back to mock data if API is not available
 */
export async function getCohortData(cohortId: string): Promise<CohortWithMembers | null> {
  try {
    return await getCohortById(cohortId);
  } catch (error) {
    console.warn('API not available, using mock data:', error);
    
    const mockCohort = mockCohorts.find(c => c.id === cohortId);
    if (!mockCohort) {
      return null;
    }
    
    return {
      ...mockCohort,
      members: getCohortMembers(cohortId),
      sessionCount: getCohortSessions(cohortId).length,
      artifactCount: getCohortArtifacts(cohortId).length,
      lastMessageAt: getCohortChatMessages(cohortId).length > 0 
        ? getCohortChatMessages(cohortId)[getCohortChatMessages(cohortId).length - 1].timestamp
        : undefined,
    };
  }
}
