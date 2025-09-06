/**
 * Analytics System
 * Privacy-focused analytics tracking with Plausible integration
 * 
 * This system provides:
 * - Event tracking for key user actions
 * - Page view tracking with context
 * - Custom event definitions
 * - User journey tracking
 * - GDPR-compliant analytics
 */

/**
 * Analytics event types
 */
export type AnalyticsEvent = 
  // Onboarding events
  | 'onboarding_started'
  | 'onboarding_step_completed'
  | 'onboarding_completed'
  | 'onboarding_abandoned'
  
  // Match events
  | 'match_viewed'
  | 'match_connected'
  | 'match_messaged'
  | 'match_filtered'
  | 'match_searched'
  
  // Connection events
  | 'connection_sent'
  | 'connection_accepted'
  | 'connection_declined'
  | 'connection_removed'
  | 'connection_blocked'
  
  // Cohort events
  | 'cohort_joined'
  | 'cohort_left'
  | 'cohort_session_attended'
  | 'cohort_chat_message'
  | 'cohort_artifact_uploaded'
  
  // Referral events
  | 'referral_sent'
  | 'referral_requested'
  | 'referral_accepted'
  | 'referral_declined'
  | 'referral_viewed'
  
  // Profile events
  | 'profile_viewed'
  | 'profile_edited'
  | 'profile_shared'
  | 'profile_skills_updated'
  | 'profile_availability_updated'
  
  // Search events
  | 'search_performed'
  | 'search_filtered'
  | 'search_result_clicked'
  
  // Ad events
  | 'ad_viewed'
  | 'ad_clicked'
  | 'ad_closed'
  | 'ad_blocked'
  
  // Navigation events
  | 'page_viewed'
  | 'tab_switched'
  | 'modal_opened'
  | 'modal_closed'
  
  // Error events
  | 'error_occurred'
  | 'api_error'
  | 'validation_error'
  
  // Funnel events
  | 'funnel_step';

/**
 * Event properties interface
 */
export interface EventProperties {
  /** Event category */
  category?: string;
  /** Event label */
  label?: string;
  /** Event value */
  value?: number;
  /** Custom properties */
  [key: string]: string | number | boolean | undefined | null;
}

/**
 * Page context for tracking
 */
export interface PageContext {
  /** Page name */
  page: string;
  /** Page section */
  section?: string;
  /** User ID (hashed) */
  userId?: string;
  /** Session ID */
  sessionId?: string;
  /** Referrer */
  referrer?: string;
  /** User agent */
  userAgent?: string;
  /** Screen resolution */
  screenResolution?: string;
  /** Viewport size */
  viewportSize?: string;
  /** Language */
  language?: string;
  /** Timezone */
  timezone?: string;
}

/**
 * Analytics configuration
 */
interface AnalyticsConfig {
  /** Plausible domain */
  domain: string;
  /** API endpoint */
  apiEndpoint: string;
  /** Whether analytics is enabled */
  enabled: boolean;
  /** Whether to track in development */
  trackInDevelopment: boolean;
  /** Whether to track locally */
  trackLocally: boolean;
}

/**
 * Default analytics configuration
 */
const defaultConfig: AnalyticsConfig = {
  domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'skillex.dev',
  apiEndpoint: 'https://plausible.io/api/event',
  enabled: process.env.NODE_ENV === 'production',
  trackInDevelopment: process.env.NEXT_PUBLIC_TRACK_ANALYTICS === 'true',
  trackLocally: process.env.NEXT_PUBLIC_TRACK_LOCALLY === 'true'
};

/**
 * Analytics class for tracking events
 */
