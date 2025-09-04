"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AvailabilitySlot {
  day: number; // 0-6 (Sunday-Saturday)
  hour: number; // 0-23
  available: boolean;
}

interface HeatmapPickerProps {
  availability: AvailabilitySlot[];
  onChange: (availability: AvailabilitySlot[]) => void;
}

/**
 * HeatmapPicker component for selecting availability
 * Displays a 7x24 grid where users can click to toggle availability
 */
export function HeatmapPicker({ availability, onChange }: HeatmapPickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<boolean | null>(null);

  const days = [
    { label: "Sun", short: "S" },
    { label: "Mon", short: "M" },
    { label: "Tue", short: "T" },
    { label: "Wed", short: "W" },
    { label: "Thu", short: "T" },
    { label: "Fri", short: "F" },
    { label: "Sat", short: "S" },
  ];

  const hours = Array.from({ length: 24 }, (_, i) => i);

  /**
   * Initialize availability grid if empty
   */
  useEffect(() => {
    if (availability.length === 0) {
      const initialAvailability: AvailabilitySlot[] = [];
      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
          initialAvailability.push({
            day,
            hour,
            available: false,
          });
        }
      }
      onChange(initialAvailability);
    }
  }, [availability.length, onChange]);

  /**
   * Get availability for a specific day and hour
   */
  const getAvailability = (day: number, hour: number): boolean => {
    const slot = availability.find(s => s.day === day && s.hour === hour);
    return slot?.available || false;
  };

  /**
   * Toggle availability for a specific slot
   */
  const toggleAvailability = (day: number, hour: number) => {
    const newAvailability = availability.map(slot => {
      if (slot.day === day && slot.hour === hour) {
        return { ...slot, available: !slot.available };
      }
      return slot;
    });
    onChange(newAvailability);
  };

  /**
   * Handle mouse down - start drag operation
   */
  const handleMouseDown = (day: number, hour: number) => {
    const currentValue = getAvailability(day, hour);
    setDragValue(!currentValue);
    setIsDragging(true);
    toggleAvailability(day, hour);
  };

  /**
   * Handle mouse enter - continue drag operation
   */
  const handleMouseEnter = (day: number, hour: number) => {
    if (isDragging && dragValue !== null) {
      const currentValue = getAvailability(day, hour);
      if (currentValue !== dragValue) {
        toggleAvailability(day, hour);
      }
    }
  };

  /**
   * Handle mouse up - end drag operation
   */
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragValue(null);
  };

  /**
   * Format hour for display
   */
  const formatHour = (hour: number): string => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };

  /**
   * Get count of available slots for a day
   */
  const getDayCount = (day: number): number => {
    return availability.filter(slot => slot.day === day && slot.available).length;
  };

  return (
    <div className="space-y-4">
      {/* Header with day labels */}
      <div className="grid grid-cols-8 gap-1">
        <div className="text-xs text-slate-500 font-medium"></div>
        {days.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-slate-500 font-medium mb-1">
              {day.short}
            </div>
            <div className="text-xs text-slate-400">
              {getDayCount(index)}
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="grid grid-cols-8 gap-1">
        {/* Hour labels */}
        <div className="space-y-1">
          {hours.map(hour => (
            <div
              key={hour}
              className="h-6 flex items-center text-xs text-slate-500 pr-2"
            >
              {hour % 4 === 0 && (
                <span className="text-right w-full">
                  {formatHour(hour)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Availability grid */}
        {days.map((_, dayIndex) => (
          <div key={dayIndex} className="space-y-1">
            {hours.map(hour => {
              const isAvailable = getAvailability(dayIndex, hour);
              return (
                <button
                  key={`${dayIndex}-${hour}`}
                  type="button"
                  className={cn(
                    "h-6 w-full rounded-sm border transition-all duration-150",
                    "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
                    isAvailable
                      ? "bg-primary-500 border-primary-600 hover:bg-primary-600"
                      : "bg-slate-100 border-slate-200 hover:bg-slate-200"
                  )}
                  onMouseDown={() => handleMouseDown(dayIndex, hour)}
                  onMouseEnter={() => handleMouseEnter(dayIndex, hour)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  title={`${days[dayIndex].label} ${formatHour(hour)} - ${isAvailable ? 'Available' : 'Not available'}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-slate-100 border border-slate-200 rounded-sm"></div>
          <span className="text-slate-600">Not available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-primary-500 border border-primary-600 rounded-sm"></div>
          <span className="text-slate-600">Available</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-slate-500">
        Click and drag to select your available times
      </div>
    </div>
  );
}
