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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={data.avatar_url || generateAvatarUrl(data.name || "User")} alt="Profile" />
          <AvatarFallback className="text-2xl">
            {data.name ? data.name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm text-slate-600 text-center">
          We'll generate an avatar for you. You can change this later in your profile settings.
        </p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter your full name"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Handle */}
      <div className="space-y-2">
        <Label htmlFor="handle">Username *</Label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
            @
          </span>
          <Input
            id="handle"
            value={data.handle}
            onChange={(e) => handleChange("handle", e.target.value.toLowerCase())}
            placeholder="username"
            className={`rounded-l-none ${errors.handle ? "border-red-500" : ""}`}
          />
        </div>
        {errors.handle && <p className="text-sm text-red-500">{errors.handle}</p>}
        <p className="text-xs text-slate-500">
          This will be your public profile URL: skillsin.dev/profile/{data.handle || "username"}
        </p>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="City, Country"
          className={errors.location ? "border-red-500" : ""}
        />
        {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          placeholder="Tell us a bit about yourself and what you're passionate about..."
          rows={4}
          className={errors.bio ? "border-red-500" : ""}
        />
        {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
        <p className="text-xs text-slate-500">
          {data.bio.length}/500 characters
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isValidating}>
          {isValidating ? "Validating..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}
