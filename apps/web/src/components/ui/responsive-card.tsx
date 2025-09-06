/**
 * Responsive card component with mobile-optimized layouts
 * Provides consistent card layouts across different screen sizes
 */

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getResponsiveClasses, getResponsivePadding, getResponsiveSpacing, getResponsiveTextSize, getResponsiveMargin } from "@/lib/responsive";

interface ResponsiveCardProps {
  /**
   * Card title
   */
  title?: string;
  /**
   * Card content
   */
  children: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Card variant
   */
  variant?: "default" | "outlined" | "elevated" | "flat";
  /**
   * Card size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to show header
   */
  showHeader?: boolean;
  /**
   * Whether to show border
   */
  showBorder?: boolean;
  /**
   * Whether to show shadow
   */
  showShadow?: boolean;
  /**
   * Mobile-specific props
   */
  mobile?: {
    /**
     * Mobile padding
     */
    padding?: string;
    /**
     * Mobile margin
     */
    margin?: string;
    /**
     * Mobile rounded corners
     */
    rounded?: string;
  };
  /**
   * Tablet-specific props
   */
  tablet?: {
    /**
     * Tablet padding
     */
    padding?: string;
    /**
     * Tablet margin
     */
    margin?: string;
    /**
     * Tablet rounded corners
     */
    rounded?: string;
  };
  /**
   * Desktop-specific props
   */
  desktop?: {
    /**
     * Desktop padding
     */
    padding?: string;
    /**
     * Desktop margin
     */
    margin?: string;
    /**
     * Desktop rounded corners
     */
    rounded?: string;
  };
}

/**
 * Responsive card component with mobile-optimized layouts
 * 
 * @param title - Card title
 * @param children - Card content
 * @param className - Additional CSS classes
 * @param variant - Card variant
 * @param size - Card size
 * @param showHeader - Whether to show header
 * @param showBorder - Whether to show border
 * @param showShadow - Whether to show shadow
 * @param mobile - Mobile-specific props
 * @param tablet - Tablet-specific props
 * @param desktop - Desktop-specific props
 * @returns ResponsiveCard JSX element
 */
export function ResponsiveCard({
  title,
  children,
  className,
  variant = "default",
  size = "md",
  showHeader = true,
  showBorder = true,
  showShadow = true,
  mobile,
  tablet,
  desktop,
}: ResponsiveCardProps) {
  const variantClasses = {
    default: "bg-white",
    outlined: "bg-white border-2 border-slate-200",
    elevated: "bg-white shadow-lg",
    flat: "bg-slate-50",
  };

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const mobilePadding = mobile?.padding || sizeClasses[size];
  const tabletPadding = tablet?.padding || sizeClasses[size];
  const desktopPadding = desktop?.padding || sizeClasses[size];

  const mobileMargin = mobile?.margin || "m-2";
  const tabletMargin = tablet?.margin || "m-4";
  const desktopMargin = desktop?.margin || "m-6";

  const mobileRounded = mobile?.rounded || "rounded-lg";
  const tabletRounded = tablet?.rounded || "rounded-lg";
  const desktopRounded = desktop?.rounded || "rounded-lg";

  const responsivePadding = getResponsivePadding(mobilePadding, tabletPadding, desktopPadding);
  const responsiveMargin = getResponsiveMargin(mobileMargin, tabletMargin, desktopMargin);
  const responsiveRounded = getResponsiveClasses(mobileRounded, tabletRounded, desktopRounded);

  return (
    <Card
      className={cn(
        variantClasses[variant],
        responsivePadding,
        responsiveMargin,
        responsiveRounded,
        showBorder && "border border-slate-200",
        showShadow && "shadow-md",
        className
      )}
    >
      {showHeader && title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(showHeader && title ? "pt-0" : "")}>
        {children}
      </CardContent>
    </Card>
  );
}

/**
 * Responsive grid container for cards
 */
interface ResponsiveGridProps {
  /**
   * Grid children
   */
  children: ReactNode;
  /**
   * Mobile columns
   */
  mobileCols?: number;
  /**
   * Tablet columns
   */
  tabletCols?: number;
  /**
   * Desktop columns
   */
  desktopCols?: number;
  /**
   * Grid gap
   */
  gap?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Responsive grid container for cards
 * 
 * @param children - Grid children
 * @param mobileCols - Mobile columns
 * @param tabletCols - Tablet columns
 * @param desktopCols - Desktop columns
 * @param gap - Grid gap
 * @param className - Additional CSS classes
 * @returns ResponsiveGrid JSX element
 */
export function ResponsiveGrid({
  children,
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 3,
  gap = "gap-4",
  className,
}: ResponsiveGridProps) {
  const gridClasses = getResponsiveClasses(
    `grid-cols-${mobileCols}`,
    `md:grid-cols-${tabletCols}`,
    `lg:grid-cols-${desktopCols}`
  );

  return (
    <div className={cn("grid", gridClasses, gap, className)}>
      {children}
    </div>
  );
}

/**
 * Responsive flex container
 */
interface ResponsiveFlexProps {
  /**
   * Flex children
   */
  children: ReactNode;
  /**
   * Mobile direction
   */
  mobileDirection?: "row" | "col";
  /**
   * Tablet direction
   */
  tabletDirection?: "row" | "col";
  /**
   * Desktop direction
   */
  desktopDirection?: "row" | "col";
  /**
   * Flex gap
   */
  gap?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Responsive flex container
 * 
 * @param children - Flex children
 * @param mobileDirection - Mobile direction
 * @param tabletDirection - Tablet direction
 * @param desktopDirection - Desktop direction
 * @param gap - Flex gap
 * @param className - Additional CSS classes
 * @returns ResponsiveFlex JSX element
 */
export function ResponsiveFlex({
  children,
  mobileDirection = "col",
  tabletDirection = "row",
  desktopDirection = "row",
  gap = "gap-4",
  className,
}: ResponsiveFlexProps) {
  const flexClasses = getResponsiveClasses(
    `flex-${mobileDirection}`,
    `md:flex-${tabletDirection}`,
    `lg:flex-${desktopDirection}`
  );

  return (
    <div className={cn("flex", flexClasses, gap, className)}>
      {children}
    </div>
  );
}

/**
 * Responsive text component
 */
interface ResponsiveTextProps {
  /**
   * Text content
   */
  children: ReactNode;
  /**
   * Mobile text size
   */
  mobileSize?: string;
  /**
   * Tablet text size
   */
  tabletSize?: string;
  /**
   * Desktop text size
   */
  desktopSize?: string;
  /**
   * Text weight
   */
  weight?: "normal" | "medium" | "semibold" | "bold";
  /**
   * Text color
   */
  color?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Responsive text component
 * 
 * @param children - Text content
 * @param mobileSize - Mobile text size
 * @param tabletSize - Tablet text size
 * @param desktopSize - Desktop text size
 * @param weight - Text weight
 * @param color - Text color
 * @param className - Additional CSS classes
 * @returns ResponsiveText JSX element
 */
export function ResponsiveText({
  children,
  mobileSize = "text-sm",
  tabletSize = "text-base",
  desktopSize = "text-lg",
  weight = "normal",
  color = "text-slate-900",
  className,
}: ResponsiveTextProps) {
  const textSize = getResponsiveTextSize(mobileSize, tabletSize, desktopSize);
  const weightClass = `font-${weight}`;

  return (
    <p className={cn(textSize, weightClass, color, className)}>
      {children}
    </p>
  );
}

