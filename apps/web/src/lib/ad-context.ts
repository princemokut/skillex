/**
 * Ad Context System
 * Provides contextual ad targeting based on user data, location, and behavior
 * 
 * This system enables:
 * - Skill-based ad targeting
 * - Location-based ad targeting
 * - Cohort topic targeting
 * - Referral context targeting
 * - Frequency capping and personalization
 */

import { AdContext } from '@/components/AdSlot';

/**
 * User context for ad targeting
 */
export interface UserAdContext {
  /** User's skills for targeting */
  skills: string[];
  /** User's location for local targeting */
  location: string;
  /** User's timezone for time-based targeting */
  timezone: string;
  /** User's cohort topics */
  cohortTopics: string[];
  /** User's referral activity */
  referralActivity: 'active' | 'moderate' | 'low';
  /** User's connection activity */
  connectionActivity: 'active' | 'moderate' | 'low';
  /** User's preferred ad categories */
  adCategories: string[];
  /** Ad frequency preference */
  adFrequency: 'low' | 'medium' | 'high';
  /** Last ad shown timestamp */
  lastAdShown?: Date;
  /** Ad interaction history */
  adInteractions: AdInteraction[];
}

/**
 * Ad interaction tracking
 */
export interface AdInteraction {
  /** Ad slot ID */
  slotId: string;
  /** Interaction type */
  type: 'view' | 'click' | 'close';
  /** Timestamp */
  timestamp: Date;
  /** Ad context */
  context: AdContext;
  /** Targeting parameters used */
  targeting: Record<string, string | string[]>;
}

/**
 * Ad targeting parameters
 */
export interface AdTargeting {
  /** Skill-based targeting */
  skills?: string[];
  /** Location-based targeting */
  location?: string;
  /** Cohort topic targeting */
  cohortTopics?: string[];
  /** Referral context targeting */
  referralContext?: 'job' | 'project' | 'collaboration' | 'mentorship' | 'freelance';
  /** User activity level */
  activityLevel?: 'active' | 'moderate' | 'low';
  /** Ad frequency preference */
  adFrequency?: 'low' | 'medium' | 'high';
  /** Time-based targeting */
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  /** Device type */
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  /** Ad categories for targeting */
  adCategories?: string[];
}

/**
 * Ad category mappings
 */
export const AD_CATEGORIES = {
  // Job-related ads
  jobs: ['Software Engineer', 'Product Manager', 'Designer', 'Data Scientist'],
  // Learning resources
  learning: ['Courses', 'Bootcamps', 'Certifications', 'Tutorials'],
  // Professional services
  services: ['Resume Writing', 'Portfolio Design', 'Career Coaching', 'Networking'],
  // Tools and software
  tools: ['Development Tools', 'Design Software', 'Project Management', 'Analytics'],
  // Events and meetups
  events: ['Tech Meetups', 'Conferences', 'Workshops', 'Networking Events'],
  // News and content
  content: ['Tech News', 'Industry Reports', 'Blogs', 'Podcasts']
} as const;

/**
 * Skill to ad category mapping
 */
