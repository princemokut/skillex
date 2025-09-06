/**
 * Mock data for referral management
 * Provides realistic sample data for development and testing
 * Includes cohort context and session completion validation
 */

import { Referral, ReferralStatus } from '@skillex/types';
import { mockCohorts, mockCohortMembers, mockSessions } from './cohort-mock-data';

// Extended referral type with cohort context
export interface ReferralWithContext extends Referral {
  cohortId: string;
  cohortTitle: string;
  sessionCompletionPercentage: number;
  isEligible: boolean;
  fromUser: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    title: string;
  };
  toUser: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    title: string;
  };
}

// Referral context types
export type ReferralContextType = 'job' | 'project' | 'collaboration' | 'mentorship' | 'freelance';

// Referral direction types
export type ReferralDirection = 'send' | 'request';

// Referral request types
export type ReferralRequestType = 'general' | 'company_specific' | 'project_specific';

// Extended referral with context type
export interface ReferralWithType extends ReferralWithContext {
  contextType: ReferralContextType;
  direction: ReferralDirection;
  requestType?: ReferralRequestType;
  companyName?: string;
  projectTitle?: string;
  urgency: 'low' | 'medium' | 'high';
}

/**
 * Calculate session completion percentage for a cohort
 * @param cohortId - The cohort ID to calculate completion for
 * @returns The percentage of sessions completed (0-100)
 */
export function calculateSessionCompletionPercentage(cohortId: string): number {
  const cohort = mockCohorts.find(c => c.id === cohortId);
  if (!cohort) return 0;

  const totalSessions = cohort.weeks;
  const completedSessions = mockSessions
    .filter(session => session.cohortId === cohortId)
    .filter(session => session.startsAt < new Date())
    .length;

  return Math.round((completedSessions / totalSessions) * 100);
}

/**
 * Check if a user is eligible to send referrals in a cohort
 * @param userId - The user ID to check
 * @param cohortId - The cohort ID to check eligibility for
 * @returns True if user is eligible (75%+ sessions completed)
 */
export function isUserEligibleForReferrals(userId: string, cohortId: string): boolean {
  const completionPercentage = calculateSessionCompletionPercentage(cohortId);
  return completionPercentage >= 75;
}

/**
 * Get cohort members who are eligible for referrals
 * @param cohortId - The cohort ID to get eligible members for
 * @returns Array of eligible cohort members
 */
export function getEligibleCohortMembers(cohortId: string) {
  const members = mockCohortMembers.filter(member => member.cohortId === cohortId);
  const completionPercentage = calculateSessionCompletionPercentage(cohortId);
  
  // Mock users data for cohort members
  const mockUsers = [
    { id: 'user-1', name: 'John Doe', handle: 'johndoe', avatar: '/avatars/john.jpg', title: 'Senior Software Engineer' },
    { id: 'user-2', name: 'Dr. Emily Rodriguez', handle: 'emilyr', avatar: '/avatars/emily.jpg', title: 'Data Science Lead' },
    { id: 'user-3', name: 'David Kim', handle: 'davidk', avatar: '/avatars/david.jpg', title: 'Senior UX Designer' },
    { id: 'user-4', name: 'Sarah Wilson', handle: 'sarahw', avatar: '/avatars/sarah.jpg', title: 'Frontend Developer' },
    { id: 'user-5', name: 'Mike Chen', handle: 'mikec', avatar: '/avatars/mike.jpg', title: 'Full Stack Developer' },
    { id: 'user-6', name: 'Tom Anderson', handle: 'toma', avatar: '/avatars/tom.jpg', title: 'Software Developer' },
    { id: 'user-7', name: 'Alex Thompson', handle: 'alext', avatar: '/avatars/alex.jpg', title: 'Data Analyst' },
    { id: 'user-8', name: 'Lisa Park', handle: 'lisap', avatar: '/avatars/lisa.jpg', title: 'UI Designer' },
    { id: 'user-9', name: 'James Wilson', handle: 'jamesw', avatar: '/avatars/james.jpg', title: 'Backend Developer' },
    { id: 'user-10', name: 'Maria Garcia', handle: 'mariag', avatar: '/avatars/maria.jpg', title: 'DevOps Engineer' },
    { id: 'user-11', name: 'Chris Brown', handle: 'chrisb', avatar: '/avatars/chris.jpg', title: 'Product Manager' },
    { id: 'user-12', name: 'Anna Lee', handle: 'annal', avatar: '/avatars/anna.jpg', title: 'UX Researcher' },
    { id: 'user-13', name: 'Ryan Taylor', handle: 'ryant', avatar: '/avatars/ryan.jpg', title: 'Mobile Developer' }
  ];

  return members.map(member => ({
    ...member,
    sessionCompletionPercentage: completionPercentage,
    isEligible: completionPercentage >= 75,
    user: mockUsers.find((user: any) => user.id === member.userId)
  })).filter(member => member.user);
}

