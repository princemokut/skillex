"use client";
/**
 * Supabase client configuration for the skillex application
 * Provides authentication and database access through Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { supabaseConfig } from './env';

/**
 * Supabase client instance
 * Configured with the project URL and anon key from environment variables
 * 
 * This client is used for:
 * - User authentication (sign up, sign in, sign out)
 * - Session management
 * - JWT token handling
 */
// Client component Supabase instance (uses cookies via auth-helpers)
export const supabase = createClientComponentClient();

/**
 * Get the current user session
 * 
 * @returns Promise resolving to the current session or null
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return session;
}

/**
 * Get the current user
 * 
 * @returns Promise resolving to the current user or null
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return user;
}

/**
 * Sign in with email and password
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to the auth response
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Error signing in:', error);
    throw error;
  }
  
  return data;
}

/**
 * Sign up with email and password
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to the auth response
 */
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    console.error('Error signing up:', error);
    throw error;
  }
  
  return data;
}

/**
 * Sign out the current user
 * 
 * @returns Promise resolving when sign out is complete
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Listen to authentication state changes
 * 
 * @param callback - Function to call when auth state changes
 * @returns Function to unsubscribe from auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}