export const SKILL_CATEGORY_MAPPING = {
  // Frontend skills
  'React': ['jobs', 'learning', 'tools'],
  'TypeScript': ['jobs', 'learning', 'tools'],
  'JavaScript': ['jobs', 'learning', 'tools'],
  'Vue.js': ['jobs', 'learning', 'tools'],
  'Angular': ['jobs', 'learning', 'tools'],
  'HTML': ['jobs', 'learning'],
  'CSS': ['jobs', 'learning'],
  'Tailwind': ['jobs', 'learning', 'tools'],
  'Sass': ['jobs', 'learning', 'tools'],
  
  // Backend skills
  'Node.js': ['jobs', 'learning', 'tools'],
  'Python': ['jobs', 'learning', 'tools'],
  'Java': ['jobs', 'learning', 'tools'],
  'Go': ['jobs', 'learning', 'tools'],
  'PHP': ['jobs', 'learning', 'tools'],
  'Ruby': ['jobs', 'learning', 'tools'],
  'C#': ['jobs', 'learning', 'tools'],
  
  // Database skills
  'PostgreSQL': ['jobs', 'learning', 'tools'],
  'MongoDB': ['jobs', 'learning', 'tools'],
  'MySQL': ['jobs', 'learning', 'tools'],
  'Redis': ['jobs', 'learning', 'tools'],
  
  // Cloud and DevOps
  'AWS': ['jobs', 'learning', 'tools'],
  'Docker': ['jobs', 'learning', 'tools'],
  'Kubernetes': ['jobs', 'learning', 'tools'],
  'Terraform': ['jobs', 'learning', 'tools'],
  'Azure': ['jobs', 'learning', 'tools'],
  'GCP': ['jobs', 'learning', 'tools'],
  
  // Design skills
  'Figma': ['jobs', 'learning', 'tools'],
  'Sketch': ['jobs', 'learning', 'tools'],
  'Adobe XD': ['jobs', 'learning', 'tools'],
  'Photoshop': ['jobs', 'learning', 'tools'],
  'Illustrator': ['jobs', 'learning', 'tools'],
  
  // Data and AI
  'Machine Learning': ['jobs', 'learning', 'tools'],
  'Data Science': ['jobs', 'learning', 'tools'],
  'R': ['jobs', 'learning', 'tools'],
  'TensorFlow': ['jobs', 'learning', 'tools'],
  'PyTorch': ['jobs', 'learning', 'tools'],
  
  // Mobile development
  'React Native': ['jobs', 'learning', 'tools'],
  'Flutter': ['jobs', 'learning', 'tools'],
  'Swift': ['jobs', 'learning', 'tools'],
  'Kotlin': ['jobs', 'learning', 'tools'],
  'iOS': ['jobs', 'learning'],
  'Android': ['jobs', 'learning']
} as const;

/**
 * Location-based ad targeting
 */
export const LOCATION_TARGETING = {
  // Major tech hubs
  'San Francisco': ['jobs', 'events', 'services'],
  'New York': ['jobs', 'events', 'services'],
  'Seattle': ['jobs', 'events', 'services'],
  'Austin': ['jobs', 'events', 'services'],
  'Boston': ['jobs', 'events', 'services'],
  'Los Angeles': ['jobs', 'events', 'services'],
  'Chicago': ['jobs', 'events', 'services'],
  'Denver': ['jobs', 'events', 'services'],
  'Portland': ['jobs', 'events', 'services'],
  'Miami': ['jobs', 'events', 'services'],
  
  // International tech hubs
  'London': ['jobs', 'events', 'services'],
  'Berlin': ['jobs', 'events', 'services'],
  'Amsterdam': ['jobs', 'events', 'services'],
  'Toronto': ['jobs', 'events', 'services'],
  'Vancouver': ['jobs', 'events', 'services'],
  'Sydney': ['jobs', 'events', 'services'],
  'Melbourne': ['jobs', 'events', 'services'],
  'Singapore': ['jobs', 'events', 'services'],
  'Tokyo': ['jobs', 'events', 'services'],
  'Dublin': ['jobs', 'events', 'services']
} as const;

/**
 * Get ad targeting parameters based on user context
 * 
 * @param userContext - User's ad context
 * @param pageContext - Current page context
 * @returns Targeting parameters for ads
 */
export function getAdTargeting(
  userContext: UserAdContext,
  pageContext: AdContext
): AdTargeting {
  const targeting: AdTargeting = {
    skills: userContext.skills,
    location: userContext.location,
    cohortTopics: userContext.cohortTopics,
    activityLevel: userContext.connectionActivity,
    adFrequency: userContext.adFrequency,
    deviceType: getDeviceType(),
    timeOfDay: getTimeOfDay()
  };

  // Add page-specific targeting
  switch (pageContext) {
    case 'matches':
      targeting.skills = userContext.skills.slice(0, 3); // Top 3 skills
      break;
    case 'connections':
      targeting.adCategories = ['services', 'events'];
      break;
    case 'referrals':
      targeting.adCategories = ['jobs', 'services'];
      targeting.referralContext = 'job';
      break;
    case 'cohorts':
      targeting.adCategories = ['learning', 'events'];
      break;
    case 'profile':
      targeting.adCategories = ['services', 'tools'];
      break;
  }

  return targeting;
}

