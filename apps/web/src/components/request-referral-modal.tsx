/**
 * RequestReferralModal Component
 * Modal for requesting referrals from cohort members
 * 
 * This component provides a form to request referrals with different
 * request types (general, company-specific, project-specific).
 */

'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Building2,
  Briefcase,
  Handshake,
  GraduationCap,
  Zap,
  AlertCircle,
  UserPlus,
  MessageCircle
} from 'lucide-react';
import { ReferralContextType, ReferralRequestType } from '@/lib/referral-mock-data';
import { getEligibleCohortMembersForReferrals, validateReferralCreation } from '@/lib/cohort-referral-utils';
import { cn } from '@/lib/utils';

/**
 * Props interface for RequestReferralModal component
 */
interface RequestReferralModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when referral request is created */
  onCreateRequest: (requestData: {
    toUserId: string;
    context: string;
    contextType: ReferralContextType;
    requestType: ReferralRequestType;
    companyName?: string;
    projectTitle?: string;
    urgency: 'low' | 'medium' | 'high';
  }) => void;
  /** Cohort ID for the referral request */
  cohortId: string;
  /** Current user ID */
  currentUserId: string;
}

/**
 * Request type options for referral requests
 */
const requestTypeOptions: { value: ReferralRequestType; label: string; icon: any; description: string }[] = [
  { value: 'general', label: 'General Referral', icon: MessageCircle, description: 'Ask for general opportunities' },
  { value: 'company_specific', label: 'Company-Specific', icon: Building2, description: 'Ask for referral at specific company' },
  { value: 'project_specific', label: 'Project-Specific', icon: Briefcase, description: 'Ask for specific project opportunities' }
];

/**
 * Context type options for referral requests
 */
const contextTypeOptions: { value: ReferralContextType; label: string; icon: any; description: string }[] = [
  { value: 'job', label: 'Job Opportunity', icon: Building2, description: 'Full-time or part-time employment' },
  { value: 'project', label: 'Project', icon: Briefcase, description: 'Contract or project-based work' },
  { value: 'collaboration', label: 'Collaboration', icon: Handshake, description: 'Joint work or partnership' },
  { value: 'mentorship', label: 'Mentorship', icon: GraduationCap, description: 'Guidance and learning opportunity' },
  { value: 'freelance', label: 'Freelance', icon: Zap, description: 'Independent contractor work' }
];

