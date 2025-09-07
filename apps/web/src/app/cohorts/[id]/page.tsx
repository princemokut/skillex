"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
import { useCohortReferrals } from "@/hooks/use-referrals";
import { ReferralCard } from "@/components/referral-card";
import { ReferralRequestModal } from "@/components/referral-request-modal";
import { RequestReferralModal } from "@/components/request-referral-modal";
import { CohortMemberReferralCard } from "@/components/cohort-member-referral-card";
import { ReferralWithType, ReferralContextType, ReferralRequestType } from "@/lib/referral-mock-data";
import { getEligibleCohortMembersForReferrals } from "@/lib/cohort-referral-utils";
import { ReferralStatus } from "@skillex/types";
import { useState } from "react";

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

  // Referral state
  const [activeReferralTab, setActiveReferralTab] = useState<'members' | 'referrals'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Mock current user ID for development
  const MOCK_CURRENT_USER_ID = 'user-1';

  // Mock cohort data for referrals
  const MOCK_COHORT = {
    id: cohortId,
    title: cohort?.title || 'Current Cohort',
    sessionCompletionPercentage: cohortId === 'cohort-1' ? 80 : Math.round(Math.min(100, (sessions.length / (cohort?.weeks || 6)) * 100)),
    isEligible: cohortId === 'cohort-1' ? true : Math.round(Math.min(100, (sessions.length / (cohort?.weeks || 6)) * 100)) >= 75
  };

  // Mock eligible members data
  const [eligibleMembers, setEligibleMembers] = useState(() => 
    getEligibleCohortMembersForReferrals(cohortId, MOCK_CURRENT_USER_ID)
  );

  // Mock referrals data
  const [referrals, setReferrals] = useState<ReferralWithType[]>(() => 
    cohortId === 'cohort-1' ? [
      {
        id: 'referral-1',
        fromUserId: MOCK_CURRENT_USER_ID,
        toUserId: 'user-4',
        context: 'I highly recommend Sarah for the Senior React Developer position at our company. She demonstrated exceptional problem-solving skills during our React & TypeScript cohort sessions.',
        status: 'sent' as ReferralStatus,
        createdAt: new Date('2024-02-10T10:00:00Z'),
        cohortId: cohortId,
        cohortTitle: cohort?.title || 'React & TypeScript Mastery',
        sessionCompletionPercentage: 80,
        isEligible: true,
        contextType: 'job' as ReferralContextType,
        companyName: 'TechCorp Inc.',
        urgency: 'high' as const,
        direction: 'send' as const,
        requestType: 'company_specific' as const,
        fromUser: {
          id: MOCK_CURRENT_USER_ID,
          name: 'John Doe',
          handle: 'johndoe',
          avatar: '/avatars/john.jpg',
          title: 'Senior Software Engineer',
          skills: ['React', 'TypeScript', 'Node.js', 'AWS']
        },
        toUser: {
          id: 'user-4',
          name: 'Sarah Wilson',
          handle: 'sarahw',
          avatar: '/avatars/sarah.jpg',
          title: 'Frontend Developer',
          skills: ['React', 'JavaScript', 'CSS', 'UI/UX']
        }
      },
      {
        id: 'referral-2',
        fromUserId: 'user-2',
        toUserId: MOCK_CURRENT_USER_ID,
        context: 'Can you refer me for opportunities at your company? I\'m looking for a full-stack developer role and would love to work with your team.',
        status: 'sent' as ReferralStatus,
        createdAt: new Date('2024-02-12T14:30:00Z'),
        cohortId: cohortId,
        cohortTitle: cohort?.title || 'React & TypeScript Mastery',
        sessionCompletionPercentage: 80,
        isEligible: true,
        contextType: 'job' as ReferralContextType,
        urgency: 'medium' as const,
        direction: 'request' as const,
        requestType: 'general' as const,
        fromUser: {
          id: 'user-2',
          name: 'Mike Johnson',
          handle: 'mikej',
          avatar: '/avatars/mike.jpg',
          title: 'Full Stack Developer',
          skills: ['React', 'Node.js', 'Python', 'MongoDB']
        },
        toUser: {
          id: MOCK_CURRENT_USER_ID,
          name: 'John Doe',
          handle: 'johndoe',
          avatar: '/avatars/john.jpg',
          title: 'Senior Software Engineer',
          skills: ['React', 'TypeScript', 'Node.js', 'AWS']
        }
      }
    ] : []
  );
  const [referralStats, setReferralStats] = useState({
    totalReferrals: cohortId === 'cohort-1' ? 2 : 0,
    byStatus: {
      sent: cohortId === 'cohort-1' ? 2 : 0,
      accepted: cohortId === 'cohort-1' ? 0 : 0,
      declined: 0
    },
    sessionCompletionPercentage: MOCK_COHORT.sessionCompletionPercentage
  });

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

  /**
   * Get filtered referrals based on search query
   * Returns referrals filtered by search query
   */
  const getFilteredReferrals = (): ReferralWithType[] => {
    if (!searchQuery) return referrals;

    const query = searchQuery.toLowerCase();
    return referrals.filter(referral => 
      referral.context.toLowerCase().includes(query) ||
      referral.fromUser.name.toLowerCase().includes(query) ||
      referral.toUser.name.toLowerCase().includes(query) ||
      (referral.companyName && referral.companyName.toLowerCase().includes(query)) ||
      (referral.projectTitle && referral.projectTitle.toLowerCase().includes(query))
    );
  };

  /**
   * Get filtered members based on search query
   * Returns members filtered by search query
   */
  const getFilteredMembers = () => {
    if (!searchQuery) return eligibleMembers;

    const query = searchQuery.toLowerCase();
    return eligibleMembers.filter(member => 
      member.user?.name.toLowerCase().includes(query) ||
      member.user?.title.toLowerCase().includes(query) ||
      member.user?.handle.toLowerCase().includes(query)
    );
  };

  /**
   * Handle create referral
   * Opens create modal with selected user
   * 
   * @param userId - User ID to create referral for
   */
  const handleCreateReferral = (userId: string) => {
    setSelectedUserId(userId);
    setShowCreateModal(true);
  };

  /**
   * Handle request referral
   * Opens request modal
   */
  const handleRequestReferral = () => {
    setShowRequestModal(true);
  };

  /**
   * Handle referral creation
   * Creates referral and refreshes data
   * 
   * @param referralData - Referral data to create
   */
  const handleReferralCreation = async (referralData: {
    toUserId: string;
    context: string;
    contextType: ReferralContextType;
    companyName?: string;
    projectTitle?: string;
    urgency: 'low' | 'medium' | 'high';
  }) => {
    try {
      // Mock creation - in production, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowCreateModal(false);
      setSelectedUserId('');
      // In production, this would refresh the data
    } catch (error) {
      console.error('Error creating referral:', error);
    }
  };

  /**
   * Handle referral request creation
   * Creates referral request and refreshes data
   * 
   * @param requestData - Request data to create
   */
  const handleReferralRequestCreation = async (requestData: {
    toUserId: string;
    context: string;
    contextType: ReferralContextType;
    requestType: ReferralRequestType;
    companyName?: string;
    projectTitle?: string;
    urgency: 'low' | 'medium' | 'high';
  }) => {
    try {
      // Mock creation - in production, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowRequestModal(false);
      // In production, this would refresh the data
    } catch (error) {
      console.error('Error creating referral request:', error);
    }
  };

  const filteredReferrals = getFilteredReferrals();
  const filteredMembers = getFilteredMembers();

  return (
    // <div className="min-h-screen bg-slate-50">
    //   <div className="max-w-7xl mx-auto p-6">
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 mt-0 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="artifacts">Resources</TabsTrigger>
                <TabsTrigger value="referrals">Referrals</TabsTrigger>
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

              {/* Referrals Tab */}
              <TabsContent value="referrals">
                <div className="space-y-6">
                  {/* Referral Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Cohort Referrals</h3>
                      <p className="text-sm text-slate-600">
                        Manage referrals within this cohort
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        className={MOCK_COHORT.isEligible 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }
                      >
                        {Math.round(MOCK_COHORT.sessionCompletionPercentage)}% Complete
                      </Badge>
                      {MOCK_COHORT.isEligible && isMember && (
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center space-x-2"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Send Referral</span>
                          </Button>
                          <Button
                            onClick={handleRequestReferral}
                            variant="outline"
                            className="flex items-center space-x-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>Request Referral</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cohort Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600">Total Referrals</p>
                            <p className="text-2xl font-bold text-slate-900">{referralStats.totalReferrals}</p>
                          </div>
                          <Users className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600">Accepted</p>
                            <p className="text-2xl font-bold text-slate-900">{referralStats.byStatus.accepted}</p>
                          </div>
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600">Pending</p>
                            <p className="text-2xl font-bold text-slate-900">{referralStats.byStatus.sent}</p>
                          </div>
                          <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600">Session Progress</p>
                            <p className="text-2xl font-bold text-slate-900">{Math.round(referralStats.sessionCompletionPercentage)}%</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Search */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 max-w-md">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="Search members or referrals..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Referral Tabs */}
                  <Tabs value={activeReferralTab} onValueChange={(value) => setActiveReferralTab(value as 'members' | 'referrals')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="members" className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Cohort Members</span>
                        <Badge variant="secondary" className="ml-1">
                          {filteredMembers.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="referrals" className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Referrals</span>
                        <Badge variant="secondary" className="ml-1">
                          {filteredReferrals.length}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>

                    {/* Members Tab */}
                    <TabsContent value="members" className="mt-6">
                      {!MOCK_COHORT.isEligible ? (
                        <Card>
                          <CardContent className="p-6 text-center">
                            <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                              Referrals Not Yet Available
                            </h3>
                            <p className="text-slate-600 mb-4">
                              Complete {75 - Math.round(MOCK_COHORT.sessionCompletionPercentage)}% more sessions to enable referrals.
                            </p>
                            <div className="w-full bg-slate-200 rounded-full h-2 max-w-md mx-auto">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(Math.round(MOCK_COHORT.sessionCompletionPercentage), 100)}%` }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ) : filteredMembers.length === 0 ? (
                        <Card>
                          <CardContent className="p-6 text-center">
                            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                              No Members Found
                            </h3>
                            <p className="text-slate-600">
                              {searchQuery ? 'No members match your search.' : 'No eligible members found.'}
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {filteredMembers.map((member) => (
                            <CohortMemberReferralCard
                              key={member.userId}
                              member={member}
                              onReferClick={handleCreateReferral}
                              isReferDisabled={!MOCK_COHORT.isEligible}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    {/* Referrals Tab */}
                    <TabsContent value="referrals" className="mt-6">
                      {filteredReferrals.length === 0 ? (
                        <Card>
                          <CardContent className="p-6 text-center">
                            <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                              No Referrals Yet
                            </h3>
                            <p className="text-slate-600 mb-4">
                              {searchQuery ? 'No referrals match your search.' : 'No referrals have been created in this cohort yet.'}
                            </p>
                            {MOCK_COHORT.isEligible && isMember && (
                              <Button onClick={() => setShowCreateModal(true)}>
                                Send First Referral
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {filteredReferrals.map((referral) => (
                            <ReferralCard
                              key={referral.id}
                              referral={referral}
                              isCurrentUser={referral.fromUserId === MOCK_CURRENT_USER_ID}
                              onStatusChange={async (referralId: string, newStatus: ReferralStatus) => {
                                // Mock status update
                                console.log('Update referral status:', referralId, newStatus);
                              }}
                              onDelete={async (referralId) => {
                                // Mock delete
                                console.log('Delete referral:', referralId);
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
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

        {/* Referral Modals */}
        {showCreateModal && (
          <ReferralRequestModal
            isOpen={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              setSelectedUserId('');
            }}
            onCreateReferral={handleReferralCreation}
            cohortId={cohortId}
            currentUserId={MOCK_CURRENT_USER_ID}
          />
        )}

        {showRequestModal && (
          <RequestReferralModal
            isOpen={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            onCreateRequest={handleReferralRequestCreation}
            cohortId={cohortId}
            currentUserId={MOCK_CURRENT_USER_ID}
          />
        )}
      </div>
    </div>
  );
}
