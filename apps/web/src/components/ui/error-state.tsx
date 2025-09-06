/**
 * Error state components for consistent error handling
 * Provides reusable error state patterns across the application
 */

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  /**
   * Icon to display in the error state
   */
  icon?: ReactNode;
  /**
   * Main title for the error state
   */
  title: string;
  /**
   * Description text for the error state
   */
  description: string;
  /**
   * Error details (optional)
   */
  details?: string;
  /**
   * Primary action button
   */
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost" | "destructive";
  };
  /**
   * Secondary action button
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost" | "destructive";
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
   * Error severity
   */
  severity?: "error" | "warning" | "info";
  /**
   * Whether to show in a card
   */
  card?: boolean;
}

/**
 * Base error state component
 * 
 * @param icon - Icon to display
 * @param title - Main title
 * @param description - Description text
 * @param details - Error details
 * @param primaryAction - Primary action button
 * @param secondaryAction - Secondary action button
 * @param children - Additional content
 * @param className - Custom className
 * @param size - Size variant
 * @param severity - Error severity
 * @param card - Whether to show in a card
 * @returns ErrorState JSX element
 */
export function ErrorState({
  icon,
  title,
  description,
  details,
  primaryAction,
  secondaryAction,
  children,
  className,
  size = "md",
  severity = "error",
  card = true
}: ErrorStateProps) {
  const sizeClasses = {
    sm: "py-6",
    md: "py-8",
    lg: "py-12"
  };

  const iconSizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const severityClasses = {
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500"
  };

  const content = (
    <div className={cn("text-center", sizeClasses[size], className)}>
      {icon && (
        <div className={cn(
          "mx-auto mb-4",
          iconSizeClasses[size],
          severityClasses[severity]
        )}>
          {icon}
        </div>
      )}
      <h3 className={cn(
        "font-semibold mb-2",
        size === "sm" ? "text-base" : size === "md" ? "text-lg" : "text-xl",
        severity === "error" ? "text-red-900" : 
        severity === "warning" ? "text-yellow-900" : "text-blue-900"
      )}>
        {title}
      </h3>
      <p className={cn(
        "mb-4 max-w-md mx-auto leading-relaxed",
        size === "sm" ? "text-sm" : "text-base",
        severity === "error" ? "text-red-700" : 
        severity === "warning" ? "text-yellow-700" : "text-blue-700"
      )}>
        {description}
      </p>
      
      {details && (
        <div className={cn(
          "mb-6 p-3 rounded-md text-sm text-left max-w-lg mx-auto",
          severity === "error" ? "bg-red-50 text-red-800" : 
          severity === "warning" ? "bg-yellow-50 text-yellow-800" : "bg-blue-50 text-blue-800"
        )}>
          <details>
            <summary className="cursor-pointer font-medium">Error Details</summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs">{details}</pre>
          </details>
        </div>
      )}
      
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
    const cardClasses = {
      error: "border-red-200 bg-red-50",
      warning: "border-yellow-200 bg-yellow-50",
      info: "border-blue-200 bg-blue-50"
    };

    return (
      <Card className={cn("border-2", cardClasses[severity])}>
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    );
  }

  return content;
}

/**
 * Network error state
 */
export function NetworkErrorState({
  onRetry,
  onGoBack,
  className
}: {
  onRetry: () => void;
  onGoBack?: () => void;
  className?: string;
}) {
  return (
    <ErrorState
      icon={<WifiOff className="h-12 w-12" />}
      title="Connection Error"
      description="We couldn't connect to the server. Please check your internet connection and try again."
      primaryAction={{
        label: "Try Again",
        onClick: onRetry
      }}
      secondaryAction={
        onGoBack
          ? {
              label: "Go Back",
              onClick: onGoBack,
              variant: "outline"
            }
          : undefined
      }
      className={className}
    />
  );
}

/**
 * Not found error state
 */
export function NotFoundErrorState({
  onGoBack,
  onGoHome,
  className
}: {
  onGoBack?: () => void;
  onGoHome: () => void;
  className?: string;
}) {
  return (
    <ErrorState
      icon={<FileX className="h-12 w-12" />}
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      primaryAction={{
        label: "Go Home",
        onClick: onGoHome
      }}
      secondaryAction={
        onGoBack
          ? {
              label: "Go Back",
              onClick: onGoBack,
              variant: "outline"
            }
          : undefined
      }
      className={className}
    />
  );
}

/**
 * Permission error state
 */
export function PermissionErrorState({
  onRequestAccess,
  onGoBack,
  className
}: {
  onRequestAccess?: () => void;
  onGoBack: () => void;
  className?: string;
}) {
  return (
    <ErrorState
      icon={<Lock className="h-12 w-12" />}
      title="Access Denied"
      description="You don't have permission to view this content. Please contact an administrator if you believe this is an error."
      primaryAction={{
        label: "Go Back",
        onClick: onGoBack,
        variant: "outline"
      }}
      secondaryAction={
        onRequestAccess
          ? {
              label: "Request Access",
              onClick: onRequestAccess
            }
          : undefined
      }
      className={className}
    />
  );
}

/**
 * Server error state
 */
export function ServerErrorState({
  onRetry,
  onReportIssue,
  className
}: {
  onRetry: () => void;
  onReportIssue?: () => void;
  className?: string;
}) {
  return (
    <ErrorState
      icon={<ServerCrash className="h-12 w-12" />}
      title="Server Error"
      description="Something went wrong on our end. We're working to fix it. Please try again in a few minutes."
      primaryAction={{
        label: "Try Again",
        onClick: onRetry
      }}
      secondaryAction={
        onReportIssue
          ? {
              label: "Report Issue",
              onClick: onReportIssue,
              variant: "outline"
            }
          : undefined
      }
      className={className}
    />
  );
}

/**
 * Validation error state
 */
export function ValidationErrorState({
  errors,
  onFixErrors,
  className
}: {
  errors: string[];
  onFixErrors: () => void;
  className?: string;
}) {
  return (
    <ErrorState
      icon={<AlertTriangle className="h-12 w-12" />}
      title="Validation Error"
      description="Please fix the following errors before continuing:"
      details={errors.join('\n')}
      primaryAction={{
        label: "Fix Errors",
        onClick: onFixErrors
      }}
      severity="warning"
      className={className}
    />
  );
}

/**
 * Inline error alert
 */
export function InlineErrorAlert({
  title,
  description,
  onDismiss,
  className
}: {
  title: string;
  description?: string;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{title}</div>
            {description && (
              <div className="text-sm mt-1">{description}</div>
            )}
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="ml-2 h-auto p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Import icons
import { 
  WifiOff, 
  FileX, 
  Lock, 
  ServerCrash, 
  AlertTriangle, 
  AlertCircle, 
  X 
} from "lucide-react";
