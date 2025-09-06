/**
 * Accessibility utilities for enhanced WCAG-AA compliance
 * Provides helper functions for common accessibility patterns
 */

/**
 * Generate a unique ID for accessibility attributes
 * Ensures proper association between labels and form controls
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create ARIA describedby attribute value
 * Combines multiple element IDs for complex descriptions
 */
export function createAriaDescribedBy(...ids: (string | undefined)[]): string | undefined {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(' ') : undefined;
}

/**
 * Generate accessible error message attributes
 * Provides proper ARIA attributes for form validation errors
 */
export function createErrorAttributes(fieldName: string, hasError: boolean) {
  const errorId = `${fieldName}-error`;
  return {
    'aria-describedby': hasError ? errorId : undefined,
    'aria-invalid': hasError,
    'aria-errormessage': hasError ? errorId : undefined,
  };
}

/**
 * Generate accessible help text attributes
 * Provides proper ARIA attributes for form help text
 */
export function createHelpAttributes(fieldName: string, hasError: boolean, hasHelp: boolean) {
  const errorId = `${fieldName}-error`;
  const helpId = `${fieldName}-help`;
  
  if (hasError) {
    return {
      'aria-describedby': errorId,
      'aria-invalid': true,
      'aria-errormessage': errorId,
    };
  }
  
  if (hasHelp) {
    return {
      'aria-describedby': helpId,
    };
  }
  
  return {};
}

/**
 * Create accessible button attributes
 * Ensures buttons have proper labels and descriptions
 */
export function createButtonAttributes(options: {
  label: string;
  description?: string;
  pressed?: boolean;
  expanded?: boolean;
  controls?: string;
  describedBy?: string;
}) {
  const attributes: Record<string, any> = {
    'aria-label': options.label,
  };

  if (options.description) {
    attributes['aria-describedby'] = options.describedBy || `${options.label}-description`;
  }

  if (options.pressed !== undefined) {
    attributes['aria-pressed'] = options.pressed;
  }

  if (options.expanded !== undefined) {
    attributes['aria-expanded'] = options.expanded;
  }

  if (options.controls) {
    attributes['aria-controls'] = options.controls;
  }

  return attributes;
}

/**
 * Create accessible form field attributes
 * Provides comprehensive accessibility for form inputs
 */
export function createFormFieldAttributes(options: {
  fieldName: string;
  label: string;
  required?: boolean;
  hasError?: boolean;
  hasHelp?: boolean;
  describedBy?: string;
  invalid?: boolean;
}) {
  const attributes: Record<string, any> = {
    'aria-label': options.label,
  };

  if (options.required) {
    attributes['aria-required'] = true;
  }

  if (options.invalid || options.hasError) {
    attributes['aria-invalid'] = true;
  }

  const describedBy = createAriaDescribedBy(
    options.describedBy,
    options.hasError ? `${options.fieldName}-error` : undefined,
    options.hasHelp ? `${options.fieldName}-help` : undefined
  );

  if (describedBy) {
    attributes['aria-describedby'] = describedBy;
  }

  return attributes;
}

/**
 * Create accessible table attributes
 * Provides proper ARIA attributes for data tables
 */
export function createTableAttributes(options: {
  caption?: string;
  hasSorting?: boolean;
  hasSelection?: boolean;
  rowCount?: number;
  columnCount?: number;
}) {
  const attributes: Record<string, any> = {
    role: 'table',
  };

  if (options.caption) {
    attributes['aria-label'] = options.caption;
  }

  if (options.hasSorting) {
    attributes['aria-sort'] = 'none';
  }

  if (options.hasSelection) {
    attributes['aria-multiselectable'] = true;
  }

  if (options.rowCount !== undefined) {
    attributes['aria-rowcount'] = options.rowCount;
  }

  if (options.columnCount !== undefined) {
    attributes['aria-colcount'] = options.columnCount;
  }

  return attributes;
}

/**
 * Create accessible grid attributes
 * Provides proper ARIA attributes for grid layouts
 */
export function createGridAttributes(options: {
  label: string;
  rowCount?: number;
  columnCount?: number;
  hasSelection?: boolean;
  hasSorting?: boolean;
}) {
  const attributes: Record<string, any> = {
    role: 'grid',
    'aria-label': options.label,
  };

  if (options.rowCount !== undefined) {
    attributes['aria-rowcount'] = options.rowCount;
  }

  if (options.columnCount !== undefined) {
    attributes['aria-colcount'] = options.columnCount;
  }

  if (options.hasSelection) {
    attributes['aria-multiselectable'] = true;
  }

  if (options.hasSorting) {
    attributes['aria-sort'] = 'none';
  }

  return attributes;
}

/**
 * Create accessible dialog attributes
 * Provides proper ARIA attributes for modal dialogs
 */
export function createDialogAttributes(options: {
  label: string;
  describedBy?: string;
  modal?: boolean;
}) {
  const attributes: Record<string, any> = {
    role: options.modal ? 'dialog' : 'dialog',
    'aria-label': options.label,
    'aria-modal': options.modal !== false,
  };

  if (options.describedBy) {
    attributes['aria-describedby'] = options.describedBy;
  }

  return attributes;
}

