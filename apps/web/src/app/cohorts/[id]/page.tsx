"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCohort } from "@/hooks/use-cohorts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  MapPin, 
  Clock,
  Eye,
  EyeOff,
  ArrowLeft,
  ExternalLink,
  Plus
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { CohortSessions } from "@/components/cohort/cohort-sessions";
import { CohortChat } from "@/components/cohort/cohort-chat";
import { CohortArtifacts } from "@/components/cohort/cohort-artifacts";
import { generateAvatarUrl, getUserInitials } from "@/lib/avatars";

/**
 * Individual cohort page showing detailed cohort information
 * Displays sessions, chat, artifacts, and member management
 */
export default function CohortPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const cohortId = params.id as string;

  const {
    cohort,
    sessions,
    artifacts,
    messages,
    isLoading,
    error,
  } = useCohort(cohortId);

  // Redirect if not authenticated
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push("/auth/signin");
    }
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load cohort. Please try again. {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading || !cohort) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-slate-200 rounded mb-6"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }


  const isOwner = cohort.ownerId === user.id;
  const userMember = cohort.members?.find(member => member.userId === user.id);
  const isMember = !!userMember;
  
  // Check if cohort has started and is private
  const cohortStartDate = cohort.startDate || new Date();
  const hasStarted = new Date() >= cohortStartDate;
  const isPrivate = cohort.visibility === 'private';
  const shouldDisableJoin = isPrivate && hasStarted;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{cohort.title}</h1>
          </div>
          {!isMember && (
            <Button 
              disabled={shouldDisableJoin}
              title={shouldDisableJoin ? "This private cohort has already started" : ""}
            >
              {shouldDisableJoin ? "Cohort Started" : "Join Cohort"}
            </Button>
          )}
        </div>

        {/* Main Layout - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="artifacts">Resources</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Cohort Details Card */}
                <Card>
                  <CardContent className="space-y-4 ">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                      <p className="text-slate-600">
                        A focused learning cohort for {cohort.title?.toLowerCase() || 'this skill'}. 
                        This {cohort.weeks || 6}-week program covers essential concepts and practical applications.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Schedule</h4>
                      <p className="text-slate-600">
                        Started {format(cohort.startDate || new Date(), 'MMM d, yyyy')} • 
                        {cohort.weeks || 6} weeks • 
                        {cohort.city || 'Remote'}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 mb-4">Progress</h4>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (sessions.length / (cohort.weeks || 6)) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-slate-600">
                        {sessions.length} of {cohort.weeks || 6} sessions completed
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sessions Tab */}
              <TabsContent value="sessions">
                <CohortSessions 
                  cohortId={cohortId} 
                  sessions={sessions as any} 
                  isOwner={isOwner}
                />
              </TabsContent>

              {/* Chat Tab */}
              <TabsContent value="chat">
                <CohortChat 
                  cohortId={cohortId} 
                  messages={messages}
                  isMember={isMember}
                />
              </TabsContent>

              {/* Artifacts Tab */}
              <TabsContent value="artifacts">
                <CohortArtifacts 
                  cohortId={cohortId} 
                  artifacts={artifacts as any}
                  isMember={isMember}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Stats and Members */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Project stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats with proper column layout */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-lg font-bold text-slate-900">{cohort.members?.length || 0}</p>
                        <p className="text-sm text-slate-600">Members</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-lg font-bold text-slate-900">{messages.length}</p>
                        <p className="text-sm text-slate-600">Messages</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-lg font-bold text-slate-900">{sessions.length}</p>
                        <p className="text-sm text-slate-600">Sessions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-lg font-bold text-slate-900">{artifacts.length}</p>
                        <p className="text-sm text-slate-600">Resources</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-200"></div>

                {/* Additional Info */}
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{cohort.city || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-2">
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
              </CardContent>
            </Card>

            {/* Members Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Members ({cohort.members?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cohort.members?.map((member, index) => {
                    const userName = `User ${(member.userId || 'U').slice(-4)}`;
                    const avatarUrl = generateAvatarUrl(userName, 'dicebear');
                    const initials = getUserInitials(userName);
                    
                    return (
                      <div key={member.userId || index} className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={avatarUrl} alt={userName} />
                          <AvatarFallback>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {userName}
                          </p>
                          <p className="text-sm text-slate-600">
                            {member.role === 'teacher' ? 'Senior Developer' : 'Software Engineer'}
                          </p>
                        </div>
                        <Badge variant={member.role === 'teacher' ? 'default' : 'secondary'}>
                          {member.role}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
