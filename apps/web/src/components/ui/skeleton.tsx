/**
 * Skeleton component for loading states
 * Provides consistent loading placeholders across the application
 */

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the skeleton should animate
   */
  animate?: boolean;
  /**
   * Skeleton variant for different use cases
   */
  variant?: "default" | "text" | "circular" | "rectangular";
}

/**
 * Skeleton component for loading placeholders
 * 
 * @param className - Additional CSS classes
 * @param animate - Whether to show animation (default: true)
 * @param variant - Skeleton variant (default: "default")
 * @returns Skeleton JSX element
 */
export function Skeleton({ 
  className, 
  animate = true, 
  variant = "default",
  ...props 
}: SkeletonProps) {
  const baseClasses = "bg-slate-200";
  
  const variantClasses = {
    default: "rounded-md",
    text: "rounded-sm",
    circular: "rounded-full",
    rectangular: "rounded-none"
  };
  
  const animationClasses = animate ? "animate-pulse" : "";
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses,
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton for card components
 */
export function CardSkeleton({ className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("border border-slate-200 rounded-lg p-6", className)} {...props}>
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton for user profile cards
 */
export function ProfileCardSkeleton({ className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("border border-slate-200 rounded-lg p-6", className)} {...props}>
      <div className="flex items-start space-x-4">
        <Skeleton variant="circular" className="h-12 w-12" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for match cards
 */
export function MatchCardSkeleton({ className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("border border-slate-200 rounded-lg p-6 h-64", className)} {...props}>
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <Skeleton variant="circular" className="h-12 w-12" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for connection cards
 */
export function ConnectionCardSkeleton({ className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("border border-slate-200 rounded-lg p-6", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton variant="circular" className="h-12 w-12" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for referral cards
 */
export function ReferralCardSkeleton({ className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("border border-slate-200 rounded-lg p-6", className)} {...props}>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Skeleton variant="circular" className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-24" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for list items
 */
export function ListItemSkeleton({ className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("flex items-center space-x-4 py-3", className)} {...props}>
      <Skeleton variant="circular" className="h-8 w-8" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  );
}

/**
 * Skeleton for table rows
 */
export function TableRowSkeleton({ 
  columns = 3, 
  className, 
  ...props 
}: Omit<SkeletonProps, 'variant'> & { columns?: number }) {
  return (
    <tr className={cn("border-b border-slate-200", className)} {...props}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Skeleton for form fields
 */
export function FormFieldSkeleton({ className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

/**
 * Skeleton for page headers
 */
export function PageHeaderSkeleton({ className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}