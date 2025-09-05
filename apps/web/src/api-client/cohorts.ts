/**
 * API client for cohort-related endpoints
 * Handles all cohort operations including CRUD, members, sessions, and artifacts
 */

import { fetcher } from './fetcher';
import { apiConfig } from '../lib/env';
import { Cohort, CohortCreate, CohortUpdate, CohortMember, Session, SessionCreate } from '@skillex/types';

// Cohort API endpoints
const COHORT_ENDPOINTS = {
  cohorts: `${apiConfig.endpoints.cohorts}`,
  members: (cohortId: string) => `${apiConfig.endpoints.cohorts}/${cohortId}/members`,
  sessions: (cohortId: string) => `${apiConfig.endpoints.cohorts}/${cohortId}/sessions`,
  artifacts: (cohortId: string) => `${apiConfig.endpoints.cohorts}/${cohortId}/artifacts`,
  chat: (cohortId: string) => `${apiConfig.endpoints.cohorts}/${cohortId}/chat`,
} as const;

// Types for API responses
export interface CohortWithMembers extends Cohort {
  members: CohortMember[];
  sessionCount: number;
  artifactCount: number;
  lastMessageAt?: Date;
}

export interface CohortListResponse {
  cohorts: CohortWithMembers[];
  total: number;
}

export interface SessionWithDetails extends Session {
  attendeeCount: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Artifact {
  id: string;
  cohortId: string;
  title: string;
  url: string;
  type: 'document' | 'code' | 'video' | 'spreadsheet' | 'design' | 'other';
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ChatMessage {
  id: string;
  cohortId: string;
  userId: string;
  content: string;
  timestamp: Date;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// Cohort CRUD operations
export async function getCohorts(): Promise<CohortListResponse> {
  return fetcher(COHORT_ENDPOINTS.cohorts, { method: 'GET' });
}

export async function getCohortById(id: string): Promise<CohortWithMembers> {
  return fetcher(`${COHORT_ENDPOINTS.cohorts}/${id}`, { method: 'GET' });
}

export async function createCohort(data: CohortCreate): Promise<Cohort> {
  return fetcher(COHORT_ENDPOINTS.cohorts, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCohort(id: string, data: CohortUpdate): Promise<Cohort> {
  return fetcher(`${COHORT_ENDPOINTS.cohorts}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteCohort(id: string): Promise<void> {
  return fetcher(`${COHORT_ENDPOINTS.cohorts}/${id}`, { method: 'DELETE' });
}

// Cohort member operations
export async function getCohortMembers(cohortId: string): Promise<CohortMember[]> {
  return fetcher(COHORT_ENDPOINTS.members(cohortId), { method: 'GET' });
}

export async function addCohortMember(cohortId: string, userId: string, role: 'teacher' | 'learner' | 'facilitator'): Promise<CohortMember> {
  return fetcher(COHORT_ENDPOINTS.members(cohortId), {
    method: 'POST',
    body: JSON.stringify({ userId, role }),
  });
}

export async function removeCohortMember(cohortId: string, userId: string): Promise<void> {
  return fetcher(`${COHORT_ENDPOINTS.members(cohortId)}/${userId}`, { method: 'DELETE' });
}

// Session operations
export async function getCohortSessions(cohortId: string): Promise<SessionWithDetails[]> {
  return fetcher(COHORT_ENDPOINTS.sessions(cohortId), { method: 'GET' });
}

export async function createSession(cohortId: string, data: SessionCreate): Promise<Session> {
  return fetcher(COHORT_ENDPOINTS.sessions(cohortId), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSession(cohortId: string, sessionId: string, data: Partial<SessionCreate>): Promise<Session> {
  return fetcher(`${COHORT_ENDPOINTS.sessions(cohortId)}/${sessionId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteSession(cohortId: string, sessionId: string): Promise<void> {
  return fetcher(`${COHORT_ENDPOINTS.sessions(cohortId)}/${sessionId}`, { method: 'DELETE' });
}

// Artifact operations
export async function getCohortArtifacts(cohortId: string): Promise<Artifact[]> {
  return fetcher(COHORT_ENDPOINTS.artifacts(cohortId), { method: 'GET' });
}

export async function addCohortArtifact(cohortId: string, data: Omit<Artifact, 'id' | 'cohortId' | 'uploadedAt'>): Promise<Artifact> {
  return fetcher(COHORT_ENDPOINTS.artifacts(cohortId), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteCohortArtifact(cohortId: string, artifactId: string): Promise<void> {
  return fetcher(`${COHORT_ENDPOINTS.artifacts(cohortId)}/${artifactId}`, { method: 'DELETE' });
}

// Chat operations
export async function getCohortChatMessages(cohortId: string, limit = 50, offset = 0): Promise<ChatMessage[]> {
  return fetcher(`${COHORT_ENDPOINTS.chat(cohortId)}?limit=${limit}&offset=${offset}`, { method: 'GET' });
}

export async function sendChatMessage(cohortId: string, content: string): Promise<ChatMessage> {
  return fetcher(COHORT_ENDPOINTS.chat(cohortId), {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}