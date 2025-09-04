"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarUrl } from "@/lib/avatars";
import { Users, Clock, MapPin, Star } from "lucide-react";

/**
 * Matches page showing potential skill exchange partners
 * Displays matches with skill overlap and availability
 */
export default function MatchesPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  // Mock data for now - will be replaced with API calls
  const mockMatches = [
    {
      id: "1",
      name: "Sarah Johnson",
      handle: "sarahj",
      location: "San Francisco, CA",
      bio: "Frontend developer passionate about React and design systems. Love teaching and learning new technologies.",
      avatar_url: "",
      skills: {
        teach: [
          { name: "React", level: "expert" },
          { name: "TypeScript", level: "advanced" },
          { name: "UI Design", level: "intermediate" }
        ],
        learn: [
          { name: "Python", level: "beginner" },
          { name: "Machine Learning", level: "beginner" }
        ]
      },
      availability: "Weekdays 6-8 PM, Weekends 10 AM-2 PM",
      matchScore: 85,
      whyMatch: "You both want to learn Python and can teach each other React/TypeScript"
    },
    {
      id: "2",
      name: "Mike Chen",
      handle: "mikechen",
      location: "New York, NY",
      bio: "Data scientist with 5 years experience. Looking to improve my frontend skills and teach data analysis.",
      avatar_url: "",
      skills: {
        teach: [
          { name: "Python", level: "expert" },
          { name: "Data Analysis", level: "expert" },
          { name: "SQL", level: "advanced" }
        ],
        learn: [
          { name: "React", level: "beginner" },
          { name: "JavaScript", level: "intermediate" }
        ]
      },
      availability: "Evenings 7-9 PM, Saturday mornings",
      matchScore: 92,
      whyMatch: "Perfect skill exchange: you teach React, he teaches Python and data analysis"
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      handle: "emilyr",
      location: "Austin, TX",
      bio: "UX designer and content creator. Always excited to learn new skills and share design knowledge.",
      avatar_url: "",
      skills: {
        teach: [
          { name: "UI Design", level: "expert" },
          { name: "Figma", level: "expert" },
          { name: "Content Writing", level: "advanced" }
        ],
        learn: [
          { name: "JavaScript", level: "beginner" },
          { name: "React", level: "beginner" }
        ]
      },
      availability: "Weekdays 5-7 PM, Sunday afternoons",
      matchScore: 78,
      whyMatch: "Great for learning design while teaching programming fundamentals"
    }
  ];

  /**
   * Get skill level color
   */
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-blue-100 text-blue-800";
      case "advanced": return "bg-purple-100 text-purple-800";
      case "expert": return "bg-orange-100 text-orange-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  /**
   * Get match score color
   */
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-slate-600";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Matches</h1>
          <p className="text-slate-600">
            Find your perfect skill exchange partners based on complementary skills and availability
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{mockMatches.length}</p>
                  <p className="text-sm text-slate-600">Potential Matches</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">92%</p>
                  <p className="text-sm text-slate-600">Best Match Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">3</p>
                  <p className="text-sm text-slate-600">Active Exchanges</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockMatches.map((match) => (
            <Card key={match.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={match.avatar_url || generateAvatarUrl(match.name)} alt={match.name} />
                      <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900">{match.name}</h3>
                      <p className="text-sm text-slate-600">@{match.handle}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{match.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getMatchScoreColor(match.matchScore)}`}>
                      {match.matchScore}%
                    </div>
                    <div className="text-xs text-slate-500">Match Score</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Bio */}
                <p className="text-sm text-slate-600">{match.bio}</p>

                {/* Skills */}
                <div className="space-y-3">
                  {/* Skills they can teach */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      Can Teach
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {match.skills.teach.map((skill, index) => (
                        <Badge
                          key={index}
                          className={`text-xs ${getSkillLevelColor(skill.level)}`}
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Skills they want to learn */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Wants to Learn</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.skills.learn.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span>{match.availability}</span>
                </div>

                {/* Why Match */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-900 mb-1">Why this match?</h5>
                  <p className="text-xs text-blue-800">{match.whyMatch}</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    Start Exchange
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (if no matches) */}
        {mockMatches.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No matches yet</h3>
              <p className="text-slate-600 mb-6">
                Complete your profile setup to find your perfect skill exchange partners.
              </p>
              <Button asChild>
                <a href="/onboarding">Complete Setup</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
