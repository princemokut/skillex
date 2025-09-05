/**
 * Mock data for cohort management
 * Provides realistic sample data for development and testing
 */

import { Cohort, CohortMember, Session } from '@skillex/types';

// Mock cohort data
export const mockCohorts: Cohort[] = [
  {
    id: 'cohort-1',
    title: 'React & TypeScript Mastery',
    ownerId: 'user-1',
    size: 4,
    startDate: new Date('2024-01-15'),
    weeks: 8,
    visibility: 'private',
    city: 'San Francisco',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'cohort-2',
    title: 'Data Science Fundamentals',
    ownerId: 'user-2',
    size: 6,
    startDate: new Date('2024-02-01'),
    weeks: 12,
    visibility: 'public',
    city: 'New York',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'cohort-3',
    title: 'UI/UX Design Principles',
    ownerId: 'user-3',
    size: 3,
    startDate: new Date('2024-01-20'),
    weeks: 6,
    visibility: 'private',
    city: 'Remote',
    createdAt: new Date('2024-01-10'),
  },
];

// Mock cohort members
export const mockCohortMembers: CohortMember[] = [
  // React & TypeScript Mastery cohort
  { cohortId: 'cohort-1', userId: 'user-1', role: 'teacher', joinedAt: new Date('2024-01-01') },
  { cohortId: 'cohort-1', userId: 'user-4', role: 'learner', joinedAt: new Date('2024-01-05') },
  { cohortId: 'cohort-1', userId: 'user-5', role: 'learner', joinedAt: new Date('2024-01-08') },
  { cohortId: 'cohort-1', userId: 'user-6', role: 'learner', joinedAt: new Date('2024-01-10') },
  
  // Data Science Fundamentals cohort
  { cohortId: 'cohort-2', userId: 'user-2', role: 'teacher', joinedAt: new Date('2024-01-15') },
  { cohortId: 'cohort-2', userId: 'user-7', role: 'learner', joinedAt: new Date('2024-01-20') },
  { cohortId: 'cohort-2', userId: 'user-8', role: 'learner', joinedAt: new Date('2024-01-22') },
  { cohortId: 'cohort-2', userId: 'user-9', role: 'learner', joinedAt: new Date('2024-01-25') },
  { cohortId: 'cohort-2', userId: 'user-10', role: 'learner', joinedAt: new Date('2024-01-28') },
  { cohortId: 'cohort-2', userId: 'user-11', role: 'learner', joinedAt: new Date('2024-01-30') },
  
  // UI/UX Design Principles cohort
  { cohortId: 'cohort-3', userId: 'user-3', role: 'teacher', joinedAt: new Date('2024-01-10') },
  { cohortId: 'cohort-3', userId: 'user-12', role: 'learner', joinedAt: new Date('2024-01-15') },
  { cohortId: 'cohort-3', userId: 'user-13', role: 'learner', joinedAt: new Date('2024-01-18') },
];

// Mock sessions data
export const mockSessions: Session[] = [
  // React & TypeScript Mastery sessions
  {
    id: 'session-1',
    cohortId: 'cohort-1',
    weekIndex: 0,
    startsAt: new Date('2024-01-15T18:00:00Z'),
    durationMinutes: 90,
    notesUrl: 'https://docs.google.com/document/d/react-ts-week1',
  },
  {
    id: 'session-2',
    cohortId: 'cohort-1',
    weekIndex: 1,
    startsAt: new Date('2024-01-22T18:00:00Z'),
    durationMinutes: 90,
    notesUrl: 'https://docs.google.com/document/d/react-ts-week2',
  },
  {
    id: 'session-3',
    cohortId: 'cohort-1',
    weekIndex: 2,
    startsAt: new Date('2024-01-29T18:00:00Z'),
    durationMinutes: 90,
  },
  {
    id: 'session-4',
    cohortId: 'cohort-1',
    weekIndex: 3,
    startsAt: new Date('2024-02-05T18:00:00Z'),
    durationMinutes: 90,
    notesUrl: 'https://docs.google.com/document/d/react-ts-week4',
  },
  
  // Data Science Fundamentals sessions
  {
    id: 'session-5',
    cohortId: 'cohort-2',
    weekIndex: 0,
    startsAt: new Date('2024-02-01T19:00:00Z'),
    durationMinutes: 120,
    notesUrl: 'https://docs.google.com/document/d/ds-fundamentals-week1',
  },
  {
    id: 'session-6',
    cohortId: 'cohort-2',
    weekIndex: 1,
    startsAt: new Date('2024-02-08T19:00:00Z'),
    durationMinutes: 120,
    notesUrl: 'https://docs.google.com/document/d/ds-fundamentals-week2',
  },
  
  // UI/UX Design Principles sessions
  {
    id: 'session-7',
    cohortId: 'cohort-3',
    weekIndex: 0,
    startsAt: new Date('2024-01-20T17:00:00Z'),
    durationMinutes: 60,
    notesUrl: 'https://docs.google.com/document/d/ux-design-week1',
  },
  {
    id: 'session-8',
    cohortId: 'cohort-3',
    weekIndex: 1,
    startsAt: new Date('2024-01-27T17:00:00Z'),
    durationMinutes: 60,
  },
];

