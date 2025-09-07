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
  Inbox
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props interface for ReferralTabs component
 */
interface ReferralTabsProps {
  /** Currently active tab */
  activeTab: 'sent' | 'received';
  /** Callback when tab changes */
  onTabChange: (tab: 'sent' | 'received') => void;
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
    onTabChange(value as 'sent' | 'received');
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
