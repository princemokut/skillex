"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCohorts } from "@/hooks/use-cohorts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CohortCreationModal } from "@/components/cohort/cohort-creation-modal";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Plus, 
  MapPin, 
  Clock,
  Eye,
  EyeOff
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { generateAvatarUrl, getUserInitials } from "@/lib/avatars";

/**
 * Cohorts page showing user's cohorts and available cohorts to join
 * Displays cohort overview with members, sessions, and activity
 */
export default function CohortsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    cohorts,
    isLoading,
    error,
    refetchCohorts,
    createCohortMutation,
  } = useCohorts();

  // Redirect if not authenticated
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push("/auth/signin");
    }
    return null;
  }

  const handleCreateCohort = () => {
    setIsCreateModalOpen(true);
  };

  const handleJoinCohort = (cohortId: string) => {
    // TODO: Implement cohort joining
    console.log("Join cohort", cohortId);
  };

  const handleViewCohort = (cohortId: string) => {
    router.push(`/cohorts/${cohortId}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load cohorts. Please try again. {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Cohorts</h1>
            <p className="text-slate-600 mt-2">
              Manage your skill exchange groups and learning sessions
            </p>
          </div>
          <Button onClick={handleCreateCohort} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Cohort
          </Button>
        </div>

        {/* Stats Cards */}
        <Card className="mb-8">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Cohorts */}
              <div className="flex items-start space-x-4">
                <Users className="h-6 w-6 text-primary-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-lg font-bold text-slate-900">
                      {cohorts.length === 1 ? '1 cohort' : `${cohorts.length} cohorts`}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500">
                    All cohorts you've joined or created
                  </p>
                </div>
              </div>

              {/* Sessions */}
              <div className="flex items-start space-x-4">
                <Calendar className="h-6 w-6 text-green-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-lg font-bold text-slate-900">
                      {cohorts.reduce((sum, cohort) => sum + cohort.sessionCount, 0)} sessions
                    </p>
                  </div>
                  <p className="text-sm text-slate-500">
                    Learning sessions across all cohorts
                  </p>
                </div>
              </div>

              {/* Chats */}
              <div className="flex items-start space-x-4">
                <MessageSquare className="h-6 w-6 text-blue-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-lg font-bold text-slate-900">
                      {cohorts.filter(c => c.lastMessageAt).length} chats
                    </p>
                  </div>
                  <p className="text-sm text-slate-500">
                    Active conversations with recent messages
                  </p>
                </div>
              </div>

              {/* Resources */}
              <div className="flex items-start space-x-4">
                <FileText className="h-6 w-6 text-purple-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-lg font-bold text-slate-900">
                      {cohorts.reduce((sum, cohort) => sum + cohort.artifactCount, 0)} resources
                    </p>
                  </div>
                  <p className="text-sm text-slate-500">
                    Documents, files, and shared materials
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cohorts Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-8 bg-slate-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : cohorts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cohorts.map((cohort) => (
              <Card key={cohort.id} className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full">
                <CardHeader className="pb-4">
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-bold text-slate-900">
                      {cohort.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4" />
                      {cohort.city || 'Remote'}
                      <span>•</span>
                      <Clock className="h-4 w-4" />
                      {cohort.weeks} weeks
                      <span>•</span>
                      {cohort.visibility === 'public' ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      )}
                      <Badge variant={cohort.visibility === 'public' ? 'default' : 'secondary'} className="text-xs">
                        {cohort.visibility}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col space-y-4">
                  {/* Members */}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600">
                      {cohort.members.length} members
                    </span>
                  </div>

                  {/* Member Avatars */}
                  <div className="flex -space-x-2">
                    {cohort.members.slice(0, 4).map((member, index) => {
                      const memberName = `User ${member.userId?.slice(-4) || 'Default'}`;
                      return (
                        <Avatar key={member.userId || index} className="h-8 w-8 border-2 border-white">
                          <AvatarImage src={generateAvatarUrl(memberName, 'dicebear')} />
                          <AvatarFallback className="text-xs">
                            {getUserInitials(memberName)}
                          </AvatarFallback>
                        </Avatar>
                      );
                    })}
                    {cohort.members.length > 4 && (
                      <div className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-slate-600">+{cohort.members.length - 4}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600">{cohort.sessionCount} sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600">{cohort.artifactCount} resources</span>
                    </div>
                  </div>

                  {/* Last Activity */}
                  {cohort.lastMessageAt && (
                    <div className="text-xs text-slate-500">
                      Last activity {formatDistanceToNow(cohort.lastMessageAt)} ago
                    </div>
                  )}

                  {/* Spacer to push buttons to bottom */}
                  <div className="flex-1"></div>

                  {/* Actions - Sticky at bottom */}
                  <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleViewCohort(cohort.id!)}
                    >
                      View Cohort
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No cohorts yet</h3>
            <p className="text-slate-600 mb-6">
              Create your first cohort or join an existing one to start learning together.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleCreateCohort}>Create Cohort</Button>
              <Button variant="outline">Browse Public Cohorts</Button>
            </div>
          </div>
        )}
      </div>

      {/* Cohort Creation Modal */}
      <CohortCreationModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
