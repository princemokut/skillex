/**
 * ListContainer Component
 * Reusable container for displaying lists with consistent styling
 * 
 * This component provides a uniform approach for displaying lists
 * across the application, ensuring consistent padding, borders, and dividers.
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props interface for ListContainer component
 */
interface ListContainerProps {
  /** Child components to render inside the container */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show dividers between items */
  showDividers?: boolean;
  /** Custom divider margin (default: ml-6) */
  dividerMargin?: string;
}

/**
 * ListContainer Component
 * Renders a consistent list container with optional dividers
 * 
 * @param children - Child components to render
 * @param className - Additional CSS classes
 * @param showDividers - Whether to show dividers between items
 * @param dividerMargin - Custom divider margin class
 */
export function ListContainer({ 
  children, 
  className,
  showDividers = true,
  dividerMargin = 'ml-6'
}: ListContainerProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-slate-200', className)}>
      {showDividers ? (
        <div className="divide-y divide-slate-200">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

/**
 * ListItem Component
 * Individual item wrapper with consistent padding
 * 
 * @param children - Content to render inside the item
 * @param className - Additional CSS classes
 * @param showDivider - Whether to show divider after this item
 * @param dividerMargin - Custom divider margin class
 */
interface ListItemProps {
  children: ReactNode;
  className?: string;
  showDivider?: boolean;
  dividerMargin?: string;
}

export function ListItem({ 
  children, 
  className,
  showDivider = false,
  dividerMargin = 'ml-6'
}: ListItemProps) {
  return (
    <div>
      <div className={cn('p-6', className)}>
        {children}
      </div>
      {showDivider && (
        <div className={cn('border-t border-slate-100', dividerMargin)}></div>
      )}
    </div>
  );
}
