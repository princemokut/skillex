"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Plus, 
  Users,
  CheckCircle,
  Circle,
  XCircle
} from "lucide-react";
import { format, isAfter, isBefore, addMinutes } from "date-fns";

interface SessionWithDetails {
  id: string;
  cohortId: string;
  weekIndex: number;
  startsAt: Date;
  durationMinutes: number;
  notesUrl?: string;
  attendeeCount: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

interface CohortSessionsProps {
  cohortId: string;
  sessions: SessionWithDetails[];
  isOwner: boolean;
}

/**
 * Cohort sessions component
 * Displays session schedule with calendar integration and status
 */
export function CohortSessions({ cohortId, sessions, isOwner }: CohortSessionsProps) {
  const handleCreateSession = () => {
    // TODO: Implement session creation modal
    console.log("Create session clicked");
  };

  const handleJoinSession = (sessionId: string) => {
    // TODO: Implement session joining (calendar link, meeting room, etc.)
    console.log("Join session", sessionId);
  };

  const getSessionStatus = (session: SessionWithDetails) => {
    const now = new Date();
    const startTime = new Date(session.startsAt);
    const endTime = addMinutes(startTime, session.durationMinutes);

    if (isBefore(now, startTime)) {
      return 'upcoming';
    } else if (isAfter(now, endTime)) {
      return 'completed';
    } else {
      return 'ongoing';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ongoing':
        return <Circle className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Circle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'ongoing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Live Now</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Sessions</h2>
              <p className="text-slate-600">Manage your cohort's learning sessions</p>
            </div>
            {isOwner && (
              <Button onClick={handleCreateSession} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Session
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions
            .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
            .map((session) => {
              const status = getSessionStatus(session);
              const startTime = new Date(session.startsAt);
              const endTime = addMinutes(startTime, session.durationMinutes);

              return (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getStatusIcon(status)}
                          <h3 className="text-lg font-semibold text-slate-900">
                            Week {session.weekIndex + 1} Session
                          </h3>
                          {getStatusBadge(status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(startTime, 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{session.attendeeCount} attendees</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          {session.notesUrl ? (
                            <a
                              href={session.notesUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View Session Notes
                            </a>
                          ) : (
                            <span className="text-sm text-slate-400">
                              No session notes
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {status === 'upcoming' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleJoinSession(session.id)}
                            className="flex items-center gap-2"
                          >
                            <Calendar className="h-4 w-4" />
                            Add to Calendar
                          </Button>
                        )}
                        {status === 'ongoing' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleJoinSession(session.id)}
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Join Now
                          </Button>
                        )}
                        {isOwner && (
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      ) : (
        /* Empty State */
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No sessions scheduled</h3>
            <p className="text-slate-600 mb-6">
              {isOwner 
                ? "Create your first session to get started with your cohort."
                : "No sessions have been scheduled for this cohort yet."
              }
            </p>
            {isOwner && (
              <Button onClick={handleCreateSession} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create First Session
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
