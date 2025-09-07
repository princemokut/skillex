/**
 * Profile Settings Page
 * Allows users to edit their profile information
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  Globe, 
  Save,
  Plus,
  X
} from 'lucide-react';

export default function ProfileSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    bio: 'Passionate developer with 5+ years experience in full-stack development.',
    locationCity: 'San Francisco',
    locationCountry: 'US',
    timezone: 'America/New_York',
    languages: ['English', 'Spanish'],
    title: 'Senior Software Engineer'
  });
  
  const [newLanguage, setNewLanguage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profile saved successfully!');
    } catch (error) {
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !profile.languages.includes(newLanguage.trim())) {
      setProfile(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-slate-600">
              Manage your profile information and preferences
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        
        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={profile.title}
                  onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter your job title"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationCity">City</Label>
                <Input
                  id="locationCity"
                  value={profile.locationCity}
                  onChange={(e) => setProfile(prev => ({ ...prev, locationCity: e.target.value }))}
                  placeholder="Enter your city"
                />
              </div>
              <div>
                <Label htmlFor="locationCountry">Country</Label>
                <Input
                  id="locationCountry"
                  value={profile.locationCountry}
                  onChange={(e) => setProfile(prev => ({ ...prev, locationCountry: e.target.value }))}
                  placeholder="Enter your country"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={profile.timezone}
                onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                placeholder="Enter your timezone"
              />
            </div>
            
            <div>
              <Label>Languages</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.languages.map((language, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{language}</span>
                    <button
                      onClick={() => removeLanguage(language)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Add a language"
                  onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                />
                <Button onClick={addLanguage} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}