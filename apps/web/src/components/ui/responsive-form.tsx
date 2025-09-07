/**
 * Responsive form components for mobile-optimized form experience
 * Provides mobile-friendly form layouts and interactions
 */

import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getResponsiveClasses, getResponsivePadding, getTouchTargetSize } from "@/lib/responsive";

interface ResponsiveFormProps {
  /**
   * Form children
   */
  children: ReactNode;
  /**
   * Form title
   */
  title?: string;
  /**
   * Form description
   */
  description?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Form variant
   */
  variant?: "default" | "card" | "minimal";
  /**
   * Mobile-specific props
   */
  mobile?: {
    /**
     * Mobile padding
     */
    padding?: string;
    /**
     * Mobile spacing
     */
    spacing?: string;
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
     * Tablet spacing
     */
    spacing?: string;
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
     * Desktop spacing
     */
    spacing?: string;
  };
}

/**
 * Responsive form component with mobile-optimized layouts
 * 
 * @param children - Form children
 * @param title - Form title
 * @param description - Form description
 * @param className - Additional CSS classes
 * @param variant - Form variant
 * @param mobile - Mobile-specific props
 * @param tablet - Tablet-specific props
 * @param desktop - Desktop-specific props
 * @returns ResponsiveForm JSX element
 */
export function ResponsiveForm({
  children,
  title,
  description,
  className,
  variant = "default",
  mobile,
  tablet,
  desktop,
}: ResponsiveFormProps) {
  const variantClasses = {
    default: "space-y-4",
    card: "bg-white rounded-lg border border-slate-200 shadow-sm space-y-4",
    minimal: "space-y-3",
  };

  const mobilePadding = mobile?.padding || "p-4";
  const tabletPadding = tablet?.padding || "md:p-6";
  const desktopPadding = desktop?.padding || "lg:p-8";

  const mobileSpacing = mobile?.spacing || "space-y-4";
  const tabletSpacing = tablet?.spacing || "md:space-y-6";
  const desktopSpacing = desktop?.spacing || "lg:space-y-8";

  const responsivePadding = getResponsiveClasses(mobilePadding, tabletPadding, desktopPadding);
  const responsiveSpacing = getResponsiveClasses(mobileSpacing, tabletSpacing, desktopSpacing);

  return (
    <form
      className={cn(
        variantClasses[variant],
        responsivePadding,
        responsiveSpacing,
        className
      )}
    >
      {title && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="text-sm text-slate-600">{description}</p>
          )}
        </div>
      )}
      {children}
    </form>
  );
}

/**
 * Responsive form field component
 */
interface ResponsiveFormFieldProps {
  /**
   * Field label
   */
  label: string;
  /**
   * Field description
   */
  description?: string;
  /**
   * Field error message
   */
  error?: string;
  /**
   * Whether field is required
   */
  required?: boolean;
  /**
   * Field children
   */
  children: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Mobile-specific props
   */
  mobile?: {
    /**
     * Mobile label size
     */
    labelSize?: string;
    /**
     * Mobile spacing
     */
    spacing?: string;
  };
  /**
   * Tablet-specific props
   */
  tablet?: {
    /**
     * Tablet label size
     */
    labelSize?: string;
    /**
     * Tablet spacing
     */
    spacing?: string;
  };
  /**
   * Desktop-specific props
   */
  desktop?: {
    /**
     * Desktop label size
     */
    labelSize?: string;
    /**
     * Desktop spacing
     */
    spacing?: string;
  };
}

/**
 * Responsive form field component
 * 
 * @param label - Field label
 * @param description - Field description
 * @param error - Field error message
 * @param required - Whether field is required
 * @param children - Field children
 * @param className - Additional CSS classes
 * @param mobile - Mobile-specific props
 * @param tablet - Tablet-specific props
 * @param desktop - Desktop-specific props
 * @returns ResponsiveFormField JSX element
 */
