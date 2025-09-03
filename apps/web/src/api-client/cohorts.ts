/**
 * Cohorts API client for the skillex application
 * Provides methods for cohort operations
 */

import { apiGet, apiPost, apiPut, apiDelete } from './fetcher';
import { apiConfig } from '../lib/env';

/**
 * Cohort interface
 */
export interface Cohort {
  id: string;
  title: string;
  ownerId: string;
  size: number;
  startDate: string;
  weeks: number;
  visibility: 'private' | 'public';
  city?: string;
  createdAt: string;
  members: CohortMember[];
  sessions: Session[];
  messages: Message[];
  artifacts: Artifact[];
}

/**
 * Cohort member interface
 */
export interface CohortMember {
  cohortId: string;
  userId: string;
  role: 'teacher' | 'learner' | 'facilitator';
  joinedAt: string;
  user: {
    id: string;
    handle: string;
    fullName: string;
    avatarUrl?: string;
  };
}

/**
 * Session interface
 */
export interface Session {
  id: string;
  cohortId: string;
  weekIndex: number;
  startsAt: string;
  durationMinutes: number;
  notesUrl?: string;
}

/**
 * Message interface
 */
export interface Message {
  id: string;
  cohortId: string;
  userId: string;
  body: string;
  createdAt: string;
  user: {
    id: string;
    handle: string;
    fullName: string;
    avatarUrl?: string;
  };
}

/**
 * Artifact interface
 */
export interface Artifact {
  id: string;
  cohortId: string;
  url: string;
  kind: 'repo' | 'doc' | 'video' | 'image' | 'other';
  createdAt: string;
}

/**
 * Get all cohorts for the current user
 * 
 * @returns Promise resolving to user's cohorts
 */
export async function getUserCohorts(): Promise<{ cohorts: Cohort[] }> {
  return apiGet<{ cohorts: Cohort[] }>(apiConfig.endpoints.cohorts);
}

/**
 * Get a specific cohort by ID
 * 
 * @param cohortId - Cohort ID
 * @returns Promise resolving to cohort data
 */
export async function getCohort(cohortId: string): Promise<Cohort> {
  return apiGet<Cohort>(`${apiConfig.endpoints.cohorts}/${cohortId}`);
}

/**
 * Create a new cohort
 * 
 * @param cohortData - Cohort creation data
 * @returns Promise resolving to created cohort
 */
export async function createCohort(cohortData: {
  title: string;
  size: number;
  startDate: string;
  weeks: number;
  visibility: 'private' | 'public';
  city?: string;
}): Promise<Cohort> {
  return apiPost<Cohort>(apiConfig.endpoints.cohorts, cohortData);
}

/**
 * Join a cohort
 * 
 * @param cohortId - Cohort ID to join
 * @returns Promise resolving to success status
 */
export async function joinCohort(cohortId: string): Promise<{ success: boolean }> {
  return apiPost<{ success: boolean }>(`${apiConfig.endpoints.cohorts}/${cohortId}/join`);
}

/**
 * Leave a cohort
 * 
 * @param cohortId - Cohort ID to leave
 * @returns Promise resolving to success status
 */
export async function leaveCohort(cohortId: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${apiConfig.endpoints.cohorts}/${cohortId}/leave`);
}

/**
 * Get cohort messages
 * 
 * @param cohortId - Cohort ID
 * @returns Promise resolving to messages
 */
export async function getCohortMessages(cohortId: string): Promise<{ messages: Message[] }> {
  return apiGet<{ messages: Message[] }>(`${apiConfig.endpoints.cohorts}/${cohortId}/messages`);
}

/**
 * Send a message to a cohort
 * 
 * @param cohortId - Cohort ID
 * @param message - Message content
 * @returns Promise resolving to sent message
 */
export async function sendCohortMessage(
  cohortId: string,
  message: { body: string }
): Promise<Message> {
  return apiPost<Message>(`${apiConfig.endpoints.cohorts}/${cohortId}/messages`, message);
}

/**
 * Get cohort artifacts
 * 
 * @param cohortId - Cohort ID
 * @returns Promise resolving to artifacts
 */
export async function getCohortArtifacts(cohortId: string): Promise<{ artifacts: Artifact[] }> {
  return apiGet<{ artifacts: Artifact[] }>(`${apiConfig.endpoints.cohorts}/${cohortId}/artifacts`);
}

/**
 * Add an artifact to a cohort
 * 
 * @param cohortId - Cohort ID
 * @param artifact - Artifact data
 * @returns Promise resolving to created artifact
 */
export async function addCohortArtifact(
  cohortId: string,
  artifact: { url: string; kind: Artifact['kind'] }
): Promise<Artifact> {
  return apiPost<Artifact>(`${apiConfig.endpoints.cohorts}/${cohortId}/artifacts`, artifact);
}
