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
import { 
  Send, 
  Inbox,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props interface for ReferralTabs component
 */
interface ReferralTabsProps {
  /** Currently active tab */
  activeTab: 'given' | 'received' | 'requests';
  /** Callback when tab changes */
  onTabChange: (tab: 'given' | 'received' | 'requests') => void;
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
    requests: {
      total: number;
      pending: number;
      accepted: number;
      declined: number;
    };
  };
  /** Additional CSS classes */
  className?: string;
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
  stats,
  className
}: ReferralTabsProps) {
  /**
   * Handle tab change with proper type casting
   * 
   * @param value - Tab value from Tabs component
   */
  const handleTabChange = (value: string) => {
    onTabChange(value as 'given' | 'received' | 'requests');
  };

  return (
    <div className={cn('w-full', className)}>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="received" className="flex items-center space-x-2">
            <Inbox className="h-4 w-4" />
            <span>Referrals Received</span>
            <Badge variant="secondary" className="ml-1">
              {stats.received.total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="given" className="flex items-center space-x-2">
            <Send className="h-4 w-4" />
            <span>Referrals Given</span>
            <Badge variant="secondary" className="ml-1">
              {stats.sent.total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Requests</span>
            <Badge variant="secondary" className="ml-1">
              {stats.requests.total}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Tab content placeholders */}
        <TabsContent value="received" className="mt-6">
          {/* Received referrals content will be rendered here */}
        </TabsContent>
        <TabsContent value="given" className="mt-6">
          {/* Given referrals content will be rendered here */}
        </TabsContent>
        <TabsContent value="requests" className="mt-6">
          {/* Requests content will be rendered here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