/**
 * RequestReferralModal component for requesting referrals
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function RequestReferralModal({ 
  isOpen, 
  onClose, 
  onCreateRequest, 
  cohortId, 
  currentUserId 
}: RequestReferralModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [context, setContext] = useState('');
  const [contextType, setContextType] = useState<ReferralContextType>('job');
  const [requestType, setRequestType] = useState<ReferralRequestType>('general');
  const [companyName, setCompanyName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get eligible cohort members
  const eligibleMembers = getEligibleCohortMembersForReferrals(cohortId, currentUserId);

  /**
   * Reset form when modal opens/closes
   */
  useEffect(() => {
    if (isOpen) {
      setSelectedUserId('');
      setContext('');
      setContextType('job');
      setRequestType('general');
      setCompanyName('');
      setProjectTitle('');
      setUrgency('medium');
      setError(null);
    }
  }, [isOpen]);

  /**
   * Generate context when request type or context type changes
   */
  useEffect(() => {
    if (requestType && contextType && cohortId) {
      const generatedContext = generateRequestContext(cohortId, requestType, contextType, companyName, projectTitle);
      setContext(generatedContext);
    }
  }, [requestType, contextType, cohortId, companyName, projectTitle]);

  /**
   * Generate request context based on type and cohort
   * 
   * @param cohortId - Cohort ID
   * @param requestType - Type of request
   * @param contextType - Context type
   * @param companyName - Company name (if applicable)
   * @param projectTitle - Project title (if applicable)
   * @returns Generated context string
   */
  const generateRequestContext = (
    cohortId: string, 
    requestType: ReferralRequestType, 
    contextType: ReferralContextType,
    companyName?: string,
    projectTitle?: string
  ): string => {
    const cohortTitle = 'React & TypeScript Mastery'; // This would come from cohort data
    
    if (requestType === 'company_specific' && companyName) {
      return `Hi! I know you work at ${companyName} and I'm looking for new opportunities. Would you be able to refer me for any open positions? I've really enjoyed working with you in our ${cohortTitle} cohort and would love to continue learning in a professional setting.`;
    } else if (requestType === 'project_specific' && projectTitle) {
      return `Hey! I'm interested in working on ${projectTitle} and would love to collaborate. Since you&apos;ve seen my work in our ${cohortTitle} cohort, would you be able to refer me for any similar projects you know about?`;
    } else {
      return `Hi! I'm exploring ${contextType} opportunities and would love to work on some projects. Since you&apos;ve seen my work in our ${cohortTitle} cohort, would you be able to refer me for any opportunities you know about?`;
    }
  };

  /**
   * Handle form submission
   * Validates form data and creates referral request
   */
  const handleSubmit = async () => {
    if (!selectedUserId) {
      setError('Please select a cohort member to request referral from');
      return;
    }

    if (!context.trim()) {
      setError('Please provide context for the referral request');
      return;
    }

    // Validate referral creation
    const validation = validateReferralCreation(currentUserId, selectedUserId, cohortId);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid referral request');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onCreateRequest({
        toUserId: selectedUserId,
        context: context.trim(),
        contextType,
        requestType,
        companyName: companyName.trim() || undefined,
        projectTitle: projectTitle.trim() || undefined,
        urgency
      });
      
      onClose();
    } catch (err) {
      setError('Failed to create referral request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle request type change
   * Updates request type and regenerates context
   * 
   * @param newRequestType - New request type selected
   */
  const handleRequestTypeChange = (newRequestType: ReferralRequestType) => {
    setRequestType(newRequestType);
    const generatedContext = generateRequestContext(cohortId, newRequestType, contextType, companyName, projectTitle);
    setContext(generatedContext);
  };

  /**
   * Handle context type change
   * Updates context type and regenerates context
   * 
   * @param newContextType - New context type selected
   */
  const handleContextTypeChange = (newContextType: ReferralContextType) => {
    setContextType(newContextType);
    const generatedContext = generateRequestContext(cohortId, requestType, newContextType, companyName, projectTitle);
    setContext(generatedContext);
  };

  const selectedMember = eligibleMembers.find(member => member.userId === selectedUserId);
  const selectedRequestType = requestTypeOptions.find(option => option.value === requestType);
  const selectedContextType = contextTypeOptions.find(option => option.value === contextType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Request Referral</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cohort context info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <Clock className="h-4 w-4" />
              <span>
                {eligibleMembers[0]?.sessionCompletionPercentage || 0}% of cohort sessions completed
              </span>
              <Badge variant="outline" className="text-xs">
                {eligibleMembers[0]?.isEligible ? 'Eligible' : 'Not Eligible'}
              </Badge>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Select cohort member */}
          <div className="space-y-2">
            <Label htmlFor="member-select">Select Cohort Member to Request Referral From</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a cohort member..." />
              </SelectTrigger>
              <SelectContent>
                {eligibleMembers.map((member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.user?.avatar} alt={member.user?.name} />
                        <AvatarFallback>{member.user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{member.user?.name}</span>
                      <span className="text-slate-500">({member.user?.title})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected member info */}
          {selectedMember && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedMember.user?.avatar} alt={selectedMember.user?.name} />
                  <AvatarFallback>{selectedMember.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-slate-900">{selectedMember.user?.name}</h4>
                  <p className="text-sm text-slate-600">{selectedMember.user?.title}</p>
                  <p className="text-xs text-slate-500">@{selectedMember.user?.handle}</p>
                </div>
              </div>
            </div>
          )}

          {/* Request type selection */}
          <div className="space-y-2">
            <Label htmlFor="request-type">Request Type</Label>
            <Select value={requestType} onValueChange={handleRequestTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {requestTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedRequestType && (
              <p className="text-xs text-slate-500">{selectedRequestType.description}</p>
            )}
          </div>

          {/* Context type selection */}
          <div className="space-y-2">
            <Label htmlFor="context-type">Opportunity Type</Label>
            <Select value={contextType} onValueChange={handleContextTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contextTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedContextType && (
              <p className="text-xs text-slate-500">{selectedContextType.description}</p>
            )}
          </div>

          {/* Company name (for company-specific requests) */}
          {requestType === 'company_specific' && (
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., TechCorp Inc."
              />
            </div>
          )}

          {/* Project title (for project-specific requests) */}
          {requestType === 'project_specific' && (
            <div className="space-y-2">
              <Label htmlFor="project-title">Project Title</Label>
              <Input
                id="project-title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g., E-commerce Dashboard"
              />
            </div>
          )}

          {/* Urgency level */}
          <div className="space-y-2">
            <Label htmlFor="urgency">Priority Level</Label>
            <Select value={urgency} onValueChange={(value: 'low' | 'medium' | 'high') => setUrgency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Request context */}
          <div className="space-y-2">
            <Label htmlFor="context">Request Message</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Write your referral request message..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-slate-500">
              {context.length}/500 characters
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedUserId || !context.trim()}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Requesting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Send Request</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