class Analytics {
  private config: AnalyticsConfig;
  private sessionId: string;
  private userId: string | null = null;
  private eventQueue: Array<{ event: AnalyticsEvent; properties: EventProperties; timestamp: Date }> = [];
  private isOnline: boolean = true;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.sessionId = this.generateSessionId();
    this.setupOnlineListener();
  }

  /**
   * Initialize analytics
   * Sets up user tracking and page view tracking
   */
  init(): void {
    if (!this.isEnabled()) return;

    // Track initial page view
    this.trackPageView();
    
    // Set up page change tracking
    this.setupPageChangeTracking();
    
    // Set up error tracking
    this.setupErrorTracking();
  }

  /**
   * Set user ID for tracking
   * 
   * @param userId - User ID (will be hashed)
   */
  setUserId(userId: string): void {
    this.userId = this.hashUserId(userId);
  }

  /**
   * Track a custom event
   * 
   * @param event - Event name
   * @param properties - Event properties
   */
  track(event: AnalyticsEvent, properties: EventProperties = {}): void {
    if (!this.isEnabled()) return;

    const eventData = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userId: this.userId,
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : ''
      },
      timestamp: new Date()
    };

    this.eventQueue.push(eventData);
    this.flushEvents();
  }

  /**
   * Track page view
   * 
   * @param page - Page name
   * @param properties - Additional properties
   */
  trackPageView(page?: string, properties: EventProperties = {}): void {
    const pageName = page || this.getCurrentPage();
    
    this.track('page_viewed', {
      category: 'navigation',
      label: pageName,
      ...properties
    });
  }

  /**
   * Track user action
   * 
   * @param action - Action name
   * @param category - Action category
   * @param properties - Additional properties
   */
  trackAction(action: string, category: string, properties: EventProperties = {}): void {
    this.track(action as AnalyticsEvent, {
      category,
      ...properties
    });
  }

  /**
   * Track error
   * 
   * @param error - Error object
   * @param context - Error context
   */
  trackError(error: Error, context: string = 'unknown'): void {
    this.track('error_occurred', {
      category: 'error',
      label: error.name,
      value: 1,
      error_message: error.message,
      error_stack: error.stack,
      context
    });
  }

  /**
   * Track ad interaction
   * 
   * @param slotId - Ad slot ID
   * @param action - Action type
   * @param properties - Additional properties
   */
  trackAdInteraction(slotId: string, action: 'viewed' | 'clicked' | 'closed', properties: EventProperties = {}): void {
    this.track(`ad_${action}` as AnalyticsEvent, {
      category: 'advertising',
      label: slotId,
      ad_slot: slotId,
      ...properties
    });
  }

  /**
   * Track search query
   * 
   * @param query - Search query
   * @param results - Number of results
   * @param filters - Applied filters
   */
  trackSearch(query: string, results: number, filters: string[] = []): void {
    this.track('search_performed', {
      category: 'search',
      label: query,
      value: results,
      query,
      results_count: results,
      filters: filters.join(',')
    });
  }

  /**
   * Track conversion funnel
   * 
   * @param step - Funnel step
   * @param value - Step value
   * @param properties - Additional properties
   */
  trackFunnel(step: string, value: number, properties: EventProperties = {}): void {
    this.track('funnel_step', {
      category: 'conversion',
      label: step,
      value,
      funnel_step: step,
      ...properties
    });
  }

  /**
   * Check if analytics is enabled
   * 
   * @returns Whether analytics is enabled
   */
  private isEnabled(): boolean {
    if (this.config.enabled) return true;
    if (this.config.trackInDevelopment && process.env.NODE_ENV === 'development') return true;
    if (this.config.trackLocally) return true;
    return false;
  }

  /**
   * Generate session ID
   * 
   * @returns Session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Hash user ID for privacy
   * 
   * @param userId - User ID
   * @returns Hashed user ID
   */
  private hashUserId(userId: string): string {
    // Simple hash function for demo purposes
    // In production, use a proper hashing library
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `user_${Math.abs(hash).toString(36)}`;
  }

  /**
   * Get current page name
   * 
   * @returns Page name
   */
  private getCurrentPage(): string {
    if (typeof window === 'undefined') return 'unknown';
    
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (segments.length === 0) return 'home';
    if (segments[0] === 'app') return segments[1] || 'dashboard';
    return segments[0];
  }

  /**
   * Set up online/offline listener
   */
  private setupOnlineListener(): void {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushEvents();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Set up page change tracking
   */
  private setupPageChangeTracking(): void {
    if (typeof window === 'undefined') return;
    
    // Track page changes in SPA
    let currentPath = window.location.pathname;
    
    const trackPageChange = () => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.trackPageView();
      }
    };
    
    // Track popstate events
    window.addEventListener('popstate', trackPageChange);
    
    // Track pushstate/replacestate (for Next.js router)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(trackPageChange, 0);
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(trackPageChange, 0);
    };
  }

  /**
   * Set up error tracking
   */
  private setupErrorTracking(): void {
    if (typeof window === 'undefined') return;
    
    // Track unhandled errors
    window.addEventListener('error', (event) => {
      this.trackError(new Error(event.message), 'unhandled_error');
    });
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(event.reason), 'unhandled_promise_rejection');
    });
  }

  /**
   * Flush events to analytics service
   */
  private async flushEvents(): Promise<void> {
    if (!this.isOnline || this.eventQueue.length === 0) return;
    
    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    try {
      await this.sendEvents(events);
    } catch (error) {
      // Re-queue events if sending fails
      this.eventQueue.unshift(...events);
      console.error('Failed to send analytics events:', error);
    }
  }

  /**
   * Send events to analytics service
   * 
   * @param events - Events to send
   */
  private async sendEvents(events: Array<{ event: AnalyticsEvent; properties: EventProperties; timestamp: Date }>): Promise<void> {
    if (this.config.trackLocally) {
      console.log('Analytics events:', events);
      return;
    }
    
    const payload = {
      domain: this.config.domain,
      name: 'pageview', // Plausible event name
      url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      screen_width: typeof window !== 'undefined' ? window.screen.width : 0,
      props: events.reduce((acc, event) => {
        acc[event.event] = event.properties;
        return acc;
      }, {} as Record<string, EventProperties>)
    };
    
    await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
      },
      body: JSON.stringify(payload)
    });
  }
}

