/**
 * Mobile user menu component with dropdown for user actions
 * Replaces the hamburger menu on mobile devices
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
import { Menu, User, Settings, LogOut, Bell } from "lucide-react";

/**
 * Mobile user menu component with user actions dropdown
 * 
 * @returns MobileUserMenu JSX element
 */
export function MobileUserMenu() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Handle sign out
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/');
      setIsOpen(false);
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  /**
   * Close menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.mobile-user-menu')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) {
    return (
      <div className="md:hidden flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/auth/signin">Sign in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/auth/signup">Sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mobile-user-menu md:hidden">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          {/* User Info */}
          <div className="flex items-center justify-start gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} alt="User" />
              <AvatarFallback>
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium text-sm">
                {user.user_metadata?.full_name || 'User'}
              </p>
              <p className="w-[200px] truncate text-xs text-slate-600">
                {user.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          
          {/* Navigation Links */}
          <DropdownMenuItem asChild>
            <Link href="/onboarding" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Setup
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/matches" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Matches
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/cohorts" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Cohorts
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/connections" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Connections
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/referrals" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Referrals
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* User Actions */}
          <DropdownMenuItem asChild>
            <Link href="/profile/settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Profile Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/johndoe" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              View Profile
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="text-red-600"
            onClick={handleSignOut}
            disabled={loading}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
