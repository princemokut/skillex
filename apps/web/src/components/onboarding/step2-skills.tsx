"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Star } from "lucide-react";
import { toast } from "sonner";

interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  type: "teach" | "learn";
}

interface OnboardingStep2Props {
  data: {
    skills: Skill[];
  };
  onUpdate: (data: { skills: Skill[] }) => void;
  onNext: () => void;
  onPrevious: () => void;
}

/**
 * Step 2: Skills selection
 * Users can add skills they want to teach and learn
 */
export function OnboardingStep2({ data, onUpdate, onNext, onPrevious }: OnboardingStep2Props) {
  const [newSkill, setNewSkill] = useState("");
  const [activeTab, setActiveTab] = useState<"teach" | "learn">("teach");
  const [isValidating, setIsValidating] = useState(false);

  // Common skills suggestions
  const skillSuggestions = [
    "JavaScript", "Python", "React", "Node.js", "TypeScript", "SQL",
    "Design", "Marketing", "Writing", "Public Speaking", "Leadership",
    "Data Analysis", "Project Management", "Photography", "Cooking",
    "Languages", "Fitness", "Music", "Art", "Business"
  ];

  /**
   * Add a new skill
   */
  const addSkill = (name: string, type: "teach" | "learn") => {
    if (!name.trim()) return;

    const skill: Skill = {
      id: `${type}-${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: name.trim(),
      level: "intermediate", // Default level
      type,
    };

    // Check if skill already exists
    const exists = data.skills.some(s => 
      s.name.toLowerCase() === skill.name.toLowerCase() && s.type === type
    );

    if (exists) {
      toast.error("This skill is already added");
      return;
    }

    onUpdate({
      skills: [...data.skills, skill]
    });
    setNewSkill("");
  };

  /**
   * Remove a skill
   */
  const removeSkill = (skillId: string) => {
    onUpdate({
      skills: data.skills.filter(s => s.id !== skillId)
    });
  };

  /**
   * Update skill level
   */
  const updateSkillLevel = (skillId: string, level: Skill["level"]) => {
    onUpdate({
      skills: data.skills.map(s => 
        s.id === skillId ? { ...s, level } : s
      )
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (data.skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    setIsValidating(true);
    
    try {
      onNext();
    } catch (error) {
      console.error("Error in step 2:", error);
      toast.error("Failed to proceed. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Get skills by type
   */
  const getSkillsByType = (type: "teach" | "learn") => {
    return data.skills.filter(s => s.type === type);
  };

  /**
   * Render skill level selector with accessibility features
   */
  const renderLevelSelector = (skill: Skill) => {
    const levels = [
      { value: "beginner", label: "Beginner", color: "bg-green-100 text-green-800" },
      { value: "intermediate", label: "Intermediate", color: "bg-blue-100 text-blue-800" },
      { value: "advanced", label: "Advanced", color: "bg-purple-100 text-purple-800" },
      { value: "expert", label: "Expert", color: "bg-orange-100 text-orange-800" },
    ] as const;

    return (
      <div 
        className="flex space-x-1" 
        role="group" 
        aria-label={`Skill level for ${skill.name}`}
      >
        {levels.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => updateSkillLevel(skill.id, level.value)}
            className={`px-2 py-1 text-xs rounded-full transition-colors ${
              skill.level === level.value
                ? level.color
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            aria-pressed={skill.level === level.value}
            aria-label={`Set ${skill.name} skill level to ${level.label}`}
          >
            {level.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Skills selection form">
      {/* Form Description for Screen Readers */}
      <div className="sr-only">
        <h2>Skills Selection - Step 2 of 3</h2>
        <p>Add skills you want to teach and learn. This helps us match you with the right people.</p>
      </div>

      <div className="text-center mb-6">
        <p className="text-slate-600">
          Add skills you want to teach and learn. This helps us match you with the right people.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "teach" | "learn")}>
        <TabsList className="grid w-full grid-cols-2" role="tablist" aria-label="Skills categories">
          <TabsTrigger 
            value="teach"
            role="tab"
            aria-selected={activeTab === "teach"}
            aria-controls="teach-panel"
            aria-label={`Skills I Can Teach - ${getSkillsByType("teach").length} skills added`}
          >
            I Can Teach ({getSkillsByType("teach").length})
          </TabsTrigger>
          <TabsTrigger 
            value="learn"
            role="tab"
            aria-selected={activeTab === "learn"}
            aria-controls="learn-panel"
            aria-label={`Skills I Want to Learn - ${getSkillsByType("learn").length} skills added`}
          >
            I Want to Learn ({getSkillsByType("learn").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent 
          value="teach" 
          className="space-y-4"
          role="tabpanel"
          id="teach-panel"
          aria-labelledby="teach-tab"
          aria-label="Skills I can teach"
        >
          {/* Add new skill */}
          <fieldset className="space-y-2">
            <legend className="sr-only">Add Teaching Skill</legend>
            <div className="flex space-x-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill you can teach..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(newSkill, "teach");
                  }
                }}
                aria-label="Add a skill you can teach"
                aria-describedby="teach-skill-help"
              />
              <Button
                type="button"
                onClick={() => addSkill(newSkill, "teach")}
                disabled={!newSkill.trim()}
                aria-label="Add skill to teaching list"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <p id="teach-skill-help" className="sr-only">
              Enter a skill you can teach others, then press Enter or click the plus button to add it
            </p>
          </fieldset>

          {/* Skill suggestions */}
          <fieldset className="space-y-2">
            <legend className="text-sm text-slate-600 font-medium">Popular skills:</legend>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Popular teaching skills">
              {skillSuggestions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill, "teach")}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  aria-label={`Add ${skill} to teaching skills`}
                >
                  + {skill}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Added skills */}
          <div className="space-y-3" role="list" aria-label="Teaching skills list">
            {getSkillsByType("teach").map((skill) => (
              <Card key={skill.id} role="listitem">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Star className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                      <span className="font-medium" aria-label={`Teaching skill: ${skill.name}`}>
                        {skill.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderLevelSelector(skill)}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.id)}
                        aria-label={`Remove ${skill.name} from teaching skills`}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent 
          value="learn" 
          className="space-y-4"
          role="tabpanel"
          id="learn-panel"
          aria-labelledby="learn-tab"
          aria-label="Skills I want to learn"
        >
          {/* Add new skill */}
          <fieldset className="space-y-2">
            <legend className="sr-only">Add Learning Skill</legend>
            <div className="flex space-x-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill you want to learn..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(newSkill, "learn");
                  }
                }}
                aria-label="Add a skill you want to learn"
                aria-describedby="learn-skill-help"
              />
              <Button
                type="button"
                onClick={() => addSkill(newSkill, "learn")}
                disabled={!newSkill.trim()}
                aria-label="Add skill to learning list"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <p id="learn-skill-help" className="sr-only">
              Enter a skill you want to learn, then press Enter or click the plus button to add it
            </p>
          </fieldset>

          {/* Skill suggestions */}
          <fieldset className="space-y-2">
            <legend className="text-sm text-slate-600 font-medium">Popular skills:</legend>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Popular learning skills">
              {skillSuggestions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill, "learn")}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  aria-label={`Add ${skill} to learning skills`}
                >
                  + {skill}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Added skills */}
          <div className="space-y-3" role="list" aria-label="Learning skills list">
            {getSkillsByType("learn").map((skill) => (
              <Card key={skill.id} role="listitem">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium" aria-label={`Learning skill: ${skill.name}`}>
                        {skill.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderLevelSelector(skill)}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.id)}
                        aria-label={`Remove ${skill.name} from learning skills`}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          aria-label="Go back to previous step"
        >
          Previous
        </Button>
        <Button 
          type="submit" 
          disabled={isValidating || data.skills.length === 0}
          aria-describedby="submit-help"
        >
          {isValidating ? "Validating..." : "Continue"}
        </Button>
      </div>
      <p id="submit-help" className="sr-only">
        {data.skills.length === 0 
          ? "Add at least one skill to continue to the next step"
          : `Continue to next step with ${data.skills.length} skills added`
        }
      </p>
    </form>
  );
}
