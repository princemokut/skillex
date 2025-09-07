/**
 * Cohort Referrals Page
 * Referral management within specific cohort context
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCohortReferrals } from '@/hooks/use-referrals';
import { ReferralCard } from '@/components/referral-card';
import { ReferralRequestModal } from '@/components/referral-request-modal';
import { RequestReferralModal } from '@/components/request-referral-modal';
import { CohortMemberReferralCard } from '@/components/cohort-member-referral-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Users, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  TrendingUp,
  Building2,
  Briefcase,
  Handshake,
  GraduationCap,
  Zap,
  MessageCircle
} from 'lucide-react';
import { ReferralWithType, ReferralContextType, ReferralRequestType } from '@/lib/referral-mock-data';
import { getEligibleCohortMembersForReferrals } from '@/lib/cohort-referral-utils';
import { ReferralStatus } from '@skillex/types';

/**
 * Mock current user ID for development
 * In production, this would come from authentication context
 */
const MOCK_CURRENT_USER_ID = 'user-1';

/**
 * Mock cohort data for development
 * In production, this would come from cohort API
 */
const MOCK_COHORT = {
  id: 'cohort-1',
  title: 'React & TypeScript Mastery',
  sessionCompletionPercentage: 87,
  isEligible: true
};

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

export default function CohortReferralsPage() {
  const params = useParams();
  const cohortId = params.id as string;
  
  const {
    referrals,
    stats,
    isLoading,
    error,
    refetch
  } = useCohortReferrals(cohortId);

  const [activeTab, setActiveTab] = useState<'members' | 'referrals'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Mock eligible members data
  const [eligibleMembers, setEligibleMembers] = useState(() => 
    getEligibleCohortMembersForReferrals(cohortId, MOCK_CURRENT_USER_ID)
  );

  /**
   * Get filtered referrals based on search query
   * Returns referrals filtered by search query
   */
  const getFilteredReferrals = (): ReferralWithType[] => {
    if (!searchQuery) return referrals;

    const query = searchQuery.toLowerCase();
    return referrals.filter(referral => 
      referral.context.toLowerCase().includes(query) ||
      referral.fromUser.name.toLowerCase().includes(query) ||
      referral.toUser.name.toLowerCase().includes(query) ||
      (referral.companyName && referral.companyName.toLowerCase().includes(query)) ||
      (referral.projectTitle && referral.projectTitle.toLowerCase().includes(query))
    );
  };

  /**
   * Get filtered members based on search query
   * Returns members filtered by search query
   */
  const getFilteredMembers = () => {
    if (!searchQuery) return eligibleMembers;

    const query = searchQuery.toLowerCase();
    return eligibleMembers.filter(member => 
      member.user?.name.toLowerCase().includes(query) ||
      member.user?.title.toLowerCase().includes(query) ||
      member.user?.handle.toLowerCase().includes(query)
    );
  };

  /**
   * Handle create referral
   * Opens create modal with selected user
   * 
   * @param userId - User ID to create referral for
   */
  const handleCreateReferral = (userId: string) => {
    setSelectedUserId(userId);
    setShowCreateModal(true);
  };

  /**
   * Handle request referral
   * Opens request modal
   */
  const handleRequestReferral = () => {
    setShowRequestModal(true);
  };

  /**
   * Handle referral creation
   * Creates referral and refreshes data
   * 
   * @param referralData - Referral data to create
   */
  const handleReferralCreation = async (referralData: {
    toUserId: string;
    context: string;
    contextType: ReferralContextType;
    companyName?: string;
    projectTitle?: string;
    urgency: 'low' | 'medium' | 'high';
  }) => {
    try {
      // Mock creation - in production, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowCreateModal(false);
      setSelectedUserId('');
      refetch();
    } catch (error) {
      console.error('Error creating referral:', error);
    }
  };

  /**
   * Handle referral request creation
   * Creates referral request and refreshes data
   * 
   * @param requestData - Request data to create
   */
  const handleReferralRequestCreation = async (requestData: {
    toUserId: string;
    context: string;
    contextType: ReferralContextType;
    requestType: ReferralRequestType;
    companyName?: string;
    projectTitle?: string;
    urgency: 'low' | 'medium' | 'high';
  }) => {
    try {
      // Mock creation - in production, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowRequestModal(false);
      refetch();
    } catch (error) {
      console.error('Error creating referral request:', error);
    }
  };

  const filteredReferrals = getFilteredReferrals();
  const filteredMembers = getFilteredMembers();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {MOCK_COHORT.title} - Referrals
              </h1>
              <p className="text-slate-600 mt-2">
                Manage referrals within this cohort
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge 
                className={MOCK_COHORT.isEligible 
                  ? 'bg-green-100 text-green-700 border-green-200' 
                  : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                }
              >
                {MOCK_COHORT.sessionCompletionPercentage}% Complete
              </Badge>
              {MOCK_COHORT.isEligible && (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Send Referral</span>
                  </Button>
                  <Button
                    onClick={handleRequestReferral}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Request Referral</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cohort Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Referrals</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalReferrals}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Accepted</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.byStatus.accepted}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.byStatus.sent}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Session Progress</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.sessionCompletionPercentage}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search members or referrals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'members' | 'referrals')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Cohort Members</span>
              <Badge variant="secondary" className="ml-1">
                {filteredMembers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Referrals</span>
              <Badge variant="secondary" className="ml-1">
                {filteredReferrals.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-6">
            {!MOCK_COHORT.isEligible ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Referrals Not Yet Available
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Complete {75 - MOCK_COHORT.sessionCompletionPercentage}% more sessions to enable referrals.
                  </p>
                  <div className="w-full bg-slate-200 rounded-full h-2 max-w-md mx-auto">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(MOCK_COHORT.sessionCompletionPercentage, 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : filteredMembers.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No Members Found
                  </h3>
                  <p className="text-slate-600">
                    {searchQuery ? 'No members match your search.' : 'No eligible members found.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredMembers.map((member) => (
                  <CohortMemberReferralCard
                    key={member.userId}
                    member={member}
                    onReferClick={handleCreateReferral}
                    isReferDisabled={!MOCK_COHORT.isEligible}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <div className="h-12 w-12 bg-slate-200 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-3/4" />
                          <div className="h-3 bg-slate-200 rounded w-1/2" />
                          <div className="h-3 bg-slate-200 rounded w-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Error Loading Referrals
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {error.message || 'Something went wrong while loading referrals.'}
                  </p>
                  <Button onClick={() => refetch()}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredReferrals.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No Referrals Yet
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {searchQuery ? 'No referrals match your search.' : 'No referrals have been created in this cohort yet.'}
                  </p>
                  {MOCK_COHORT.isEligible && (
                    <Button onClick={() => setShowCreateModal(true)}>
                      Send First Referral
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredReferrals.map((referral) => (
                  <ReferralCard
                    key={referral.id}
                    referral={referral}
                    isCurrentUser={referral.fromUserId === MOCK_CURRENT_USER_ID}
                    onStatusChange={async (referralId: string, newStatus: ReferralStatus) => {
                      // Mock status update
                      console.log('Update referral status:', referralId, newStatus);
                    }}
                    onDelete={async (referralId) => {
                      // Mock delete
                      console.log('Delete referral:', referralId);
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Referral Modal */}
        {showCreateModal && (
          <ReferralRequestModal
            isOpen={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              setSelectedUserId('');
            }}
            onCreateReferral={handleReferralCreation}
            cohortId={cohortId}
            currentUserId={MOCK_CURRENT_USER_ID}
          />
        )}

        {/* Request Referral Modal */}
        {showRequestModal && (
          <RequestReferralModal
            isOpen={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            onCreateRequest={handleReferralRequestCreation}
            cohortId={cohortId}
            currentUserId={MOCK_CURRENT_USER_ID}
          />
        )}
      </div>
    </div>
  );
}
