/**
 * Authentication utilities for the skillex application
 * Provides route guards, redirects, and authentication state management
 */

import { redirect } from 'next/navigation';
import { getCurrentSession, getCurrentUser } from './supabaseClient';

/**
 * Authentication state interface
 */
export interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
}

/**
 * Check if the user is authenticated
 * 
 * @returns Promise resolving to true if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return !!session;
}

/**
 * Get the current authenticated user
 * 
 * @returns Promise resolving to the user object or null
 */
export async function getAuthUser() {
  const user = await getCurrentUser();
  return user;
}

/**
 * Require authentication for a route
 * Redirects to onboarding if not authenticated
 * 
 * @param redirectTo - Optional redirect path (default: '/onboarding/step1')
 */
export async function requireAuth(redirectTo: string = '/onboarding/step1') {
  const isAuth = await isAuthenticated();
  
  if (!isAuth) {
    redirect(redirectTo);
  }
}

/**
 * Require unauthenticated state for a route
 * Redirects to matches if already authenticated
 * 
 * @param redirectTo - Optional redirect path (default: '/matches')
 */
export async function requireGuest(redirectTo: string = '/matches') {
  const isAuth = await isAuthenticated();
  
  if (isAuth) {
    redirect(redirectTo);
  }
}

/**
 * Get the user's JWT token for API requests
 * 
 * @returns Promise resolving to the JWT token or null
 */
export async function getAuthToken(): Promise<string | null> {
  const session = await getCurrentSession();
  return session?.access_token || null;
}

/**
 * Check if the user has completed onboarding
 * This would typically check a user profile or onboarding status
 * For now, we'll assume users need to complete onboarding
 * 
 * @returns Promise resolving to true if onboarding is complete
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  // TODO: Implement actual onboarding check via API
  // This would check if the user has a complete profile
  return false;
}

/**
 * Require completed onboarding
 * Redirects to onboarding if not completed
 * 
 * @param redirectTo - Optional redirect path (default: '/onboarding/step1')
 */
export async function requireOnboardingComplete(redirectTo: string = '/onboarding/step1') {
  const isAuth = await isAuthenticated();
  
  if (!isAuth) {
    redirect('/onboarding/step1');
    return;
  }
  
  const onboardingComplete = await hasCompletedOnboarding();
  
  if (!onboardingComplete) {
    redirect(redirectTo);
  }
}

/**
 * Get user profile data
 * This would typically fetch from your API
 * 
 * @returns Promise resolving to user profile or null
 */
export async function getUserProfile() {
  // TODO: Implement API call to get user profile
  // This would call your API with the JWT token
  return null;
}

/**
 * Authentication middleware for API routes
 * Validates the JWT token from the request
 * 
 * @param request - Next.js request object
 * @returns Promise resolving to the user data or null
 */
export async function validateApiAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  // TODO: Validate token with your API
  // This would verify the JWT token with your backend
  return null;
}
