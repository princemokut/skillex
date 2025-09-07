/**
 * Mobile navigation component with hamburger menu and slide-out drawer
 * Provides a mobile-optimized navigation experience
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";
import { Menu, X, User, Settings, LogOut, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  /**
   * Whether the mobile navigation is open
   */
  isOpen: boolean;
  /**
   * Function to toggle the mobile navigation
   */
  onToggle: () => void;
  /**
   * Function to close the mobile navigation
   */
  onClose: () => void;
}

/**
 * Mobile navigation component with hamburger menu and slide-out drawer
 * 
 * @param isOpen - Whether the mobile navigation is open
 * @param onToggle - Function to toggle the mobile navigation
 * @param onClose - Function to close the mobile navigation
 * @returns MobileNavigation JSX element
 */
export function MobileNavigation({ isOpen, onToggle, onClose }: MobileNavigationProps) {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  /**
   * Handle sign out
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/');
      onClose();
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  /**
   * Handle navigation link click
   */
  const handleLinkClick = () => {
    onClose();
  };

  /**
   * Close mobile menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.mobile-nav')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="md:hidden p-2"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          
          {/* Mobile Menu Panel */}
          <div className="mobile-nav fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="text-xl font-bold text-slate-900">skillex</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                  aria-label="Close mobile menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 px-4 py-6 space-y-2">
                {user ? (
                  <>
                    <Link
                      href="/onboarding"
                      onClick={handleLinkClick}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="text-base font-medium">Setup</span>
                    </Link>
                    <Link
                      href="/matches"
                      onClick={handleLinkClick}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="text-base font-medium">Matches</span>
                    </Link>
                    <Link
                      href="/cohorts"
                      onClick={handleLinkClick}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="text-base font-medium">Cohorts</span>
                    </Link>
                    <Link
                      href="/connections"
                      onClick={handleLinkClick}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="text-base font-medium">Connections</span>
                    </Link>
                    <Link
                      href="/referrals"
                      onClick={handleLinkClick}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="text-base font-medium">Referrals</span>
                    </Link>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Button asChild className="w-full">
                      <Link href="/auth/signin" onClick={handleLinkClick}>
                        Sign in
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/auth/signup" onClick={handleLinkClick}>
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* User Section */}
              {user && (
                <div className="border-t border-slate-200 p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt="User" />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link href="/profile/settings" onClick={handleLinkClick}>
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link href="/profile/johndoe" onClick={handleLinkClick}>
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      disabled={loading}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Mobile navigation hook for managing mobile menu state
 * 
 * @returns Object with mobile navigation state and handlers
 */
export function useMobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return {
    isOpen,
    toggle,
    close,
    open
  };
}
