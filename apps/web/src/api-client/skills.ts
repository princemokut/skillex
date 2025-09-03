/**
 * Skills API client for the skillex application
 * Provides methods for user skills operations
 */

import { apiGet, apiPost, apiDelete } from './fetcher';
import { apiConfig } from '../lib/env';
import type { SkillResponse, SkillCreate } from '@skillex/types';

/**
 * Get the current user's skills
 * 
 * @returns Promise resolving to the user's skills
 */
export async function getUserSkills(): Promise<{ skills: SkillResponse[] }> {
  return apiGet<{ skills: SkillResponse[] }>(`${apiConfig.endpoints.skills}/me`);
}

/**
 * Create a new skill for the current user
 * 
 * @param skillData - Skill data
 * @returns Promise resolving to the created skill
 */
export async function createSkill(skillData: SkillCreate): Promise<SkillResponse> {
  return apiPost<SkillResponse>(apiConfig.endpoints.skills, skillData);
}

/**
 * Delete a user skill
 * 
 * @param skillId - Skill ID to delete
 * @returns Promise resolving to success status
 */
export async function deleteSkill(skillId: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${apiConfig.endpoints.skills}/${skillId}`);
}

/**
 * Get skills by tags (for matching)
 * 
 * @param tags - Array of skill tags to search for
 * @returns Promise resolving to matching skills
 */
export async function getSkillsByTags(tags: string[]): Promise<{ skills: SkillResponse[] }> {
  const queryParams = new URLSearchParams();
  tags.forEach(tag => queryParams.append('tags', tag));
  
  return apiGet<{ skills: SkillResponse[] }>(
    `${apiConfig.endpoints.skills}?${queryParams.toString()}`
  );
}
