import { translations } from '../data/translations';

export interface TranslationValidationResult {
  isValid: boolean;
  missingKeys: { [lang: string]: string[] };
  extraKeys: { [lang: string]: string[] };
  inconsistentKeys: { [lang: string]: string[] };
  summary: {
    totalLanguages: number;
    totalKeys: number;
    missingCount: number;
    extraCount: number;
    inconsistentCount: number;
  };
}

/**
 * Validates all translations for consistency and completeness
 */
export const validateAllTranslations = (): TranslationValidationResult => {
  const supportedLangs = Object.keys(translations);
  const baseLang = 'en';
  const baseKeys = getAllKeys(translations[baseLang]);
  
  const missingKeys: { [lang: string]: string[] } = {};
  const extraKeys: { [lang: string]: string[] } = {};
  const inconsistentKeys: { [lang: string]: string[] } = {};
  
  let totalMissing = 0;
  let totalExtra = 0;
  let totalInconsistent = 0;
  
  supportedLangs.forEach(lang => {
    if (lang === baseLang) return;
    
    const langKeys = getAllKeys(translations[lang]);
    const missing = baseKeys.filter(key => !langKeys.includes(key));
    const extra = langKeys.filter(key => !baseKeys.includes(key));
    const inconsistent = findInconsistentKeys(translations[baseLang], translations[lang], baseKeys);
    
    if (missing.length > 0) {
      missingKeys[lang] = missing;
      totalMissing += missing.length;
    }
    
    if (extra.length > 0) {
      extraKeys[lang] = extra;
      totalExtra += extra.length;
    }
    
    if (inconsistent.length > 0) {
      inconsistentKeys[lang] = inconsistent;
      totalInconsistent += inconsistent.length;
    }
  });
  
  return {
    isValid: totalMissing === 0 && totalExtra === 0 && totalInconsistent === 0,
    missingKeys,
    extraKeys,
    inconsistentKeys,
    summary: {
      totalLanguages: supportedLangs.length,
      totalKeys: baseKeys.length,
      missingCount: totalMissing,
      extraCount: totalExtra,
      inconsistentCount: totalInconsistent,
    }
  };
};

/**
 * Validates a specific language against the base language
 */
export const validateLanguage = (lang: string): TranslationValidationResult => {
  const baseLang = 'en';
  const baseKeys = getAllKeys(translations[baseLang]);
  const langKeys = getAllKeys(translations[lang]);
  
  const missing = baseKeys.filter(key => !langKeys.includes(key));
  const extra = langKeys.filter(key => !baseKeys.includes(key));
  const inconsistent = findInconsistentKeys(translations[baseLang], translations[lang], baseKeys);
  
  return {
    isValid: missing.length === 0 && extra.length === 0 && inconsistent.length === 0,
    missingKeys: { [lang]: missing },
    extraKeys: { [lang]: extra },
    inconsistentKeys: { [lang]: inconsistent },
    summary: {
      totalLanguages: 1,
      totalKeys: baseKeys.length,
      missingCount: missing.length,
      extraCount: extra.length,
      inconsistentCount: inconsistent.length,
    }
  };
};

/**
 * Gets all nested keys from an object
 */
const getAllKeys = (obj: any, prefix = ''): string[] => {
  let keys: string[] = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(getAllKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  
  return keys;
};

/**
 * Finds keys that have different structures between languages
 */
const findInconsistentKeys = (baseObj: any, langObj: any, baseKeys: string[]): string[] => {
  const inconsistent: string[] = [];
  
  baseKeys.forEach(key => {
    const baseValue = getNestedValue(baseObj, key);
    const langValue = getNestedValue(langObj, key);
    
    if (baseValue !== undefined && langValue !== undefined) {
      const baseType = typeof baseValue;
      const langType = typeof langValue;
      
      // Check if types are different
      if (baseType !== langType) {
        inconsistent.push(key);
      }
      
      // Check if arrays have different lengths
      if (Array.isArray(baseValue) && Array.isArray(langValue)) {
        if (baseValue.length !== langValue.length) {
          inconsistent.push(key);
        }
      }
      
      // Check if objects have different structures
      if (baseType === 'object' && langType === 'object' && !Array.isArray(baseValue) && !Array.isArray(langValue)) {
        const baseKeys = Object.keys(baseValue);
        const langKeys = Object.keys(langValue);
        
        if (baseKeys.length !== langKeys.length || !baseKeys.every(k => langKeys.includes(k))) {
          inconsistent.push(key);
        }
      }
    }
  });
  
  return inconsistent;
};

/**
 * Gets a nested value from an object using dot notation
 */
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

/**
 * Generates a report of translation validation results
 */
export const generateValidationReport = (result: TranslationValidationResult): string => {
  let report = `🌐 Translation Validation Report\n`;
  report += `================================\n\n`;
  
  report += `Summary:\n`;
  report += `- Total Languages: ${result.summary.totalLanguages}\n`;
  report += `- Total Keys: ${result.summary.totalKeys}\n`;
  report += `- Missing Keys: ${result.summary.missingCount}\n`;
  report += `- Extra Keys: ${result.summary.extraCount}\n`;
  report += `- Inconsistent Keys: ${result.summary.inconsistentCount}\n`;
  report += `- Overall Status: ${result.isValid ? '✅ Valid' : '❌ Issues Found'}\n\n`;
  
  if (Object.keys(result.missingKeys).length > 0) {
    report += `Missing Keys:\n`;
    Object.entries(result.missingKeys).forEach(([lang, keys]) => {
      report += `  ${lang}: ${keys.length} missing\n`;
      keys.slice(0, 5).forEach(key => report += `    - ${key}\n`);
      if (keys.length > 5) report += `    ... and ${keys.length - 5} more\n`;
    });
    report += `\n`;
  }
  
  if (Object.keys(result.extraKeys).length > 0) {
    report += `Extra Keys:\n`;
    Object.entries(result.extraKeys).forEach(([lang, keys]) => {
      report += `  ${lang}: ${keys.length} extra\n`;
      keys.slice(0, 5).forEach(key => report += `    - ${key}\n`);
      if (keys.length > 5) report += `    ... and ${keys.length - 5} more\n`;
    });
    report += `\n`;
  }
  
  if (Object.keys(result.inconsistentKeys).length > 0) {
    report += `Inconsistent Keys:\n`;
    Object.entries(result.inconsistentKeys).forEach(([lang, keys]) => {
      report += `  ${lang}: ${keys.length} inconsistent\n`;
      keys.slice(0, 5).forEach(key => report += `    - ${key}\n`);
      if (keys.length > 5) report += `    ... and ${keys.length - 5} more\n`;
    });
  }
  
  return report;
};

/**
 * Fixes common translation issues automatically
 */
export const autoFixTranslations = (): { fixed: number; issues: string[] } => {
  const issues: string[] = [];
  let fixed = 0;
  
  // This would implement automatic fixes for common issues
  // For now, just return a placeholder
  issues.push('Auto-fix functionality not yet implemented');
  
  return { fixed, issues };
};
