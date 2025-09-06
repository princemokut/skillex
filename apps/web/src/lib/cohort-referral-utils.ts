/**
 * Utility functions for cohort-based referral management
 * Handles session completion validation and referral eligibility
 */

import { mockCohorts, mockCohortMembers, mockSessions } from './cohort-mock-data';
import { ReferralContextType } from './referral-mock-data';

// Referral eligibility threshold (75%)
export const REFERRAL_ELIGIBILITY_THRESHOLD = 75;

/**
 * Mock users data for cohort members
 * Simple user data for development and testing
 */
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
  return completionPercentage >= REFERRAL_ELIGIBILITY_THRESHOLD;
}

/**
 * Get cohort members who are eligible for referrals
 * @param cohortId - The cohort ID to get eligible members for
 * @param currentUserId - The current user ID to exclude from results
 * @returns Array of eligible cohort members
 */
export function getEligibleCohortMembersForReferrals(cohortId: string, currentUserId: string) {
  const members = mockCohortMembers.filter(member => 
    member.cohortId === cohortId && member.userId !== currentUserId
  );
  const completionPercentage = calculateSessionCompletionPercentage(cohortId);
  
  return members.map(member => ({
    ...member,
    sessionCompletionPercentage: completionPercentage,
    isEligible: completionPercentage >= REFERRAL_ELIGIBILITY_THRESHOLD,
    user: mockUsers.find((user: any) => user.id === member.userId)
  }));
}

/**
 * Generate referral context based on cohort work
 * @param cohortId - The cohort ID to generate context for
 * @param contextType - The type of referral context
 * @returns Generated context string
 */
export function generateReferralContext(
  cohortId: string, 
  contextType: ReferralContextType
): string {
  const cohort = mockCohorts.find(c => c.id === cohortId);
  if (!cohort) return '';

  const completionPercentage = calculateSessionCompletionPercentage(cohortId);
  const cohortTitle = cohort.title;

  const contextTemplates = {
    job: `Based on our work together in the ${cohortTitle} cohort (${completionPercentage}% sessions completed), I can confidently recommend this person for the position. They demonstrated strong technical skills and excellent collaboration throughout our sessions.`,
    project: `Having worked closely with this person in our ${cohortTitle} cohort, I believe they would be an excellent fit for this project. Their problem-solving approach and attention to detail were consistently impressive.`,
    collaboration: `Our collaboration in the ${cohortTitle} cohort has shown me that this person brings valuable skills and a great work ethic. I'd love to work with them again on this opportunity.`,
    mentorship: `Through our ${cohortTitle} cohort sessions, I've seen this person's potential and dedication to learning. They would benefit greatly from mentorship and have the drive to succeed.`,
    freelance: `Based on their performance in our ${cohortTitle} cohort, this person has the skills and reliability needed for freelance work. They consistently delivered quality work and met deadlines.`
  };

  return contextTemplates[contextType] || contextTemplates.job;
}

/**
 * Validate referral creation request
 * @param fromUserId - The user ID sending the referral
 * @param toUserId - The user ID receiving the referral
 * @param cohortId - The cohort ID for the referral
 * @returns Validation result with success status and error message
 */
export function validateReferralCreation(
  fromUserId: string, 
  toUserId: string, 
  cohortId: string
): { isValid: boolean; error?: string } {
  // Check if both users are in the same cohort
  const fromUserInCohort = mockCohortMembers.some(
    member => member.cohortId === cohortId && member.userId === fromUserId
  );
  const toUserInCohort = mockCohortMembers.some(
    member => member.cohortId === cohortId && member.userId === toUserId
  );

  if (!fromUserInCohort) {
    return { isValid: false, error: 'You must be a member of this cohort to send referrals' };
  }

  if (!toUserInCohort) {
    return { isValid: false, error: 'The recipient must be a member of this cohort' };
  }

  if (fromUserId === toUserId) {
    return { isValid: false, error: 'You cannot refer yourself' };
  }

  // Check if cohort is eligible for referrals (75% completion)
  const completionPercentage = calculateSessionCompletionPercentage(cohortId);
  if (completionPercentage < REFERRAL_ELIGIBILITY_THRESHOLD) {
    return { 
      isValid: false, 
      error: `Referrals are only available after ${REFERRAL_ELIGIBILITY_THRESHOLD}% of cohort sessions are completed (currently ${completionPercentage}%)` 
    };
  }

  return { isValid: true };
}

/**
 * Get referral context suggestions based on cohort work
 * @param cohortId - The cohort ID to get suggestions for
 * @returns Array of context suggestions
 */
export function getReferralContextSuggestions(cohortId: string): string[] {
  const cohort = mockCohorts.find(c => c.id === cohortId);
  if (!cohort) return [];

  const completionPercentage = calculateSessionCompletionPercentage(cohortId);
  const cohortTitle = cohort.title;

  return [
    `Strong technical skills demonstrated in ${cohortTitle} cohort sessions`,
    `Excellent problem-solving approach during our ${cohortTitle} collaboration`,
    `Consistent quality work and attention to detail in ${cohortTitle}`,
    `Great communication and teamwork in our ${cohortTitle} cohort`,
    `Proactive learning and initiative shown throughout ${cohortTitle}`,
    `Reliable and punctual participation in ${cohortTitle} sessions`,
    `Creative solutions and innovative thinking in ${cohortTitle} projects`,
    `Mentoring other cohort members during ${cohortTitle} sessions`
  ];
}

/**
 * Get cohort referral statistics
 * @param cohortId - The cohort ID to get statistics for
 * @returns Object with cohort referral statistics
 */
export function getCohortReferralEligibilityStats(cohortId: string) {
  const cohort = mockCohorts.find(c => c.id === cohortId);
  if (!cohort) return null;

  const completionPercentage = calculateSessionCompletionPercentage(cohortId);
  const totalMembers = mockCohortMembers.filter(member => member.cohortId === cohortId).length;
  const eligibleMembers = getEligibleCohortMembersForReferrals(cohortId, '').length;

  return {
    cohortId,
    cohortTitle: cohort.title,
    sessionCompletionPercentage: completionPercentage,
    isEligible: completionPercentage >= REFERRAL_ELIGIBILITY_THRESHOLD,
    totalMembers,
    eligibleMembers,
    sessionsCompleted: Math.floor((completionPercentage / 100) * cohort.weeks),
    totalSessions: cohort.weeks,
    threshold: REFERRAL_ELIGIBILITY_THRESHOLD
  };
}

/**
 * Get user's referral eligibility across all cohorts
 * @param userId - The user ID to check eligibility for
 * @returns Array of cohort eligibility information
 */
export function getUserReferralEligibility(userId: string) {
  const userCohorts = mockCohortMembers
    .filter(member => member.userId === userId)
    .map(member => member.cohortId);

  return userCohorts.map(cohortId => {
    const cohort = mockCohorts.find(c => c.id === cohortId);
    const completionPercentage = calculateSessionCompletionPercentage(cohortId);
    
    return {
      cohortId,
      cohortTitle: cohort?.title || 'Unknown Cohort',
      sessionCompletionPercentage: completionPercentage,
      isEligible: completionPercentage >= REFERRAL_ELIGIBILITY_THRESHOLD,
      canSendReferrals: isUserEligibleForReferrals(userId, cohortId),
      sessionsCompleted: Math.floor((completionPercentage / 100) * (cohort?.weeks || 0)),
      totalSessions: cohort?.weeks || 0
    };
  });
}