/**
 * Create accessible list attributes
 * Provides proper ARIA attributes for various list types
 */
export function createListAttributes(options: {
  type: 'list' | 'menu' | 'menubar' | 'tablist' | 'tree';
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  hasSelection?: boolean;
  multiselectable?: boolean;
}) {
  const attributes: Record<string, any> = {
    role: options.type,
  };

  if (options.label) {
    attributes['aria-label'] = options.label;
  }

  if (options.orientation) {
    attributes['aria-orientation'] = options.orientation;
  }

  if (options.hasSelection) {
    attributes['aria-activedescendant'] = '';
  }

  if (options.multiselectable) {
    attributes['aria-multiselectable'] = true;
  }

  return attributes;
}

/**
 * Create accessible progress attributes
 * Provides proper ARIA attributes for progress indicators
 */
export function createProgressAttributes(options: {
  label: string;
  value: number;
  max?: number;
  describedBy?: string;
}) {
  const attributes: Record<string, any> = {
    role: 'progressbar',
    'aria-label': options.label,
    'aria-valuenow': options.value,
    'aria-valuemin': 0,
    'aria-valuemax': options.max || 100,
  };

  if (options.describedBy) {
    attributes['aria-describedby'] = options.describedBy;
  }

  return attributes;
}

/**
 * Create accessible status attributes
 * Provides proper ARIA attributes for status messages
 */
export function createStatusAttributes(options: {
  type: 'status' | 'alert' | 'log' | 'timer';
  live?: 'off' | 'polite' | 'assertive';
  atomic?: boolean;
}) {
  const attributes: Record<string, any> = {
    role: options.type,
    'aria-live': options.live || 'polite',
  };

  if (options.atomic) {
    attributes['aria-atomic'] = true;
  }

  return attributes;
}

/**
 * Validate color contrast ratio
 * Ensures text meets WCAG-AA contrast requirements
 */
export function validateColorContrast(
  foregroundColor: string,
  backgroundColor: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  // This is a simplified implementation
  // In a real app, you'd use a proper color contrast library
  // like color-contrast or chroma-js
  
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Apply gamma correction
    const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  const l1 = getLuminance(foregroundColor);
  const l2 = getLuminance(backgroundColor);
  
  const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return level === 'AA' ? contrast >= 4.5 : contrast >= 7;
}

/**
 * Create accessible keyboard navigation
 * Provides keyboard event handlers for common navigation patterns
 */
export function createKeyboardNavigation(options: {
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onPageUp?: () => void;
  onPageDown?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onEscape?: () => void;
}) {
  return (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        options.onArrowUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        options.onArrowDown?.();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        options.onArrowLeft?.();
        break;
      case 'ArrowRight':
        e.preventDefault();
        options.onArrowRight?.();
        break;
      case 'Home':
        e.preventDefault();
        options.onHome?.();
        break;
      case 'End':
        e.preventDefault();
        options.onEnd?.();
        break;
      case 'PageUp':
        e.preventDefault();
        options.onPageUp?.();
        break;
      case 'PageDown':
        e.preventDefault();
        options.onPageDown?.();
        break;
      case 'Enter':
        e.preventDefault();
        options.onEnter?.();
        break;
      case ' ':
        e.preventDefault();
        options.onSpace?.();
        break;
      case 'Escape':
        e.preventDefault();
        options.onEscape?.();
        break;
    }
  };
}

/**
 * Create accessible focus management
 * Provides utilities for managing focus in complex components
 */
export function createFocusManagement() {
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  return {
    /**
     * Get all focusable elements within a container
     */
    getFocusableElements: (container: HTMLElement) => {
      return Array.from(container.querySelectorAll(focusableElements)) as HTMLElement[];
    },
    
    /**
     * Trap focus within a container
     */
    trapFocus: (container: HTMLElement) => {
      const elements = Array.from(container.querySelectorAll(focusableElements)) as HTMLElement[];
      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];
      
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              e.preventDefault();
            }
          }
        }
      };
      
      container.addEventListener('keydown', handleTabKey);
      
      return () => {
        container.removeEventListener('keydown', handleTabKey);
      };
    },
    
    /**
     * Focus the first focusable element in a container
     */
    focusFirst: (container: HTMLElement) => {
      const elements = Array.from(container.querySelectorAll(focusableElements)) as HTMLElement[];
      elements[0]?.focus();
    },
    
    /**
     * Focus the last focusable element in a container
     */
    focusLast: (container: HTMLElement) => {
      const elements = Array.from(container.querySelectorAll(focusableElements)) as HTMLElement[];
      elements[elements.length - 1]?.focus();
    },
  };
}

/**
 * Create accessible announcements
 * Provides utilities for screen reader announcements
 */
export function createAnnouncements() {
  return {
    /**
     * Announce text to screen readers
     */
    announce: (text: string, priority: 'polite' | 'assertive' = 'polite') => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', priority);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = text;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },
    
    /**
     * Announce form validation errors
     */
    announceError: (fieldName: string, errorMessage: string) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `${fieldName}: ${errorMessage}`;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },
    
    /**
     * Announce success messages
     */
    announceSuccess: (message: string) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },
  };
}
