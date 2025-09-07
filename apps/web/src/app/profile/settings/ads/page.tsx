/**
 * Ad Preferences Page
 * User settings for ad personalization and privacy controls
 * 
 * This page allows users to:
 * - Control ad frequency and targeting
 * - Manage ad categories and interests
 * - Set privacy preferences
 * - Opt out of specific ad types
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Target, 
  Shield, 
  Bell, 
  MapPin, 
  Code, 
  Users,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { trackPageView, trackAction } from '@/lib/analytics';

/**
 * Ad preference categories
 */
const AD_CATEGORIES = [
  { id: 'jobs', name: 'Job Opportunities', description: 'Software engineering, product management, and tech roles' },
  { id: 'learning', name: 'Learning Resources', description: 'Courses, bootcamps, certifications, and tutorials' },
  { id: 'services', name: 'Professional Services', description: 'Resume writing, portfolio design, career coaching' },
  { id: 'tools', name: 'Development Tools', description: 'Software, extensions, and productivity tools' },
  { id: 'events', name: 'Events & Meetups', description: 'Tech conferences, workshops, and networking events' },
  { id: 'content', name: 'Tech News & Content', description: 'Industry reports, blogs, and podcasts' }
] as const;

/**
 * Ad frequency options
 */
const FREQUENCY_OPTIONS = [
  { value: 'low', label: 'Low', description: 'Fewer ads, more relevant' },
  { value: 'medium', label: 'Medium', description: 'Balanced ad experience' },
  { value: 'high', label: 'High', description: 'More ads, broader targeting' }
] as const;

/**
 * Ad preferences state interface
 */
interface AdPreferences {
  enabled: boolean;
  frequency: 'low' | 'medium' | 'high';
  categories: string[];
  locationTargeting: boolean;
  skillTargeting: boolean;
  behavioralTargeting: boolean;
  personalizedAds: boolean;
  adBlockingDetection: boolean;
  dataSharing: boolean;
}

/**
 * Default ad preferences
 */
const DEFAULT_PREFERENCES: AdPreferences = {
  enabled: true,
  frequency: 'medium',
  categories: ['jobs', 'learning', 'services'],
  locationTargeting: true,
  skillTargeting: true,
  behavioralTargeting: true,
  personalizedAds: true,
  adBlockingDetection: true,
  dataSharing: false
};

