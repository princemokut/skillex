/**
 * Utility functions for formatting and displaying user availability
 */

interface AvailabilitySlot {
  day: number; // 0-6 (Sunday-Saturday)
  hour: number; // 0-23
  available: boolean;
}

interface TimeBlock {
  start: number;
  end: number;
}

interface DayAvailability {
  day: number;
  dayName: string;
  timeBlocks: TimeBlock[];
  totalSlots: number;
}

interface AvailabilityPattern {
  weekdayBlocks: TimeBlock[];
  weekendBlocks: TimeBlock[];
  hasWeekdayAvailability: boolean;
  hasWeekendAvailability: boolean;
  dayAvailability: DayAvailability[];
}

/**
 * Format hour number to readable time string
 */
export function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

/**
 * Group consecutive hours into time blocks
 */
function getTimeBlocks(hours: number[]): TimeBlock[] {
  if (hours.length === 0) return [];
  
  const sortedHours = [...hours].sort((a, b) => a - b);
  const blocks: TimeBlock[] = [];
  let currentBlock = { start: sortedHours[0], end: sortedHours[0] };
  
  for (let i = 1; i < sortedHours.length; i++) {
    if (sortedHours[i] === currentBlock.end + 1) {
      // Consecutive hour, extend current block
      currentBlock.end = sortedHours[i];
    } else {
      // Gap found, save current block and start new one
      blocks.push({ ...currentBlock });
      currentBlock = { start: sortedHours[i], end: sortedHours[i] };
    }
  }
  blocks.push(currentBlock);
  return blocks;
}

/**
 * Analyze availability and return structured pattern data
 */
export function analyzeAvailability(availability: AvailabilitySlot[]): AvailabilityPattern {
  const availableSlots = availability.filter(slot => slot.available);
  const days = [...new Set(availableSlots.map(slot => slot.day))];
  
  // Get time blocks for each day separately
  const dayAvailability: DayAvailability[] = days.map(day => {
    const daySlots = availableSlots.filter(slot => slot.day === day);
    const dayHours = daySlots.map(slot => slot.hour);
    const timeBlocks = getTimeBlocks(dayHours);
    
    return {
      day,
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day],
      timeBlocks,
      totalSlots: daySlots.length
    };
  });
  
  // Group by day patterns (weekdays vs weekends)
  const weekdays = dayAvailability.filter(d => d.day >= 1 && d.day <= 5); // Mon-Fri
  const weekends = dayAvailability.filter(d => d.day === 0 || d.day === 6); // Sun, Sat
  
  // Get common time patterns
  const getCommonTimeBlocks = (dayGroup: DayAvailability[]) => {
    if (dayGroup.length === 0) return [];
    
    // Find hours that are common across all days in the group
    const allHours = dayGroup.flatMap(d => d.timeBlocks.flatMap(block => 
      Array.from({ length: block.end - block.start + 1 }, (_, i) => block.start + i)
    ));
    
    const hourCounts = allHours.reduce((acc, hour) => {
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    // Only include hours that appear on ALL days in the group
    const commonHours = Object.entries(hourCounts)
      .filter(([_, count]) => count === dayGroup.length)
      .map(([hour, _]) => parseInt(hour))
      .sort((a, b) => a - b);
    
    return getTimeBlocks(commonHours);
  };
  
  const weekdayBlocks = getCommonTimeBlocks(weekdays);
  const weekendBlocks = getCommonTimeBlocks(weekends);
  
  return {
    weekdayBlocks,
    weekendBlocks,
    hasWeekdayAvailability: weekdayBlocks.length > 0,
    hasWeekendAvailability: weekendBlocks.length > 0,
    dayAvailability
  };
}

/**
 * Format time block for display
 */
export function formatTimeBlock(block: TimeBlock): string {
  const startTime = formatHour(block.start);
  const endTime = formatHour(block.end + 1);
  return `${startTime} - ${endTime}`;
}

/**
 * Generate availability summary text for matches page
 */
export function generateAvailabilitySummary(availability: AvailabilitySlot[]): string {
  const pattern = analyzeAvailability(availability);
  const parts: string[] = [];
  
  if (pattern.hasWeekdayAvailability) {
    const weekdayTimes = pattern.weekdayBlocks.map(formatTimeBlock).join(', ');
    parts.push(`Weekdays ${weekdayTimes}`);
  }
  
  if (pattern.hasWeekendAvailability) {
    const weekendTimes = pattern.weekendBlocks.map(formatTimeBlock).join(', ');
    parts.push(`Weekends ${weekendTimes}`);
  }
  
  return parts.join('\n• ');
}

/**
 * Generate detailed availability display for profile cards
 */
export function generateAvailabilityDisplay(availability: AvailabilitySlot[]): {
  summary: string;
  hasAvailability: boolean;
  weekdayBlocks: string[];
  weekendBlocks: string[];
} {
  const pattern = analyzeAvailability(availability);
  
  const weekdayBlocks = pattern.weekdayBlocks.map(formatTimeBlock);
  const weekendBlocks = pattern.weekendBlocks.map(formatTimeBlock);
  
  const summary = generateAvailabilitySummary(availability);
  
  return {
    summary,
    hasAvailability: pattern.hasWeekdayAvailability || pattern.hasWeekendAvailability,
    weekdayBlocks,
    weekendBlocks
  };
}

/**
 * Get last active time (mock implementation - would use real data)
 */
export function getLastActiveTime(): string {
  // This would typically come from user activity data
  const daysAgo = Math.floor(Math.random() * 7) + 1;
  return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
}
