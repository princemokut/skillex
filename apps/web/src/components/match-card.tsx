"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDeterministicAvatarUrl } from "@/lib/avatars";
import { formatRelativeTime } from "@/lib/utils";
import { MapPin, Star, User, Clock } from "lucide-react";

/**
 * Interface for match data structure
 */
export interface MatchData {
  id: string;
  name: string;
  handle: string;
  title?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  skills_to_teach: Array<{
    name: string;
    level: "beginner" | "intermediate" | "advanced" | "expert";
  }>;
  skills_to_learn: Array<{
    name: string;
    level: "beginner" | "intermediate" | "advanced" | "expert";
  }>;
  common_skills: string[];
  match_score: number;
  last_active?: string;
  availability_summary?: string;
}

interface MatchCardProps {
  match: MatchData;
  onConnect?: (matchId: string) => void;
  onViewProfile?: (matchId: string) => void;
  className?: string;
}

/**
 * MatchCard component for displaying potential skill exchange partners
 * Shows user profile, skills, match score, and action buttons
 */
export function MatchCard({ 
  match, 
  onConnect, 
  onViewProfile, 
  className 
}: MatchCardProps) {
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "expert": return "bg-red-100 text-red-700 border-red-200";
      case "advanced": return "bg-orange-100 text-orange-700 border-orange-200";
      case "intermediate": return "bg-blue-100 text-blue-700 border-blue-200";
      case "beginner": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-gray-600";
  };

  /**
   * Sort skills by proficiency level from beginner to expert
   * @param skills - Array of skills with level property
   * @returns Sorted skills array
   */
  const sortSkillsByLevel = (skills: Array<{ name: string; level: string }>) => {
    const levelOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 };
    return [...skills].sort((a, b) => {
      const aLevel = levelOrder[a.level.toLowerCase() as keyof typeof levelOrder] || 0;
      const bLevel = levelOrder[b.level.toLowerCase() as keyof typeof levelOrder] || 0;
      return aLevel - bLevel;
    });
  };

  return (
    <Card className={`w-full h-full flex flex-col hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage 
                src={match.avatar_url || getDeterministicAvatarUrl({ full_name: match.name })} 
                alt={match.name} 
              />
              <AvatarFallback>
                {match.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-slate-900 truncate" title={match.name}>
                {match.name}
              </CardTitle>
              <p className="text-sm text-slate-500 truncate" title={match.title || `@${match.handle}`}>
                {match.title || `@${match.handle}`}
              </p>
              {match.location && (
                <div className="flex items-center text-xs text-slate-500 mt-1">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate" title={match.location}>{match.location}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0 min-w-0">
            <div className={`text-xl font-bold ${getMatchScoreColor(match.match_score)}`}>
              {match.match_score}%
            </div>
            <div className="text-xs text-slate-500">Match</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Bio */}
        {match.bio && (
          <div className="mb-6">
            <p className="text-sm text-slate-600 line-clamp-2">
              {match.bio}
            </p>
          </div>
        )}

        {/* Skills to Teach */}
        <div className="h-20 mb-10 flex flex-col">
          <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
            <Star className="h-4 w-4 mr-1 text-amber-500" />
            Can Teach
          </h4>
          <div className="flex flex-wrap gap-1 items-start flex-1">
            {sortSkillsByLevel(match.skills_to_teach).slice(0, 3).map((skill, index) => (
              <Badge
                key={`teach-${index}`}
                variant="secondary"
                className={`text-xs h-6 ${getSkillLevelColor(skill.level)}`}
              >
                {skill.name} ({skill.level})
              </Badge>
            ))}
            {match.skills_to_teach.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs h-6 cursor-pointer hover:bg-slate-100"
                title={`View all ${match.skills_to_teach.length} skills`}
              >
                +{match.skills_to_teach.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Skills to Learn */}
        <div className="h-20 mb-10 flex flex-col">
          <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
            <User className="h-4 w-4 mr-1 text-blue-500" />
            Wants to Learn
          </h4>
          <div className="flex flex-wrap gap-1 items-start flex-1">
            {sortSkillsByLevel(match.skills_to_learn).slice(0, 3).map((skill, index) => (
              <Badge
                key={`learn-${index}`}
                variant="outline"
                className={`text-xs h-6 ${getSkillLevelColor(skill.level)}`}
              >
                {skill.name} ({skill.level})
              </Badge>
            ))}
            {match.skills_to_learn.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs h-6 cursor-pointer hover:bg-slate-100"
                title={`View all ${match.skills_to_learn.length} skills`}
              >
                +{match.skills_to_learn.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Common Skills */}
        <div className="h-20 mb-10 flex flex-col">
          <h4 className="text-sm font-medium text-slate-700 mb-2">
            Common Skills
            <span className="text-xs text-slate-500 ml-1">(shared interests)</span>
          </h4>
          <div className="flex flex-wrap gap-1 items-start flex-1">
            {match.common_skills.length > 0 ? (
              <>
                {match.common_skills.slice(0, 3).map((skill, index) => (
                  <Badge
                    key={`common-${index}`}
                    variant="default"
                    className="text-xs h-6 bg-primary-100 text-primary-700 border-primary-200"
                  >
                    {skill}
                  </Badge>
                ))}
                {match.common_skills.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs h-6 cursor-pointer hover:bg-slate-100"
                    title={`View all ${match.common_skills.length} common skills`}
                  >
                    +{match.common_skills.length - 3} more
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-xs text-slate-400 italic">No shared skills</span>
            )}
          </div>
        </div>

        {/* Spacer to push availability/status and buttons to bottom */}
        <div className="flex-1"></div>

        {/* Availability and Status - Sticky above buttons */}
        <div className="space-y-1 mb-4">
          {/* Availability Summary - Line by line */}
          {match.availability_summary && (
            <div className="text-xs text-slate-500">
              <Clock className="h-3 w-3 mr-1 inline" />
              <span className="font-medium">Available:</span>
              <div className="ml-4 mt-1">
                {match.availability_summary.split(', ').map((time, index) => (
                  <div key={index} className="text-xs text-slate-500">
                    • {time}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last Active */}
          {match.last_active && (
            <div className="text-xs text-slate-400">
              Last active {formatRelativeTime(new Date(match.last_active))}
            </div>
          )}
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex gap-2 pt-4 border-t border-slate-100">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onConnect?.(match.id)}
          >
            Connect
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewProfile?.(match.id)}
          >
            Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

