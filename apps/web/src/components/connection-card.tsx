/**
 * ConnectionCard Component
 * Displays a user's connection information with actions
 * 
 * This component shows user profile details, connection status,
 * and provides appropriate actions based on the connection state.
 */

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  MapPin, 
  Calendar,
  MessageCircle,
  Trash2,
  X
} from 'lucide-react';
import { Connection, UserProfile } from '@/lib/connection-mock-data';
import { cn } from '@/lib/utils';

/**
 * Props interface for ConnectionCard component
 */
interface ConnectionCardProps {
  /** Connection data to display */
  connection: Connection;
  /** Whether this is the current user's connection (for sent/received) */
  isCurrentUser: boolean;
  /** Callback when connection status changes */
  onStatusChange?: (connectionId: string, newStatus: string) => void;
  /** Callback when connection is removed */
  onRemove?: (connectionId: string) => void;
  /** Callback when profile is clicked */
  onViewProfile?: (connectionId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get skill level color class
 * Returns appropriate color styling based on skill level
 * 
 * @param level - Skill level to get color for
 * @returns CSS class string for skill level color
 */
function getSkillLevelColor(level: string): string {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'advanced':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'expert':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Get connection status display info
 * Returns display text and styling for connection status
 * 
 * @param status - Connection status
 * @param isCurrentUser - Whether this is the current user's connection
 * @returns Object with display text and styling
 */
function getConnectionStatusInfo(status: string, isCurrentUser: boolean) {
  switch (status) {
    case 'pending':
      return {
        text: isCurrentUser ? 'Request Sent' : 'Pending Request',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock
      };
    case 'accepted':
      return {
        text: 'Connected',
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: UserCheck
      };
    case 'blocked':
      return {
        text: 'Blocked',
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: UserX
      };
    default:
      return {
        text: 'Unknown',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: Clock
      };
  }
}

/**
 * Format relative time
 * Converts ISO date string to human-readable relative time
 * 
 * @param dateString - ISO date string
 * @returns Formatted relative time string
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 168) { // 7 days
    const days = Math.floor(diffInHours / 24);
    return `${days}d ago`;
  } else {
    const weeks = Math.floor(diffInHours / 168);
    return `${weeks}w ago`;
  }
}

/**
 * ConnectionCard Component
 * Renders a connection card with user info and actions
 */
export function ConnectionCard({ 
  connection, 
  isCurrentUser, 
  onStatusChange, 
  onRemove, 
  onViewProfile,
  className 
}: ConnectionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  // Determine which user to display (not the current user)
  const displayUser: UserProfile = isCurrentUser ? connection.addressee : connection.requester;
  const statusInfo = getConnectionStatusInfo(connection.status, isCurrentUser);
  const StatusIcon = statusInfo.icon;
  
  /**
   * Handle connection action
   * Processes connection status changes with loading state
   * 
   * @param action - Action to perform
   */
  const handleAction = async (action: string) => {
    setIsLoading(true);
    try {
      if (action === 'remove' && onRemove) {
        onRemove(connection.id);
      } else if (onStatusChange) {
        onStatusChange(connection.id, action);
      }
    } catch (error) {
      console.error('Error handling connection action:', error);
    } finally {
      setIsLoading(false);
      setShowActions(false);
    }
  };
  
  /**
   * Get primary skills to display
   * Returns up to 1 skill for display in the card
   * 
   * @param skills - Array of user skills
   * @returns Array of skills to display
   */
  const getPrimarySkills = (skills: any[]) => {
    return skills.slice(0, 1);
  };
  
  return (
    <div 
      className={cn('w-full transition-all duration-200 hover:bg-slate-50 cursor-pointer', className)}
      onClick={() => onViewProfile?.(connection.id)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          {/* User Info Section */}
          <div className="flex items-start space-x-4 flex-1">
            {/* Avatar */}
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={displayUser.avatarUrl} 
                alt={`${displayUser.fullName}'s avatar`}
              />
              <AvatarFallback className="text-lg font-semibold">
                {displayUser.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            {/* User Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-slate-900 truncate">
                  {displayUser.fullName}
                </h3>
                {connection.status === 'accepted' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement message functionality
                      console.log('Message user:', displayUser.handle);
                    }}
                    className="h-6 w-6 p-0 text-slate-500 hover:text-slate-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <p className="text-sm text-slate-600 mb-3 truncate">
                {displayUser.title}
              </p>
              
              {/* Skills Preview */}
              <div className="flex flex-wrap gap-1 mb-3">
                {getPrimarySkills(displayUser.skills).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={cn(
                      'text-xs px-2 py-1',
                      getSkillLevelColor(skill.level)
                    )}
                  >
                    {skill.name}
                  </Badge>
                ))}
                {displayUser.skills.length > 1 && (
                  <Badge variant="outline" className="text-xs px-2 py-1 text-slate-500">
                    +{displayUser.skills.length - 1} more
                  </Badge>
                )}
              </div>
              
              {/* Bio Preview */}
              <p className="text-sm text-slate-600 line-clamp-2">
                {displayUser.bio}
              </p>
            </div>
          </div>
          
          {/* Actions Section */}
          <div className="flex flex-col items-end space-y-2">
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {connection.status === 'pending' && !isCurrentUser && (
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('accepted');
                    }}
                    disabled={isLoading}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    title="Accept connection"
                  >
                    <UserCheck className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('blocked');
                    }}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Decline connection"
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {connection.status === 'accepted' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('remove');
                  }}
                  disabled={isLoading}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              
              {connection.status === 'pending' && isCurrentUser && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('remove');
                  }}
                  disabled={isLoading}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
