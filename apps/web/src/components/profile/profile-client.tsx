"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Globe, 
  MessageCircle, 
  UserPlus,
  Building2,
  Briefcase,
  GraduationCap,
  Zap
} from 'lucide-react';

interface ProfileClientProps {
  user: {
    id: string;
    handle: string;
    fullName: string;
    title: string;
    location: string;
    bio: string;
    skills: string[];
    experience: Array<{
      company: string;
      position: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      institution: string;
      degree: string;
      year: string;
    }>;
    joinedAt: Date;
    lastActiveAt: Date;
    avatar?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  handle: string;
}

/**
 * Client component for profile page interactive functionality
 * Handles state management and user interactions
 */
export function ProfileClient({ user, handle }: ProfileClientProps) {
  const handleConnect = () => {
    // TODO: Implement connection request
    console.log('Connect with user:', user.id);
  };

  const handleMessage = () => {
    // TODO: Implement messaging
    console.log('Message user:', user.id);
  };

  const getSkillIcon = (skill: string) => {
    if (skill.toLowerCase().includes('react') || skill.toLowerCase().includes('javascript')) {
      return <Zap className="h-4 w-4" />;
    } else if (skill.toLowerCase().includes('design') || skill.toLowerCase().includes('ui')) {
      return <Globe className="h-4 w-4" />;
    } else if (skill.toLowerCase().includes('data') || skill.toLowerCase().includes('analytics')) {
      return <Building2 className="h-4 w-4" />;
    } else if (skill.toLowerCase().includes('leadership') || skill.toLowerCase().includes('management')) {
      return <Briefcase className="h-4 w-4" />;
    } else {
      return <GraduationCap className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 py-0 sm:py-6 lg:py-8 px-0 sm:px-6 lg:px-8 mt-0 pb-20 md:pb-48">
      <div className="max-w-4xl mx-auto px-0 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 px-4 sm:px-0 pt-4 sm:pt-0">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-2xl">
                      {user.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">{user.fullName}</h1>
                      <p className="text-xl text-slate-600 mt-1">{user.title}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {user.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {user.joinedAt.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Last active {user.lastActiveAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button onClick={handleConnect} className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Connect
                      </Button>
                      <Button variant="outline" onClick={handleMessage} className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  </div>
                  
                  {user.bio && (
                    <div className="mt-4">
                      <p className="text-slate-700 leading-relaxed">{user.bio}</p>
                    </div>
                  )}
                  
                  {/* Social Links */}
                  {(user.website || user.linkedin || user.github) && (
                    <div className="flex gap-4 mt-4">
                      {user.website && (
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <Globe className="h-4 w-4" />
                          Website
                        </a>
                      )}
                      {user.linkedin && (
                        <a
                          href={user.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <Globe className="h-4 w-4" />
                          LinkedIn
                        </a>
                      )}
                      {user.github && (
                        <a
                          href={user.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <Globe className="h-4 w-4" />
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {getSkillIcon(skill)}
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {user.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-slate-200 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{exp.position}</h3>
                        <p className="text-slate-600">{exp.company}</p>
                        <p className="text-sm text-slate-500">{exp.duration}</p>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-slate-700 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.education.map((edu, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                      <p className="text-slate-600">{edu.institution}</p>
                      <p className="text-sm text-slate-500">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Connections</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Cohorts</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Referrals</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Skills</span>
                  <span className="font-semibold">{user.skills.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <p className="text-slate-900">Joined React & TypeScript Mastery cohort</p>
                  <p className="text-slate-500">2 days ago</p>
                </div>
                <div className="text-sm">
                  <p className="text-slate-900">Completed Data Science Fundamentals</p>
                  <p className="text-slate-500">1 week ago</p>
                </div>
                <div className="text-sm">
                  <p className="text-slate-900">Received referral from Jane Smith</p>
                  <p className="text-slate-500">2 weeks ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
