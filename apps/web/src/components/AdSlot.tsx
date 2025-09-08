/**
 * AdSlot Component
 * Responsive ad container with contextual targeting and ad blocker detection
 * 
 * This component provides a professional ad placement system with:
 * - Multiple ad sizes and formats
 * - Ad blocker detection and graceful degradation
 * - Context-aware targeting
 * - Loading states and error handling
 * - Clear ad labeling for transparency
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Ad size variants for different placements
 */
export type AdSize = 'banner' | 'sidebar' | 'in-content' | 'mobile-banner' | 'leaderboard';

/**
 * Ad placement contexts for targeting
 */
export type AdContext = 'matches' | 'connections' | 'referrals' | 'cohorts' | 'profile' | 'general';

/**
 * Props interface for AdSlot component
 */
interface AdSlotProps {
  /** Ad slot identifier for tracking */
  slotId: string;
  /** Ad size variant */
  size?: AdSize;
  /** Placement context for targeting */
  context?: AdContext;
  /** Additional CSS classes */
  className?: string;
  /** Custom targeting parameters */
  targeting?: Record<string, any>;
  /** Fallback content when ad fails to load */
  fallback?: React.ReactNode;
  /** Whether to enable lazy loading */
  lazy?: boolean;
  /** Ad refresh interval in seconds (0 = no refresh) */
  refreshInterval?: number;
  /** Callback for ad interactions */
  onAdInteraction?: (action: 'viewed' | 'clicked' | 'closed') => void;
}

/**
 * Ad size configurations
 */
const adSizes = {
  banner: {
    width: 728,
    height: 90,
    className: 'h-[90px]'
  },
  sidebar: {
    width: 300,
    height: 250,
    className: 'h-[250px]'
  },
  'in-content': {
    width: 300,
    height: 250,
    className: 'h-[250px]'
  },
  'mobile-banner': {
    width: 320,
    height: 50,
    className: 'h-[50px]'
  },
  leaderboard: {
    width: 728,
    height: 90,
    className: 'h-[90px]'
  }
};

