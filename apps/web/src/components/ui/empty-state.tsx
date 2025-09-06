/**
 * Empty state components for consistent empty state designs
 * Provides reusable empty state patterns across the application
 */

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  /**
   * Icon to display in the empty state
   */
  icon?: ReactNode;
  /**
   * Main title for the empty state
   */
  title: string;
  /**
   * Description text for the empty state
   */
  description: string;
  /**
   * Primary action button
   */
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
  };
  /**
   * Secondary action button
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
  };
  /**
   * Additional content to display
   */
  children?: ReactNode;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to show in a card
   */
  card?: boolean;
}

/**
 * Base empty state component
 * 
 * @param icon - Icon to display
 * @param title - Main title
 * @param description - Description text
 * @param primaryAction - Primary action button
 * @param secondaryAction - Secondary action button
 * @param children - Additional content
 * @param className - Custom className
 * @param size - Size variant
 * @param card - Whether to show in a card
 * @returns EmptyState JSX element
 */
export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
  className,
  size = "md",
  card = true
}: EmptyStateProps) {
  const sizeClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16"
  };

  const iconSizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20"
  };

  const content = (
    <div className={cn("text-center", sizeClasses[size], className)}>
      {icon && (
        <div className={cn(
          "bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4",
          iconSizeClasses[size]
        )}>
          {icon}
        </div>
      )}
      <h3 className={cn(
        "font-semibold text-slate-900 mb-2",
        size === "sm" ? "text-base" : size === "md" ? "text-lg" : "text-xl"
      )}>
        {title}
      </h3>
      <p className={cn(
        "text-slate-500 mb-6 max-w-md mx-auto leading-relaxed",
        size === "sm" ? "text-sm" : "text-base"
      )}>
        {description}
      </p>
      
      {(primaryAction || secondaryAction) && (
        <div className="flex gap-3 justify-center">
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              variant={primaryAction.variant || "default"}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || "outline"}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
      
      {children}
    </div>
  );

  if (card) {
    return (
      <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    );
  }

  return content;
}

/**
 * Empty state for no matches found
 */
export function NoMatchesEmptyState({
  onClearFilters,
  onCompleteProfile,
  className
}: {
  onClearFilters: () => void;
  onCompleteProfile: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Filter className="h-8 w-8 text-slate-400" />}
      title="No matches found"
      description="Try adjusting your filters or complete your profile to get better matches."
      primaryAction={{
        label: "Complete Profile",
        onClick: onCompleteProfile
      }}
      secondaryAction={{
        label: "Clear Filters",
        onClick: onClearFilters,
        variant: "outline"
      }}
      className={className}
    />
  );
}

/**
 * Empty state for no connections
 */
export function NoConnectionsEmptyState({
  onSendRequest,
  className
}: {
  onSendRequest: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8 text-slate-400" />}
      title="No connections yet"
      description="Start building your professional network by sending connection requests to people you'd like to work with."
      primaryAction={{
        label: "Send Connection Request",
        onClick: onSendRequest
      }}
      className={className}
    />
  );
}

/**
 * Empty state for no referrals
 */
export function NoReferralsEmptyState({
  onSendReferral,
  onRequestReferral,
  className
}: {
  onSendReferral: () => void;
  onRequestReferral: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8 text-slate-400" />}
      title="No referrals yet"
      description="Start building your professional network by sending or requesting referrals from your cohort members."
      primaryAction={{
        label: "Send Referral",
        onClick: onSendReferral
      }}
      secondaryAction={{
        label: "Request Referral",
        onClick: onRequestReferral,
        variant: "outline"
      }}
      className={className}
    />
  );
}

/**
 * Empty state for no cohorts
 */
export function NoCohortsEmptyState({
  onCreateCohort,
  onBrowseCohorts,
  className
}: {
  onCreateCohort: () => void;
  onBrowseCohorts: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8 text-slate-400" />}
      title="No cohorts yet"
      description="Create your first cohort or join an existing one to start learning together."
      primaryAction={{
        label: "Create Cohort",
        onClick: onCreateCohort
      }}
      secondaryAction={{
        label: "Browse Public Cohorts",
        onClick: onBrowseCohorts,
        variant: "outline"
      }}
      className={className}
    />
  );
}

/**
 * Empty state for no resources/artifacts
 */
export function NoResourcesEmptyState({
  onAddResource,
  isMember = false,
  className
}: {
  onAddResource: () => void;
  isMember?: boolean;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8 text-slate-400" />}
      title="No resources yet"
      description={
        isMember
          ? "Share your first resource with the cohort to get started. Upload documents, code repositories, videos, and more."
          : "No resources have been shared in this cohort yet. Check back later for shared files and resources."
      }
      primaryAction={
        isMember
          ? {
              label: "Share First Resource",
              onClick: onAddResource
            }
          : undefined
      }
      className={className}
    />
  );
}

/**
 * Empty state for no sessions
 */
export function NoSessionsEmptyState({
  onCreateSession,
  isOwner = false,
  className
}: {
  onCreateSession: () => void;
  isOwner?: boolean;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Calendar className="h-8 w-8 text-slate-400" />}
      title="No sessions scheduled"
      description={
        isOwner
          ? "Create your first session to get started with your cohort."
          : "No sessions have been scheduled for this cohort yet."
      }
      primaryAction={
        isOwner
          ? {
              label: "Create First Session",
              onClick: onCreateSession
            }
          : undefined
      }
      className={className}
    />
  );
}

/**
 * Empty state for search results
 */
export function NoSearchResultsEmptyState({
  onClearSearch,
  searchQuery,
  className
}: {
  onClearSearch: () => void;
  searchQuery: string;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8 text-slate-400" />}
      title="No results found"
      description={`No results found for "${searchQuery}". Try adjusting your search terms or filters.`}
      primaryAction={{
        label: "Clear Search",
        onClick: onClearSearch,
        variant: "outline"
      }}
      className={className}
    />
  );
}

// Import icons
import { 
  Filter, 
  Users, 
  FileText, 
  Calendar, 
  Search 
} from "lucide-react";
