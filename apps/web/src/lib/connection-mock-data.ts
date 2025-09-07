/**
 * Mock connection data service for development and testing
 * Provides realistic sample data for user connections and profiles
 * 
 * This module generates diverse user profiles with different connection statuses
 * to simulate a real social network environment for testing and development.
 */

import { mockSkills, mockLocations, mockTitles, mockBios } from './mock-data';

/**
 * Connection status enumeration
 * Represents the different states a connection can be in
 */
export type ConnectionStatus = 'pending' | 'accepted' | 'blocked';

/**
 * Skill level enumeration
 * Represents proficiency levels for user skills
 */
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/**
 * Skill interface for user profiles
 * Represents a skill that a user can teach or learn
 */
export interface UserSkill {
  name: string;
  level: SkillLevel;
  kind: 'teach' | 'learn';
}

/**
 * User profile interface for connection data
 * Represents a user's public profile information
 */
export interface UserProfile {
  id: string;
  handle: string;
  fullName: string;
  bio: string;
  avatarUrl?: string;
  timezone: string;
  languages: string[];
  locationCity?: string;
  locationCountry?: string;
  title: string;
  skills: UserSkill[];
  availabilitySummary: string;
  lastActive: string;
  createdAt: string;
}

/**
 * Connection interface
 * Represents a connection between two users
 */
export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: ConnectionStatus;
  createdAt: string;
  requester: UserProfile;
  addressee: UserProfile;
}

/**
 * Connections data structure
 * Groups connections by their status for easy tab-based display
 */
export interface ConnectionsData {
  sent: Connection[];
  received: Connection[];
  accepted: Connection[];
}

/**
 * Generate a random skill level
 * Creates a weighted distribution favoring intermediate and advanced levels
 * 
 * @returns A random skill level with realistic distribution
 */
function generateSkillLevel(): SkillLevel {
  const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
  const weights = [0.15, 0.35, 0.35, 0.15]; // Weighted towards intermediate/advanced
  
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < levels.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return levels[i];
    }
  }
  
  return 'intermediate'; // Fallback
}

/**
 * Generate a random timezone
 * Creates realistic timezone distribution for global user base
 * 
 * @returns A random timezone string
 */
function generateTimezone(): string {
  const timezones = [
    'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Denver',
    'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Europe/Amsterdam',
    'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Kolkata',
    'Australia/Sydney', 'Australia/Melbourne', 'America/Toronto', 'America/Vancouver'
  ];
  
  return timezones[Math.floor(Math.random() * timezones.length)];
}

/**
 * Generate a random language array
 * Creates realistic language combinations for users
 * 
 * @returns Array of language strings
 */
function generateLanguages(): string[] {
  const allLanguages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian'];
  const languages = ['English']; // English is always included
  
  // Add 0-2 additional languages
  const additionalCount = Math.floor(Math.random() * 3);
  const availableLanguages = allLanguages.filter(lang => lang !== 'English');
  
  for (let i = 0; i < additionalCount; i++) {
    const randomLang = availableLanguages[Math.floor(Math.random() * availableLanguages.length)];
    if (!languages.includes(randomLang)) {
      languages.push(randomLang);
    }
  }
  
  return languages;
}

/**
 * Generate skills for a user profile
 * Creates a realistic mix of skills to teach and learn
 * 
 * @param userId - User ID for deterministic generation
 * @returns Array of user skills
 */
function generateUserSkills(userId: string): UserSkill[] {
  const skills: UserSkill[] = [];
  
  // Generate 2-4 skills to teach
  const teachCount = 2 + (userId.charCodeAt(0) % 3);
  const teachSkills = new Set<string>();
  
  while (teachSkills.size < teachCount) {
    const skill = mockSkills[Math.floor(Math.random() * mockSkills.length)];
    teachSkills.add(skill);
  }
  
  teachSkills.forEach(skill => {
    skills.push({
      name: skill,
      level: generateSkillLevel(),
      kind: 'teach'
    });
  });
  
  // Generate 1-3 skills to learn
  const learnCount = 1 + (userId.charCodeAt(1) % 3);
  const learnSkills = new Set<string>();
  
  while (learnSkills.size < learnCount) {
    const skill = mockSkills[Math.floor(Math.random() * mockSkills.length)];
    if (!teachSkills.has(skill)) { // Avoid overlap with teach skills
      learnSkills.add(skill);
    }
  }
  
  learnSkills.forEach(skill => {
    skills.push({
      name: skill,
      level: generateSkillLevel(),
      kind: 'learn'
    });
  });
  
  return skills;
}

