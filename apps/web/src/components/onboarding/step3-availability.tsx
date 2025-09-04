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
   * Get availability summary
   */
  const getAvailabilitySummary = () => {
    const availableSlots = data.availability.filter(slot => slot.available);
    const days = [...new Set(availableSlots.map(slot => slot.day))];
    const hours = [...new Set(availableSlots.map(slot => slot.hour))];
    
    return {
      totalSlots: availableSlots.length,
      days: days.length,
      hours: hours.length,
      timeRange: hours.length > 0 ? {
        start: Math.min(...hours),
        end: Math.max(...hours)
      } : null
    };
  };

  const summary = getAvailabilitySummary();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-slate-600">
          When are you available for skill exchanges? Select your preferred times.
        </p>
      </div>

      {/* Timezone Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Your Timezone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-slate-600">
            {timezone || "Detecting timezone..."}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Times are shown in your local timezone. Others will see them in their timezone.
          </p>
        </CardContent>
      </Card>

      {/* Heatmap Picker */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Clock className="h-4 w-4" />
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
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <h4 className="font-medium text-slate-900 mb-2">Availability Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-primary-600">{summary.totalSlots}</div>
                  <div className="text-slate-600">Time Slots</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">{summary.days}</div>
                  <div className="text-slate-600">Days</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">
                    {summary.timeRange ? `${summary.timeRange.start}:00 - ${summary.timeRange.end + 1}:00` : "N/A"}
                  </div>
                  <div className="text-slate-600">Time Range</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">💡 Tips for Better Matches</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Select multiple time slots across different days</li>
          <li>• Consider your most productive hours</li>
          <li>• You can always update your availability later</li>
          <li>• More availability = more potential matches</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="submit" disabled={isValidating}>
          {isValidating ? "Completing..." : "Complete Setup"}
        </Button>
      </div>
    </form>
  );
}
