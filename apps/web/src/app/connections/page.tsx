/**
 * Connections Page
 * Main page for managing user connections
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useConnections } from '@/hooks/use-connections';
import { ConnectionTabs } from '@/components/connection-tabs';
import { ConnectionCard } from '@/components/connection-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Users, 
  UserPlus, 
  UserCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Connection } from '@/lib/connection-mock-data';
import { AdSlot, AdSlotContainer } from '@/components/AdSlot';
import { getAdTargeting } from '@/lib/ad-context';
import { trackPageView, trackAdInteraction } from '@/lib/analytics';
import { NoConnectionsEmptyState } from '@/components/ui/empty-state';
import { ConnectionCardSkeleton } from '@/components/ui/skeleton';
import { AnimationWrapper, StaggerWrapper } from '@/components/ui/animations';
import { ResponsiveCard } from '@/components/ui/responsive-card';
import { useIsMobile, useIsTablet } from '@/lib/responsive';

/**
 * Search and filter state interface
 */
interface SearchFilters {
  query: string;
  showFilters: boolean;
  skillFilter: string[];
  locationFilter: string;
  statusFilter: string[];
}

export default function ConnectionsPage() {
  const {
    connectionsData,
    currentTabData,
    activeTab,
    isLoading,
    error,
    setActiveTab,
    handleStatusChange,
    handleRemove,
    refetch
  } = useConnections();
  
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    showFilters: false,
    skillFilter: [],
    locationFilter: '',
    statusFilter: []
  });
  
  /**
   * Filter connections based on search criteria
   */
  const filterConnections = (connections: Connection[]): Connection[] => {
    return connections.filter((connection) => {
      const displayUser = activeTab === 'sent' ? connection.addressee : connection.requester;
      
      if (searchFilters.query) {
        const query = searchFilters.query.toLowerCase();
        const matchesName = displayUser.fullName.toLowerCase().includes(query);
        const matchesHandle = displayUser.handle.toLowerCase().includes(query);
        const matchesTitle = displayUser.title.toLowerCase().includes(query);
        const matchesBio = displayUser.bio.toLowerCase().includes(query);
        const matchesSkills = displayUser.skills.some(skill => 
          skill.name.toLowerCase().includes(query)
        );
        
        if (!matchesName && !matchesHandle && !matchesTitle && !matchesBio && !matchesSkills) {
          return false;
        }
      }
      
      if (searchFilters.skillFilter.length > 0) {
        const hasMatchingSkill = searchFilters.skillFilter.some(filterSkill =>
          displayUser.skills.some(skill => 
            skill.name.toLowerCase().includes(filterSkill.toLowerCase())
          )
        );
        if (!hasMatchingSkill) return false;
      }
      
      if (searchFilters.locationFilter) {
        const location = searchFilters.locationFilter.toLowerCase();
        const matchesCity = displayUser.locationCity?.toLowerCase().includes(location);
        const matchesCountry = displayUser.locationCountry?.toLowerCase().includes(location);
        if (!matchesCity && !matchesCountry) return false;
      }
      
      if (searchFilters.statusFilter.length > 0) {
        if (!searchFilters.statusFilter.includes(connection.status)) return false;
      }
      
      return true;
    });
  };
  
  const filteredConnections = useMemo(() => {
    return filterConnections(currentTabData);
  }, [currentTabData, searchFilters, activeTab]);
  
  const handleSearchChange = (value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      query: value
    }));
  };
  
  const toggleFilters = () => {
    setSearchFilters(prev => ({
      ...prev,
      showFilters: !prev.showFilters
    }));
  };
  
  const clearFilters = () => {
    setSearchFilters({
      query: '',
      showFilters: false,
      skillFilter: [],
      locationFilter: '',
      statusFilter: []
    });
  };
  
  const getConnectionStats = () => {
    if (!connectionsData) return { total: 0, pending: 0, accepted: 0 };
    
    const total = connectionsData.sent.length + connectionsData.received.length + connectionsData.accepted.length;
    const pending = connectionsData.sent.filter(c => c.status === 'pending').length + 
                   connectionsData.received.filter(c => c.status === 'pending').length;
    const accepted = connectionsData.accepted.length;
    
    return { total, pending, accepted };
  };
  
  const stats = getConnectionStats();
  
  // Track page view and analytics
  useEffect(() => {
    trackPageView('connections', {
      total_connections: stats.total,
      pending_connections: stats.pending,
      accepted_connections: stats.accepted,
      active_tab: activeTab
    });
  }, [stats, activeTab]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AnimationWrapper animation="fadeIn">
            <div className="space-y-6">
              <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ConnectionCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </AnimationWrapper>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AnimationWrapper animation="fadeIn">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Error Loading Connections
                </h3>
                <p className="text-red-700 mb-4">
                  We couldn't load your connections. Please try again.
                </p>
                <Button 
                  onClick={() => refetch()} 
                  variant="outline" 
                  className="border-red-300 text-red-700 hover:scale-105 transition-transform duration-200"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </AnimationWrapper>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Connections
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Manage your professional connections and network
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Accepted</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.accepted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search connections by name, skills, or location..."
                  value={searchFilters.query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={toggleFilters}
                  className={searchFilters.showFilters ? 'bg-slate-100' : ''}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                {searchFilters.query && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Connections Tabs */}
        <ConnectionTabs
          sentConnections={connectionsData?.sent || []}
          receivedConnections={connectionsData?.received || []}
          acceptedConnections={connectionsData?.accepted || []}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Connections List */}
        <div className="space-y-4">
          {filteredConnections.length > 0 ? (
            <StaggerWrapper staggerDelay={100}>
              {filteredConnections.map((connection) => (
                <AnimationWrapper
                  key={connection.id}
                  hover="hoverScale"
                  transition="standard"
                >
                  <ConnectionCard
                    connection={connection}
                    isCurrentUser={activeTab === 'sent'}
                    onStatusChange={handleStatusChange}
                    onRemove={handleRemove}
                  />
                </AnimationWrapper>
              ))}
            </StaggerWrapper>
          ) : (
            <AnimationWrapper animation="fadeIn">
              <NoConnectionsEmptyState
                onSendRequest={() => {
                  // TODO: Implement send connection request
                  console.log('Send connection request');
                }}
              />
            </AnimationWrapper>
          )}
        </div>
          </div>
          
          {/* Right Sidebar with Ads */}
          <div className="lg:col-span-1">
            <AdSlotContainer>
              <AdSlot
                slotId="connections-sidebar-1"
                size="sidebar"
                context="connections"
                targeting={getAdTargeting({
                  skills: [],
                  location: '',
                  timezone: '',
                  cohortTopics: [],
                  referralActivity: 'low',
                  connectionActivity: 'active',
                  adCategories: ['services', 'events'],
                  adFrequency: 'medium',
                  adInteractions: []
                }, 'connections')}
                onAdInteraction={(action: 'viewed' | 'clicked' | 'closed') => trackAdInteraction('connections-sidebar-1', action)}
              />
              
              <AdSlot
                slotId="connections-sidebar-2"
                size="sidebar"
                context="connections"
                targeting={getAdTargeting({
                  skills: [],
                  location: '',
                  timezone: '',
                  cohortTopics: [],
                  referralActivity: 'low',
                  connectionActivity: 'active',
                  adCategories: ['services', 'events'],
                  adFrequency: 'medium',
                  adInteractions: []
                }, 'connections')}
                onAdInteraction={(action: 'viewed' | 'clicked' | 'closed') => trackAdInteraction('connections-sidebar-2', action)}
              />
            </AdSlotContainer>
          </div>
        </div>
      </div>
    </div>
  );
}