/**
 * Generate a single user profile
 * Creates a realistic user profile with all necessary fields
 * 
 * @param index - Index for deterministic generation
 * @returns A complete user profile
 */
function generateUserProfile(index: number): UserProfile {
  const firstName = ['Sarah', 'Marcus', 'Elena', 'David', 'Lisa', 'Alex', 'Maria', 'James', 'Priya', 'Tom', 'Rachel', 'Michael', 'Sofia', 'Daniel', 'Emma', 'Ryan', 'Olivia', 'Lucas', 'Isabella', 'Noah'][index % 20];
  const lastName = ['Chen', 'Johnson', 'Rodriguez', 'Kim', 'Wang', 'Thompson', 'Garcia', 'Wilson', 'Patel', 'Anderson', 'Brown', 'Davis', 'Miller', 'Martinez', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez'][index % 20];
  const fullName = `${firstName} ${lastName}`;
  const handle = `${firstName.toLowerCase()}${lastName.toLowerCase().charAt(0)}${index + 1}`;
  const userId = `user_${index + 1}`;
  
  return {
    id: userId,
    handle,
    fullName,
    bio: mockBios[index % mockBios.length],
    avatarUrl: undefined, // Will be generated by avatar component
    timezone: generateTimezone(),
    languages: generateLanguages(),
    locationCity: mockLocations[index % mockLocations.length],
    locationCountry: mockLocations[index % mockLocations.length].split(', ')[1] || 'US',
    title: mockTitles[index % mockTitles.length],
    skills: generateUserSkills(userId),
    availabilitySummary: 'Weekdays 6-8 PM, Weekends 10 AM-2 PM',
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
  };
}

/**
 * Generate mock connections data
 * Creates realistic connection scenarios with different statuses
 * 
 * @returns Complete connections data with sent, received, and accepted connections
 */
export function generateMockConnections(): ConnectionsData {
  // Generate 15 user profiles
  const users = Array.from({ length: 15 }, (_, index) => generateUserProfile(index));
  
  // Current user (index 0) - the one viewing connections
  const currentUser = users[0];
  
  // Generate sent connections (3-4 users)
  const sentConnections: Connection[] = users.slice(1, 5).map((user, index) => ({
    id: `sent_${index + 1}`,
    requesterId: currentUser.id,
    addresseeId: user.id,
    status: 'pending' as ConnectionStatus,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    requester: currentUser,
    addressee: user
  }));
  
  // Generate received connections (2-3 users)
  const receivedConnections: Connection[] = users.slice(5, 8).map((user, index) => ({
    id: `received_${index + 1}`,
    requesterId: user.id,
    addresseeId: currentUser.id,
    status: 'pending' as ConnectionStatus,
    createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
    requester: user,
    addressee: currentUser
  }));
  
  // Generate accepted connections (5-6 users)
  const acceptedConnections: Connection[] = users.slice(8, 14).map((user, index) => ({
    id: `accepted_${index + 1}`,
    requesterId: Math.random() > 0.5 ? currentUser.id : user.id,
    addresseeId: Math.random() > 0.5 ? user.id : currentUser.id,
    status: 'accepted' as ConnectionStatus,
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    requester: Math.random() > 0.5 ? currentUser : user,
    addressee: Math.random() > 0.5 ? user : currentUser
  }));
  
  return {
    sent: sentConnections,
    received: receivedConnections,
    accepted: acceptedConnections
  };
}

/**
 * Get mock connections data
 * Main function to retrieve connection data with fallback
 * 
 * @returns Promise resolving to connections data
 */
export async function getMockConnections(): Promise<ConnectionsData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return generateMockConnections();
}

/**
 * Get mock user profile by handle
 * Retrieves a specific user profile for public profile pages
 * 
 * @param handle - User handle to look up
 * @returns Promise resolving to user profile or null if not found
 */
export async function getMockUserProfile(handle: string): Promise<UserProfile | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Generate users and find by handle
  const users = Array.from({ length: 15 }, (_, index) => generateUserProfile(index));
  const user = users.find(u => u.handle === handle);
  
  return user || null;
}

/**
 * Get mock current user profile
 * Retrieves the current user's profile for settings and editing
 * 
 * @returns Promise resolving to current user profile
 */
export async function getMockCurrentUser(): Promise<UserProfile> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return generateUserProfile(0); // Current user is always index 0
}
