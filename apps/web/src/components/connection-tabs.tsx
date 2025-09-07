/**
 * ConnectionTabs Component
 * Provides tab navigation for different connection types
 * 
 * This component displays tabs for sent, received, and accepted connections
 * with counts and status indicators for easy navigation.
 */

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Connection } from '@/lib/connection-mock-data';
import { cn } from '@/lib/utils';

/**
 * Props interface for ConnectionTabs component
 */
interface ConnectionTabsProps {
  /** Array of sent connections */
  sentConnections: Connection[];
  /** Array of received connections */
  receivedConnections: Connection[];
  /** Array of accepted connections */
  acceptedConnections: Connection[];
  /** Currently active tab */
  activeTab?: string;
  /** Callback when tab changes */
  onTabChange?: (tab: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get tab count with pending indicator
 * Returns the count and whether there are pending items
 * 
 * @param connections - Array of connections
 * @param type - Type of connections (sent/received/accepted)
 * @returns Object with count and pending status
 */
function getTabCount(connections: Connection[], type: string) {
  const count = connections.length;
  const hasPending = type === 'received' && connections.some(c => c.status === 'pending');
  
  return { count, hasPending };
}

/**
 * ConnectionTabs Component
 * Renders tab navigation for connection management
 */
export function ConnectionTabs({
  sentConnections,
  receivedConnections,
  acceptedConnections,
  activeTab = 'accepted',
  onTabChange,
  className
}: ConnectionTabsProps) {
  const sentCount = getTabCount(sentConnections, 'sent');
  const receivedCount = getTabCount(receivedConnections, 'received');
  const acceptedCount = getTabCount(acceptedConnections, 'accepted');
  
  /**
   * Handle tab change
   * Calls the onTabChange callback when tab is switched
   * 
   * @param value - New tab value
   */
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };
  
  return (
    <div className={cn('w-full', className)}>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100">
          {/* Accepted Tab */}
          <TabsTrigger 
            value="accepted" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <span>Accepted</span>
            <Badge 
              variant="secondary" 
              className={cn(
                'text-xs px-2 py-0.5',
                acceptedCount.count > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'
              )}
            >
              {acceptedCount.count}
            </Badge>
          </TabsTrigger>
          
          {/* Sent Tab */}
          <TabsTrigger 
            value="sent" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <span>Sent</span>
            <Badge 
              variant="secondary" 
              className={cn(
                'text-xs px-2 py-0.5',
                sentCount.count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
              )}
            >
              {sentCount.count}
            </Badge>
          </TabsTrigger>
          
          {/* Received Tab */}
          <TabsTrigger 
            value="received" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <span>Received</span>
            <div className="flex items-center space-x-1">
              <Badge 
                variant="secondary" 
                className={cn(
                  'text-xs px-2 py-0.5',
                  receivedCount.count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
                )}
              >
                {receivedCount.count}
              </Badge>
              {receivedCount.hasPending && (
                <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
              )}
            </div>
          </TabsTrigger>
        </TabsList>
        
        {/* Tab Content */}
        <div className="mt-0">
          <TabsContent value="accepted" className="mt-0">
            <div className="space-y-4">
              {acceptedConnections.length > 0 ? (
                acceptedConnections.map((connection) => (
                  <div key={connection.id}>
                    {/* Connection content will be rendered by parent */}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-2">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">No accepted connections</h3>
                  <p className="text-slate-500">You don't have any connections yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sent" className="mt-0">
            <div className="space-y-4">
              {sentConnections.length > 0 ? (
                sentConnections.map((connection) => (
                  <div key={connection.id}>
                    {/* Connection content will be rendered by parent */}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-2">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">No sent requests</h3>
                  <p className="text-slate-500">You haven't sent any connection requests yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="received" className="mt-0">
            <div className="space-y-4">
              {receivedConnections.length > 0 ? (
                receivedConnections.map((connection) => (
                  <div key={connection.id}>
                    {/* Connection content will be rendered by parent */}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-2">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">No received requests</h3>
                  <p className="text-slate-500">You don't have any pending connection requests.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
