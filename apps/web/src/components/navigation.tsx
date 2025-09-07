/**
 * Navigation component for the skillex application
 * Provides the main navigation bar with logo, menu items, and user actions
 */

"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";
import { MobileUserMenu } from "@/components/ui/mobile-user-menu";
import { Search } from "lucide-react";

/**
 * Navigation component with top-level menu items
 * 
 * @returns Navigation JSX component
 */
export interface NavigationProps {
  onSearch?: (query: string) => void;
  filtersComponent?: React.ReactNode;
  isMatchesPage?: boolean;
}

export function Navigation({ onSearch, filtersComponent, isMatchesPage = false }: NavigationProps = {}) {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    } else if (pathname === '/matches') {
      // Default behavior for matches page
      // We'll handle this externally via props
    }
  };

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
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Search */}
            <div className="flex items-center space-x-4">
              {/* Logo - Always visible, text hidden on mobile */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="hidden sm:block text-xl font-bold text-slate-900">skillex</span>
              </Link>
              
              {/* Global Search Field - Desktop - Only on matches page */}
              {user && pathname === '/matches' && (
                <div className="hidden sm:block relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search name, skills and more"
                    onChange={handleSearch}
                    className="pl-10 h-9 bg-slate-50 border-slate-200"
                  />
                </div>
              )}
            </div>

            {/* Mobile Search Field - Centered - Only on matches page */}
            {user && pathname === '/matches' && (
              <div className="flex-1 sm:hidden mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search name, skills and more"
                    onChange={handleSearch}
                    className="pl-10 h-9 bg-slate-50 border-slate-200 w-full"
                  />
                </div>
              </div>
            )}

          {/* Main Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/onboarding" 
                className={`transition-colors ${
                  pathname === "/onboarding" 
                    ? "text-primary-600 font-medium" 
                    : "text-slate-700 hover:text-primary-600"
                }`}
              >
                Setup
              </Link>
              <Link 
                href="/matches" 
                className={`transition-colors ${
                  pathname === "/matches" 
                    ? "text-primary-600 font-medium" 
                    : "text-slate-700 hover:text-primary-600"
                }`}
              >
                Matches
              </Link>
              <Link 
                href="/cohorts" 
                className={`transition-colors ${
                  pathname === "/cohorts" 
                    ? "text-primary-600 font-medium" 
                    : "text-slate-700 hover:text-primary-600"
                }`}
              >
                Cohorts
              </Link>
              <Link 
                href="/connections" 
                className={`transition-colors ${
                  pathname === "/connections" 
                    ? "text-primary-600 font-medium" 
                    : "text-slate-700 hover:text-primary-600"
                }`}
              >
                Connections
              </Link>
              <Link 
                href="/referrals" 
                className={`transition-colors ${
                  pathname === "/referrals" 
                    ? "text-primary-600 font-medium" 
                    : "text-slate-700 hover:text-primary-600"
                }`}
              >
                Referrals
              </Link>
            </div>
            )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden md:flex items-center space-x-4">
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
                </div>

              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile User Menu - Always render */}
            <MobileUserMenu />
          </div>
          </div>
        </div>
      </nav>
      
      {/* Filter bar that appears only on matches page */}
      {isMatchesPage && filtersComponent && (
        <div className="bg-white shadow-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filtersComponent}
          </div>
        </div>
      )}
      
    </div>
  );
}

