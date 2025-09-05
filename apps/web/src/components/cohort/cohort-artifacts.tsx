"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileText, 
  Plus, 
  ExternalLink, 
  Download,
  Code,
  Video,
  Table,
  Palette,
  File
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Artifact {
  id: string;
  cohortId: string;
  title: string;
  url: string;
  type: 'document' | 'code' | 'video' | 'spreadsheet' | 'design' | 'other';
  uploadedBy: string;
  uploadedAt: Date;
}

interface CohortArtifactsProps {
  cohortId: string;
  artifacts: Artifact[];
  isMember: boolean;
}

/**
 * Cohort artifacts component
 * Displays shared resources and files for the cohort
 */
export function CohortArtifacts({ cohortId, artifacts, isMember }: CohortArtifactsProps) {
  const handleAddArtifact = () => {
    // TODO: Implement artifact upload modal
    console.log("Add artifact clicked");
  };

  const handleDownloadArtifact = (artifact: Artifact) => {
    // TODO: Implement artifact download
    console.log("Download artifact", artifact.id);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'code':
        return <Code className="h-5 w-5 text-green-600" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-600" />;
      case 'spreadsheet':
        return <Table className="h-5 w-5 text-green-600" />;
      case 'design':
        return <Palette className="h-5 w-5 text-purple-600" />;
      default:
        return <File className="h-5 w-5 text-slate-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeLabels = {
      document: 'Document',
      code: 'Code',
      video: 'Video',
      spreadsheet: 'Spreadsheet',
      design: 'Design',
      other: 'Other'
    };

    return (
      <Badge variant="outline" className="text-xs">
        {typeLabels[type as keyof typeof typeLabels] || 'Other'}
      </Badge>
    );
  };

  const getUserDisplayName = (userId: string) => {
    // TODO: Get actual user names from user data
    return `User ${userId.slice(-4)}`;
  };

  const getUserInitials = (userId: string) => {
    return userId.slice(-2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Resources</h2>
          <p className="text-slate-600">Shared files and resources for this cohort</p>
        </div>
        {isMember && (
          <Button onClick={handleAddArtifact} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        )}
      </div>

      {/* Artifacts Grid */}
      {artifacts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {artifacts
            .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
            .map((artifact) => (
              <Card key={artifact.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      {getTypeIcon(artifact.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 mb-1 truncate">
                        {artifact.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getTypeBadge(artifact.type)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Uploader Info */}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`/api/avatar/${artifact.uploadedBy}`} />
                        <AvatarFallback className="text-xs">
                          {getUserInitials(artifact.uploadedBy)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{getUserDisplayName(artifact.uploadedBy)}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(artifact.uploadedAt)} ago</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(artifact.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadArtifact(artifact)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        /* Empty State */
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No resources yet</h3>
            <p className="text-slate-600 mb-6">
              {isMember 
                ? "Share your first resource with the cohort to get started."
                : "No resources have been shared in this cohort yet."
              }
            </p>
            {isMember && (
              <Button onClick={handleAddArtifact} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Share First Resource
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resource Types Info */}
      {artifacts.length > 0 && (
        <Card className="bg-slate-50">
          <CardContent className="p-4">
            <h4 className="font-medium text-slate-900 mb-3">Supported Resource Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Documents (PDF, DOC)</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-green-600" />
                <span>Code Repositories</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-red-600" />
                <span>Videos (YouTube, Vimeo)</span>
              </div>
              <div className="flex items-center gap-2">
                <Table className="h-4 w-4 text-green-600" />
                <span>Spreadsheets</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-600" />
                <span>Design Files (Figma)</span>
              </div>
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-slate-600" />
                <span>Other Files</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
