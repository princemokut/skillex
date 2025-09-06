/**
 * Component for displaying user availability in profile cards
 * Shows availability in the format: "Weekdays 6-8 PM, Weekends 10 AM-2 PM"
 */

import { generateAvailabilityDisplay, getLastActiveTime } from "@/lib/availability-utils";

interface AvailabilitySlot {
  day: number; // 0-6 (Sunday-Saturday)
  hour: number; // 0-23
  available: boolean;
}

interface AvailabilityDisplayProps {
  availability: AvailabilitySlot[];
  showLastActive?: boolean;
  className?: string;
}

/**
 * Display user availability in a clean, readable format
 */
export function AvailabilityDisplay({ 
  availability, 
  showLastActive = true,
  className = ""
}: AvailabilityDisplayProps) {
  const { summary, hasAvailability, weekdayBlocks, weekendBlocks } = generateAvailabilityDisplay(availability);
  
  if (!hasAvailability) {
    return (
      <div className={`text-sm text-slate-500 ${className}`}>
        <div className="font-medium text-slate-600 mb-1">Available:</div>
        <div>Not specified</div>
        {showLastActive && (
          <div className="mt-1 text-xs text-slate-400">
            Last active {getLastActiveTime()}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`text-sm text-slate-600 ${className}`}>
      <div className="font-medium text-slate-700 mb-1">Available:</div>
      
      {/* Weekdays */}
      {weekdayBlocks.length > 0 && (
        <div className="mb-1">
          <span className="text-slate-500">• Weekdays </span>
          <span className="text-slate-700">{weekdayBlocks.join(', ')}</span>
        </div>
      )}
      
      {/* Weekends */}
      {weekendBlocks.length > 0 && (
        <div className="mb-1">
          <span className="text-slate-500">• Weekends </span>
          <span className="text-slate-700">{weekendBlocks.join(', ')}</span>
        </div>
      )}
      
      {/* Last Active */}
      {showLastActive && (
        <div className="mt-2 text-xs text-slate-400">
          Last active {getLastActiveTime()}
        </div>
      )}
    </div>
  );
}

/**
 * Compact availability display for smaller cards
 */
export function CompactAvailabilityDisplay({ 
  availability, 
  className = ""
}: Omit<AvailabilityDisplayProps, 'showLastActive'>) {
  const { summary, hasAvailability } = generateAvailabilityDisplay(availability);
  
  if (!hasAvailability) {
    return (
      <div className={`text-xs text-slate-500 ${className}`}>
        Availability not specified
      </div>
    );
  }
  
  return (
    <div className={`text-xs text-slate-600 ${className}`}>
      <div className="font-medium mb-1">Available:</div>
      <div className="text-slate-500">{summary}</div>
    </div>
  );
}
