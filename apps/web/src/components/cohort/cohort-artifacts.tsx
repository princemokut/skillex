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
import { generateAvatarUrl, getUserInitials } from "@/lib/avatars";

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

  const generateUserAvatar = (userId: string) => {
    const userName = `User ${userId.slice(-4)}`;
    return generateAvatarUrl(userName, 'dicebear');
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="rounded-none sm:rounded-lg">
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Artifacts Grid */}
      {artifacts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artifacts
            .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
            .map((artifact) => (
              <Card key={artifact.id} className="group hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-slate-300 flex flex-col rounded-none sm:rounded-lg">
                <CardContent className="flex flex-col flex-1">
                  <div className="space-y-4">
                    {/* Header with icon and title */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
                        {getTypeIcon(artifact.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 line-clamp-2 leading-tight">
                          {artifact.title}
                        </h3>
                      </div>
                    </div>

                    {/* Spacer to push footer to bottom */}
                    <div className="flex-1"></div>

                    {/* Uploader Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={generateUserAvatar(artifact.uploadedBy)} alt={getUserDisplayName(artifact.uploadedBy)} />
                        <AvatarFallback className="text-sm font-medium">
                          {getUserInitials(artifact.uploadedBy)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {getUserDisplayName(artifact.uploadedBy)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDistanceToNow(artifact.uploadedAt)} ago
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                        onClick={() => window.open(artifact.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3 border-slate-300 hover:bg-slate-50"
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
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-none sm:rounded-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">No resources yet</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
              {isMember 
                ? "Share your first resource with the cohort to get started. Upload documents, code repositories, videos, and more."
                : "No resources have been shared in this cohort yet. Check back later for shared files and resources."
              }
            </p>
            {isMember && (
              <Button 
                onClick={handleAddArtifact} 
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 h-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                Share First Resource
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resource Types Info */}
      {artifacts.length > 0 && (
        <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 rounded-none sm:rounded-lg">
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                Supported Resource Types
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Documents</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Code className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Code Repos</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Video className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Videos</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Table className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Spreadsheets</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Palette className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Design Files</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <File className="h-4 w-4 text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Other Files</span>
              </div>
            </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
