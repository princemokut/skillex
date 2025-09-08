"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarUrl } from "@/lib/avatars";
import { toast } from "sonner";

interface OnboardingStep1Props {
  data: {
    name: string;
    handle: string;
    location: string;
    bio: string;
    avatar_url: string;
  };
  onUpdate: (data: Partial<OnboardingStep1Props["data"]>) => void;
  onNext: () => void;
}

/**
 * Step 1: Basic user information
 * Collects name, handle, location, bio, and avatar
 */
export function OnboardingStep1({ data, onUpdate, onNext }: OnboardingStep1Props) {
  const [isValidating, setIsValidating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!data.handle.trim()) {
      newErrors.handle = "Handle is required";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(data.handle)) {
      newErrors.handle = "Handle can only contain letters, numbers, hyphens, and underscores";
    }

    if (!data.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (data.bio.length > 500) {
      newErrors.bio = "Bio must be 500 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsValidating(true);
    
    try {
      // Generate avatar URL if not provided
      const avatarUrl = data.avatar_url || generateAvatarUrl(data.name || "User");
      
      onUpdate({
        ...data,
        avatar_url: avatarUrl,
      });
      
      onNext();
    } catch (error) {
      console.error("Error in step 1:", error);
      toast.error("Failed to proceed. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Handle input changes
   */
  const handleChange = (field: keyof OnboardingStep1Props["data"], value: string) => {
    onUpdate({ [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Basic profile information form">
      {/* Form Description for Screen Readers */}
      <div className="sr-only">
        <h2>Profile Setup - Step 1 of 3</h2>
        <p>Complete your basic profile information including name, username, location, and bio.</p>
      </div>

      {/* Avatar Section */}
      <fieldset className="flex flex-col items-center space-y-4">
        <legend className="sr-only">Profile Avatar</legend>
        <Avatar className="h-24 w-24" role="img" aria-label="Profile avatar">
          <AvatarImage src={data.avatar_url || generateAvatarUrl(data.name || "User")} alt="Profile avatar" />
          <AvatarFallback className="text-2xl" aria-label="Avatar fallback">
            {data.name ? data.name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm text-slate-600 text-center" role="note">
          We&apos;ll generate an avatar for you. You can change this later in your profile settings.
        </p>
      </fieldset>

      {/* Name */}
      <fieldset className="space-y-2">
        <legend className="sr-only">Name Information</legend>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter your full name"
          className={errors.name ? "border-red-500" : ""}
          aria-describedby={errors.name ? "name-error" : "name-description"}
          aria-invalid={!!errors.name}
          aria-label="Full name (required)"
          required
        />
        <p id="name-description" className="sr-only">
          Enter your full name as it should appear on your profile
        </p>
        {errors.name && (
          <p id="name-error" className="text-sm text-red-500" role="alert" aria-live="polite">
            {errors.name}
          </p>
        )}
      </fieldset>

      {/* Handle */}
      <fieldset className="space-y-2">
        <legend className="sr-only">Username Information</legend>
        <Label htmlFor="handle">Username *</Label>
        <div className="flex" role="group" aria-label="Username input with @ symbol">
          <span 
            className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm"
            aria-hidden="true"
          >
            @
          </span>
          <Input
            id="handle"
            value={data.handle}
            onChange={(e) => handleChange("handle", e.target.value.toLowerCase())}
            placeholder="username"
            className={`rounded-l-none ${errors.handle ? "border-red-500" : ""}`}
            aria-describedby={errors.handle ? "handle-error" : "handle-help"}
            aria-invalid={!!errors.handle}
            aria-label="Username (required) - will be prefixed with @ symbol"
            required
          />
        </div>
        {errors.handle && (
          <p id="handle-error" className="text-sm text-red-500" role="alert" aria-live="polite">
            {errors.handle}
          </p>
        )}
        <p id="handle-help" className="text-xs text-slate-500">
          This will be your public profile URL: skillex.dev/profile/{data.handle || "username"}
        </p>
      </fieldset>

      {/* Location */}
      <fieldset className="space-y-2">
        <legend className="sr-only">Location Information</legend>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="City, Country"
          className={errors.location ? "border-red-500" : ""}
          aria-describedby={errors.location ? "location-error" : "location-description"}
          aria-invalid={!!errors.location}
          aria-label="Location (required) - enter your city and country"
          required
        />
        <p id="location-description" className="sr-only">
          Enter your city and country to help others find you for local skill exchanges
        </p>
        {errors.location && (
          <p id="location-error" className="text-sm text-red-500" role="alert" aria-live="polite">
            {errors.location}
          </p>
        )}
      </fieldset>

      {/* Bio */}
      <fieldset className="space-y-2">
        <legend className="sr-only">Bio Information</legend>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          placeholder="Tell us a bit about yourself and what you&apos;re passionate about..."
          rows={4}
          className={errors.bio ? "border-red-500" : ""}
          aria-describedby={errors.bio ? "bio-error" : "bio-help"}
          aria-invalid={!!errors.bio}
          aria-label="Bio - tell us about yourself and your passions"
          maxLength={500}
        />
        {errors.bio && (
          <p id="bio-error" className="text-sm text-red-500" role="alert" aria-live="polite">
            {errors.bio}
          </p>
        )}
        <p id="bio-help" className="text-xs text-slate-500">
          {data.bio.length}/500 characters
        </p>
      </fieldset>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isValidating}
          aria-describedby="submit-help"
        >
          {isValidating ? "Validating..." : "Continue"}
        </Button>
      </div>
      <p id="submit-help" className="sr-only">
        Complete this form to continue to the next step of onboarding
      </p>
    </form>
  );
}
