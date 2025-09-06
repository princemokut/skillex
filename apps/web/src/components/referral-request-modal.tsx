/**
 * ReferralRequestModal Component
 * Modal for creating new referral requests within cohort context
 * 
 * This component provides a form to create referral requests
 * with cohort member selection and context input.
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
  AlertCircle
} from 'lucide-react';
import { ReferralContextType } from '@/lib/referral-mock-data';
import { getEligibleCohortMembersForReferrals, validateReferralCreation, generateReferralContext } from '@/lib/cohort-referral-utils';
import { cn } from '@/lib/utils';

/**
 * Props interface for ReferralRequestModal component
 */
interface ReferralRequestModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when referral is created */
  onCreateReferral: (referralData: {
    toUserId: string;
    context: string;
    contextType: ReferralContextType;
    companyName?: string;
    projectTitle?: string;
    urgency: 'low' | 'medium' | 'high';
  }) => void;
  /** Cohort ID for the referral */
  cohortId: string;
  /** Current user ID */
  currentUserId: string;
}

/**
 * Context type options for referral creation
 */
const contextTypeOptions: { value: ReferralContextType; label: string; icon: any; description: string }[] = [
  { value: 'job', label: 'Job Opportunity', icon: Building2, description: 'Full-time or part-time employment' },
  { value: 'project', label: 'Project', icon: Briefcase, description: 'Contract or project-based work' },
  { value: 'collaboration', label: 'Collaboration', icon: Handshake, description: 'Joint work or partnership' },
  { value: 'mentorship', label: 'Mentorship', icon: GraduationCap, description: 'Guidance and learning opportunity' },
  { value: 'freelance', label: 'Freelance', icon: Zap, description: 'Independent contractor work' }
];

/**
 * ReferralRequestModal component for creating referral requests
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function ReferralRequestModal({ 
  isOpen, 
  onClose, 
  onCreateReferral, 
  cohortId, 
  currentUserId 
}: ReferralRequestModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [context, setContext] = useState('');
  const [contextType, setContextType] = useState<ReferralContextType>('job');
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
      setCompanyName('');
      setProjectTitle('');
      setUrgency('medium');
      setError(null);
    }
  }, [isOpen]);

  /**
   * Generate context when context type changes
   */
  useEffect(() => {
    if (contextType && cohortId) {
      const generatedContext = generateReferralContext(cohortId, contextType);
      setContext(generatedContext);
    }
  }, [contextType, cohortId]);

  /**
   * Handle form submission
   * Validates form data and creates referral
   */
  const handleSubmit = async () => {
    if (!selectedUserId) {
      setError('Please select a cohort member to refer');
      return;
    }

    if (!context.trim()) {
      setError('Please provide context for the referral');
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
      await onCreateReferral({
        toUserId: selectedUserId,
        context: context.trim(),
        contextType,
        companyName: companyName.trim() || undefined,
        projectTitle: projectTitle.trim() || undefined,
        urgency
      });
      
      onClose();
    } catch (err) {
      setError('Failed to create referral. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle context type change
   * Updates context type and regenerates context
   * 
   * @param newContextType - New context type selected
   */
  const handleContextTypeChange = (newContextType: ReferralContextType) => {
    setContextType(newContextType);
    const generatedContext = generateReferralContext(cohortId, newContextType);
    setContext(generatedContext);
  };

  const selectedMember = eligibleMembers.find(member => member.userId === selectedUserId);
  const selectedContextType = contextTypeOptions.find(option => option.value === contextType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Send Referral</span>
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
            <Label htmlFor="member-select">Select Cohort Member to Refer</Label>
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

          {/* Context type selection */}
          <div className="space-y-2">
            <Label htmlFor="context-type">Referral Type</Label>
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

          {/* Company/Project name */}
          {(contextType === 'job' || contextType === 'project' || contextType === 'freelance') && (
            <div className="space-y-2">
              <Label htmlFor="company-name">
                {contextType === 'job' ? 'Company Name' : 'Project Title'}
              </Label>
              <Input
                id="company-name"
                value={contextType === 'job' ? companyName : projectTitle}
                onChange={(e) => {
                  if (contextType === 'job') {
                    setCompanyName(e.target.value);
                  } else {
                    setProjectTitle(e.target.value);
                  }
                }}
                placeholder={contextType === 'job' ? 'e.g., TechCorp Inc.' : 'e.g., E-commerce Dashboard'}
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

          {/* Referral context */}
          <div className="space-y-2">
            <Label htmlFor="context">Referral Context</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe why you're recommending this person..."
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
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Send Referral</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
