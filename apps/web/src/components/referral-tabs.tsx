/**
 * ReferralTabs Component
 * Tab navigation for sent/received referrals with cohort filtering
 * 
 * This component provides tab-based navigation for managing referrals
 * with status filtering and cohort-based organization.
 */

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Send, 
  Inbox, 
  Clock, 
  CheckCircle, 
  XCircle,
  Filter,
  Users,
  Calendar
} from 'lucide-react';
import { ReferralStatus } from '@skillex/types';
import { cn } from '@/lib/utils';

/**
 * Props interface for ReferralTabs component
 */
interface ReferralTabsProps {
  /** Currently active tab */
  activeTab: 'sent' | 'received';
  /** Callback when tab changes */
  onTabChange: (tab: 'sent' | 'received') => void;
  /** Currently selected status filter */
  statusFilter: ReferralStatus | 'all';
  /** Callback when status filter changes */
  onStatusFilterChange: (status: ReferralStatus | 'all') => void;
  /** Currently selected cohort filter */
  cohortFilter: string | 'all';
  /** Callback when cohort filter changes */
  onCohortFilterChange: (cohortId: string | 'all') => void;
  /** Available cohorts for filtering */
  cohorts: Array<{ id: string; title: string; sessionCompletionPercentage: number }>;
  /** Referral statistics */
  stats: {
    sent: {
      total: number;
      draft: number;
      sent: number;
      accepted: number;
      declined: number;
    };
    received: {
      total: number;
      pending: number;
      accepted: number;
      declined: number;
    };
  };
  /** Whether to show cohort filtering */
  showCohortFilter?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Status filter options
 */
const statusFilterOptions: Array<{ value: ReferralStatus | 'all'; label: string; icon: any; count?: number }> = [
  { value: 'all', label: 'All', icon: null },
  { value: 'draft', label: 'Draft', icon: Clock },
  { value: 'sent', label: 'Sent', icon: Send },
  { value: 'accepted', label: 'Accepted', icon: CheckCircle },
  { value: 'declined', label: 'Declined', icon: XCircle },
];

/**
 * Get status count for a specific status
 * Returns the count for the given status in the stats object
 * 
 * @param stats - Statistics object
 * @param status - Status to get count for
 * @param isSent - Whether to look in sent or received stats
 * @returns Count for the status
 */
function getStatusCount(
  stats: ReferralTabsProps['stats'], 
  status: ReferralStatus | 'all', 
  isSent: boolean
): number {
  if (status === 'all') {
    return isSent ? stats.sent.total : stats.received.total;
  }

  if (isSent) {
    switch (status) {
      case 'draft':
        return stats.sent.draft;
      case 'sent':
        return stats.sent.sent;
      case 'accepted':
        return stats.sent.accepted;
      case 'declined':
        return stats.sent.declined;
      default:
        return 0;
    }
  } else {
    switch (status) {
      case 'sent':
        return stats.received.pending;
      case 'accepted':
        return stats.received.accepted;
      case 'declined':
        return stats.received.declined;
      default:
        return 0;
    }
  }
}

/**
 * ReferralTabs component for tab-based referral navigation
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function ReferralTabs({
  activeTab,
  onTabChange,
  statusFilter,
  onStatusFilterChange,
  cohortFilter,
  onCohortFilterChange,
  cohorts,
  stats,
  showCohortFilter = true,
  className
}: ReferralTabsProps) {
  /**
   * Handle tab change
   * Updates active tab and resets status filter
   * 
   * @param tab - New active tab
   */
  const handleTabChange = (tab: 'sent' | 'received') => {
    onTabChange(tab);
    // Reset status filter when switching tabs
    onStatusFilterChange('all');
  };

  return (
    <div className={cn('w-full', className)}>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sent" className="flex items-center space-x-2">
            <Send className="h-4 w-4" />
            <span>Sent</span>
            <Badge variant="secondary" className="ml-1">
              {stats.sent.total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="received" className="flex items-center space-x-2">
            <Inbox className="h-4 w-4" />
            <span>Received</span>
            <Badge variant="secondary" className="ml-1">
              {stats.received.total}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Status filter */}
        <div className="flex items-center space-x-2 mt-4">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Filter by status:</span>
          <div className="flex items-center space-x-1">
            {statusFilterOptions.map((option) => {
              const Icon = option.icon;
              const count = getStatusCount(stats, option.value, activeTab === 'sent');
              
              return (
                <Button
                  key={option.value}
                  variant={statusFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onStatusFilterChange(option.value)}
                  className="flex items-center space-x-1"
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  <span>{option.label}</span>
                  {count > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Cohort filter */}
        {showCohortFilter && cohorts.length > 0 && (
          <div className="flex items-center space-x-2 mt-3">
            <Users className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filter by cohort:</span>
            <div className="flex items-center space-x-1">
              <Button
                variant={cohortFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCohortFilterChange('all')}
              >
                All Cohorts
              </Button>
              {cohorts.map((cohort) => (
                <Button
                  key={cohort.id}
                  variant={cohortFilter === cohort.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onCohortFilterChange(cohort.id)}
                  className="flex items-center space-x-1"
                >
                  <span>{cohort.title}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {cohort.sessionCompletionPercentage}%
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Tab content placeholders */}
        <TabsContent value="sent" className="mt-6">
          {/* Sent referrals content will be rendered here */}
        </TabsContent>
        <TabsContent value="received" className="mt-6">
          {/* Received referrals content will be rendered here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
