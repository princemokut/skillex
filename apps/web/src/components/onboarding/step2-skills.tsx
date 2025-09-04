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
   * Render skill level selector
   */
  const renderLevelSelector = (skill: Skill) => {
    const levels = [
      { value: "beginner", label: "Beginner", color: "bg-green-100 text-green-800" },
      { value: "intermediate", label: "Intermediate", color: "bg-blue-100 text-blue-800" },
      { value: "advanced", label: "Advanced", color: "bg-purple-100 text-purple-800" },
      { value: "expert", label: "Expert", color: "bg-orange-100 text-orange-800" },
    ] as const;

    return (
      <div className="flex space-x-1">
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
          >
            {level.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-slate-600">
          Add skills you want to teach and learn. This helps us match you with the right people.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "teach" | "learn")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teach">
            Skills I Can Teach ({getSkillsByType("teach").length})
          </TabsTrigger>
          <TabsTrigger value="learn">
            Skills I Want to Learn ({getSkillsByType("learn").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teach" className="space-y-4">
          {/* Add new skill */}
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
            />
            <Button
              type="button"
              onClick={() => addSkill(newSkill, "teach")}
              disabled={!newSkill.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Skill suggestions */}
          <div className="space-y-2">
            <Label className="text-sm text-slate-600">Popular skills:</Label>
            <div className="flex flex-wrap gap-2">
              {skillSuggestions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill, "teach")}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Added skills */}
          <div className="space-y-3">
            {getSkillsByType("teach").map((skill) => (
              <Card key={skill.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderLevelSelector(skill)}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="learn" className="space-y-4">
          {/* Add new skill */}
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
            />
            <Button
              type="button"
              onClick={() => addSkill(newSkill, "learn")}
              disabled={!newSkill.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Skill suggestions */}
          <div className="space-y-2">
            <Label className="text-sm text-slate-600">Popular skills:</Label>
            <div className="flex flex-wrap gap-2">
              {skillSuggestions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill, "learn")}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Added skills */}
          <div className="space-y-3">
            {getSkillsByType("learn").map((skill) => (
              <Card key={skill.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderLevelSelector(skill)}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.id)}
                      >
                        <X className="h-4 w-4" />
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
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="submit" disabled={isValidating || data.skills.length === 0}>
          {isValidating ? "Validating..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}