// Mock referrals data with cohort context
export const mockReferrals: ReferralWithType[] = [
  {
    id: 'referral-1',
    fromUserId: 'user-1',
    toUserId: 'user-4',
    context: 'I highly recommend Sarah for the Senior React Developer position at our company. She demonstrated exceptional problem-solving skills during our React & TypeScript cohort sessions and consistently delivered high-quality code.',
    status: 'sent',
    createdAt: new Date('2024-02-10T10:00:00Z'),
    cohortId: 'cohort-1',
    cohortTitle: 'React & TypeScript Mastery',
    sessionCompletionPercentage: 87,
    isEligible: true,
    contextType: 'job',
    direction: 'send',
    companyName: 'TechCorp Inc.',
    urgency: 'high',
    fromUser: {
      id: 'user-1',
      name: 'John Doe',
      handle: 'johndoe',
      avatar: '/avatars/john.jpg',
      title: 'Senior Software Engineer'
    },
    toUser: {
      id: 'user-4',
      name: 'Sarah Wilson',
      handle: 'sarahw',
      avatar: '/avatars/sarah.jpg',
      title: 'Frontend Developer'
    }
  },
  {
    id: 'referral-2',
    fromUserId: 'user-4',
    toUserId: 'user-5',
    context: 'Mike would be perfect for this freelance React project. He showed great attention to detail in our cohort sessions and has excellent communication skills.',
    status: 'accepted',
    createdAt: new Date('2024-02-08T14:30:00Z'),
    cohortId: 'cohort-1',
    cohortTitle: 'React & TypeScript Mastery',
    sessionCompletionPercentage: 87,
    isEligible: true,
    contextType: 'freelance',
    direction: 'send',
    projectTitle: 'E-commerce Dashboard',
    urgency: 'medium',
    fromUser: {
      id: 'user-4',
      name: 'Sarah Wilson',
      handle: 'sarahw',
      avatar: '/avatars/sarah.jpg',
      title: 'Frontend Developer'
    },
    toUser: {
      id: 'user-5',
      name: 'Mike Chen',
      handle: 'mikec',
      avatar: '/avatars/mike.jpg',
      title: 'Full Stack Developer'
    }
  },
  {
    id: 'referral-3',
    fromUserId: 'user-2',
    toUserId: 'user-7',
    context: 'Alex has shown remarkable analytical thinking in our Data Science cohort. I\'d love to collaborate with them on our upcoming machine learning project.',
    status: 'draft',
    createdAt: new Date('2024-02-12T09:15:00Z'),
    cohortId: 'cohort-2',
    cohortTitle: 'Data Science Fundamentals',
    sessionCompletionPercentage: 50,
    isEligible: false,
    contextType: 'collaboration',
    direction: 'send',
    projectTitle: 'ML Model Optimization',
    urgency: 'low',
    fromUser: {
      id: 'user-2',
      name: 'Dr. Emily Rodriguez',
      handle: 'emilyr',
      avatar: '/avatars/emily.jpg',
      title: 'Data Science Lead'
    },
    toUser: {
      id: 'user-7',
      name: 'Alex Thompson',
      handle: 'alext',
      avatar: '/avatars/alex.jpg',
      title: 'Data Analyst'
    }
  },
  {
    id: 'referral-4',
    fromUserId: 'user-3',
    toUserId: 'user-12',
    context: 'Lisa has incredible design intuition and would be an excellent mentor for junior designers. Her work in our UI/UX cohort was outstanding.',
    status: 'declined',
    createdAt: new Date('2024-02-05T16:45:00Z'),
    cohortId: 'cohort-3',
    cohortTitle: 'UI/UX Design Principles',
    sessionCompletionPercentage: 100,
    isEligible: true,
    contextType: 'mentorship',
    direction: 'send',
    urgency: 'medium',
    fromUser: {
      id: 'user-3',
      name: 'David Kim',
      handle: 'davidk',
      avatar: '/avatars/david.jpg',
      title: 'Senior UX Designer'
    },
    toUser: {
      id: 'user-12',
      name: 'Lisa Park',
      handle: 'lisap',
      avatar: '/avatars/lisa.jpg',
      title: 'UI Designer'
    }
  },
  {
    id: 'referral-5',
    fromUserId: 'user-5',
    toUserId: 'user-6',
    context: 'Tom\'s TypeScript skills have improved dramatically throughout our cohort. He\'d be a great fit for the TypeScript Developer role at StartupXYZ.',
    status: 'sent',
    createdAt: new Date('2024-02-11T11:20:00Z'),
    cohortId: 'cohort-1',
    cohortTitle: 'React & TypeScript Mastery',
    sessionCompletionPercentage: 87,
    isEligible: true,
    contextType: 'job',
    direction: 'send',
    companyName: 'StartupXYZ',
    urgency: 'high',
    fromUser: {
      id: 'user-5',
      name: 'Mike Chen',
      handle: 'mikec',
      avatar: '/avatars/mike.jpg',
      title: 'Full Stack Developer'
    },
    toUser: {
      id: 'user-6',
      name: 'Tom Anderson',
      handle: 'toma',
      avatar: '/avatars/tom.jpg',
      title: 'Software Developer'
    }
  },
  // Referral Requests (user asking for referrals)
  {
    id: 'referral-6',
    fromUserId: 'user-4',
    toUserId: 'user-1',
    context: 'Hi John! I know you work at TechCorp and I\'m looking for new opportunities. Would you be able to refer me for any open positions? I\'ve really enjoyed working with you in our React cohort and would love to continue learning in a professional setting.',
    status: 'sent',
    createdAt: new Date('2024-02-13T14:30:00Z'),
    cohortId: 'cohort-1',
    cohortTitle: 'React & TypeScript Mastery',
    sessionCompletionPercentage: 87,
    isEligible: true,
    contextType: 'job',
    direction: 'request',
    requestType: 'company_specific',
    companyName: 'TechCorp Inc.',
    urgency: 'medium',
    fromUser: {
      id: 'user-4',
      name: 'Sarah Wilson',
      handle: 'sarahw',
      avatar: '/avatars/sarah.jpg',
      title: 'Frontend Developer'
    },
    toUser: {
      id: 'user-1',
      name: 'John Doe',
      handle: 'johndoe',
      avatar: '/avatars/john.jpg',
      title: 'Senior Software Engineer'
    }
  },
  {
    id: 'referral-7',
    fromUserId: 'user-6',
    toUserId: 'user-5',
    context: 'Hey Mike! I\'m exploring freelance opportunities and would love to work on some React projects. Since you\'ve seen my work in our cohort, would you be able to refer me for any freelance gigs you know about?',
    status: 'accepted',
    createdAt: new Date('2024-02-09T16:45:00Z'),
    cohortId: 'cohort-1',
    cohortTitle: 'React & TypeScript Mastery',
    sessionCompletionPercentage: 87,
    isEligible: true,
    contextType: 'freelance',
    direction: 'request',
    requestType: 'general',
    urgency: 'low',
    fromUser: {
      id: 'user-6',
      name: 'Tom Anderson',
      handle: 'toma',
      avatar: '/avatars/tom.jpg',
      title: 'Software Developer'
    },
    toUser: {
      id: 'user-5',
      name: 'Mike Chen',
      handle: 'mikec',
      avatar: '/avatars/mike.jpg',
      title: 'Full Stack Developer'
    }
  },
  {
    id: 'referral-8',
    fromUserId: 'user-7',
    toUserId: 'user-2',
    context: 'Dr. Rodriguez, I\'m really interested in data science opportunities and would love to work on machine learning projects. Would you be able to refer me for any positions or collaborations in your network?',
    status: 'sent',
    createdAt: new Date('2024-02-14T10:15:00Z'),
    cohortId: 'cohort-2',
    cohortTitle: 'Data Science Fundamentals',
    sessionCompletionPercentage: 50,
    isEligible: false,
    contextType: 'collaboration',
    direction: 'request',
    requestType: 'general',
    urgency: 'medium',
    fromUser: {
      id: 'user-7',
      name: 'Alex Thompson',
      handle: 'alext',
      avatar: '/avatars/alex.jpg',
      title: 'Data Analyst'
    },
    toUser: {
      id: 'user-2',
      name: 'Dr. Emily Rodriguez',
      handle: 'emilyr',
      avatar: '/avatars/emily.jpg',
      title: 'Data Science Lead'
    }
  }
];

