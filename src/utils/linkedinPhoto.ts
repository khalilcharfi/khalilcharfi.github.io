/**
 * Professional Profile Photo Fetcher
 * Attempts to fetch profile photo from LinkedIn, XING, and other sources
 * with multiple fallback strategies
 */

export interface ProfilePhotoConfig {
  linkedinUrl?: string;
  xingUrl?: string;
  fallbackAssetPath: string;
  cacheKey?: string;
}

// Legacy support
export type LinkedInPhotoConfig = ProfilePhotoConfig;

/**
 * Get profile photo URL from various sources (LinkedIn, XING, etc.)
 */
export async function getProfilePhotoUrl(config: ProfilePhotoConfig): Promise<string> {
  const { linkedinUrl, xingUrl, fallbackAssetPath, cacheKey = 'profile_photo_url' } = config;
  
  // Legacy support
  const profileUrl = linkedinUrl || xingUrl;
  
  // Check cache first
  const cachedUrl = localStorage.getItem(cacheKey);
  if (cachedUrl) {
    // Verify cached URL still works
    const isValid = await verifyImageUrl(cachedUrl);
    if (isValid) return cachedUrl;
    localStorage.removeItem(cacheKey);
  }

  // Try multiple strategies to get the photo
  const strategies = [
    () => linkedinUrl ? fetchFromLinkedInPublicProfile(linkedinUrl) : Promise.resolve(null),
    () => xingUrl ? fetchFromXINGProfile(xingUrl) : Promise.resolve(null),
    () => linkedinUrl ? fetchFromLinkedInAPI(linkedinUrl) : Promise.resolve(null),
    () => Promise.resolve(fallbackAssetPath)
  ];

  for (const strategy of strategies) {
    try {
      const url = await strategy();
      if (url) {
        const isValid = await verifyImageUrl(url);
        if (isValid) {
          // Cache successful URL (except fallback)
          if (url !== fallbackAssetPath) {
            localStorage.setItem(cacheKey, url);
          }
          return url;
        }
      }
    } catch (error) {
      console.warn('LinkedIn photo fetch strategy failed:', error);
      continue;
    }
  }

  // Final fallback
  return fallbackAssetPath;
}

/**
 * Attempt to extract photo URL from LinkedIn public profile
 */
async function fetchFromLinkedInPublicProfile(profileUrl: string): Promise<string | null> {
  try {
    // Extract username from profile URL
    const username = profileUrl.split('/in/')[1]?.replace('/', '');
    if (!username) return null;

    // Try common LinkedIn CDN patterns
    const cdnPatterns = [
      `https://media.licdn.com/dms/image/v2/D4D03AQH${username}/profile-displayphoto-shrink_800_800/`,
      `https://media.licdn.com/dms/image/D4D03AQH${username}/profile-displayphoto-shrink_400_400/`,
      `https://www.linkedin.com/in/${username}/overlay/photo/`
    ];

    for (const pattern of cdnPatterns) {
      const isValid = await verifyImageUrl(pattern);
      if (isValid) return pattern;
    }

    return null;
  } catch (error) {
    console.warn('Failed to fetch from LinkedIn public profile:', error);
    return null;
  }
}

/**
 * Attempt to extract photo URL from XING public profile
 */
async function fetchFromXINGProfile(profileUrl: string): Promise<string | null> {
  try {
    // Extract username from XING profile URL
    // e.g., https://www.xing.com/profile/Khalil_Charfi2 -> Khalil_Charfi2
    const username = profileUrl.split('/profile/')[1]?.replace('/', '').toLowerCase();
    if (!username) return null;

    // Try common XING CDN patterns
    const xingPatterns = [
      `https://profile-images.xing.com/images/${username}/web/image.jpg`,
      `https://x1.xingassets.com/assets/profile_images/${username}/image.jpg`,
      `https://www.xing.com/image/${username}`,
      `https://profile-images.xing.com/images/${username}/1024x1024/photo.jpg`,
    ];

    for (const pattern of xingPatterns) {
      const isValid = await verifyImageUrl(pattern);
      if (isValid) return pattern;
    }

    return null;
  } catch (error) {
    console.warn('Failed to fetch from XING profile:', error);
    return null;
  }
}

/**
 * Attempt to use LinkedIn API (requires proper CORS and API setup)
 */
async function fetchFromLinkedInAPI(profileUrl: string): Promise<string | null> {
  // This would require OAuth and proper API credentials
  // Placeholder for future implementation
  return null;
}

// Legacy support
export const getLinkedInPhotoUrl = getProfilePhotoUrl;

/**
 * Verify if an image URL is accessible
 */
async function verifyImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      img.src = '';
      resolve(false);
    }, 5000); // 5 second timeout

    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };

    img.src = url;
  });
}

/**
 * Hook to use profile photo with React
 */
export function useProfilePhoto(config: ProfilePhotoConfig) {
  const [photoUrl, setPhotoUrl] = React.useState<string>(config.fallbackAssetPath);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadPhoto() {
      try {
        setIsLoading(true);
        const url = await getProfilePhotoUrl(config);
        if (mounted) {
          setPhotoUrl(url);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setPhotoUrl(config.fallbackAssetPath);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadPhoto();

    return () => {
      mounted = false;
    };
  }, [config.linkedinUrl, config.xingUrl, config.fallbackAssetPath]);

  return { photoUrl, isLoading, error };
}

// Legacy support
export const useLinkedInPhoto = useProfilePhoto;

// For non-React usage
import React from 'react';

