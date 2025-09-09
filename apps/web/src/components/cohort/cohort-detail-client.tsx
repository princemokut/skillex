"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
  Plus,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Building2,
  Briefcase,
  Handshake,
  GraduationCap,
  Zap
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { CohortSessions } from "@/components/cohort/cohort-sessions";
import { CohortChat } from "@/components/cohort/cohort-chat";
import { CohortArtifacts } from "@/components/cohort/cohort-artifacts";
import { generateAvatarUrl, getUserInitials } from "@/lib/avatars";
import { CohortWithMembers } from "@/api-client/cohorts";

interface CohortDetailClientProps {
  cohort: CohortWithMembers;
  cohortId: string;
}

/**
 * Client component for cohort detail page interactive functionality
 * Handles state management and user interactions
 */
export function CohortDetailClient({ cohort, cohortId }: CohortDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const handleBack = () => {
    router.push("/cohorts");
  };

  const handleInviteMembers = () => {
    // TODO: Implement member invitation
    console.log("Invite members");
  };

  const handleShareCohort = () => {
    // TODO: Implement cohort sharing
    console.log("Share cohort");
  };

  const filteredMembers = cohort.members.filter(member => {
    const memberName = `User ${member.userId?.slice(-4) || 'Default'}`;
    return memberName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 py-0 sm:py-6 lg:py-8 px-0 sm:px-6 lg:px-8 mt-0 pb-20 md:pb-48">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 px-4 sm:px-0 pt-4 sm:pt-0">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cohorts
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {cohort.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {cohort.city || 'Remote'}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {cohort.weeks} weeks
                </div>
                <div className="flex items-center gap-2">
                  {cohort.visibility === 'public' ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  )}
                  <Badge variant={cohort.visibility === 'public' ? 'default' : 'secondary'}>
                    {cohort.visibility}
                  </Badge>
                </div>
              </div>
              <p className="text-slate-600 max-w-2xl">
                A focused learning group for mastering React and TypeScript through hands-on projects and peer collaboration.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleInviteMembers}>
                <Plus className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
              <Button variant="outline" onClick={handleShareCohort}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{cohort.members.length}</p>
                  <p className="text-sm text-slate-600">Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{cohort.sessionCount}</p>
                  <p className="text-sm text-slate-600">Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{cohort.artifactCount}</p>
                  <p className="text-sm text-slate-600">Resources</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {cohort.lastMessageAt ? 'Active' : '0'}
                  </p>
                  <p className="text-sm text-slate-600">Chat Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Members Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Members ({cohort.members.length})
                  </CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button size="sm" onClick={handleInviteMembers}>
                      <Plus className="h-4 w-4 mr-2" />
                      Invite
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {filteredMembers.map((member, index) => {
                    const memberName = `User ${member.userId?.slice(-4) || 'Default'}`;
                    const isOwner = member.role === 'teacher';
                    const isOnline = Math.random() > 0.3; // Mock online status
                    
                    return (
                      <div key={member.userId || index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={generateAvatarUrl(memberName, 'dicebear')} />
                              <AvatarFallback>
                                {getUserInitials(memberName)}
                              </AvatarFallback>
                            </Avatar>
                            {isOnline && (
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900">{memberName}</p>
                              {isOwner && (
                                <Badge variant="default" className="text-xs">
                                  Owner
                                </Badge>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {member.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">
                              Joined {formatDistanceToNow(member.joinedAt)} ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">User 1234</span> shared a new message in the chat
                      </p>
                      <p className="text-xs text-slate-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">User 5678</span> uploaded a new resource
                      </p>
                      <p className="text-xs text-slate-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">
                        New session scheduled for tomorrow at 2:00 PM
                      </p>
                      <p className="text-xs text-slate-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <CohortSessions 
              cohortId={cohortId} 
              sessions={[]} 
              isOwner={false} 
            />
          </TabsContent>

          <TabsContent value="chat">
            <CohortChat 
              cohortId={cohortId} 
              messages={[]} 
              isMember={true} 
            />
          </TabsContent>

          <TabsContent value="resources">
            <CohortArtifacts 
              cohortId={cohortId} 
              artifacts={[]} 
              isMember={true} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
