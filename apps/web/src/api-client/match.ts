/**
 * Match API client for the skillex application
 * Provides methods for user matching operations
 */

import { apiPost } from './fetcher';
import { apiConfig } from '../lib/env';

/**
 * Match preview interface
 */
export interface MatchPreview {
  matches: MatchCandidate[];
  message?: string;
}

/**
 * Match candidate interface
 */
export interface MatchCandidate {
  user: {
    id: string;
    handle: string;
    fullName: string;
    bio?: string;
    avatarUrl?: string;
    locationCity?: string;
    locationCountry?: string;
    timezone: string;
  };
  skills: {
    teach: string[];
    learn: string[];
    overlap: string[];
  };
  availability: {
    overlap: number;
    percentage: number;
  };
  score: number;
  reason: string;
}

/**
 * Get matching preview with scored candidates
 * 
 * @returns Promise resolving to match preview data
 */
export async function getMatchPreview(): Promise<MatchPreview> {
  return apiPost<MatchPreview>(`${apiConfig.endpoints.matches}/preview`);
}

/**
 * Get matches with filters
 * 
 * @param filters - Optional filters for matching
 * @returns Promise resolving to filtered matches
 */
export async function getMatches(filters?: {
  tags?: string[];
  location?: string;
  timezone?: string;
  cohortSize?: number;
}): Promise<MatchPreview> {
  return apiPost<MatchPreview>(`${apiConfig.endpoints.matches}/preview`, filters);
}

/**
 * Get match explanation for a specific user
 * 
 * @param userId - User ID to get match explanation for
 * @returns Promise resolving to match explanation
 */
export async function getMatchExplanation(userId: string): Promise<{
  user: MatchCandidate['user'];
  skills: MatchCandidate['skills'];
  availability: MatchCandidate['availability'];
  score: number;
  reason: string;
}> {
  return apiPost<{
    user: MatchCandidate['user'];
    skills: MatchCandidate['skills'];
    availability: MatchCandidate['availability'];
    score: number;
    reason: string;
  }>(`${apiConfig.endpoints.matches}/explain`, { userId });
}