/**
 * Global analytics instance
 */
export const analytics = new Analytics();

/**
 * Initialize analytics
 * Call this in your app's root component
 */
export function initAnalytics(): void {
  analytics.init();
}

/**
 * Set user ID for tracking
 * 
 * @param userId - User ID
 */
export function setUserId(userId: string): void {
  analytics.setUserId(userId);
}

/**
 * Track custom event
 * 
 * @param event - Event name
 * @param properties - Event properties
 */
export function trackEvent(event: AnalyticsEvent, properties: EventProperties = {}): void {
  analytics.track(event, properties);
}

/**
 * Track page view
 * 
 * @param page - Page name
 * @param properties - Additional properties
 */
export function trackPageView(page?: string, properties: EventProperties = {}): void {
  analytics.trackPageView(page, properties);
}

/**
 * Track user action
 * 
 * @param action - Action name
 * @param category - Action category
 * @param properties - Additional properties
 */
export function trackAction(action: string, category: string, properties: EventProperties = {}): void {
  analytics.trackAction(action, category, properties);
}

/**
 * Track error
 * 
 * @param error - Error object
 * @param context - Error context
 */
export function trackError(error: Error, context: string = 'unknown'): void {
  analytics.trackError(error, context);
}

/**
 * Track ad interaction
 * 
 * @param slotId - Ad slot ID
 * @param action - Action type
 * @param properties - Additional properties
 */
export function trackAdInteraction(slotId: string, action: 'viewed' | 'clicked' | 'closed', properties: EventProperties = {}): void {
  analytics.trackAdInteraction(slotId, action, properties);
}

/**
 * Track search query
 * 
 * @param query - Search query
 * @param results - Number of results
 * @param filters - Applied filters
 */
export function trackSearch(query: string, results: number, filters: string[] = []): void {
  analytics.trackSearch(query, results, filters);
}

/**
 * Track conversion funnel
 * 
 * @param step - Funnel step
 * @param value - Step value
 * @param properties - Additional properties
 */
export function trackFunnel(step: string, value: number, properties: EventProperties = {}): void {
  analytics.trackFunnel(step, value, properties);
}