/**
 * Get relevant ad categories based on user skills
 * 
 * @param skills - User's skills
 * @returns Array of relevant ad categories
 */
export function getRelevantAdCategories(skills: string[]): string[] {
  const categories = new Set<string>();
  
  skills.forEach(skill => {
    const skillCategories = SKILL_CATEGORY_MAPPING[skill as keyof typeof SKILL_CATEGORY_MAPPING];
    if (skillCategories) {
      skillCategories.forEach(category => categories.add(category));
    }
  });
  
  return Array.from(categories);
}

/**
 * Get location-based ad categories
 * 
 * @param location - User's location
 * @returns Array of relevant ad categories for location
 */
export function getLocationAdCategories(location: string): string[] {
  return [...(LOCATION_TARGETING[location as keyof typeof LOCATION_TARGETING] || ['jobs', 'events', 'services'])];
}

/**
 * Check if ad should be shown based on frequency capping
 * 
 * @param userContext - User's ad context
 * @param slotId - Ad slot ID
 * @param minInterval - Minimum interval between ads in minutes
 * @returns Whether ad should be shown
 */
export function shouldShowAd(
  userContext: UserAdContext,
  slotId: string,
  minInterval: number = 5
): boolean {
  if (!userContext.lastAdShown) return true;
  
  const now = new Date();
  const timeSinceLastAd = now.getTime() - userContext.lastAdShown.getTime();
  const minIntervalMs = minInterval * 60 * 1000;
  
  return timeSinceLastAd >= minIntervalMs;
}

/**
 * Get device type for targeting
 * 
 * @returns Device type
 */
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Get time of day for targeting
 * 
 * @returns Time of day
 */
function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

/**
 * Generate ad targeting query string
 * 
 * @param targeting - Targeting parameters
 * @returns Query string for ad requests
 */
export function generateAdQueryString(targeting: AdTargeting): string {
  const params = new URLSearchParams();
  
  Object.entries(targeting).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        params.append(key, value.join(','));
      } else {
        params.append(key, value.toString());
      }
    }
  });
  
  return params.toString();
}

/**
 * Track ad interaction
 * 
 * @param userContext - User's ad context
 * @param interaction - Ad interaction to track
 */
export function trackAdInteraction(
  userContext: UserAdContext,
  interaction: Omit<AdInteraction, 'timestamp'>
): void {
  const newInteraction: AdInteraction = {
    ...interaction,
    timestamp: new Date()
  };
  
  userContext.adInteractions.push(newInteraction);
  
  // Keep only last 100 interactions
  if (userContext.adInteractions.length > 100) {
    userContext.adInteractions = userContext.adInteractions.slice(-100);
  }
}

/**
 * Get ad personalization score
 * 
 * @param userContext - User's ad context
 * @param targeting - Ad targeting parameters
 * @returns Personalization score (0-1)
 */
export function getAdPersonalizationScore(
  userContext: UserAdContext,
  targeting: AdTargeting
): number {
  let score = 0;
  let factors = 0;
  
  // Skill matching
  if (targeting.skills && userContext.skills.length > 0) {
    const skillMatches = targeting.skills.filter(skill => 
      userContext.skills.includes(skill)
    ).length;
    score += (skillMatches / targeting.skills.length) * 0.4;
    factors += 0.4;
  }
  
  // Location matching
  if (targeting.location && userContext.location) {
    if (targeting.location === userContext.location) {
      score += 0.3;
    }
    factors += 0.3;
  }
  
  // Activity level matching
  if (targeting.activityLevel && userContext.connectionActivity) {
    if (targeting.activityLevel === userContext.connectionActivity) {
      score += 0.2;
    }
    factors += 0.2;
  }
  
  // Ad frequency preference
  if (targeting.adFrequency && userContext.adFrequency) {
    if (targeting.adFrequency === userContext.adFrequency) {
      score += 0.1;
    }
    factors += 0.1;
  }
  
  return factors > 0 ? score / factors : 0;
}
