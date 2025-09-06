/**
 * Responsive design utilities and helpers
 * Provides common responsive patterns and breakpoint utilities
 */

import { useEffect, useState } from "react";

/**
 * Breakpoint definitions matching Tailwind CSS
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Device type definitions
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Screen size definitions
 */
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Hook to get current screen size
 * 
 * @returns Current screen size
 */
export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>('md');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      
      if (width < breakpoints.sm) {
        setScreenSize('xs');
      } else if (width < breakpoints.md) {
        setScreenSize('sm');
      } else if (width < breakpoints.lg) {
        setScreenSize('md');
      } else if (width < breakpoints.xl) {
        setScreenSize('lg');
      } else if (width < breakpoints['2xl']) {
        setScreenSize('xl');
      } else {
        setScreenSize('2xl');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
}

/**
 * Hook to get current device type
 * 
 * @returns Current device type
 */
export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      
      if (width < breakpoints.md) {
        setDeviceType('mobile');
      } else if (width < breakpoints.lg) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  return deviceType;
}

/**
 * Hook to check if screen is mobile
 * 
 * @returns True if screen is mobile
 */
export function useIsMobile(): boolean {
  const deviceType = useDeviceType();
  return deviceType === 'mobile';
}

/**
 * Hook to check if screen is tablet
 * 
 * @returns True if screen is tablet
 */
export function useIsTablet(): boolean {
  const deviceType = useDeviceType();
  return deviceType === 'tablet';
}

/**
 * Hook to check if screen is desktop
 * 
 * @returns True if screen is desktop
 */
export function useIsDesktop(): boolean {
  const deviceType = useDeviceType();
  return deviceType === 'desktop';
}

/**
 * Hook to check if screen is touch device
 * 
 * @returns True if screen is touch device
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      );
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);
    
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  return isTouch;
}

/**
 * Get responsive class names based on device type
 * 
 * @param mobile - Mobile class names
 * @param tablet - Tablet class names
 * @param desktop - Desktop class names
 * @returns Responsive class names
 */
export function getResponsiveClasses(
  mobile: string,
  tablet: string,
  desktop: string
): string {
  return `${mobile} md:${tablet} lg:${desktop}`;
}

/**
 * Get responsive grid classes
 * 
 * @param mobile - Mobile grid columns
 * @param tablet - Tablet grid columns
 * @param desktop - Desktop grid columns
 * @returns Responsive grid class names
 */
export function getResponsiveGrid(
  mobile: number,
  tablet: number,
  desktop: number
): string {
  return `grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop}`;
}

/**
 * Get responsive spacing classes
 * 
 * @param mobile - Mobile spacing
 * @param tablet - Tablet spacing
 * @param desktop - Desktop spacing
 * @returns Responsive spacing class names
 */
export function getResponsiveSpacing(
  mobile: string,
  tablet: string,
  desktop: string
): string {
  return `${mobile} md:${tablet} lg:${desktop}`;
}

/**
 * Get responsive text size classes
 * 
 * @param mobile - Mobile text size
 * @param tablet - Tablet text size
 * @param desktop - Desktop text size
 * @returns Responsive text size class names
 */
export function getResponsiveTextSize(
  mobile: string,
  tablet: string,
  desktop: string
): string {
  return `text-${mobile} md:text-${tablet} lg:text-${desktop}`;
}

/**
 * Get responsive padding classes
 * 
 * @param mobile - Mobile padding
 * @param tablet - Tablet padding
 * @param desktop - Desktop padding
 * @returns Responsive padding class names
 */
export function getResponsivePadding(
  mobile: string,
  tablet: string,
  desktop: string
): string {
  return `p-${mobile} md:p-${tablet} lg:p-${desktop}`;
}

/**
 * Get responsive margin classes
 * 
 * @param mobile - Mobile margin
 * @param tablet - Tablet margin
 * @param desktop - Desktop margin
 * @returns Responsive margin class names
 */
export function getResponsiveMargin(
  mobile: string,
  tablet: string,
  desktop: string
): string {
  return `m-${mobile} md:m-${tablet} lg:m-${desktop}`;
}

/**
 * Get responsive width classes
 * 
 * @param mobile - Mobile width
 * @param tablet - Tablet width
 * @param desktop - Desktop width
 * @returns Responsive width class names
 */
export function getResponsiveWidth(
  mobile: string,
  tablet: string,
  desktop: string
): string {
  return `w-${mobile} md:w-${tablet} lg:w-${desktop}`;
}

/**
 * Get responsive height classes
 * 
 * @param mobile - Mobile height
 * @param tablet - Tablet height
 * @param desktop - Desktop height
 * @returns Responsive height class names
 */
export function getResponsiveHeight(
  mobile: string,
  tablet: string,
  desktop: string
): string {
  return `h-${mobile} md:h-${tablet} lg:h-${desktop}`;
}

/**
 * Check if current screen size matches breakpoint
 * 
 * @param breakpoint - Breakpoint to check
 * @returns True if screen matches breakpoint
 */
export function isBreakpoint(breakpoint: keyof typeof breakpoints): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints[breakpoint];
}

/**
 * Get touch target size class for accessibility
 * 
 * @param size - Size variant
 * @returns Touch target class names
 */
export function getTouchTargetSize(size: 'sm' | 'md' | 'lg' = 'md'): string {
  const sizes = {
    sm: 'min-h-[32px] min-w-[32px]',
    md: 'min-h-[44px] min-w-[44px]',
    lg: 'min-h-[48px] min-w-[48px]',
  };
  
  return sizes[size];
}

/**
 * Get responsive container classes
 * 
 * @returns Responsive container class names
 */
export function getResponsiveContainer(): string {
  return 'container mx-auto px-4 sm:px-6 lg:px-8';
}

/**
 * Get responsive max width classes
 * 
 * @param mobile - Mobile max width
 * @param tablet - Tablet max width
 * @param desktop - Desktop max width
 * @returns Responsive max width class names
 */
export function getResponsiveMaxWidth(
  mobile: string,
  tablet: string,
  desktop: string
): string {
  return `max-w-${mobile} md:max-w-${tablet} lg:max-w-${desktop}`;
}

/**
 * Get responsive gap classes
 * 
 * @param mobile - Mobile gap
 * @param tablet - Tablet gap
 * @param desktop - Desktop gap
 * @returns Responsive gap class names
 */
export function getResponsiveGap(
  mobile: string,
  tablet: string,
  desktop: string
): string {
  return `gap-${mobile} md:gap-${tablet} lg:gap-${desktop}`;
}

/**
 * Get responsive flex direction classes
 * 
 * @param mobile - Mobile flex direction
 * @param tablet - Tablet flex direction
 * @param desktop - Desktop flex direction
 * @returns Responsive flex direction class names
 */
export function getResponsiveFlexDirection(
  mobile: string,
  tablet: string,
  desktop: string
): string {
  return `flex-${mobile} md:flex-${tablet} lg:flex-${desktop}`;
}

/**
 * Get responsive display classes
 * 
 * @param mobile - Mobile display
 * @param tablet - Tablet display
 * @param desktop - Desktop display
 * @returns Responsive display class names
 */
export function getResponsiveDisplay(
  mobile: string,
  tablet: string,
  desktop: string
): string {
  return `${mobile} md:${tablet} lg:${desktop}`;
}
