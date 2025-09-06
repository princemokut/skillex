/**
 * CohortMemberReferralCard Component
 * Displays cohort members with referral eligibility status
 * 
 * This component shows cohort member information, session completion
 * percentage, and referral button (enabled only after 75% completion).
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  UserPlus,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props interface for CohortMemberReferralCard component
 */
interface CohortMemberReferralCardProps {
  /** Member data to display */
  member: {
    userId: string;
    cohortId: string;
    role: string;
    joinedAt: Date;
    sessionCompletionPercentage: number;
    isEligible: boolean;
    user?: {
      id: string;
      name: string;
      handle: string;
      avatar: string;
      title: string;
      skills?: string[];
      location?: string;
    };
  };
  /** Callback when referral button is clicked */
  onReferClick?: (userId: string) => void;
  /** Whether referral button should be disabled */
  isReferDisabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get eligibility status color class
 * Returns appropriate color styling based on eligibility status
 * 
 * @param isEligible - Whether member is eligible for referrals
 * @param completionPercentage - Session completion percentage
 * @returns CSS class string for eligibility status
 */
function getEligibilityStatusClass(isEligible: boolean, completionPercentage: number): string {
  if (isEligible) {
    return 'bg-green-100 text-green-700 border-green-200';
  } else if (completionPercentage >= 50) {
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  } else {
    return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

/**
 * Get eligibility status text
 * Returns human-readable status text
 * 
 * @param isEligible - Whether member is eligible for referrals
 * @param completionPercentage - Session completion percentage
 * @returns Status text
 */
function getEligibilityStatusText(isEligible: boolean, completionPercentage: number): string {
  if (isEligible) {
    return 'Eligible for Referrals';
  } else if (completionPercentage >= 50) {
    return 'Almost Eligible';
  } else {
    return 'Not Yet Eligible';
  }
}

/**
 * Get progress bar color class
 * Returns appropriate color styling based on completion percentage
 * 
 * @param completionPercentage - Session completion percentage
 * @returns CSS class string for progress bar
 */
function getProgressBarClass(completionPercentage: number): string {
  if (completionPercentage >= 75) {
    return 'bg-green-500';
  } else if (completionPercentage >= 50) {
    return 'bg-yellow-500';
  } else {
    return 'bg-slate-300';
  }
}

/**
 * CohortMemberReferralCard component for displaying cohort member referral eligibility
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function CohortMemberReferralCard({ 
  member, 
  onReferClick, 
  isReferDisabled = false,
  className 
}: CohortMemberReferralCardProps) {
  const { user, sessionCompletionPercentage, isEligible } = member;

  if (!user) {
    return null;
  }

  /**
   * Handle referral button click
   * Calls the onReferClick callback with user ID
   */
  const handleReferClick = () => {
    if (isEligible && !isReferDisabled) {
      onReferClick?.(user.id);
    }
  };

  return (
    <Card className={cn('w-full transition-all duration-200 hover:shadow-md', className)}>
      <CardContent className="p-6">
        {/* Header with user info and eligibility status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-slate-900 truncate">
                  {user.name}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {member.role}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 truncate">
                {user.title}
              </p>
              <p className="text-xs text-slate-500">
                @{user.handle}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <Badge className={cn('text-xs', getEligibilityStatusClass(isEligible, sessionCompletionPercentage))}>
              {getEligibilityStatusText(isEligible, sessionCompletionPercentage)}
            </Badge>
            {!isEligible && (
              <div className="flex items-center space-x-1 text-xs text-slate-500">
                <AlertCircle className="h-3 w-3" />
                <span>75% required</span>
              </div>
            )}
          </div>
        </div>

        {/* Session completion progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                Session Progress
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              {sessionCompletionPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                getProgressBarClass(sessionCompletionPercentage)
              )}
              style={{ width: `${Math.min(sessionCompletionPercentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
            <span>Started</span>
            <span>75% threshold</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Skills preview */}
        {user.skills && user.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Skills</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {user.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {user.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{user.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        {user.location && (
          <div className="mb-4">
            <p className="text-sm text-slate-600">
              📍 {user.location}
            </p>
          </div>
        )}

        {/* Referral button */}
        <div className="pt-4 border-t border-slate-200">
          <Button
            onClick={handleReferClick}
            disabled={!isEligible || isReferDisabled}
            className={cn(
              'w-full flex items-center justify-center space-x-2',
              isEligible 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            )}
          >
            {isEligible ? (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Send Referral</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                <span>Not Yet Eligible</span>
              </>
            )}
          </Button>
          
          {!isEligible && (
            <p className="text-xs text-slate-500 text-center mt-2">
              Complete {75 - sessionCompletionPercentage}% more sessions to enable referrals
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