/**
 * Get all referrals for a specific user
 * @param userId - The user ID to get referrals for
 * @returns Array of referrals where user is sender or receiver
 */
export function getUserReferrals(userId: string): ReferralWithType[] {
  return mockReferrals.filter(
    referral => referral.fromUserId === userId || referral.toUserId === userId
  );
}

/**
 * Get referrals sent by a specific user
 * @param userId - The user ID to get sent referrals for
 * @returns Array of referrals sent by the user
 */
export function getSentReferrals(userId: string): ReferralWithType[] {
  return mockReferrals.filter(referral => referral.fromUserId === userId);
}

/**
 * Get referrals received by a specific user
 * @param userId - The user ID to get received referrals for
 * @returns Array of referrals received by the user
 */
export function getReceivedReferrals(userId: string): ReferralWithType[] {
  return mockReferrals.filter(referral => referral.toUserId === userId);
}

/**
 * Get referrals for a specific cohort
 * @param cohortId - The cohort ID to get referrals for
 * @returns Array of referrals within the cohort
 */
export function getCohortReferrals(cohortId: string): ReferralWithType[] {
  return mockReferrals.filter(referral => referral.cohortId === cohortId);
}

/**
 * Get referrals by status
 * @param status - The referral status to filter by
 * @returns Array of referrals with the specified status
 */
