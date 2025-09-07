/**
 * API client for match-related endpoints
 * Handles match preview, filtering, and discovery functionality
 */

import { fetcher } from './fetcher';
import { apiConfig } from '../lib/env';

/**
 * Interface for match preview request
 */
export interface MatchPreviewRequest {
  filters?: {
    skill_level?: string;
    location?: string;
    availability?: string;
    skills?: string[];
    search?: string;
  };
  limit?: number;
  offset?: number;
  sort_by?: 'match_score' | 'last_active' | 'name' | 'location';
}

/**
 * Interface for match preview response
 */
export interface MatchPreviewResponse {
  matches: Array<{
    id: string;
    name: string;
    handle: string;
    bio?: string;
    location?: string;
    avatar_url?: string;
    skills_to_teach: Array<{
      name: string;
      level: "beginner" | "intermediate" | "advanced" | "expert";
    }>;
    skills_to_learn: Array<{
      name: string;
      level: "beginner" | "intermediate" | "advanced" | "expert";
    }>;
    common_skills: string[];
    match_score: number;
    last_active?: string;
    availability_summary?: string;
  }>;
  total: number;
  has_more: boolean;
  available_skills: string[];
}

/**
 * Get match preview with filtering options
 * 
 * @param request - Match preview request parameters
 * @returns Promise resolving to match preview response
 */
export async function getMatchPreview(request: MatchPreviewRequest = {}): Promise<MatchPreviewResponse> {
  const params = new URLSearchParams();
  
  if (request.filters) {
    if (request.filters.skill_level) {
      params.append('skill_level', request.filters.skill_level);
    }
    if (request.filters.location) {
      params.append('location', request.filters.location);
    }
    if (request.filters.availability) {
      params.append('availability', request.filters.availability);
    }
    if (request.filters.skills && request.filters.skills.length > 0) {
      params.append('skills', request.filters.skills.join(','));
    }
    if (request.filters.search) {
      params.append('search', request.filters.search);
    }
  }
  
  if (request.limit) {
    params.append('limit', request.limit.toString());
  }
  if (request.offset) {
    params.append('offset', request.offset.toString());
  }
  if (request.sort_by) {
    params.append('sort_by', request.sort_by);
  }

  const url = `${apiConfig.endpoints.matches}/preview`;
  
  // Use the params to build a body instead of query string for POST requests
  return fetcher(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
}

/**
 * Get available skills for filtering
 * 
 * @returns Promise resolving to array of available skills
 */
export async function getAvailableSkills(): Promise<string[]> {
  const response = await getMatchPreview({ limit: 1 });
  return response.available_skills || [];
}

/**
 * Get match by ID
 * 
 * @param matchId - The match ID
 * @returns Promise resolving to match data
 */
export async function getMatchById(matchId: string) {
  return fetcher(`${apiConfig.endpoints.matches}/${matchId}`);
}

/**
 * Connect with a match
 * 
 * @param matchId - The match ID to connect with
 * @returns Promise resolving to connection response
 */
export async function connectWithMatch(matchId: string) {
  return fetcher(`${apiConfig.endpoints.connections}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      match_id: matchId,
    }),
  });
}