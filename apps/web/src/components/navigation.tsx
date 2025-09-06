/**
 * Navigation component for the skillex application
 * Provides the main navigation bar with logo, menu items, and user actions
 */

"use client";

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

/**
 * Navigation component with top-level menu items
 * 
 * @returns Navigation JSX component
 */
export function Navigation() {
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
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-slate-900">skillex</span>
            </Link>
          </div>

          {/* Main Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/onboarding" 
                className="text-slate-700 hover:text-primary-600 transition-colors"
              >
                Setup
              </Link>
              <Link 
                href="/matches" 
                className="text-slate-700 hover:text-primary-600 transition-colors"
              >
                Matches
              </Link>
              <Link 
                href="/cohorts" 
                className="text-slate-700 hover:text-primary-600 transition-colors"
              >
                Cohorts
              </Link>
              <Link 
                href="/connections" 
                className="text-slate-700 hover:text-primary-600 transition-colors"
              >
                Connections
              </Link>
              <Link 
                href="/referrals" 
                className="text-slate-700 hover:text-primary-600 transition-colors"
              >
                Referrals
              </Link>
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications (placeholder) */}
                <Button variant="ghost" size="sm" className="relative">
                  <span className="sr-only">Notifications</span>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5zM4.5 19.5L9 15H4.5v4.5z"
                    />
                  </svg>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt="User" />
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="w-[200px] truncate text-sm text-slate-600">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile/settings">Profile Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/johndoe">View Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={handleSignOut}
                      disabled={loading}
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * Mobile navigation component
 * Provides a collapsible menu for mobile devices
 * 
 * @returns Mobile navigation JSX component
 */
export function MobileNavigation() {
  return (
    <div className="md:hidden">
      {/* Mobile menu implementation would go here */}
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link
          href="/matches"
          className="text-slate-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Matches
        </Link>
        <Link
          href="/cohorts"
          className="text-slate-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Cohorts
        </Link>
        <Link
          href="/connections"
          className="text-slate-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Connections
        </Link>
        <Link
          href="/referrals"
          className="text-slate-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Referrals
        </Link>
      </div>
    </div>
  );
}