export function getReferralsByStatus(status: ReferralStatus): ReferralWithType[] {
  return mockReferrals.filter(referral => referral.status === status);
}

/**
 * Get referral statistics for a user
 * @param userId - The user ID to get statistics for
 * @returns Object with referral statistics
 */
export function getReferralStats(userId: string) {
  const sentReferrals = getSentReferrals(userId);
  const receivedReferrals = getReceivedReferrals(userId);
  
  return {
    sent: {
      total: sentReferrals.length,
      draft: sentReferrals.filter(r => r.status === 'draft').length,
      sent: sentReferrals.filter(r => r.status === 'sent').length,
      accepted: sentReferrals.filter(r => r.status === 'accepted').length,
      declined: sentReferrals.filter(r => r.status === 'declined').length,
    },
    received: {
      total: receivedReferrals.length,
      pending: receivedReferrals.filter(r => r.status === 'sent').length,
      accepted: receivedReferrals.filter(r => r.status === 'accepted').length,
      declined: receivedReferrals.filter(r => r.status === 'declined').length,
    }
  };
}

/**
 * Get cohort referral statistics
 * @param cohortId - The cohort ID to get statistics for
 * @returns Object with cohort referral statistics
 */
export function getCohortReferralStats(cohortId: string) {
  const cohortReferrals = getCohortReferrals(cohortId);
  const completionPercentage = calculateSessionCompletionPercentage(cohortId);
  
  return {
    totalReferrals: cohortReferrals.length,
    sessionCompletionPercentage: completionPercentage,
    isEligible: completionPercentage >= 75,
    byStatus: {
      draft: cohortReferrals.filter(r => r.status === 'draft').length,
      sent: cohortReferrals.filter(r => r.status === 'sent').length,
      accepted: cohortReferrals.filter(r => r.status === 'accepted').length,
      declined: cohortReferrals.filter(r => r.status === 'declined').length,
    },
    byType: {
      job: cohortReferrals.filter(r => r.contextType === 'job').length,
      project: cohortReferrals.filter(r => r.contextType === 'project').length,
      collaboration: cohortReferrals.filter(r => r.contextType === 'collaboration').length,
      mentorship: cohortReferrals.filter(r => r.contextType === 'mentorship').length,
      freelance: cohortReferrals.filter(r => r.contextType === 'freelance').length,
    }
  };
}

/**
 * Create a new referral
 * @param referralData - The referral data to create
 * @returns The created referral
 */
export function createReferral(referralData: Omit<ReferralWithType, 'id' | 'createdAt'>): ReferralWithType {
  const newReferral: ReferralWithType = {
    ...referralData,
    id: `referral-${Date.now()}`,
    createdAt: new Date(),
  };
  
  mockReferrals.push(newReferral);
  return newReferral;
}

/**
 * Update a referral status
 * @param referralId - The referral ID to update
 * @param status - The new status
 * @returns The updated referral or null if not found
 */
export function updateReferralStatus(referralId: string, status: ReferralStatus): ReferralWithType | null {
  const referral = mockReferrals.find(r => r.id === referralId);
  if (referral) {
    referral.status = status;
    return referral;
  }
  return null;
}

/**
 * Delete a referral
 * @param referralId - The referral ID to delete
 * @returns True if deleted, false if not found
 */
export function deleteReferral(referralId: string): boolean {
  const index = mockReferrals.findIndex(r => r.id === referralId);
  if (index !== -1) {
    mockReferrals.splice(index, 1);
    return true;
  }
  return false;
}
