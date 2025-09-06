/**
 * Touch target utilities for mobile accessibility
 * Ensures all interactive elements meet minimum touch target requirements
 */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getTouchTargetSize } from "@/lib/responsive";

interface TouchTargetProps {
  /**
   * Child components
   */
  children: ReactNode;
  /**
   * Touch target size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to apply touch target styles
   */
  enabled?: boolean;
}

/**
 * Touch target wrapper component
 * Ensures minimum touch target size for accessibility
 * 
 * @param children - Child components
 * @param size - Touch target size
 * @param className - Additional CSS classes
 * @param enabled - Whether to apply touch target styles
 * @returns TouchTarget JSX element
 */
export function TouchTarget({
  children,
  size = "md",
  className,
  enabled = true,
}: TouchTargetProps) {
  if (!enabled) {
    return <>{children}</>;
  }

  const touchTargetClass = getTouchTargetSize(size);

  return (
    <div className={cn(touchTargetClass, className)}>
      {children}
    </div>
  );
}

/**
 * Touch target button component
 * Button with guaranteed touch target size
 */
interface TouchTargetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Touch target size
   */
  touchSize?: "sm" | "md" | "lg";
  /**
   * Button variant
   */
  variant?: "default" | "outline" | "ghost" | "destructive";
  /**
   * Button size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Touch target button component
 * 
 * @param touchSize - Touch target size
 * @param variant - Button variant
 * @param size - Button size
 * @param className - Additional CSS classes
 * @param props - Button props
 * @returns TouchTargetButton JSX element
 */
export function TouchTargetButton({
  touchSize = "md",
  variant = "default",
  size = "md",
  className,
  ...props
}: TouchTargetButtonProps) {
  const touchTargetClass = getTouchTargetSize(touchSize);
  
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const variantClasses = {
    default: "bg-primary-600 text-white hover:bg-primary-700",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        sizeClasses[size],
        variantClasses[variant],
        touchTargetClass,
        className
      )}
      {...props}
    />
  );
}

/**
 * Touch target link component
 * Link with guaranteed touch target size
 */
interface TouchTargetLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Touch target size
   */
  touchSize?: "sm" | "md" | "lg";
  /**
   * Link variant
   */
  variant?: "default" | "outline" | "ghost";
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Touch target link component
 * 
 * @param touchSize - Touch target size
 * @param variant - Link variant
 * @param className - Additional CSS classes
 * @param props - Link props
 * @returns TouchTargetLink JSX element
 */
export function TouchTargetLink({
  touchSize = "md",
  variant = "default",
  className,
  ...props
}: TouchTargetLinkProps) {
  const touchTargetClass = getTouchTargetSize(touchSize);
  
  const variantClasses = {
    default: "text-primary-600 hover:text-primary-700",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md",
    ghost: "text-slate-700 hover:bg-slate-100 rounded-md",
  };

  return (
    <a
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        variantClasses[variant],
        touchTargetClass,
        className
      )}
      {...props}
    />
  );
}

/**
 * Touch target icon button component
 * Icon button with guaranteed touch target size
 */
interface TouchTargetIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Touch target size
   */
  touchSize?: "sm" | "md" | "lg";
  /**
   * Button variant
   */
  variant?: "default" | "outline" | "ghost" | "destructive";
  /**
   * Icon component
   */
  icon: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Touch target icon button component
 * 
 * @param touchSize - Touch target size
 * @param variant - Button variant
 * @param icon - Icon component
 * @param className - Additional CSS classes
 * @param props - Button props
 * @returns TouchTargetIconButton JSX element
 */
export function TouchTargetIconButton({
  touchSize = "md",
  variant = "ghost",
  icon,
  className,
  ...props
}: TouchTargetIconButtonProps) {
  const touchTargetClass = getTouchTargetSize(touchSize);
  
  const variantClasses = {
    default: "bg-primary-600 text-white hover:bg-primary-700",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        touchTargetClass,
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
}

/**
 * Touch target checkbox component
 * Checkbox with guaranteed touch target size
 */
interface TouchTargetCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Touch target size
   */
  touchSize?: "sm" | "md" | "lg";
  /**
   * Label text
   */
  label?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Touch target checkbox component
 * 
 * @param touchSize - Touch target size
 * @param label - Label text
 * @param className - Additional CSS classes
 * @param props - Checkbox props
 * @returns TouchTargetCheckbox JSX element
 */
export function TouchTargetCheckbox({
  touchSize = "md",
  label,
  className,
  ...props
}: TouchTargetCheckboxProps) {
  const touchTargetClass = getTouchTargetSize(touchSize);

  return (
    <label className={cn("inline-flex items-center cursor-pointer", className)}>
      <input
        type="checkbox"
        className={cn(
          "rounded border-slate-300 text-primary-600 focus:ring-primary-500",
          touchTargetClass
        )}
        {...props}
      />
      {label && (
        <span className="ml-2 text-sm text-slate-700">{label}</span>
      )}
    </label>
  );
}

/**
 * Touch target radio component
 * Radio button with guaranteed touch target size
 */
interface TouchTargetRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Touch target size
   */
  touchSize?: "sm" | "md" | "lg";
  /**
   * Label text
   */
  label?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Touch target radio component
 * 
 * @param touchSize - Touch target size
 * @param label - Label text
 * @param className - Additional CSS classes
 * @param props - Radio props
 * @returns TouchTargetRadio JSX element
 */
export function TouchTargetRadio({
  touchSize = "md",
  label,
  className,
  ...props
}: TouchTargetRadioProps) {
  const touchTargetClass = getTouchTargetSize(touchSize);

  return (
    <label className={cn("inline-flex items-center cursor-pointer", className)}>
      <input
        type="radio"
        className={cn(
          "border-slate-300 text-primary-600 focus:ring-primary-500",
          touchTargetClass
        )}
        {...props}
      />
      {label && (
        <span className="ml-2 text-sm text-slate-700">{label}</span>
      )}
    </label>
  );
}
