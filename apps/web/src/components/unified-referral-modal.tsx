/**
 * UnifiedReferralModal Component
 * Combined modal for both sending and requesting referrals
 * 
 * This component merges the functionality of ReferralRequestModal and RequestReferralModal
 * with radio button selection to choose between sending or requesting referrals.
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
  MessageCircle,
  Send
} from 'lucide-react';
import { ReferralContextType, ReferralRequestType } from '@/lib/referral-mock-data';
import { getEligibleCohortMembersForReferrals, validateReferralCreation, generateReferralContext } from '@/lib/cohort-referral-utils';
import { cn } from '@/lib/utils';

/**
 * Props interface for UnifiedReferralModal component
 */
interface UnifiedReferralModalProps {
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
  /** Cohort ID for the referral */
  cohortId: string;
  /** Current user ID */
  currentUserId: string;
}

/**
 * Request type options for referral requests
 */
const requestTypeOptions: { value: ReferralRequestType; label: string; icon: any; description: string }[] = [
  { value: 'general', label: 'General', icon: MessageCircle, description: 'Any opportunities you know about' },
  { value: 'company_specific', label: 'Company-Specific', icon: Building2, description: 'Referral at your company' }
];

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
 * UnifiedReferralModal component for creating both send and request referrals
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function UnifiedReferralModal({ 
  isOpen, 
  onClose, 
  onCreateReferral,
  onCreateRequest,
  cohortId, 
  currentUserId 
}: UnifiedReferralModalProps) {
  const [referralType, setReferralType] = useState<'send' | 'request'>('send');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [context, setContext] = useState('');
  const [contextType, setContextType] = useState<ReferralContextType>('job');
  const [requestType, setRequestType] = useState<ReferralRequestType>('general');
  const [companyName, setCompanyName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get eligible cohort members (only for send referrals)
  const eligibleMembers = getEligibleCohortMembersForReferrals(cohortId, currentUserId);
  
  // Check if user is eligible for referrals (75% completion required)
  const isEligibleForReferrals = eligibleMembers && eligibleMembers.length > 0 && 
    (eligibleMembers[0]?.sessionCompletionPercentage || 0) >= 75;

  /**
   * Reset form when modal opens/closes
   */
  useEffect(() => {
    if (isOpen) {
      setReferralType('send');
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
   * Regenerate context when referral type, request type, or company name changes
   */
  useEffect(() => {
    if (isOpen && contextType) {
      const generatedContext = generateReferralContext(
        cohortId, 
        contextType, 
        referralType, 
        referralType === 'request' ? requestType : undefined,
        companyName
      );
      setContext(generatedContext);
    }
  }, [referralType, requestType, companyName, isOpen, contextType, cohortId]);

  /**
   * Handle context type change and generate context
   */
  const handleContextTypeChange = (newContextType: ReferralContextType) => {
    setContextType(newContextType);
    
    // Generate context based on context type, referral type, request type, and company name
    const generatedContext = generateReferralContext(
      cohortId, 
      newContextType, 
      referralType, 
      referralType === 'request' ? requestType : undefined,
      companyName
    );
    setContext(generatedContext);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate both send and request referrals require a selected user
      if (!selectedUserId) {
        throw new Error(referralType === 'send' ? 'Please select a person to refer' : 'Please select a cohort member to request referral from');
      }
      
      if (referralType === 'send') {
        // Validate send referral
        if (!context.trim()) {
          throw new Error('Please provide context for the referral');
        }

        const referralData = {
          toUserId: selectedUserId,
          context: context.trim(),
          contextType,
          companyName: companyName.trim() || undefined,
          projectTitle: projectTitle.trim() || undefined,
          urgency
        };

        // Validate referral creation
        const validation = validateReferralCreation(currentUserId, selectedUserId, cohortId);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        await onCreateReferral(referralData);
      } else {
        // Validate request referral
        if (!context.trim()) {
          throw new Error('Please provide context for your request');
        }

        const requestData = {
          toUserId: '', // Will be filled by the system
          context: context.trim(),
          contextType,
          requestType,
          companyName: companyName.trim() || undefined,
          projectTitle: projectTitle.trim() || undefined,
          urgency
        };

        await onCreateRequest(requestData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Get context placeholder based on type and context type
   */
  const getContextPlaceholder = () => {
    if (referralType === 'send') {
      return `Describe the ${contextTypeOptions.find(opt => opt.value === contextType)?.label.toLowerCase()} opportunity...`;
    } else {
      return `Describe what kind of ${contextTypeOptions.find(opt => opt.value === contextType)?.label.toLowerCase()} you're looking for...`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Create Referral
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cohort context info */}
          {eligibleMembers && eligibleMembers.length > 0 && (
            <div className={`border rounded-lg p-4 ${isEligibleForReferrals ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className={isEligibleForReferrals ? 'text-blue-700' : 'text-yellow-700'}>
                  {eligibleMembers[0]?.sessionCompletionPercentage || 0}% of cohort sessions completed
                </span>
                <Badge variant="outline" className="text-xs">
                  {isEligibleForReferrals ? 'Eligible' : 'Not Eligible'}
                </Badge>
              </div>
              {!isEligibleForReferrals && (
                <p className="text-xs text-yellow-700 mt-2">
                  Complete at least 75% of cohort sessions to create referrals
                </p>
              )}
            </div>
          )}

          {/* Referral Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">
              Referral Type
            </Label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="referralType"
                  value="send"
                  checked={referralType === 'send'}
                  onChange={(e) => setReferralType(e.target.value as 'send' | 'request')}
                  className="h-4 w-4 text-blue-600"
                />
                <Send className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-700">Send Referral</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="referralType"
                  value="request"
                  checked={referralType === 'request'}
                  onChange={(e) => setReferralType(e.target.value as 'send' | 'request')}
                  className="h-4 w-4 text-blue-600"
                />
                <MessageCircle className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-700">Request Referral</span>
              </label>
            </div>
          </div>

          {/* Person Selection - For Both Send and Request Referrals */}
          <div className="space-y-3">
            <Label htmlFor="person-select" className="text-sm font-medium text-slate-700">
              {referralType === 'send' ? 'Cohort Member to Refer' : 'Who to Ask for Referral'}
            </Label>
            {eligibleMembers && eligibleMembers.length > 0 ? (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="person-select">
                  <SelectValue placeholder={referralType === 'send' ? 'Choose a cohort member to refer' : 'Choose a cohort member...'} />
                </SelectTrigger>
                <SelectContent>
                  {eligibleMembers.map((member) => (
                    <SelectItem key={member.userId} value={member.userId}>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.user?.avatar} alt={member.user?.name} />
                          <AvatarFallback>{member.user?.name?.charAt(0).toUpperCase() || 'M'}</AvatarFallback>
                        </Avatar>
                        <span>{member.user?.name || 'Unknown Member'}</span>
                        <span className="text-slate-500">({member.user?.title || 'No title'})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-600">
                  No eligible members found in this cohort for referrals.
                </p>
              </div>
            )}
          </div>

          {/* Request Type Selection - Only for Request Referrals */}
          {referralType === 'request' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">
                Request Type
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {requestTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      onClick={() => setRequestType(option.value)}
                      className={cn(
                        "flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors",
                        requestType === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-900">{option.label}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Context Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">
              Context Type
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contextTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.value}
                    onClick={() => handleContextTypeChange(option.value)}
                    className={cn(
                      "flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors",
                      contextType === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-900">{option.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Company Name - Show for job and project types, or for company-specific requests */}
          {((contextType === 'job' || contextType === 'project') || (referralType === 'request' && requestType === 'company_specific')) && (
            <div className="space-y-3">
              <Label htmlFor="company" className="text-sm font-medium text-slate-700">
                Company Name
              </Label>
              <Input
                id="company"
                placeholder={referralType === 'request' && requestType === 'company_specific' ? "Enter the company name" : "Enter company name"}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          )}

          {/* Project Title - Show for project type */}
          {contextType === 'project' && (
            <div className="space-y-3">
              <Label htmlFor="project" className="text-sm font-medium text-slate-700">
                Project Title
              </Label>
              <Input
                id="project"
                placeholder="Enter project title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </div>
          )}

          {/* Context Description */}
          <div className="space-y-3">
            <Label htmlFor="context" className="text-sm font-medium text-slate-700">
              {referralType === 'send' ? 'Referral Details' : 'Request Details'}
            </Label>
            <Textarea
              id="context"
              placeholder={getContextPlaceholder()}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Urgency Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">
              Urgency Level
            </Label>
            <div className="flex space-x-4">
              {[
                { value: 'low', label: 'Low', color: 'text-green-600' },
                { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
                { value: 'high', label: 'High', color: 'text-red-600' }
              ].map((level) => (
                <label key={level.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="urgency"
                    value={level.value}
                    checked={urgency === level.value}
                    onChange={(e) => setUrgency(e.target.value as 'low' | 'medium' | 'high')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className={`text-sm ${level.color}`}>{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isEligibleForReferrals}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  {referralType === 'send' ? (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Referral</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4" />
                      <span>Request Referral</span>
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