/**
 * AdSlot component for displaying contextual advertisements
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function AdSlot({
  slotId,
  size = 'sidebar',
  context = 'general',
  className,
  targeting = {},
  fallback,
  lazy = true,
  refreshInterval = 0,
  onAdInteraction
}: AdSlotProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [adContent, setAdContent] = useState<React.ReactNode>(null);
  const adRef = useRef<HTMLDivElement>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const adConfig = adSizes[size];
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  /**
   * Detect if ad blocker is present
   * Checks for common ad blocker patterns
   */
  const detectAdBlocker = async (): Promise<boolean> => {
    try {
      // Create a test ad element
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.cssText = 'position:absolute;left:-10000px;top:-1000px;';
      
      document.body.appendChild(testAd);
      
      // Check if the element is still visible after a short delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const isBlocked = testAd.offsetHeight === 0 || 
                       testAd.offsetWidth === 0 ||
                       testAd.style.display === 'none' ||
                       testAd.style.visibility === 'hidden';
      
      document.body.removeChild(testAd);
      return isBlocked;
    } catch (error) {
      return true; // Assume blocked if detection fails
    }
  };

  /**
   * Generate mock ad content based on context and targeting
   * In production, this would integrate with ad networks
   */
  const generateAdContent = (): React.ReactNode => {
    const mockAds = {
      matches: [
        { title: 'Find Your Next Role', company: 'TechCorp', type: 'Job' },
        { title: 'React Developer Position', company: 'StartupXYZ', type: 'Job' },
        { title: 'Learn Advanced TypeScript', company: 'CodeAcademy', type: 'Course' }
      ],
      connections: [
        { title: 'Network with Professionals', company: 'LinkedIn Pro', type: 'Service' },
        { title: 'Attend Tech Meetup', company: 'LocalTech', type: 'Event' },
        { title: 'Professional Headshots', company: 'PhotoStudio', type: 'Service' }
      ],
      referrals: [
        { title: 'Hire Top Talent', company: 'RecruitPro', type: 'Service' },
        { title: 'Job Posting Platform', company: 'JobBoard', type: 'Service' },
        { title: 'Career Coaching', company: 'CareerBoost', type: 'Service' }
      ],
      cohorts: [
        { title: 'Advanced React Course', company: 'TechInstitute', type: 'Course' },
        { title: 'Data Science Bootcamp', company: 'DataAcademy', type: 'Course' },
        { title: 'UX Design Workshop', company: 'DesignSchool', type: 'Course' }
      ],
      profile: [
        { title: 'Professional Portfolio', company: 'PortfolioPro', type: 'Service' },
        { title: 'Resume Builder', company: 'ResumeTool', type: 'Service' },
        { title: 'Personal Branding', company: 'BrandStudio', type: 'Service' }
      ],
      general: [
        { title: 'Tech News Daily', company: 'TechNews', type: 'News' },
        { title: 'Developer Tools', company: 'DevTools', type: 'Service' },
        { title: 'Cloud Hosting', company: 'CloudProvider', type: 'Service' }
      ]
    };

    const contextAds = mockAds[context] || mockAds.general;
    const randomAd = contextAds[Math.floor(Math.random() * contextAds.length)];

    return (
      <div 
        className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 cursor-pointer hover:from-blue-100 hover:to-indigo-200 transition-colors"
        onClick={() => onAdInteraction?.('clicked')}
      >
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">
              {randomAd.company.charAt(0)}
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">{randomAd.title}</h3>
          <p className="text-sm text-slate-600 mb-2">{randomAd.company}</p>
          <Badge variant="outline" className="text-xs">
            {randomAd.type}
          </Badge>
        </div>
      </div>
    );
  };

  /**
   * Load ad content
   * Handles ad loading, error states, and ad blocker detection
   */
  const loadAd = useCallback(async () => {
    try {
      setIsError(false);
      setIsBlocked(false);

      // Check for ad blocker
      const blocked = await detectAdBlocker();
      if (blocked) {
        setIsBlocked(true);
        return;
      }

      // Simulate ad loading delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      // Generate mock ad content
      const content = generateAdContent();
      setAdContent(content);
      setIsLoaded(true);
      
      // Track ad view
      onAdInteraction?.('viewed');
    } catch (error) {
      console.error('Error loading ad:', error);
      setIsError(true);
    }
  }, [onAdInteraction]);

  /**
   * Refresh ad content
   * Reloads the ad with new content
   */
  const refreshAd = useCallback(() => {
    setIsLoaded(false);
    setAdContent(null);
    loadAd();
  }, [loadAd]);

  /**
   * Set up intersection observer for lazy loading
   */
  useEffect(() => {
    if (!lazy || !adRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(adRef.current);

    return () => observer.disconnect();
  }, [lazy]);

  /**
   * Load ad when visible
   */
  useEffect(() => {
    if (isVisible && !isLoaded && !isError && !isBlocked) {
      loadAd();
    }
  }, [isVisible, isLoaded, isError, isBlocked, loadAd]);

  /**
   * Set up refresh interval
   */
  useEffect(() => {
    if (refreshInterval > 0 && isLoaded) {
      refreshTimerRef.current = setInterval(refreshAd, refreshInterval * 1000);
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [refreshInterval, isLoaded, refreshAd]);

  /**
   * Render fallback content
   */
  const renderFallback = () => {
    if (fallback) return fallback;

    if (isBlocked) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <EyeOff className="h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm text-slate-600 mb-2">Ad blocked</p>
          <p className="text-xs text-slate-500">
            Consider disabling your ad blocker to support our platform
          </p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
          <p className="text-sm text-slate-600 mb-2">Ad unavailable</p>
          <p className="text-xs text-slate-500">Please try refreshing the page</p>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-slate-200 rounded-full mb-3" />
          <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
          <div className="h-3 bg-slate-200 rounded w-16" />
        </div>
      </div>
    );
  };

  return (
    <div
      ref={adRef}
      className={cn(
        'relative',
        className
      )}
      data-ad-slot={slotId}
      data-ad-context={context}
      data-ad-size={size}
    >
      {/* Ad Container */}
      <Card className={cn('w-full', adConfig.className)}>
        <CardContent className="p-0 h-full">
          {isLoaded && adContent ? (
            <div className="h-full">
              {adContent}
            </div>
          ) : (
            renderFallback()
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * AdSlotContainer component for wrapping multiple ad slots
 * Provides consistent spacing and layout
 */
interface AdSlotContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function AdSlotContainer({ children, className }: AdSlotContainerProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
}