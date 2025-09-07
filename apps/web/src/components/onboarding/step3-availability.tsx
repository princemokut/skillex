"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeatmapPicker } from "@/components/ui/heatmap-picker";
import { Clock, MapPin } from "lucide-react";

interface AvailabilitySlot {
  day: number; // 0-6 (Sunday-Saturday)
  hour: number; // 0-23
  available: boolean;
}

interface OnboardingStep3Props {
  data: {
    availability: AvailabilitySlot[];
  };
  onUpdate: (data: { availability: AvailabilitySlot[] }) => void;
  onComplete: () => void;
  onPrevious: () => void;
}

/**
 * Step 3: Availability selection
 * Users set their availability using a 7x24 heatmap
 */
export function OnboardingStep3({ data, onUpdate, onComplete, onPrevious }: OnboardingStep3Props) {
  const [isValidating, setIsValidating] = useState(false);
  const [timezone, setTimezone] = useState("");

  // Initialize timezone
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, []);

  /**
   * Handle availability changes from HeatmapPicker
   */
  const handleAvailabilityChange = (availability: AvailabilitySlot[]) => {
    onUpdate({ availability });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const availableSlots = data.availability.filter(slot => slot.available);
    
    if (availableSlots.length === 0) {
      // You might want to show a warning instead of blocking
      console.warn("No availability selected");
    }

    setIsValidating(true);
    
    try {
      onComplete();
    } catch (error) {
      console.error("Error in step 3:", error);
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Get availability summary with proper time block detection per day
   */
  const getAvailabilitySummary = () => {
    const availableSlots = data.availability.filter(slot => slot.available);
    const days = [...new Set(availableSlots.map(slot => slot.day))];
    
    // Group consecutive hours into time blocks
    const getTimeBlocks = (hours: number[]) => {
      if (hours.length === 0) return [];
      
      const sortedHours = [...hours].sort((a, b) => a - b);
      const blocks: { start: number; end: number }[] = [];
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
    };
    
    // Get time blocks for each day separately
    const dayAvailability = days.map(day => {
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
    const getCommonTimeBlocks = (dayGroup: typeof dayAvailability) => {
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
      totalSlots: availableSlots.length,
      days: days.length,
      dayAvailability,
      weekdayBlocks,
      weekendBlocks,
      hasWeekdayAvailability: weekdayBlocks.length > 0,
      hasWeekendAvailability: weekendBlocks.length > 0
    };
  };

  const summary = getAvailabilitySummary();

  return (
    <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Availability selection form">
      {/* Form Description for Screen Readers */}
      <div className="sr-only">
        <h2>Availability Selection - Step 3 of 3</h2>
        <p>When are you available for skill exchanges? Select your preferred times using the interactive grid.</p>
      </div>

      <div className="text-center mb-6">
        <p className="text-slate-600">
          When are you available for skill exchanges? Select your preferred times.
        </p>
      </div>

      {/* Timezone Info */}
      <Card role="region" aria-label="Timezone information">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span>Your Timezone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-slate-600" aria-live="polite">
            {timezone || "Detecting timezone..."}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Times are shown in your local timezone. Others will see them in their timezone.
          </p>
        </CardContent>
      </Card>

      {/* Heatmap Picker */}
      <Card role="region" aria-label="Availability selection grid">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>Select Your Availability</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <HeatmapPicker
            availability={data.availability}
            onChange={handleAvailabilityChange}
          />
        </CardContent>
      </Card>

      {/* Availability Summary */}
      {summary.totalSlots > 0 && (
        <Card role="region" aria-label="Availability summary">
          <CardContent className="pt-4">
            <div className="text-center">
              <h4 className="font-medium text-slate-900 mb-2">Availability Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-sm" role="group" aria-label="Availability statistics">
                <div role="listitem">
                  <div className="text-2xl font-bold text-primary-600" aria-label={`${summary.totalSlots} time slots selected`}>
                    {summary.totalSlots}
                  </div>
                  <div className="text-slate-600">Time Slots</div>
                </div>
                <div role="listitem">
                  <div className="text-2xl font-bold text-primary-600" aria-label={`${summary.days} days with availability`}>
                    {summary.days}
                  </div>
                  <div className="text-slate-600">Days</div>
                </div>
                <div role="listitem">
                  <div className="text-2xl font-bold text-primary-600" aria-label={`${summary.dayAvailability.length} days configured`}>
                    {summary.dayAvailability.length}
                  </div>
                  <div className="text-slate-600">Days Set</div>
                </div>
              </div>
              
              {/* Availability Pattern Display */}
              <div className="mt-4 text-left">
                <h5 className="text-sm font-medium text-slate-700 mb-3 text-center">Your Availability Pattern:</h5>
                
                {/* Weekdays */}
                {summary.hasWeekdayAvailability && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-slate-600 mb-1">Weekdays:</div>
                    <div className="space-y-1">
                      {summary.weekdayBlocks.map((block, index) => (
                        <div 
                          key={index}
                          className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm mr-2 mb-1"
                          role="listitem"
                          aria-label={`Weekday time block: ${block.start}:00 - ${block.end + 1}:00`}
                        >
                          {block.start}:00 - {block.end + 1}:00
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Weekends */}
                {summary.hasWeekendAvailability && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-slate-600 mb-1">Weekends:</div>
                    <div className="space-y-1">
                      {summary.weekendBlocks.map((block, index) => (
                        <div 
                          key={index}
                          className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm mr-2 mb-1"
                          role="listitem"
                          aria-label={`Weekend time block: ${block.start}:00 - ${block.end + 1}:00`}
                        >
                          {block.start}:00 - {block.end + 1}:00
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Individual Day Details */}
                <details className="mt-3">
                  <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700">
                    View individual day details
                  </summary>
                  <div className="mt-2 space-y-2">
                    {summary.dayAvailability.map((day) => (
                      <div key={day.day} className="text-xs text-slate-600">
                        <span className="font-medium">{day.dayName}:</span>
                        {day.timeBlocks.map((block, index) => (
                          <span key={index} className="ml-2">
                            {block.start}:00-{block.end + 1}:00
                            {index < day.timeBlocks.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 p-4 rounded-lg" role="region" aria-label="Tips for better matches">
        <h4 className="font-medium text-blue-900 mb-2">
          <span aria-hidden="true">💡</span> Tips for Better Matches
        </h4>
        <ul className="text-sm text-blue-800 space-y-1" role="list" aria-label="Availability tips">
          <li role="listitem">• Select multiple time slots across different days</li>
          <li role="listitem">• Consider your most productive hours</li>
          <li role="listitem">• You can always update your availability later</li>
          <li role="listitem">• More availability = more potential matches</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          aria-label="Go back to previous step"
        >
          Previous
        </Button>
        <Button 
          type="submit" 
          disabled={isValidating}
          aria-describedby="complete-help"
        >
          {isValidating ? "Completing..." : "Complete Setup"}
        </Button>
      </div>
      <p id="complete-help" className="sr-only">
        {isValidating 
          ? "Completing your profile setup, please wait"
          : "Complete your profile setup and start using Skillex"
        }
      </p>
    </form>
  );
}
