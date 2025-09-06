/**
 * Animation and transition utilities for consistent UI interactions
 * Provides reusable animation patterns across the application
 */

import { cn } from "@/lib/utils";

/**
 * Animation variants for consistent transitions
 */
export const animationVariants = {
  // Fade animations
  fadeIn: "animate-in fade-in duration-200",
  fadeOut: "animate-out fade-out duration-200",
  fadeInUp: "animate-in fade-in slide-in-from-bottom-2 duration-300",
  fadeInDown: "animate-in fade-in slide-in-from-top-2 duration-300",
  fadeInLeft: "animate-in fade-in slide-in-from-left-2 duration-300",
  fadeInRight: "animate-in fade-in slide-in-from-right-2 duration-300",
  
  // Scale animations
  scaleIn: "animate-in zoom-in-95 duration-200",
  scaleOut: "animate-out zoom-out-95 duration-200",
  scaleOnHover: "hover:scale-105 transition-transform duration-200",
  scaleOnPress: "active:scale-95 transition-transform duration-100",
  
  // Slide animations
  slideInUp: "animate-in slide-in-from-bottom-4 duration-300",
  slideInDown: "animate-in slide-in-from-top-4 duration-300",
  slideInLeft: "animate-in slide-in-from-left-4 duration-300",
  slideInRight: "animate-in slide-in-from-right-4 duration-300",
  
  // Bounce animations
  bounce: "animate-bounce",
  bounceIn: "animate-in zoom-in-95 duration-500",
  
  // Pulse animations
  pulse: "animate-pulse",
  pulseOnHover: "hover:animate-pulse",
  
  // Spin animations
  spin: "animate-spin",
  spinOnHover: "hover:animate-spin",
  
  // Ping animations
  ping: "animate-ping",
  pingOnHover: "hover:animate-ping",
  
  // Wiggle animations
  wiggle: "animate-wiggle",
  wiggleOnHover: "hover:animate-wiggle",
};

/**
 * Hover effect variants
 */
export const hoverVariants = {
  // Background hover effects
  hoverBg: "hover:bg-slate-50 transition-colors duration-200",
  hoverBgPrimary: "hover:bg-primary-50 transition-colors duration-200",
  hoverBgDestructive: "hover:bg-destructive-50 transition-colors duration-200",
  
  // Text hover effects
  hoverText: "hover:text-slate-900 transition-colors duration-200",
  hoverTextPrimary: "hover:text-primary-600 transition-colors duration-200",
  hoverTextDestructive: "hover:text-destructive-600 transition-colors duration-200",
  
  // Border hover effects
  hoverBorder: "hover:border-slate-300 transition-colors duration-200",
  hoverBorderPrimary: "hover:border-primary-300 transition-colors duration-200",
  hoverBorderDestructive: "hover:border-destructive-300 transition-colors duration-200",
  
  // Shadow hover effects
  hoverShadow: "hover:shadow-md transition-shadow duration-200",
  hoverShadowLg: "hover:shadow-lg transition-shadow duration-200",
  hoverShadowXl: "hover:shadow-xl transition-shadow duration-200",
  
  // Scale hover effects
  hoverScale: "hover:scale-105 transition-transform duration-200",
  hoverScaleSm: "hover:scale-102 transition-transform duration-200",
  hoverScaleLg: "hover:scale-110 transition-transform duration-200",
  
  // Opacity hover effects
  hoverOpacity: "hover:opacity-80 transition-opacity duration-200",
  hoverOpacitySm: "hover:opacity-90 transition-opacity duration-200",
  hoverOpacityLg: "hover:opacity-70 transition-opacity duration-200",
};

/**
 * Focus effect variants
 */
export const focusVariants = {
  // Focus ring effects
  focusRing: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
  focusRingSm: "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
  focusRingLg: "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
  
  // Focus background effects
  focusBg: "focus-visible:bg-slate-50",
  focusBgPrimary: "focus-visible:bg-primary-50",
  
  // Focus border effects
  focusBorder: "focus-visible:border-primary-500",
  focusBorderDestructive: "focus-visible:border-destructive-500",
};

/**
 * Transition variants
 */
export const transitionVariants = {
  // Standard transitions
  standard: "transition-all duration-200 ease-in-out",
  fast: "transition-all duration-150 ease-in-out",
  slow: "transition-all duration-300 ease-in-out",
  
  // Specific property transitions
  colors: "transition-colors duration-200 ease-in-out",
  transform: "transition-transform duration-200 ease-in-out",
  opacity: "transition-opacity duration-200 ease-in-out",
  shadow: "transition-shadow duration-200 ease-in-out",
  
  // Easing variants
  easeIn: "transition-all duration-200 ease-in",
  easeOut: "transition-all duration-200 ease-out",
  easeInOut: "transition-all duration-200 ease-in-out",
  linear: "transition-all duration-200 linear",
};

/**
 * Animation wrapper component
 */
interface AnimationWrapperProps {
  children: React.ReactNode;
  animation?: keyof typeof animationVariants;
  hover?: keyof typeof hoverVariants;
  focus?: keyof typeof focusVariants;
  transition?: keyof typeof transitionVariants;
  className?: string;
  delay?: number;
  duration?: number;
}

/**
 * Animation wrapper for consistent animations
 * 
 * @param children - Child components
 * @param animation - Animation variant
 * @param hover - Hover effect variant
 * @param focus - Focus effect variant
 * @param transition - Transition variant
 * @param className - Additional CSS classes
 * @param delay - Animation delay in ms
 * @param duration - Animation duration in ms
 * @returns AnimationWrapper JSX element
 */
export function AnimationWrapper({
  children,
  animation,
  hover,
  focus,
  transition = "standard",
  className,
  delay,
  duration
}: AnimationWrapperProps) {
  const delayClass = delay ? `delay-${delay}` : "";
  const durationClass = duration ? `duration-${duration}` : "";
  
  return (
    <div
      className={cn(
        animation && animationVariants[animation],
        hover && hoverVariants[hover],
        focus && focusVariants[focus],
        transitionVariants[transition],
        delayClass,
        durationClass,
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Stagger animation wrapper for lists
 */
interface StaggerWrapperProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

/**
 * Stagger animation wrapper for list items
 * 
 * @param children - Child components
 * @param staggerDelay - Delay between each item in ms
 * @param className - Additional CSS classes
 * @returns StaggerWrapper JSX element
 */
export function StaggerWrapper({
  children,
  staggerDelay = 100,
  className
}: StaggerWrapperProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {React.Children.map(children, (child, index) => (
        <div
          className={cn(
            "animate-in fade-in slide-in-from-bottom-2 duration-300",
            `delay-${index * staggerDelay}`
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

/**
 * Loading skeleton with animation
 */
interface LoadingSkeletonProps {
  className?: string;
  animate?: boolean;
}

/**
 * Animated loading skeleton
 * 
 * @param className - Additional CSS classes
 * @param animate - Whether to animate
 * @returns LoadingSkeleton JSX element
 */
export function LoadingSkeleton({
  className,
  animate = true
}: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-slate-200 rounded-md",
        animate && "animate-pulse",
        className
      )}
    />
  );
}

/**
 * Shimmer effect for loading states
 */
interface ShimmerProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Shimmer effect component
 * 
 * @param className - Additional CSS classes
 * @param children - Child components
 * @returns Shimmer JSX element
 */
export function Shimmer({ className, children }: ShimmerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "before:absolute before:inset-0",
        "before:-translate-x-full before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        className
      )}
    >
      {children}
    </div>
  );
}

// Import React for children mapping
import React from "react";
