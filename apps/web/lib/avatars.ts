/**
 * Avatar utilities for generating deterministic avatar URLs
 * Uses external services to generate consistent avatars without requiring file uploads
 */

/**
 * Generates a DiceBear avatar URL for a user handle
 * Provides consistent, colorful avatars based on the user's handle
 * 
 * @param handle - User's unique handle
 * @param size - Avatar size in pixels (default: 100)
 * @returns DiceBear avatar URL
 */
export function getDiceBearAvatar(handle: string, size: number = 100): string {
  const seed = encodeURIComponent(handle);
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}&radius=50&size=${size}`;
}

/**
 * Generates a UI Avatars initials avatar URL
 * Creates avatars with user initials and random background colors
 * 
 * @param fullName - User's full name
 * @param size - Avatar size in pixels (default: 100)
 * @returns UI Avatars URL
 */
export function getInitialsAvatar(fullName: string, size: number = 100): string {
  const name = encodeURIComponent(fullName);
  return `https://ui-avatars.com/api/?name=${name}&background=random&size=${size}&color=fff&bold=true`;
}

/**
 * Generates a cover image URL using Picsum
 * Provides consistent cover images for user profiles
 * 
 * @param handle - User's unique handle
 * @param width - Image width (default: 1200)
 * @param height - Image height (default: 300)
 * @returns Picsum cover image URL
 */
export function getCoverImage(handle: string, width: number = 1200, height: number = 300): string {
  const seed = encodeURIComponent(handle);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

/**
 * Gets the appropriate avatar URL for a user
 * Falls back to initials avatar if no handle is provided
 * 
 * @param user - User object with handle and fullName
 * @param size - Avatar size in pixels (default: 100)
 * @returns Avatar URL
 */
export function getUserAvatar(
  user: { handle?: string; fullName: string },
  size: number = 100
): string {
  if (user.handle) {
    return getDiceBearAvatar(user.handle, size);
  }
  return getInitialsAvatar(user.fullName, size);
}

/**
 * Gets a cover image URL for a user profile
 * 
 * @param user - User object with handle
 * @param width - Image width (default: 1200)
 * @param height - Image height (default: 300)
 * @returns Cover image URL
 */
export function getUserCoverImage(
  user: { handle: string },
  width: number = 1200,
  height: number = 300
): string {
  return getCoverImage(user.handle, width, height);
}

/**
 * Avatar size presets for consistent sizing across the app
 */
export const avatarSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 64,
  xl: 100,
  '2xl': 128,
} as const;

/**
 * Gets an avatar URL with a predefined size
 * 
 * @param user - User object
 * @param size - Predefined size key
 * @returns Avatar URL with specified size
 */
export function getAvatarWithSize(
  user: { handle?: string; fullName: string },
  size: keyof typeof avatarSizes = 'md'
): string {
  return getUserAvatar(user, avatarSizes[size]);
}
