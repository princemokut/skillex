"use client";

import { useState, useEffect, useRef } from "react";
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
 * Supports keyboard navigation and screen reader accessibility
 */
export function HeatmapPicker({ availability, onChange }: HeatmapPickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<boolean | null>(null);
  const [focusedSlot, setFocusedSlot] = useState<{ day: number; hour: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

  /**
   * Handle keyboard navigation for the heatmap grid
   */
  const handleKeyDown = (e: React.KeyboardEvent, day: number, hour: number) => {
    if (!focusedSlot) {
      setFocusedSlot({ day, hour });
      return;
    }

    let newDay = focusedSlot.day;
    let newHour = focusedSlot.hour;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newHour = Math.max(0, focusedSlot.hour - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newHour = Math.min(23, focusedSlot.hour + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newDay = Math.max(0, focusedSlot.day - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newDay = Math.min(6, focusedSlot.day + 1);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        toggleAvailability(day, hour);
        return;
      case 'Home':
        e.preventDefault();
        newHour = 0;
        break;
      case 'End':
        e.preventDefault();
        newHour = 23;
        break;
      case 'PageUp':
        e.preventDefault();
        newHour = Math.max(0, focusedSlot.hour - 4);
        break;
      case 'PageDown':
        e.preventDefault();
        newHour = Math.min(23, focusedSlot.hour + 4);
        break;
      default:
        return;
    }

    setFocusedSlot({ day: newDay, hour: newHour });
    
    // Focus the new slot
    const newSlotElement = document.querySelector(`[data-slot="${newDay}-${newHour}"]`) as HTMLButtonElement;
    newSlotElement?.focus();
  };

  /**
   * Handle focus events for keyboard navigation
   */
  const handleFocus = (day: number, hour: number) => {
    setFocusedSlot({ day, hour });
  };

  /**
   * Get accessibility label for a time slot
   */
  const getSlotLabel = (day: number, hour: number): string => {
    const isAvailable = getAvailability(day, hour);
    const dayName = days[day].label;
    const timeString = formatHour(hour);
    return `${dayName} ${timeString}, ${isAvailable ? 'available' : 'not available'}`;
  };

  return (
    <div className="space-y-4">
      {/* Instructions for screen readers */}
      <div className="sr-only">
        <p>
          Use arrow keys to navigate the availability grid. Press Space or Enter to toggle availability. 
          Press Home to go to the first hour, End to go to the last hour, Page Up to go up 4 hours, 
          and Page Down to go down 4 hours.
        </p>
      </div>

      {/* Header with day labels */}
      <div className="grid grid-cols-8 gap-1" role="row" aria-label="Day headers">
        <div className="text-xs text-slate-500 font-medium" role="columnheader" aria-label="Time column"></div>
        {days.map((day, index) => (
          <div key={index} className="text-center" role="columnheader" aria-label={`${day.label} availability`}>
            <div className="text-xs text-slate-500 font-medium mb-1">
              {day.short}
            </div>
            <div className="text-xs text-slate-400" aria-label={`${getDayCount(index)} available hours`}>
              {getDayCount(index)}
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div 
        ref={gridRef}
        className="space-y-1" 
        role="grid" 
        aria-label="Weekly availability schedule"
        tabIndex={0}
      >
        {/* Each row represents one hour across all days */}
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-8 gap-1" role="row" aria-label={`${formatHour(hour)} availability`}>
            {/* Hour label for this row */}
            <div
              className="h-6 flex items-center text-xs text-slate-500 pr-2"
              role="rowheader"
              aria-label={hour % 4 === 0 ? formatHour(hour) : undefined}
            >
              {hour % 4 === 0 && (
                <span className="text-right w-full">
                  {formatHour(hour)}
                </span>
              )}
            </div>

            {/* Availability slots for each day at this hour */}
            {days.map((_, dayIndex) => {
              const isAvailable = getAvailability(dayIndex, hour);
              const isFocused = focusedSlot?.day === dayIndex && focusedSlot?.hour === hour;
              return (
                <button
                  key={`${dayIndex}-${hour}`}
                  type="button"
                  data-slot={`${dayIndex}-${hour}`}
                  role="gridcell"
                  aria-label={getSlotLabel(dayIndex, hour)}
                  aria-pressed={isAvailable}
                  tabIndex={isFocused ? 0 : -1}
                  className={cn(
                    "h-6 w-full rounded-sm border transition-all duration-150",
                    "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
                    isAvailable
                      ? "bg-primary-500 border-primary-600 hover:bg-primary-600"
                      : "bg-slate-100 border-slate-200 hover:bg-slate-200",
                    isFocused && "ring-2 ring-primary-500 ring-offset-1"
                  )}
                  onMouseDown={() => handleMouseDown(dayIndex, hour)}
                  onMouseEnter={() => handleMouseEnter(dayIndex, hour)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onKeyDown={(e) => handleKeyDown(e, dayIndex, hour)}
                  onFocus={() => handleFocus(dayIndex, hour)}
                  title={`${days[dayIndex].label} ${formatHour(hour)} - ${isAvailable ? 'Available' : 'Not available'}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm" role="legend" aria-label="Availability legend">
        <div className="flex items-center space-x-2">
          <div 
            className="w-4 h-4 bg-slate-100 border border-slate-200 rounded-sm" 
            aria-hidden="true"
            role="img"
            aria-label="Not available indicator"
          ></div>
          <span className="text-slate-600">Not available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div 
            className="w-4 h-4 bg-primary-500 border border-primary-600 rounded-sm" 
            aria-hidden="true"
            role="img"
            aria-label="Available indicator"
          ></div>
          <span className="text-slate-600">Available</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-slate-500" role="note" aria-label="Usage instructions">
        Click and drag to select your available times, or use keyboard navigation with arrow keys
      </div>
    </div>
  );
}