export default function AdPreferencesPage() {
  const [preferences, setPreferences] = useState<AdPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  /**
   * Load user preferences
   * In production, this would fetch from API
   */
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In production, fetch from API
        const savedPreferences = localStorage.getItem('ad-preferences');
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading preferences:', error);
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  /**
   * Track page view
   */
  useEffect(() => {
    trackPageView('profile-settings-ads', {
      ad_enabled: preferences.enabled,
      ad_frequency: preferences.frequency,
      categories_count: preferences.categories.length
    });
  }, [preferences]);

  /**
   * Update preference value
   * 
   * @param key - Preference key
   * @param value - New value
   */
  const updatePreference = (key: keyof AdPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * Toggle category selection
   * 
   * @param categoryId - Category ID to toggle
   */
  const toggleCategory = (categoryId: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  /**
   * Save preferences
   */
  const savePreferences = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('idle');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, save to API
      localStorage.setItem('ad-preferences', JSON.stringify(preferences));
      
      setSaveStatus('success');
      trackAction('ad_preferences_saved', 'settings', {
        enabled: preferences.enabled,
        frequency: preferences.frequency,
        categories: preferences.categories.join(',')
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaveStatus('error');
      trackAction('ad_preferences_save_error', 'settings', { error: String(error) });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Reset to defaults
   */
  const resetToDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES);
    trackAction('ad_preferences_reset', 'settings');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Ad Preferences</h1>
          <p className="text-slate-600">
            Control how ads are personalized and displayed to you
          </p>
        </div>

        {/* Save Status */}
        {saveStatus === 'success' && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your ad preferences have been saved successfully.
            </AlertDescription>
          </Alert>
        )}

        {saveStatus === 'error' && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to save your preferences. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Ad Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Ad Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="ad-enabled" className="text-base font-medium">
                    Enable Ads
                  </Label>
                  <p className="text-sm text-slate-600">
                    Show advertisements to support our platform
                  </p>
                </div>
                <Switch
                  id="ad-enabled"
                  checked={preferences.enabled}
                  onCheckedChange={(checked) => updatePreference('enabled', checked)}
                />
              </div>

              <div className="border-t border-slate-200" />

              <div className="space-y-4">
                <Label className="text-base font-medium">Ad Frequency</Label>
                <p className="text-sm text-slate-600 mb-4">
                  Choose how often you see ads
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {FREQUENCY_OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        preferences.frequency === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => updatePreference('frequency', option.value)}
                    >
                      <div className="font-medium text-slate-900">{option.label}</div>
                      <div className="text-sm text-slate-600 mt-1">{option.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ad Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Ad Categories</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-6">
                Select the types of ads you're interested in seeing
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AD_CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      preferences.categories.includes(category.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">{category.name}</div>
                        <div className="text-sm text-slate-600 mt-1">{category.description}</div>
                      </div>
                      {preferences.categories.includes(category.id) && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Targeting Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Targeting Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="location-targeting" className="text-base font-medium">
                    Location-Based Targeting
                  </Label>
                  <p className="text-sm text-slate-600">
                    Show ads relevant to your location
                  </p>
                </div>
                <Switch
                  id="location-targeting"
                  checked={preferences.locationTargeting}
                  onCheckedChange={(checked) => updatePreference('locationTargeting', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="skill-targeting" className="text-base font-medium">
                    Skill-Based Targeting
                  </Label>
                  <p className="text-sm text-slate-600">
                    Show ads based on your skills and interests
                  </p>
                </div>
                <Switch
                  id="skill-targeting"
                  checked={preferences.skillTargeting}
                  onCheckedChange={(checked) => updatePreference('skillTargeting', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="behavioral-targeting" className="text-base font-medium">
                    Behavioral Targeting
                  </Label>
                  <p className="text-sm text-slate-600">
                    Show ads based on your activity and preferences
                  </p>
                </div>
                <Switch
                  id="behavioral-targeting"
                  checked={preferences.behavioralTargeting}
                  onCheckedChange={(checked) => updatePreference('behavioralTargeting', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="personalized-ads" className="text-base font-medium">
                    Personalized Ads
                  </Label>
                  <p className="text-sm text-slate-600">
                    Use your data to show more relevant ads
                  </p>
                </div>
                <Switch
                  id="personalized-ads"
                  checked={preferences.personalizedAds}
                  onCheckedChange={(checked) => updatePreference('personalizedAds', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Privacy Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="ad-blocking-detection" className="text-base font-medium">
                    Ad Blocker Detection
                  </Label>
                  <p className="text-sm text-slate-600">
                    Detect when ads are blocked and show alternative content
                  </p>
                </div>
                <Switch
                  id="ad-blocking-detection"
                  checked={preferences.adBlockingDetection}
                  onCheckedChange={(checked) => updatePreference('adBlockingDetection', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="data-sharing" className="text-base font-medium">
                    Data Sharing
                  </Label>
                  <p className="text-sm text-slate-600">
                    Allow sharing of anonymized data for ad improvement
                  </p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={preferences.dataSharing}
                  onCheckedChange={(checked) => updatePreference('dataSharing', checked)}
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Your privacy is important to us. We only use your data to show relevant ads and never share personal information with third parties.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              disabled={isSaving}
            >
              Reset to Defaults
            </Button>
            
            <Button
              onClick={savePreferences}
              disabled={isSaving}
              className="min-w-32"
            >
              {isSaving ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Preferences'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
