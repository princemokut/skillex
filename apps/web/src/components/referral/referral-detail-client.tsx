"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

interface ReferralDetailClientProps {
  referral: ReferralWithType;
  referralId: string;
  currentUserId: string;
}

/**
 * Client component for referral detail page interactive functionality
 * Handles state management and user interactions
 */
export function ReferralDetailClient({ referral, referralId, currentUserId }: ReferralDetailClientProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleBack = () => {
    router.push('/referrals');
  };

  const handleStatusUpdate = async (newStatus: ReferralStatus) => {
    setIsUpdating(true);
    try {
      // TODO: Implement status update API call
      console.log('Updating referral status:', referralId, newStatus);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to update referral status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContactUser = (userId: string) => {
    // TODO: Implement user contact functionality
    console.log('Contact user:', userId);
  };

  const handleViewCohort = (cohortId: string) => {
    router.push(`/cohorts/${cohortId}`);
  };

  const getContextTypeIcon = (contextType: ReferralContextType) => {
    switch (contextType) {
      case 'job':
        return <Building2 className="h-5 w-5" />;
      case 'project':
        return <Briefcase className="h-5 w-5" />;
      case 'collaboration':
        return <GraduationCap className="h-5 w-5" />;
      case 'mentorship':
        return <Handshake className="h-5 w-5" />;
      case 'freelance':
        return <Zap className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: ReferralStatus) => {
    switch (status) {
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ReferralStatus) => {
    switch (status) {
      case 'sent':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'declined':
        return <XCircle className="h-4 w-4" />;
      case 'draft':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const isOwner = referral.fromUserId === currentUserId;
  const isRecipient = referral.toUserId === currentUserId;

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 py-0 sm:py-6 lg:py-8 px-0 sm:px-6 lg:px-8 mt-0 pb-20 md:pb-48">
      <div className="max-w-4xl mx-auto px-0 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 px-4 sm:px-0 pt-4 sm:pt-0">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Referrals
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getContextTypeIcon(referral.contextType)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {referral.contextType.charAt(0).toUpperCase() + referral.contextType.slice(1)} Referral
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(referral.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(referral.status)}
                        {referral.status}
                      </div>
                    </Badge>
                    <span className="text-sm text-slate-500">
                      Created {formatRelativeTime(referral.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {isOwner && (
                <Button
                  variant="outline"
                  onClick={() => handleContactUser(referral.toUserId)}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Recipient
                </Button>
              )}
              {isRecipient && (
                <Button
                  variant="outline"
                  onClick={() => handleContactUser(referral.fromUserId)}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Referrer
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => handleViewCohort(referral.cohortId)}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Cohort
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Referral Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Referral Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Context */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Context</h3>
                <div className="prose max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {referral.context}
                  </p>
                </div>
              </div>

              {/* Session Completion */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Session Completion</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Progress</span>
                      <span className="text-sm text-slate-600">{referral.sessionCompletionPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${referral.sessionCompletionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cohort Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Cohort Information</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900">{referral.cohortTitle}</h4>
                      <p className="text-sm text-slate-600">Cohort ID: {referral.cohortId}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCohort(referral.cohortId)}
                    >
                      View Cohort
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* People Involved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Referrer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Referrer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={referral.fromUser?.avatar} />
                    <AvatarFallback>
                      {referral.fromUser?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{referral.fromUser?.name}</h4>
                    <p className="text-sm text-slate-600">{referral.fromUser?.title}</p>
                    <p className="text-xs text-slate-500">ID: {referral.fromUserId}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactUser(referral.fromUserId)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recipient */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recipient
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={referral.toUser?.avatar} />
                    <AvatarFallback>
                      {referral.toUser?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{referral.toUser?.name}</h4>
                    <p className="text-sm text-slate-600">{referral.toUser?.title}</p>
                    <p className="text-xs text-slate-500">ID: {referral.toUserId}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactUser(referral.toUserId)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          {isRecipient && referral.status === 'sent' && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleStatusUpdate('accepted')}
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Accept Referral
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate('declined')}
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Decline Referral
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Referral Created</p>
                    <p className="text-sm text-slate-600">{formatDate(referral.createdAt)}</p>
                  </div>
                </div>
                {referral.status !== 'sent' && (
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      {getStatusIcon(referral.status)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        Status Updated to {referral.status}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatDate(referral.createdAt)} {/* TODO: Add actual update date */}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
