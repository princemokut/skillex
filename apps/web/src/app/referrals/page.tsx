/**
 * Referrals Page
 * Main page for managing user referrals with cohort filtering
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useReferrals } from '@/hooks/use-referrals';
import { ReferralTabs } from '@/components/referral-tabs';
import { ReferralCard } from '@/components/referral-card';
import { ReferralRequestModal } from '@/components/referral-request-modal';
import { RequestReferralModal } from '@/components/request-referral-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Plus, 
  AlertCircle,
  Building2,
  Briefcase,
  Handshake,
  GraduationCap,
  Zap,
  MessageCircle
} from 'lucide-react';
import { ReferralWithType, ReferralContextType, ReferralRequestType } from '@/lib/referral-mock-data';
import { ReferralStatus } from '@skillex/types';
import { AdSlot, AdSlotContainer } from '@/components/AdSlot';
import { getAdTargeting } from '@/lib/ad-context';
import { trackPageView, trackAdInteraction } from '@/lib/analytics';

/**
 * Search and filter state interface
 */
interface SearchFilters {
  query: string;
  showFilters: boolean;
  contextTypeFilter: ReferralContextType[];
  urgencyFilter: string[];
}

/**
 * Mock current user ID for development
 * In production, this would come from authentication context
 */
const MOCK_CURRENT_USER_ID = 'user-1';

