/**
 * Public Profile Page
 * Displays a user's public profile information
 */

'use client';

import { useParams } from 'next/navigation';
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
  UserPlus
} from 'lucide-react';

export default function PublicProfilePage() {
  const params = useParams();
  const handle = params.handle as string;

  // Mock user data
  const user = {
    id: '1',
    handle: handle || 'johndoe',
    fullName: 'John Doe',
    bio: 'Passionate developer with 5+ years experience in full-stack development. Love teaching and learning new technologies.',
    avatarUrl: undefined,
    timezone: 'America/New_York',
    languages: ['English', 'Spanish'],
    locationCity: 'San Francisco, CA',
    locationCountry: 'US',
    title: 'Senior Software Engineer',
    skills: [
      { name: 'React', level: 'expert', kind: 'teach' },
      { name: 'TypeScript', level: 'advanced', kind: 'teach' },
      { name: 'Python', level: 'intermediate', kind: 'learn' },
      { name: 'Machine Learning', level: 'beginner', kind: 'learn' }
    ],
    availabilitySummary: 'Weekdays 6-8 PM, Weekends 10 AM-2 PM',
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  const teachSkills = user.skills.filter(skill => skill.kind === 'teach');
  const learnSkills = user.skills.filter(skill => skill.kind === 'learn');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={user.avatarUrl} 
                  alt={`${user.fullName}'s avatar`}
                />
                <AvatarFallback className="text-2xl font-semibold">
                  {user.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      {user.fullName}
                    </h1>
                    <div className="flex items-center space-x-4 mb-2">
                      <Badge variant="outline" className="text-sm">
                        @{user.handle}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Connected
                      </Badge>
                    </div>
                    <p className="text-lg text-slate-600 mb-4">
                      {user.title}
                    </p>
                  </div>
                  
                  {/* Connection Actions */}
                  <div className="flex space-x-3">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                    <Button variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
                
                {/* Bio */}
                <p className="text-slate-700 mb-6 leading-relaxed">
                  {user.bio}
                </p>
                
                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                  {user.locationCity && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{user.locationCity}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Last active 2h ago</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>{user.timezone}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills to Teach */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Skills to Teach</span>
                <Badge variant="secondary" className="ml-auto">
                  {teachSkills.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teachSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-slate-900">{skill.name}</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {skill.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Skills to Learn */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Skills to Learn</span>
                <Badge variant="secondary" className="ml-auto">
                  {learnSkills.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {learnSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-slate-900">{skill.name}</span>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {skill.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}