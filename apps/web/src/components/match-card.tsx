"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDeterministicAvatarUrl } from "@/lib/avatars";
import { formatRelativeTime } from "@/lib/utils";
import { MapPin, MessageCircle, Star, User, Clock } from "lucide-react";

/**
 * Interface for match data structure
 */
export interface MatchData {
  id: string;
  name: string;
  handle: string;
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
  onMessage?: (matchId: string) => void;
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
  onMessage,
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

  return (
    <Card className={`w-full hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={match.avatar_url || getDeterministicAvatarUrl({ full_name: match.name })} 
                alt={match.name} 
              />
              <AvatarFallback>
                {match.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-slate-900 truncate">
                {match.name}
              </CardTitle>
              <p className="text-sm text-slate-500 truncate">
                @{match.handle}
              </p>
              {match.location && (
                <div className="flex items-center text-xs text-slate-500 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {match.location}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getMatchScoreColor(match.match_score)}`}>
              {match.match_score}%
            </div>
            <div className="text-xs text-slate-500">Match Score</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        {match.bio && (
          <p className="text-sm text-slate-600 line-clamp-2">
            {match.bio}
          </p>
        )}

        {/* Skills to Teach */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
            <Star className="h-4 w-4 mr-1 text-amber-500" />
            Can Teach
          </h4>
          <div className="flex flex-wrap gap-1">
            {match.skills_to_teach.slice(0, 3).map((skill, index) => (
              <Badge 
                key={`teach-${index}`} 
                variant="secondary"
                className={`text-xs ${getSkillLevelColor(skill.level)}`}
              >
                {skill.name} ({skill.level})
              </Badge>
            ))}
            {match.skills_to_teach.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{match.skills_to_teach.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Skills to Learn */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
            <User className="h-4 w-4 mr-1 text-blue-500" />
            Wants to Learn
          </h4>
          <div className="flex flex-wrap gap-1">
            {match.skills_to_learn.slice(0, 3).map((skill, index) => (
              <Badge 
                key={`learn-${index}`} 
                variant="outline"
                className={`text-xs ${getSkillLevelColor(skill.level)}`}
              >
                {skill.name} ({skill.level})
              </Badge>
            ))}
            {match.skills_to_learn.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{match.skills_to_learn.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Common Skills */}
        {match.common_skills.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">
              Common Skills
            </h4>
            <div className="flex flex-wrap gap-1">
              {match.common_skills.map((skill, index) => (
                <Badge 
                  key={`common-${index}`} 
                  variant="default"
                  className="text-xs bg-primary-100 text-primary-700 border-primary-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Availability Summary */}
        {match.availability_summary && (
          <div className="flex items-center text-xs text-slate-500">
            <Clock className="h-3 w-3 mr-1" />
            {match.availability_summary}
          </div>
        )}

        {/* Last Active */}
        {match.last_active && (
          <div className="text-xs text-slate-400">
            Last active {formatRelativeTime(new Date(match.last_active))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
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
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onMessage?.(match.id)}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
