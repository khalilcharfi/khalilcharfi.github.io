import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';

// Enhanced translation hook with better error handling and debugging
export const useTranslation = (namespace?: string) => {
  const { t: originalT, i18n, ready } = useI18nTranslation(namespace);
  
  // Enhanced translation function with debugging
  const t = useCallback((key: string, options?: any) => {
    try {
      const result = originalT(key, options);
      
      // Check if translation is missing (returns the key itself)
      if (result === key && process.env.NODE_ENV === 'development') {
        console.warn(`🌐 Missing translation: "${key}" in language: "${i18n.language}"`);
        
        // Try to find similar keys
        const allKeys = getAllKeysFromResources(i18n.getResourceBundle(i18n.language, namespace || 'translation'));
        const similarKeys = findSimilarKeys(key, allKeys);
        
        if (similarKeys.length > 0) {
          console.warn(`   Similar keys found: ${similarKeys.slice(0, 3).join(', ')}`);
        }
      }
      
      return result;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return key; // Return the key as fallback
    }
  }, [originalT, i18n, namespace]);
  
  // Memoized language utilities
  const languageUtils = useMemo(() => ({
    currentLanguage: i18n.language,
    baseLanguage: i18n.language?.split('-')[0] || 'en',
    isRTL: ['ar', 'he', 'fa', 'ur'].includes(i18n.language?.split('-')[0] || ''),
    changeLanguage: i18n.changeLanguage,
    isReady: ready,
  }), [i18n.language, ready]);
  
  return {
    t,
    i18n,
    ready,
    ...languageUtils,
  };
};

// Helper function to get all keys from a resource bundle
const getAllKeysFromResources = (resources: any, prefix = ''): string[] => {
  if (!resources || typeof resources !== 'object') return [];
  
  let keys: string[] = [];
  
  for (const key in resources) {
    if (resources.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof resources[key] === 'object' && resources[key] !== null && !Array.isArray(resources[key])) {
        keys = keys.concat(getAllKeysFromResources(resources[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  
  return keys;
};

// Helper function to find similar keys using Levenshtein distance
const findSimilarKeys = (targetKey: string, allKeys: string[]): string[] => {
  const similarityThreshold = 0.6;
  
  return allKeys
    .map(key => ({
      key,
      similarity: calculateSimilarity(targetKey, key)
    }))
    .filter(item => item.similarity >= similarityThreshold)
    .sort((a, b) => b.similarity - a.similarity)
    .map(item => item.key);
};

// Simple similarity calculation using Jaccard index
const calculateSimilarity = (str1: string, str2: string): number => {
  const set1 = new Set(str1.toLowerCase().split('.'));
  const set2 = new Set(str2.toLowerCase().split('.'));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

// Export the original hook as well for compatibility
export { useTranslation as useI18nTranslation } from 'react-i18next';
