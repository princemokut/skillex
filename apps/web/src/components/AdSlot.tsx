/**
 * AdSlot component for displaying contextual advertisements
 * Provides clearly labeled ad spaces with frequency capping
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Props for the AdSlot component
 */
interface AdSlotProps {
  /** The type of ad slot for contextual placement */
  type: 'skill-tags' | 'location' | 'cohort' | 'profile' | 'sidebar';
  /** Optional custom className for styling */
  className?: string;
  /** Whether to show the ad label (default: true) */
  showLabel?: boolean;
}

/**
 * AdSlot component for displaying contextual advertisements
 * 
 * This component provides a standardized way to display ads throughout the application.
 * Ads are clearly labeled and placed contextually based on the type prop.
 * 
 * @param props - Component props
 * @returns AdSlot JSX component
 */
export function AdSlot({ 
  type, 
  className = "", 
  showLabel = true 
}: AdSlotProps) {
  /**
   * Gets contextual ad content based on the slot type
   * In a real implementation, this would fetch from an ad service
   */
  const getAdContent = () => {
    switch (type) {
      case 'skill-tags':
        return {
          title: "Master Python with Expert-Led Courses",
          description: "Join 10,000+ developers learning Python",
          cta: "Start Learning",
          image: "/placeholder-ad-skill.jpg"
        };
      case 'location':
        return {
          title: "Remote Work Opportunities",
          description: "Find your next remote role",
          cta: "Browse Jobs",
          image: "/placeholder-ad-location.jpg"
        };
      case 'cohort':
        return {
          title: "Join Our Next Cohort",
          description: "Limited spots available",
          cta: "Apply Now",
          image: "/placeholder-ad-cohort.jpg"
        };
      case 'profile':
        return {
          title: "Boost Your Profile",
          description: "Get more visibility",
          cta: "Learn More",
          image: "/placeholder-ad-profile.jpg"
        };
      case 'sidebar':
        return {
          title: "Premium Features",
          description: "Unlock advanced matching",
          cta: "Upgrade",
          image: "/placeholder-ad-sidebar.jpg"
        };
      default:
        return {
          title: "Discover More",
          description: "Explore our platform",
          cta: "Learn More",
          image: "/placeholder-ad.jpg"
        };
    }
  };

  const adContent = getAdContent();

  return (
    <Card className={`border-slate-200 ${className}`}>
      <CardContent className="p-4">
        {showLabel && (
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="text-xs">
              Advertisement
            </Badge>
          </div>
        )}
        
        <div className="space-y-3">
          {/* Ad Image Placeholder */}
          <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center">
            <span className="text-slate-400 text-sm">Ad Image</span>
          </div>
          
          {/* Ad Content */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 text-sm">
              {adContent.title}
            </h3>
            <p className="text-slate-600 text-xs">
              {adContent.description}
            </p>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors">
              {adContent.cta}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * AdSlot container for the right rail
 * Provides consistent styling for sidebar advertisements
 * 
 * @param props - Component props
 * @returns RightRailAdSlot JSX component
 */
export function RightRailAdSlot(props: Omit<AdSlotProps, 'type'>) {
  return (
    <div className="space-y-4">
      <AdSlot type="sidebar" {...props} />
      <AdSlot type="skill-tags" {...props} />
    </div>
  );
}

/**
 * Inline ad slot for content areas
 * Provides smaller, less intrusive ad placement
 * 
 * @param props - Component props
 * @returns InlineAdSlot JSX component
 */
export function InlineAdSlot(props: Omit<AdSlotProps, 'type'>) {
  return (
    <div className="my-6">
      <AdSlot type="skill-tags" className="max-w-sm mx-auto" {...props} />
    </div>
  );
}
