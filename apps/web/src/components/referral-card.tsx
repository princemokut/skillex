/**
 * ReferralCard Component
 * Displays a referral with cohort context and actions
 * 
 * This component shows referral details, status, and provides
 * appropriate actions based on the referral state and user role.
 */

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Calendar,
  MoreHorizontal,
  MessageCircle,
  ExternalLink,
  Building2,
  Briefcase,
  Handshake,
  GraduationCap,
  Zap
} from 'lucide-react';
import { ReferralWithType, ReferralContextType, ReferralDirection, ReferralRequestType } from '@/lib/referral-mock-data';
import { ReferralStatus } from '@skillex/types';
import { cn, formatDate, formatRelativeTime } from '@/lib/utils';

/**
 * Props interface for ReferralCard component
 */
interface ReferralCardProps {
  /** Referral data to display */
  referral: ReferralWithType;
  /** Whether this is the current user's referral (for sent/received) */
  isCurrentUser: boolean;
  /** Current active tab to determine badge visibility */
  activeTab?: 'given' | 'received' | 'requests';
  /** Callback when referral status changes */
  onStatusChange?: (referralId: string, newStatus: ReferralStatus) => void;
  /** Callback when referral is deleted */
  onDelete?: (referralId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get status color class for referral status
 * Returns appropriate color styling based on referral status
 * 
 * @param status - Referral status to get color for
 * @returns CSS class string for status color
 */
function getStatusColorClass(status: string): string {
  switch (status) {
    case 'draft':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'sent':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'accepted':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'declined':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

/**
 * Get urgency color class for referral urgency
 * Returns appropriate color styling based on urgency level
 * 
 * @param urgency - Urgency level to get color for
 * @returns CSS class string for urgency color
 */
function getUrgencyColorClass(urgency: string): string {
  switch (urgency) {
    case 'high':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

/**
 * Get context type icon for referral context
 * Returns appropriate icon component based on context type
 * 
 * @param contextType - Context type to get icon for
 * @returns Icon component for context type
 */
function getContextTypeIcon(contextType: ReferralContextType) {
  switch (contextType) {
    case 'job':
      return Building2;
    case 'project':
      return Briefcase;
    case 'collaboration':
      return Handshake;
    case 'mentorship':
      return GraduationCap;
    case 'freelance':
      return Zap;
    default:
      return Briefcase;
  }
}

/**
 * Get context type display name
 * Returns human-readable name for context type
 * 
 * @param contextType - Context type to get display name for
 * @returns Display name for context type
 */
function getContextTypeDisplayName(contextType: ReferralContextType): string {
  switch (contextType) {
    case 'job':
      return 'Job Opportunity';
    case 'project':
      return 'Project';
    case 'collaboration':
      return 'Collaboration';
    case 'mentorship':
      return 'Mentorship';
    case 'freelance':
      return 'Freelance';
    default:
      return 'Opportunity';
  }
}

/**
 * ReferralCard component for displaying referral information
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function ReferralCard({ 
  referral, 
  isCurrentUser, 
  activeTab,
  onStatusChange, 
  onDelete, 
  className 
}: ReferralCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const ContextIcon = getContextTypeIcon(referral.contextType);
  const contextDisplayName = getContextTypeDisplayName(referral.contextType);
  const isSender = isCurrentUser;
  const isReceiver = !isCurrentUser;
  const isRequest = referral.direction === 'request';
  const isSend = referral.direction === 'send';

  /**
   * Handle status change action
   * Calls the onStatusChange callback with new status
   * 
   * @param newStatus - New status to set
   */
  const handleStatusChange = (newStatus: ReferralStatus) => {
    onStatusChange?.(referral.id, newStatus);
    setShowActions(false);
  };

  /**
   * Handle delete action
   * Calls the onDelete callback
   */
  const handleDelete = () => {
    onDelete?.(referral.id);
    setShowActions(false);
  };

  // If className includes 'border-0 shadow-none', render without Card wrapper
  if (className?.includes('border-0 shadow-none')) {
    return (
      <div className={cn('w-full transition-all duration-200', className)}>
        <div className="p-0">
        {/* Header with user info and status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={isSender ? referral.toUser.avatar : referral.fromUser.avatar} 
                alt={isSender ? referral.toUser.name : referral.fromUser.name}
              />
              <AvatarFallback>
                {isSender ? referral.toUser.name.charAt(0) : referral.fromUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-slate-900 truncate">
                {isSender ? referral.toUser.name : referral.fromUser.name}
              </h3>
            </div>
              <p className="text-sm text-slate-600 truncate">
                {isSender ? referral.toUser.title : referral.fromUser.title}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                {(isSender ? referral.toUser.skills || [] : referral.fromUser.skills || []).slice(0, 2).map((skill, index) => (
                  <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
                {(isSender ? referral.toUser.skills || [] : referral.fromUser.skills || []).length > 2 && (
                  <span className="text-xs text-slate-500">
                    +{(isSender ? referral.toUser.skills || [] : referral.fromUser.skills || []).length - 2} more
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Only show status badge in Requests tab */}
            {activeTab === 'requests' && (
              <Badge className={cn('text-xs', getStatusColorClass(referral.status))}>
                {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Context type and urgency */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <ContextIcon className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              {contextDisplayName}
            </span>
          </div>
          {referral.requestType && (
            <Badge variant="secondary" className="text-xs">
              {referral.requestType === 'company_specific' ? 'Company-Specific' : 
               referral.requestType === 'project_specific' ? 'Project-Specific' : 'General'}
            </Badge>
          )}
          <Badge className={cn('text-xs', getUrgencyColorClass(referral.urgency))}>
            {referral.urgency.charAt(0).toUpperCase() + referral.urgency.slice(1)} Priority
          </Badge>
        </div>

        {/* Company/Project info */}
        {(referral.companyName || referral.projectTitle) && (
          <div className="mb-3">
            <p className="text-sm font-medium text-slate-900">
              {referral.companyName || referral.projectTitle}
            </p>
          </div>
        )}

        {/* Referral context */}
        <div className="mb-4">
          <div className={cn(
            'text-sm text-slate-700 leading-relaxed whitespace-pre-line',
            !isExpanded && 'line-clamp-3'
          )}>
            {referral.context}
          </div>
          {referral.context.length > 150 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 h-auto p-0 text-blue-600 hover:text-blue-700"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>

        {/* Cohort context */}
        <div className="flex items-center space-x-4 text-xs text-slate-500 mb-4">
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{referral.cohortTitle}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{referral.sessionCompletionPercentage}% sessions completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatRelativeTime(referral.createdAt)}</span>
          </div>
        </div>

        {/* Action buttons */}
        {showActions && (
          <div className="flex items-center space-x-2 pt-4 border-t border-slate-200">
            {isReceiver && referral.status === 'sent' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleStatusChange('accepted')}
                  className="flex items-center space-x-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{isRequest ? 'Accept Request' : 'Accept'}</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange('declined')}
                  className="flex items-center space-x-1"
                >
                  <XCircle className="h-4 w-4" />
                  <span>{isRequest ? 'Decline Request' : 'Decline'}</span>
                </Button>
              </>
            )}
            
            {isSender && referral.status === 'draft' && (
              <Button
                size="sm"
                onClick={() => handleStatusChange('sent')}
                className="flex items-center space-x-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{isRequest ? 'Send Request' : 'Send'}</span>
              </Button>
            )}
            
            {(isSender || referral.status === 'declined') && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowActions(false)}
            >
              Cancel
            </Button>
          </div>
        )}
        </div>
      </div>
    );
  }

  // Default Card wrapper rendering
  return (
    <Card className={cn('w-full transition-all duration-200 hover:shadow-md', className)}>
      <CardContent className="p-6">
        {/* Header with user info and status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={isSender ? referral.toUser.avatar : referral.fromUser.avatar} 
                alt={isSender ? referral.toUser.name : referral.fromUser.name}
              />
              <AvatarFallback>
                {isSender ? referral.toUser.name.charAt(0) : referral.fromUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-slate-900 truncate">
                {isSender ? referral.toUser.name : referral.fromUser.name}
              </h3>
            </div>
              <p className="text-sm text-slate-600 truncate">
                {isSender ? referral.toUser.title : referral.fromUser.title}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                {(isSender ? referral.toUser.skills || [] : referral.fromUser.skills || []).slice(0, 2).map((skill, index) => (
                  <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
                {(isSender ? referral.toUser.skills || [] : referral.fromUser.skills || []).length > 2 && (
                  <span className="text-xs text-slate-500">
                    +{(isSender ? referral.toUser.skills || [] : referral.fromUser.skills || []).length - 2} more
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Only show status badge in Requests tab */}
            {activeTab === 'requests' && (
              <Badge className={cn('text-xs', getStatusColorClass(referral.status))}>
                {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Context type and urgency */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <ContextIcon className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              {contextDisplayName}
            </span>
          </div>
          {referral.companyName && (
            <span className="text-sm text-slate-500">•</span>
          )}
          {referral.companyName && (
            <span className="text-sm text-slate-600">{referral.companyName}</span>
          )}
          {referral.projectTitle && (
            <>
              <span className="text-sm text-slate-500">•</span>
              <span className="text-sm text-slate-600">{referral.projectTitle}</span>
            </>
          )}
          <span className="text-sm text-slate-500">•</span>
          <Badge className={cn('text-xs', getUrgencyColorClass(referral.urgency))}>
            {referral.urgency} priority
          </Badge>
        </div>

        {/* Referral context */}
        <div className="mb-4">
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {referral.context}
          </div>
        </div>

        {/* Cohort info */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{referral.cohortTitle}</span>
            <span>•</span>
            <span>{referral.sessionCompletionPercentage}% sessions completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(referral.createdAt)}</span>
          </div>
        </div>

        {/* Action buttons */}
        {showActions && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center space-x-2">
            {isRequest && isReceiver && referral.status === 'sent' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleStatusChange('accepted')}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Accept</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange('declined')}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Decline</span>
                </Button>
              </>
            )}
            
            {isSend && isSender && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowActions(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
