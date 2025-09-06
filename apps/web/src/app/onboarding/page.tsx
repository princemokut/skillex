"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OnboardingStep1 } from "@/components/onboarding/step1-basics";
import { OnboardingStep2 } from "@/components/onboarding/step2-skills";
import { OnboardingStep3 } from "@/components/onboarding/step3-availability";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";

/**
 * Onboarding wizard page with 3 steps
 * Handles the complete user onboarding flow from basics to availability
 */
export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basics
    name: "",
    handle: "",
    location: "",
    bio: "",
    avatar_url: "",
    
    // Step 2: Skills
    skills: [] as Array<{
      id: string;
      name: string;
      level: "beginner" | "intermediate" | "advanced" | "expert";
      type: "teach" | "learn";
    }>,
    
    // Step 3: Availability
    availability: [] as Array<{
      day: number; // 0-6 (Sunday-Saturday)
      hour: number; // 0-23
      available: boolean;
    }>,
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  /**
   * Handle form data updates from each step
   */
  const handleStepData = (stepData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  /**
   * Navigate to next step
   */
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  /**
   * Navigate to previous step
   */
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  /**
   * Complete onboarding and create user profile
   */
  const handleComplete = async () => {
    try {
      // TODO: Call API to create user profile
      // This will be implemented when we integrate with the API
      console.log("Completing onboarding with data:", formData);
      
      toast.success("Welcome to Skillex! Your profile has been created.");
      router.push("/matches");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Failed to complete onboarding. Please try again.");
    }
  };

  // Redirect if not authenticated
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push("/auth/signin");
    }
    return null;
  }

  return (
    // <div className="min-h-screen bg-slate-50 py-8">
    //   <div className="max-w-2xl mx-auto px-4">
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 mt-0 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome to Skillex!
          </h1>
          <p className="text-slate-600">
            Let's set up your profile to get started with skill exchanges
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "What skills do you have?"}
              {currentStep === 3 && "When are you available?"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <OnboardingStep1
                data={formData}
                onUpdate={handleStepData}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <OnboardingStep2
                data={formData}
                onUpdate={handleStepData}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}
            {currentStep === 3 && (
              <OnboardingStep3
                data={formData}
                onUpdate={handleStepData}
                onComplete={handleComplete}
                onPrevious={handlePrevious}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
