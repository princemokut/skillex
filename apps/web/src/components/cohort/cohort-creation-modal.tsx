"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCohorts } from "@/hooks/use-cohorts";
import { CohortCreate } from "@skillex/types";
import { toast } from "sonner";

interface CohortCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Cohort creation modal
 * Allows users to create new cohorts with detailed configuration
 */
export function CohortCreationModal({ open, onOpenChange }: CohortCreationModalProps) {
  const router = useRouter();
  const { createCohortMutation } = useCohorts();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    size: 4,
    weeks: 6,
    city: "",
    visibility: "private" as "private" | "public",
    startDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a cohort title");
      return;
    }

    if (!formData.startDate) {
      toast.error("Please select a start date");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const cohortData: CohortCreate = {
        title: formData.title,
        ownerId: "user-1", // TODO: Get from auth context
        size: formData.size,
        weeks: formData.weeks,
        visibility: formData.visibility,
        city: formData.city || undefined,
        startDate: new Date(formData.startDate),
      };

      await createCohortMutation.mutateAsync(cohortData);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        size: 4,
        weeks: 6,
        city: "",
        visibility: "private",
        startDate: "",
      });
      
      onOpenChange(false);
      toast.success("Cohort created successfully!");
      
      // TODO: Navigate to the new cohort page
      // router.push(`/cohorts/${newCohort.id}`);
      
    } catch (error) {
      console.error("Failed to create cohort:", error);
      toast.error("Failed to create cohort. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      size: 4,
      weeks: 6,
      city: "",
      visibility: "private",
      startDate: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Cohort</DialogTitle>
          <DialogDescription>
            Set up a new skill exchange cohort. You can always modify these settings later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Cohort Title *</Label>
              <Input
                id="title"
                placeholder="e.g., React & TypeScript Mastery"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="mt-1"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this cohort will focus on..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Size and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="size">Group Size</Label>
                <Select
                  value={formData.size.toString()}
                  onValueChange={(value) => handleInputChange("size", parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 people</SelectItem>
                    <SelectItem value="3">3 people</SelectItem>
                    <SelectItem value="4">4 people</SelectItem>
                    <SelectItem value="5">5 people</SelectItem>
                    <SelectItem value="6">6 people</SelectItem>
                    <SelectItem value="8">8 people</SelectItem>
                    <SelectItem value="10">10 people</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="weeks">Duration (weeks)</Label>
                <Select
                  value={formData.weeks.toString()}
                  onValueChange={(value) => handleInputChange("weeks", parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 weeks</SelectItem>
                    <SelectItem value="6">6 weeks</SelectItem>
                    <SelectItem value="8">8 weeks</SelectItem>
                    <SelectItem value="12">12 weeks</SelectItem>
                    <SelectItem value="16">16 weeks</SelectItem>
                    <SelectItem value="24">24 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="city">Location</Label>
              <Input
                id="city"
                placeholder="e.g., San Francisco, Remote"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Start Date */}
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="mt-1"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="visibility">Public Cohort</Label>
                <p className="text-sm text-slate-600">
                  Allow others to discover and join this cohort
                </p>
              </div>
              <Switch
                id="visibility"
                checked={formData.visibility === "public"}
                onCheckedChange={(checked) => 
                  handleInputChange("visibility", checked ? "public" : "private")
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.startDate}
            >
              {isSubmitting ? "Creating..." : "Create Cohort"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