export default function ReferralsPage() {
  const {
    referrals,
    allReferrals,
    sentReferrals,
    receivedReferrals,
    stats,
    availableCohorts,
    isLoading,
    error,
    activeTab,
    statusFilter,
    cohortFilter,
    handleTabChange,
    handleStatusFilterChange,
    handleCohortFilterChange,
    handleCreateReferral,
    handleUpdateReferralStatus,
    handleDeleteReferral,
    refetch
  } = useReferrals(MOCK_CURRENT_USER_ID);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    showFilters: false,
    contextTypeFilter: [],
    urgencyFilter: []
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedCohortId, setSelectedCohortId] = useState<string>('');

  /**
   * Get filtered referrals based on search and filters
   * Returns referrals filtered by search query and context type
   */
  const getFilteredReferrals = (): ReferralWithType[] => {
    let filtered = referrals;

    // Filter by search query
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(referral => 
        referral.context.toLowerCase().includes(query) ||
        referral.fromUser.name.toLowerCase().includes(query) ||
        referral.toUser.name.toLowerCase().includes(query) ||
        (referral.companyName && referral.companyName.toLowerCase().includes(query)) ||
        (referral.projectTitle && referral.projectTitle.toLowerCase().includes(query))
      );
    }

    // Filter by context type
    if (searchFilters.contextTypeFilter.length > 0) {
      filtered = filtered.filter(referral => 
        searchFilters.contextTypeFilter.includes(referral.contextType)
      );
    }

    // Filter by urgency
    if (searchFilters.urgencyFilter.length > 0) {
      filtered = filtered.filter(referral => 
        searchFilters.urgencyFilter.includes(referral.urgency)
      );
    }

    return filtered;
  };

  /**
   * Get context type icon
   * Returns appropriate icon component for context type
   * 
   * @param contextType - Context type to get icon for
   * @returns Icon component
   */
  const getContextTypeIcon = (contextType: ReferralContextType) => {
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
  };

  /**
   * Get context type display name
   * Returns human-readable name for context type
   * 
   * @param contextType - Context type to get display name for
   * @returns Display name
   */
  const getContextTypeDisplayName = (contextType: ReferralContextType): string => {
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
  };

  /**
   * Handle create referral
   * Opens create modal with selected cohort
   * 
   * @param cohortId - Cohort ID to create referral for
   */
  const handleCreateReferralClick = (cohortId: string) => {
    setSelectedCohortId(cohortId);
    setShowCreateModal(true);
  };

  /**
   * Handle request referral
   * Opens request modal with selected cohort
   * 
   * @param cohortId - Cohort ID to request referral for
   */
  const handleRequestReferralClick = (cohortId: string) => {
    setSelectedCohortId(cohortId);
    setShowRequestModal(true);
  };

  /**
   * Handle referral creation
   * Creates referral and closes modal
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
      await handleCreateReferral({
        ...referralData,
        cohortId: selectedCohortId
      });
      setShowCreateModal(false);
      setSelectedCohortId('');
    } catch (error) {
      console.error('Error creating referral:', error);
    }
  };

  /**
   * Handle referral request creation
   * Creates referral request and closes modal
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
      setSelectedCohortId('');
    } catch (error) {
      console.error('Error creating referral request:', error);
    }
  };

  const filteredReferrals = getFilteredReferrals();

  // Track page view and analytics
  useEffect(() => {
    trackPageView('referrals', {
      active_tab: activeTab
    });
  }, [activeTab]);

  return (
    // <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 mt-0 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="">
            <div className="space-y-4">
              {/* Description and Refresh Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-base text-slate-600">
                  Manage your professional referrals and recommendations
                </p>
                <Button 
                  onClick={() => refetch()} 
                  variant="outline" 
                  size="sm" 
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search referrals..."
                    value={searchFilters.query}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, query: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSearchFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))}
                    className={searchFilters.showFilters ? 'bg-slate-100' : ''}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  {searchFilters.query && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchFilters(prev => ({ ...prev, query: '' }))}
                    >
                      Clear
                    </Button>
                  )}
                  {availableCohorts.length > 0 && (
                    <>
                      <Button
                        onClick={() => handleCreateReferralClick(availableCohorts[0].id)}
                        className="flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Send Referral</span>
                        <span className="sm:hidden">Send</span>
                      </Button>
                      <Button
                        onClick={() => handleRequestReferralClick(availableCohorts[0].id)}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Request Referral</span>
                        <span className="sm:hidden">Request</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {searchFilters.showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Context Type Filter */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Referral Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['job', 'project', 'collaboration', 'mentorship', 'freelance'] as ReferralContextType[]).map((type) => {
                        const Icon = getContextTypeIcon(type);
                        return (
                          <Button
                            key={type}
                            variant={searchFilters.contextTypeFilter.includes(type) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              setSearchFilters(prev => ({
                                ...prev,
                                contextTypeFilter: prev.contextTypeFilter.includes(type)
                                  ? prev.contextTypeFilter.filter(t => t !== type)
                                  : [...prev.contextTypeFilter, type]
                              }));
                            }}
                            className="flex items-center space-x-1"
                          >
                            <Icon className="h-3 w-3" />
                            <span>{getContextTypeDisplayName(type)}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Urgency Filter */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Priority Level
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['low', 'medium', 'high'] as const).map((urgency) => (
                        <Button
                          key={urgency}
                          variant={searchFilters.urgencyFilter.includes(urgency) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSearchFilters(prev => ({
                              ...prev,
                              urgencyFilter: prev.urgencyFilter.includes(urgency)
                                ? prev.urgencyFilter.filter(u => u !== urgency)
                                : [...prev.urgencyFilter, urgency]
                            }));
                          }}
                        >
                          {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Referral Tabs */}
        <ReferralTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          cohortFilter={cohortFilter}
          onCohortFilterChange={handleCohortFilterChange}
          cohorts={availableCohorts}
          stats={stats}
          showCohortFilter={true}
        />

        {/* Referrals List */}
        <div className="mt-6">
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
                <Handshake className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No Referrals Found
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchFilters.query || searchFilters.contextTypeFilter.length > 0 || searchFilters.urgencyFilter.length > 0
                    ? 'No referrals match your current filters.'
                    : activeTab === 'sent'
                    ? 'You haven\'t sent any referrals yet.'
                    : 'You haven\'t received any referrals yet.'
                  }
                </p>
                {availableCohorts.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <Button onClick={() => handleCreateReferralClick(availableCohorts[0].id)}>
                      Send Your First Referral
                    </Button>
                    <Button 
                      onClick={() => handleRequestReferralClick(availableCohorts[0].id)}
                      variant="outline"
                    >
                      Request Your First Referral
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* In-content Ad after first 2 referrals */}
              {filteredReferrals.length > 2 && (
                <div className="flex justify-center">
                  <AdSlot
                    slotId="referrals-in-content-1"
                    size="in-content"
                    context="referrals"
                    targeting={getAdTargeting({
                      skills: ['React', 'TypeScript', 'JavaScript'],
                      location: 'San Francisco',
                      timezone: 'America/Los_Angeles',
                      cohortTopics: ['React & TypeScript Mastery'],
                      referralActivity: 'active',
                      connectionActivity: 'moderate',
                      adCategories: ['jobs', 'services'],
                      adFrequency: 'medium',
                      adInteractions: []
                    }, 'referrals')}
                    onAdInteraction={(action: 'viewed' | 'clicked' | 'closed') => trackAdInteraction('referrals-in-content-1', action)}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredReferrals.map((referral) => (
                  <ReferralCard
                    key={referral.id}
                    referral={referral}
                    isCurrentUser={activeTab === 'sent'}
                    onStatusChange={handleUpdateReferralStatus}
                    onDelete={handleDeleteReferral}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
          </div>
          
          {/* Right Sidebar with Ads */}
          <div className="lg:col-span-1">
            <AdSlotContainer>
              <AdSlot
                slotId="referrals-sidebar-1"
                size="sidebar"
                context="referrals"
                targeting={getAdTargeting({
                  skills: ['React', 'TypeScript', 'JavaScript'],
                  location: 'San Francisco',
                  timezone: 'America/Los_Angeles',
                  cohortTopics: ['React & TypeScript Mastery'],
                  referralActivity: 'active',
                  connectionActivity: 'moderate',
                  adCategories: ['jobs', 'services'],
                  adFrequency: 'medium',
                  adInteractions: []
                }, 'referrals')}
                onAdInteraction={(action: 'viewed' | 'clicked' | 'closed') => trackAdInteraction('referrals-sidebar-1', action)}
              />
              
              <AdSlot
                slotId="referrals-sidebar-2"
                size="sidebar"
                context="referrals"
                targeting={getAdTargeting({
                  skills: ['React', 'TypeScript', 'JavaScript'],
                  location: 'San Francisco',
                  timezone: 'America/Los_Angeles',
                  cohortTopics: ['React & TypeScript Mastery'],
                  referralActivity: 'active',
                  connectionActivity: 'moderate',
                  adCategories: ['jobs', 'services'],
                  adFrequency: 'medium',
                  adInteractions: []
                }, 'referrals')}
                onAdInteraction={(action: 'viewed' | 'clicked' | 'closed') => trackAdInteraction('referrals-sidebar-2', action)}
              />
            </AdSlotContainer>
          </div>
        </div>

        {/* Create Referral Modal */}
        {showCreateModal && selectedCohortId && (
          <ReferralRequestModal
            isOpen={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              setSelectedCohortId('');
            }}
            onCreateReferral={handleReferralCreation}
            cohortId={selectedCohortId}
            currentUserId={MOCK_CURRENT_USER_ID}
          />
        )}

        {/* Request Referral Modal */}
        {showRequestModal && selectedCohortId && (
          <RequestReferralModal
            isOpen={showRequestModal}
            onClose={() => {
              setShowRequestModal(false);
              setSelectedCohortId('');
            }}
            onCreateRequest={handleReferralRequestCreation}
            cohortId={selectedCohortId}
            currentUserId={MOCK_CURRENT_USER_ID}
          />
        )}
      </div>
    </div>
  );
}