export function ResponsiveFormField({
  label,
  description,
  error,
  required,
  children,
  className,
  mobile,
  tablet,
  desktop,
}: ResponsiveFormFieldProps) {
  const mobileLabelSize = mobile?.labelSize || "text-sm";
  const tabletLabelSize = tablet?.labelSize || "md:text-base";
  const desktopLabelSize = desktop?.labelSize || "lg:text-lg";

  const mobileSpacing = mobile?.spacing || "space-y-2";
  const tabletSpacing = tablet?.spacing || "md:space-y-3";
  const desktopSpacing = desktop?.spacing || "lg:space-y-4";

  const responsiveLabelSize = getResponsiveClasses(mobileLabelSize, tabletLabelSize, desktopLabelSize);
  const responsiveSpacing = getResponsiveClasses(mobileSpacing, tabletSpacing, desktopSpacing);

  return (
    <div className={cn("space-y-2", responsiveSpacing, className)}>
      <Label className={cn("font-medium text-slate-700", responsiveLabelSize)}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-slate-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

/**
 * Responsive input component
 */
interface ResponsiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input variant
   */
  variant?: "default" | "mobile-optimized";
  /**
   * Mobile-specific props
   */
  mobile?: {
    /**
     * Mobile input size
     */
    size?: string;
    /**
     * Mobile padding
     */
    padding?: string;
  };
  /**
   * Tablet-specific props
   */
  tablet?: {
    /**
     * Tablet input size
     */
    size?: string;
    /**
     * Tablet padding
     */
    padding?: string;
  };
  /**
   * Desktop-specific props
   */
  desktop?: {
    /**
     * Desktop input size
     */
    size?: string;
    /**
     * Desktop padding
     */
    padding?: string;
  };
}

/**
 * Responsive input component
 * 
 * @param variant - Input variant
 * @param mobile - Mobile-specific props
 * @param tablet - Tablet-specific props
 * @param desktop - Desktop-specific props
 * @param className - Additional CSS classes
 * @param props - Input props
 * @returns ResponsiveInput JSX element
 */
export function ResponsiveInput({
  variant = "default",
  mobile,
  tablet,
  desktop,
  className,
  ...props
}: ResponsiveInputProps) {
  const mobileSize = mobile?.size || "h-10";
  const tabletSize = tablet?.size || "md:h-11";
  const desktopSize = desktop?.size || "lg:h-12";

  const mobilePadding = mobile?.padding || "px-3";
  const tabletPadding = tablet?.padding || "md:px-4";
  const desktopPadding = desktop?.padding || "lg:px-5";

  const responsiveSize = getResponsiveClasses(mobileSize, tabletSize, desktopSize);
  const responsivePadding = getResponsiveClasses(mobilePadding, tabletPadding, desktopPadding);

  const touchTargetClass = variant === "mobile-optimized" ? getTouchTargetSize("md") : "";

  return (
    <Input
      className={cn(
        responsiveSize,
        responsivePadding,
        touchTargetClass,
        className
      )}
      {...props}
    />
  );
}

/**
 * Responsive textarea component
 */
interface ResponsiveTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Textarea variant
   */
  variant?: "default" | "mobile-optimized";
  /**
   * Mobile-specific props
   */
  mobile?: {
    /**
     * Mobile textarea size
     */
    size?: string;
    /**
     * Mobile padding
     */
    padding?: string;
  };
  /**
   * Tablet-specific props
   */
  tablet?: {
    /**
     * Tablet textarea size
     */
    size?: string;
    /**
     * Tablet padding
     */
    padding?: string;
  };
  /**
   * Desktop-specific props
   */
  desktop?: {
    /**
     * Desktop textarea size
     */
    size?: string;
    /**
     * Desktop padding
     */
    padding?: string;
  };
}

/**
 * Responsive textarea component
 * 
 * @param variant - Textarea variant
 * @param mobile - Mobile-specific props
 * @param tablet - Tablet-specific props
 * @param desktop - Desktop-specific props
 * @param className - Additional CSS classes
 * @param props - Textarea props
 * @returns ResponsiveTextarea JSX element
 */
export function ResponsiveTextarea({
  variant = "default",
  mobile,
  tablet,
  desktop,
  className,
  ...props
}: ResponsiveTextareaProps) {
  const mobileSize = mobile?.size || "min-h-[100px]";
  const tabletSize = tablet?.size || "md:min-h-[120px]";
  const desktopSize = desktop?.size || "lg:min-h-[140px]";

  const mobilePadding = mobile?.padding || "p-3";
  const tabletPadding = tablet?.padding || "md:p-4";
  const desktopPadding = desktop?.padding || "lg:p-5";

  const responsiveSize = getResponsiveClasses(mobileSize, tabletSize, desktopSize);
  const responsivePadding = getResponsiveClasses(mobilePadding, tabletPadding, desktopPadding);

  const touchTargetClass = variant === "mobile-optimized" ? getTouchTargetSize("md") : "";

  return (
    <Textarea
      className={cn(
        responsiveSize,
        responsivePadding,
        touchTargetClass,
        className
      )}
      {...props}
    />
  );
}

/**
 * Responsive button component
 */
interface ResponsiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   */
  variant?: "default" | "outline" | "ghost" | "destructive";
  /**
   * Button size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Mobile-specific props
   */
  mobile?: {
    /**
     * Mobile button size
     */
    size?: string;
    /**
     * Mobile padding
     */
    padding?: string;
  };
  /**
   * Tablet-specific props
   */
  tablet?: {
    /**
     * Tablet button size
     */
    size?: string;
    /**
     * Tablet padding
     */
    padding?: string;
  };
  /**
   * Desktop-specific props
   */
  desktop?: {
    /**
     * Desktop button size
     */
    size?: string;
    /**
     * Desktop padding
     */
    padding?: string;
  };
}

/**
 * Responsive button component
 * 
 * @param variant - Button variant
 * @param size - Button size
 * @param mobile - Mobile-specific props
 * @param tablet - Tablet-specific props
 * @param desktop - Desktop-specific props
 * @param className - Additional CSS classes
 * @param props - Button props
 * @returns ResponsiveButton JSX element
 */
export function ResponsiveButton({
  variant = "default",
  size = "md",
  mobile,
  tablet,
  desktop,
  className,
  ...props
}: ResponsiveButtonProps) {
  const mobileSize = mobile?.size || "h-10";
  const tabletSize = tablet?.size || "md:h-11";
  const desktopSize = desktop?.size || "lg:h-12";

  const mobilePadding = mobile?.padding || "px-4";
  const tabletPadding = tablet?.padding || "md:px-6";
  const desktopPadding = desktop?.padding || "lg:px-8";

  const responsiveSize = getResponsiveClasses(mobileSize, tabletSize, desktopSize);
  const responsivePadding = getResponsiveClasses(mobilePadding, tabletPadding, desktopPadding);

  const touchTargetClass = getTouchTargetSize("md");

  return (
    <Button
      variant={variant}
      className={cn(
        responsiveSize,
        responsivePadding,
        touchTargetClass,
        className
      )}
      {...props}
    />
  );
}
