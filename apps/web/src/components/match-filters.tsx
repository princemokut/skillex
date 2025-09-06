"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, X, MapPin, Clock } from "lucide-react";

/**
 * Interface for filter options
 */
export interface MatchFilters {
  search: string;
  skillLevel: string;
  location: string;
  availability: string;
  sortBy: string;
  selectedSkills: string[];
}

interface MatchFiltersProps {
  filters: MatchFilters;
  onFiltersChange: (filters: MatchFilters) => void;
  availableSkills: string[];
  className?: string;
}

/**
 * MatchFilters component for filtering and searching matches
 * Provides search, skill level, location, and availability filters
 */
export function MatchFilters({ 
  filters, 
  onFiltersChange, 
  availableSkills,
  className 
}: MatchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof MatchFilters, value: string | string[]) => {
    // Convert "any" values to empty strings for API compatibility
    const processedValue = value === "any" ? "" : value;
    onFiltersChange({
      ...filters,
      [key]: processedValue,
    });
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.selectedSkills.includes(skill)
      ? filters.selectedSkills.filter(s => s !== skill)
      : [...filters.selectedSkills, skill];
    
    handleFilterChange('selectedSkills', newSkills);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      skillLevel: 'any',
      location: '',
      availability: 'any',
      sortBy: 'match_score',
      selectedSkills: [],
    });
  };

  const hasActiveFilters = filters.search || 
    (filters.skillLevel && filters.skillLevel !== 'any') || 
    filters.location || 
    (filters.availability && filters.availability !== 'any') || 
    filters.selectedSkills.length > 0;

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-slate-500 hover:text-slate-700 h-7 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 px-2 text-xs"
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-3">
        {/* Skill Levels Legend */}
        <div>
          <div className="text-xs font-medium text-slate-700 mb-1">Skill Levels:</div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded bg-green-100 border border-green-200 mr-1"></span>
              <span className="text-slate-500">Beginner</span>
            </div>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded bg-blue-100 border border-blue-200 mr-1"></span>
              <span className="text-slate-500">Intermediate</span>
            </div>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded bg-orange-100 border border-orange-200 mr-1"></span>
              <span className="text-slate-500">Advanced</span>
            </div>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded bg-red-100 border border-red-200 mr-1"></span>
              <span className="text-slate-500">Expert</span>
            </div>
          </div>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="skillLevel" className="text-xs font-medium mb-1 block">
              Skill Level
            </Label>
            <Select 
              value={filters.skillLevel} 
              onValueChange={(value) => handleFilterChange('skillLevel', value)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Any level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any level</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location" className="text-xs font-medium mb-1 block">
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="location"
                placeholder="City, Country"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="pl-10 h-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="availability" className="text-xs font-medium mb-1 block">
                  Availability
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Select 
                    value={filters.availability} 
                    onValueChange={(value) => handleFilterChange('availability', value)}
                  >
                    <SelectTrigger className="pl-10 h-9 text-sm">
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="morning">Morning (6AM-12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM-6PM)</SelectItem>
                      <SelectItem value="evening">Evening (6PM-12AM)</SelectItem>
                      <SelectItem value="weekend">Weekends only</SelectItem>
                      <SelectItem value="weekday">Weekdays only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="sortBy" className="text-xs font-medium mb-1 block">
                  Sort by
                </Label>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match_score">Match Score</SelectItem>
                    <SelectItem value="last_active">Last Active</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Skills Filter */}
            <div>
              <Label className="text-xs font-medium mb-1 block">
                Skills
              </Label>
              <div className="max-h-24 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {availableSkills.slice(0, 12).map((skill) => (
                    <Badge
                      key={skill}
                      variant={filters.selectedSkills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary-50 text-xs h-6"
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                {availableSkills.length > 12 && (
                  <p className="text-xs text-slate-500 mt-1">
                    Showing 12 skills. Use search for others.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-3 border-t border-slate-100">
            <div className="flex flex-wrap gap-1">
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs h-6 px-2">
                  Search: {filters.search.length > 10 ? filters.search.slice(0, 10) + '...' : filters.search}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('search', '')}
                  />
                </Badge>
              )}
              {filters.skillLevel && filters.skillLevel !== 'any' && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs h-6 px-2">
                  Level: {filters.skillLevel}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('skillLevel', 'any')}
                  />
                </Badge>
              )}
              {filters.location && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs h-6 px-2">
                  Location: {filters.location.length > 10 ? filters.location.slice(0, 10) + '...' : filters.location}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('location', '')}
                  />
                </Badge>
              )}
              {filters.availability && filters.availability !== 'any' && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs h-6 px-2">
                  Time: {filters.availability}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('availability', 'any')}
                  />
                </Badge>
              )}
              {filters.selectedSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1 text-xs h-6 px-2">
                  {skill.length > 12 ? skill.slice(0, 12) + '...' : skill}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleSkillToggle(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
