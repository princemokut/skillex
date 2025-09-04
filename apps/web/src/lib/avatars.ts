/**
 * Avatar utility functions for generating deterministic avatar URLs
 * Provides consistent avatar generation using various services
 */

/**
 * Generate a DiceBear avatar URL
 * @param seed - The seed for generating the avatar
 * @param style - The DiceBear style (default: 'avataaars')
 * @returns The DiceBear avatar URL
 */
export function generateDiceBearAvatar(seed: string, style: string = 'avataaars'): string {
  const encodedSeed = encodeURIComponent(seed);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodedSeed}`;
}

/**
 * Generate a UI Avatars URL
 * @param name - The name to generate initials from
 * @param background - Background color (default: 'random')
 * @param color - Text color (default: 'fff')
 * @returns The UI Avatars URL
 */
export function generateUIAvatar(name: string, background: string = 'random', color: string = 'fff'): string {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const encodedName = encodeURIComponent(initials);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=${color}&size=128`;
}

/**
 * Generate a Picsum placeholder avatar
 * @param seed - The seed for generating the image
 * @param size - The size of the image (default: 128)
 * @returns The Picsum avatar URL
 */
export function generatePicsumAvatar(seed: string, size: number = 128): string {
  const seedHash = seed.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return `https://picsum.photos/seed/${Math.abs(seedHash)}/${size}/${size}`;
}

/**
 * Generate a deterministic avatar URL using the best available service
 * @param name - The name to generate the avatar from
 * @param service - The service to use (default: 'dicebear')
 * @returns The avatar URL
 */
export function generateAvatarUrl(name: string, service: 'dicebear' | 'ui-avatars' | 'picsum' = 'dicebear'): string {
  if (!name || name.trim() === '') {
    name = 'User';
  }

  switch (service) {
    case 'dicebear':
      return generateDiceBearAvatar(name);
    case 'ui-avatars':
      return generateUIAvatar(name);
    case 'picsum':
      return generatePicsumAvatar(name);
    default:
      return generateDiceBearAvatar(name);
  }
}

/**
 * Get user initials from a name
 * @param name - The full name
 * @returns The initials (max 2 characters)
 */
export function getUserInitials(name: string): string {
  if (!name || name.trim() === '') {
    return 'U';
  }

  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a random avatar seed based on user data
 * @param name - The user's name
 * @param email - The user's email (optional)
 * @returns A deterministic seed for avatar generation
 */
export function generateAvatarSeed(name: string, email?: string): string {
  const baseSeed = email ? `${name}-${email}` : name;
  return baseSeed.toLowerCase().replace(/[^a-z0-9]/g, '');
}
