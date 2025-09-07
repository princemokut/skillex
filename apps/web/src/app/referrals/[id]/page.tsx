/**
 * Referral Details Page
 * Detailed view of a specific referral with cohort context
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ReferralCard } from '@/components/referral-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Building2,
  Briefcase,
  Handshake,
  GraduationCap,
  Zap,
  MessageCircle,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { ReferralWithType, ReferralContextType } from '@/lib/referral-mock-data';
import { ReferralStatus } from '@skillex/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';

/**
 * Mock current user ID for development
 * In production, this would come from authentication context
 */
const MOCK_CURRENT_USER_ID = 'user-1';

/**
 * Get context type icon
 * Returns appropriate icon component for context type
 * 
 * @param contextType - Context type to get icon for
 * @returns Icon component
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
 * @returns Display name
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

export default function ReferralDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [referral, setReferral] = useState<ReferralWithType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const referralId = params.id as string;

  /**
   * Load referral data
   * Fetches referral data by ID
   */
  useEffect(() => {
    const loadReferral = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Mock data - in production, this would be an API call
        const mockReferrals = [
          {
            id: 'referral-1',
            fromUserId: 'user-1',
            toUserId: 'user-4',
            context: 'I highly recommend Sarah for the Senior React Developer position at our company. She demonstrated exceptional problem-solving skills during our React & TypeScript cohort sessions and consistently delivered high-quality code. Her attention to detail and collaborative approach made her stand out among all participants.',
            status: 'sent' as ReferralStatus,
            createdAt: new Date('2024-02-10T10:00:00Z'),
            cohortId: 'cohort-1',
            cohortTitle: 'React & TypeScript Mastery',
            sessionCompletionPercentage: 87,
            isEligible: true,
            contextType: 'job' as ReferralContextType,
            companyName: 'TechCorp Inc.',
            urgency: 'high' as const,
            direction: 'send' as const,
            requestType: 'company_specific' as const,
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
          }
        ];

        const foundReferral = mockReferrals.find(r => r.id === referralId);
        
        if (!foundReferral) {
          setError('Referral not found');
          return;
        }

        setReferral(foundReferral);
      } catch (err) {
        setError('Failed to load referral');
        console.error('Error loading referral:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (referralId) {
      loadReferral();
    }
  }, [referralId]);

  /**
   * Handle status update
   * Updates referral status
   * 
   * @param referralId - Referral ID to update
   * @param newStatus - New status to set
   */
  const handleStatusUpdate = async (referralId: string, newStatus: ReferralStatus) => {
    if (!referral) return;

    try {
      setIsUpdating(true);
      
      // Mock update - in production, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReferral(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      console.error('Error updating referral status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle delete referral
   * Deletes the referral and navigates back
   */
  const handleDelete = async () => {
    if (!referral) return;

    try {
      setIsUpdating(true);
      
      // Mock delete - in production, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/referrals');
    } catch (err) {
      console.error('Error deleting referral:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-6" />
            <div className="h-96 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !referral) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {error || 'Referral Not Found'}
              </h3>
              <p className="text-slate-600 mb-4">
                {error || 'The referral you\'re looking for doesn\'t exist or has been removed.'}
              </p>
              <Button onClick={() => router.push('/referrals')}>
                Back to Referrals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isSender = referral.fromUserId === MOCK_CURRENT_USER_ID;
  const isReceiver = referral.toUserId === MOCK_CURRENT_USER_ID;
  const ContextIcon = getContextTypeIcon(referral.contextType);
  const contextDisplayName = getContextTypeDisplayName(referral.contextType);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Referral Details</h1>
              <p className="text-slate-600 mt-2">
                {isSender ? 'Referral you sent' : 'Referral you received'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColorClass(referral.status)}>
                {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
              </Badge>
              <Badge className={getUrgencyColorClass(referral.urgency)}>
                {referral.urgency.charAt(0).toUpperCase() + referral.urgency.slice(1)} Priority
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Referral Card */}
            <ReferralCard
              referral={referral}
              isCurrentUser={isSender}
              onStatusChange={handleStatusUpdate}
              onDelete={handleDelete}
            />

            {/* Detailed Context */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Full Context</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {referral.context}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {isReceiver && referral.status === 'sent' && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Respond to Referral
                  </h3>
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => handleStatusUpdate(referral.id, 'accepted')}
                      disabled={isUpdating}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Accept Referral</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate(referral.id, 'declined')}
                      disabled={isUpdating}
                      className="flex items-center space-x-2"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Decline Referral</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Referral Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ContextIcon className="h-5 w-5" />
                  <span>Referral Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Type</label>
                  <p className="text-slate-900">{contextDisplayName}</p>
                </div>
                
                {referral.companyName && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">Company</label>
                    <p className="text-slate-900">{referral.companyName}</p>
                  </div>
                )}
                
                {referral.projectTitle && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">Project</label>
                    <p className="text-slate-900">{referral.projectTitle}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Priority</label>
                  <Badge className={getUrgencyColorClass(referral.urgency)}>
                    {referral.urgency.charAt(0).toUpperCase() + referral.urgency.slice(1)}
                  </Badge>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Created</label>
                  <p className="text-slate-900">{formatDate(referral.createdAt)}</p>
                  <p className="text-sm text-slate-500">{formatRelativeTime(referral.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Cohort Context */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Cohort Context</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Cohort</label>
                  <p className="text-slate-900">{referral.cohortTitle}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Session Progress</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(referral.sessionCompletionPercentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {referral.sessionCompletionPercentage}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {referral.isEligible ? 'Eligible for referrals' : 'Not yet eligible (75% required)'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>{isSender ? 'Referred To' : 'Referred By'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={isSender ? referral.toUser.avatar : referral.fromUser.avatar} 
                      alt={isSender ? referral.toUser.name : referral.fromUser.name}
                    />
                    <AvatarFallback>
                      {isSender ? referral.toUser.name.charAt(0) : referral.fromUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {isSender ? referral.toUser.name : referral.fromUser.name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {isSender ? referral.toUser.title : referral.fromUser.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      @{isSender ? referral.toUser.handle : referral.fromUser.handle}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
