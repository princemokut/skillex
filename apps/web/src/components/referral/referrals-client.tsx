"use client";

import { useState, useMemo, useEffect } from 'react';
import { useReferrals } from '@/hooks/use-referrals';
import { ReferralTabs } from '@/components/referral-tabs';
import { ReferralCard } from '@/components/referral-card';
import { UnifiedReferralModal } from '@/components/unified-referral-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListContainer, ListItem } from '@/components/ui/list-container';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  MessageCircle,
  CheckCircle,
  Clock,
  TrendingUp
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
  statusFilter: ReferralStatus | 'all';
  cohortFilter: string | 'all';
}

interface ReferralsClientProps {
  givenReferrals: ReferralWithType[];
  receivedReferrals: ReferralWithType[];
  requests: ReferralWithType[];
  stats: {
    totalReferrals: number;
    acceptedReferrals: number;
    pendingReferrals: number;
    responseRate: number;
  };
  userId: string;
  error?: Error | null;
}

export function ReferralsClient({ 
  givenReferrals, 
  receivedReferrals, 
  requests, 
  stats, 
  userId,
  error 
}: ReferralsClientProps) {
  const [activeTab, setActiveTab] = useState<'given' | 'received' | 'requests'>('received');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    showFilters: false,
    contextTypeFilter: [],
    statusFilter: 'all',
    cohortFilter: 'all',
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    trackPageView('referrals');
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters(prev => ({ ...prev, query: e.target.value }));
  };

  const handleToggleFilters = () => {
    setSearchFilters(prev => ({ ...prev, showFilters: !prev.showFilters }));
  };

  const handleContextTypeFilter = (type: ReferralContextType) => {
    setSearchFilters(prev => ({
      ...prev,
      contextTypeFilter: prev.contextTypeFilter.includes(type)
        ? prev.contextTypeFilter.filter(t => t !== type)
        : [...prev.contextTypeFilter, type],
    }));
  };

  const handleStatusFilter = (status: ReferralStatus | 'all') => {
    setSearchFilters(prev => ({ ...prev, statusFilter: status }));
  };

  const handleCohortFilter = (cohortId: string | 'all') => {
    setSearchFilters(prev => ({ ...prev, cohortFilter: cohortId }));
  };

  const handleClearFilters = () => {
    setSearchFilters(prev => ({
      ...prev,
      query: '',
      contextTypeFilter: [],
      statusFilter: 'all',
      cohortFilter: 'all',
    }));
  };

  const currentTabData = useMemo(() => {
    switch (activeTab) {
      case 'given':
        return givenReferrals;
      case 'received':
        return receivedReferrals;
      case 'requests':
        return requests;
      default:
        return [];
    }
  }, [activeTab, givenReferrals, receivedReferrals, requests]);

  const filteredReferrals = useMemo(() => {
    return currentTabData.filter(referral => {
      const matchesQuery = referral.context.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
                           referral.fromUser.name.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
                           referral.toUser.name.toLowerCase().includes(searchFilters.query.toLowerCase());

      const matchesContextType = searchFilters.contextTypeFilter.length === 0 ||
                                 searchFilters.contextTypeFilter.includes(referral.contextType);

      const matchesStatus = searchFilters.statusFilter === 'all' ||
                            referral.status === searchFilters.statusFilter;

      const matchesCohort = searchFilters.cohortFilter === 'all' ||
                            referral.cohortId === searchFilters.cohortFilter;

      return matchesQuery && matchesContextType && matchesStatus && matchesCohort;
    });
  }, [currentTabData, searchFilters]);

  const handleAdInteraction = (adData: any) => {
    trackAdInteraction('referrals', adData);
  };

  const getContextTypeIcon = (contextType: ReferralContextType) => {
    switch (contextType) {
      case 'job':
        return <Building2 className="h-4 w-4" />;
      case 'project':
        return <Briefcase className="h-4 w-4" />;
      case 'collaboration':
        return <GraduationCap className="h-4 w-4" />;
      case 'mentorship':
        return <Handshake className="h-4 w-4" />;
      case 'freelance':
        return <Zap className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load referrals. Please try again. {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 py-0 sm:py-6 lg:py-8 px-0 sm:px-6 lg:px-8 mt-0 pb-20 md:pb-48">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 px-4 sm:px-0 pt-4 sm:pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Referrals</h1>
              <p className="text-slate-600">
                Manage your professional referrals and requests
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Referral
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <Card className="mb-8 rounded-none sm:rounded-lg">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Total Referrals */}
              <div className="flex items-start space-x-4">
                <Handshake className="h-6 w-6 text-primary-600 mt-1" />
                <div className="flex-1">
                  <p className="text-lg font-bold text-slate-900">{stats.totalReferrals}</p>
                  <p className="text-sm text-slate-500">Total Referrals</p>
                </div>
              </div>

              {/* Accepted Referrals */}
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                <div className="flex-1">
                  <p className="text-lg font-bold text-slate-900">{stats.acceptedReferrals}</p>
                  <p className="text-sm text-slate-500">Accepted</p>
                </div>
              </div>

              {/* Pending Referrals */}
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-yellow-600 mt-1" />
                <div className="flex-1">
                  <p className="text-lg font-bold text-slate-900">{stats.pendingReferrals}</p>
                  <p className="text-sm text-slate-500">Pending</p>
                </div>
              </div>

              {/* Response Rate */}
              <div className="flex items-start space-x-4">
                <TrendingUp className="h-6 w-6 text-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="text-lg font-bold text-slate-900">{stats.responseRate}%</p>
                  <p className="text-sm text-slate-500">Response Rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="mb-8 rounded-none sm:rounded-lg">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 mb-4">
              <Input
                type="text"
                placeholder="Search referrals..."
                value={searchFilters.query}
                onChange={handleSearchChange}
                className="flex-1"
              />
              <Button variant="outline" size="icon" onClick={handleToggleFilters}>
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleClearFilters}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {searchFilters.showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Context Type Filter */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Context Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['job', 'project', 'collaboration', 'mentorship', 'freelance'] as ReferralContextType[]).map(type => (
                      <Button
                        key={type}
                        variant={searchFilters.contextTypeFilter.includes(type) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleContextTypeFilter(type)}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'sent', 'accepted', 'declined', 'draft'] as const).map(status => (
                      <Button
                        key={status}
                        variant={searchFilters.statusFilter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusFilter(status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Cohort Filter (TODO: Populate with actual cohorts) */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Cohort
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={searchFilters.cohortFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleCohortFilter('all')}
                    >
                      All
                    </Button>
                    {/* Mock cohorts */}
                    {[{ id: 'cohort-1', title: 'React Mastery' }, { id: 'cohort-2', title: 'Data Science' }].map(cohort => (
                      <Button
                        key={cohort.id}
                        variant={searchFilters.cohortFilter === cohort.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleCohortFilter(cohort.id)}
                      >
                        {cohort.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Referrals Tabs */}
        <ReferralTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={{
            sent: {
              total: givenReferrals.length,
              draft: givenReferrals.filter(r => r.status === 'draft').length,
              sent: givenReferrals.filter(r => r.status === 'sent').length,
              accepted: givenReferrals.filter(r => r.status === 'accepted').length,
              declined: givenReferrals.filter(r => r.status === 'declined').length,
            },
            received: {
              total: receivedReferrals.length,
              pending: receivedReferrals.filter(r => r.status === 'sent').length,
              accepted: receivedReferrals.filter(r => r.status === 'accepted').length,
              declined: receivedReferrals.filter(r => r.status === 'declined').length,
            },
            requests: {
              total: requests.length,
              pending: requests.filter(r => r.status === 'sent').length,
              accepted: requests.filter(r => r.status === 'accepted').length,
              declined: requests.filter(r => r.status === 'declined').length,
            }
          }}
        />

        {/* Referrals List */}
        <div className="space-y-6">
          {filteredReferrals.length > 0 ? (
            <ListContainer>
              {filteredReferrals.map((referral) => (
                <ListItem key={referral.id}>
                  <ReferralCard
                    referral={referral}
                    isCurrentUser={true}
                    activeTab={activeTab}
                    onStatusChange={(referralId, status) => {
                      // TODO: Implement status update
                      console.log('Update referral status:', referralId, status);
                    }}
                  />
                </ListItem>
              ))}
            </ListContainer>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-slate-500">
                No referrals found matching your criteria.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ad Slot */}
        <div className="mt-8">
          <AdSlotContainer>
            <AdSlot
              slotId="referrals-leaderboard"
              size="leaderboard"
              context="referrals"
              onAdInteraction={handleAdInteraction}
            />
          </AdSlotContainer>
        </div>
      </div>

      {/* Create Referral Modal */}
      <UnifiedReferralModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        cohortId="cohort-1" // TODO: Get from context or props
        currentUserId={userId}
        onCreateReferral={(referralData) => {
          // TODO: Implement referral creation
          console.log('Create referral:', referralData);
          setShowCreateModal(false);
        }}
        onCreateRequest={(requestData) => {
          // TODO: Implement request creation
          console.log('Create request:', requestData);
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}