// Mock artifacts data
export const mockArtifacts = [
  {
    id: 'artifact-1',
    cohortId: 'cohort-1',
    title: 'React Component Best Practices',
    url: 'https://docs.google.com/document/d/react-best-practices',
    type: 'document' as const,
    uploadedBy: 'user-1',
    uploadedAt: new Date('2024-01-16'),
  },
  {
    id: 'artifact-2',
    cohortId: 'cohort-1',
    title: 'TypeScript Configuration Guide',
    url: 'https://github.com/example/typescript-config',
    type: 'code' as const,
    uploadedBy: 'user-4',
    uploadedAt: new Date('2024-01-18'),
  },
  {
    id: 'artifact-3',
    cohortId: 'cohort-1',
    title: 'Project Setup Video',
    url: 'https://youtube.com/watch?v=react-setup',
    type: 'video' as const,
    uploadedBy: 'user-1',
    uploadedAt: new Date('2024-01-20'),
  },
  {
    id: 'artifact-4',
    cohortId: 'cohort-2',
    title: 'Data Analysis Template',
    url: 'https://docs.google.com/spreadsheets/d/data-template',
    type: 'spreadsheet' as const,
    uploadedBy: 'user-2',
    uploadedAt: new Date('2024-02-02'),
  },
  {
    id: 'artifact-5',
    cohortId: 'cohort-2',
    title: 'Python Data Science Libraries',
    url: 'https://github.com/example/python-ds-libs',
    type: 'code' as const,
    uploadedBy: 'user-7',
    uploadedAt: new Date('2024-02-05'),
  },
  {
    id: 'artifact-6',
    cohortId: 'cohort-3',
    title: 'Design System Components',
    url: 'https://figma.com/file/design-system',
    type: 'design' as const,
    uploadedBy: 'user-3',
    uploadedAt: new Date('2024-01-21'),
  },
];

// Mock chat messages
export const mockChatMessages = [
  {
    id: 'msg-1',
    cohortId: 'cohort-1',
    userId: 'user-1',
    content: 'Welcome everyone! Let\'s start with React fundamentals.',
    timestamp: new Date('2024-01-15T18:05:00Z'),
  },
  {
    id: 'msg-2',
    cohortId: 'cohort-1',
    userId: 'user-4',
    content: 'Thanks for having us! Excited to learn React.',
    timestamp: new Date('2024-01-15T18:07:00Z'),
  },
  {
    id: 'msg-3',
    cohortId: 'cohort-1',
    userId: 'user-5',
    content: 'Quick question - should we use functional or class components?',
    timestamp: new Date('2024-01-15T18:10:00Z'),
  },
  {
    id: 'msg-4',
    cohortId: 'cohort-1',
    userId: 'user-1',
    content: 'Great question! We\'ll focus on functional components with hooks.',
    timestamp: new Date('2024-01-15T18:12:00Z'),
  },
  {
    id: 'msg-5',
    cohortId: 'cohort-2',
    userId: 'user-2',
    content: 'Data Science cohort is starting! Check out the resources I shared.',
    timestamp: new Date('2024-02-01T19:05:00Z'),
  },
  {
    id: 'msg-6',
    cohortId: 'cohort-2',
    userId: 'user-7',
    content: 'The Python setup guide was super helpful, thanks!',
    timestamp: new Date('2024-02-01T19:15:00Z'),
  },
];

// Helper functions
export function getCohortById(id: string): Cohort | undefined {
  return mockCohorts.find(cohort => cohort.id === id);
}

export function getCohortMembers(cohortId: string): CohortMember[] {
  return mockCohortMembers.filter(member => member.cohortId === cohortId);
}

export function getCohortSessions(cohortId: string): Session[] {
  return mockSessions.filter(session => session.cohortId === cohortId);
}

export function getCohortArtifacts(cohortId: string) {
  return mockArtifacts.filter(artifact => artifact.cohortId === cohortId);
}

export function getCohortChatMessages(cohortId: string) {
  return mockChatMessages.filter(msg => msg.cohortId === cohortId);
}

export function getUserCohorts(userId: string): Cohort[] {
  const userCohortIds = mockCohortMembers
    .filter(member => member.userId === userId)
    .map(member => member.cohortId);
  
  return mockCohorts.filter(cohort => userCohortIds.includes(cohort.id));
}
