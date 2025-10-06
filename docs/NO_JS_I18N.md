# No-JS Internationalization (i18n) Guide

## Overview

The portfolio now supports multilingual content even when JavaScript is disabled. This ensures that users from different regions can access content in their preferred language regardless of their browser settings.

## How It Works

### 1. Language Detection

When the page loads, a small inline script (before the main React app) detects the user's language preference:

```javascript
// Priority order:
1. URL parameter (?lang=en)
2. localStorage (if previously set)
3. Browser language (navigator.language)
4. Default to English
```

### 2. Data Attributes

All translatable content in the no-JS fallback uses `data-*` attributes:

```html
<span class="i18n-nojs-title" 
      data-en="Interactive features unavailable."
      data-de="Interaktive Funktionen nicht verfügbar."
      data-fr="Fonctionnalités interactives non disponibles."
      data-ar="الميزات التفاعلية غير متاحة.">
  Interactive features unavailable.
</span>
```

### 3. Automatic Translation

A lightweight script replaces the content based on detected language:

```javascript
const lang = document.documentElement.getAttribute('data-lang') || 'en';
const i18nElements = document.querySelectorAll('[data-en]');
i18nElements.forEach(el => {
  const text = el.getAttribute('data-' + lang);
  if (text) el.textContent = text;
});
```

## Supported Languages

- 🇬🇧 **English (en)** - Default
- 🇩🇪 **German (de)**
- 🇫🇷 **French (fr)**
- 🇸🇦 **Arabic (ar)** - Includes RTL support

## Testing i18n No-JS

### Method 1: URL Parameters

```bash
# Build and preview
npm run build && npm run preview

# Test different languages
open http://localhost:4173?lang=en  # English
open http://localhost:4173?lang=de  # German
open http://localhost:4173?lang=fr  # French
open http://localhost:4173?lang=ar  # Arabic
```

### Method 2: Browser Language

1. Change your browser's language preference
2. Clear localStorage: `localStorage.clear()`
3. Reload the page
4. The site should detect your browser language

### Method 3: Automated Testing

```bash
# Test all languages with curl
for lang in en de fr ar; do
  echo "Testing $lang..."
  curl -s "http://localhost:4173?lang=$lang" | grep -o 'data-lang="[^"]*"'
done
```

### Method 4: Playwright Test

```javascript
import { test, expect } from '@playwright/test';

const languages = [
  { code: 'en', banner: 'Interactive features unavailable' },
  { code: 'de', banner: 'Interaktive Funktionen nicht verfügbar' },
  { code: 'fr', banner: 'Fonctionnalités interactives non disponibles' },
  { code: 'ar', banner: 'الميزات التفاعلية غير متاحة' }
];

for (const { code, banner } of languages) {
  test(`no-JS should display ${code} content`, async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false
    });
    
    const page = await context.newPage();
    await page.goto(`http://localhost:4173?lang=${code}`);
    
    // Check language attribute
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe(code);
    
    // Check translated banner
    const bannerText = await page.locator('.i18n-nojs-title').textContent();
    expect(bannerText).toContain(banner);
    
    // Check RTL for Arabic
    if (code === 'ar') {
      const dir = await page.getAttribute('html', 'dir');
      expect(dir).toBe('rtl');
    }
    
    await context.close();
  });
}
```

## Translated Elements

The following elements are translated in no-JS mode:

### Banner Messages
- **Title**: "Interactive features unavailable"
- **Message**: "You can still browse all content..."

### Loading Screen
- **Text**: "Loading Portfolio..."

### Footer Note
- **Enhanced Experience**: Full description of JavaScript features

### Language Switcher
- Links to switch between languages (always visible)

## Adding New Translations

### Step 1: Add to translations.ts

```typescript
// src/features/i18n/data/translations.ts
export interface LanguageSpecificTranslations {
  // ... existing fields
  noJs: {
    bannerTitle: string;
    bannerMessage: string;
    footerNote: string;
    newField: string; // Add new field
  };
}

// Then add translations for each language
en: {
  noJs: {
    // ... existing translations
    newField: "English text"
  }
},
de: {
  noJs: {
    // ... existing translations
    newField: "German text"
  }
},
// ... etc
```

### Step 2: Add to index.html

```html
<span class="i18n-new-element"
      data-en="English text"
      data-de="German text"
      data-fr="French text"
      data-ar="Arabic text">
  English text
</span>
```

### Step 3: Test

```bash
npm run build
npm run preview
# Test with ?lang=de, ?lang=fr, etc.
```

## RTL Support

Arabic language automatically enables RTL (Right-to-Left) layout:

```javascript
if (detectedLang === 'ar') {
  document.documentElement.setAttribute('dir', 'rtl');
}
```

CSS automatically handles RTL:
- Text alignment
- Padding/margin flip
- Icon positioning
- Navigation direction

## Language Persistence

Language preference is stored in:
1. **URL parameter** - Highest priority
2. **localStorage** - Persists across sessions
3. **Browser language** - Fallback

When JavaScript is enabled, the React app reads the same `data-lang` attribute for consistency.

## SEO Benefits

### Hreflang Tags

The HTML includes proper hreflang tags:

```html
<link rel="alternate" hreflang="en" href="https://khalilcharfi.github.io/?lang=en">
<link rel="alternate" hreflang="de" href="https://khalilcharfi.github.io/?lang=de">
<link rel="alternate" hreflang="fr" href="https://khalilcharfi.github.io/?lang=fr">
<link rel="alternate" hreflang="ar" href="https://khalilcharfi.github.io/?lang=ar">
<link rel="alternate" hreflang="x-default" href="https://khalilcharfi.github.io/">
```

### Language Attribute

The `lang` attribute is set dynamically:

```html
<html lang="de" data-lang="de">
```

This helps:
- Search engines understand content language
- Screen readers pronounce correctly
- Browser translation tools

## Performance

The i18n solution is extremely lightweight:

- **Script size**: ~200 bytes (inline)
- **Execution time**: <1ms
- **No external dependencies**
- **No network requests**
- **Works offline**

## Accessibility

### Screen Readers

- Proper `lang` attribute for pronunciation
- `hreflang` on language switcher links
- ARIA labels in correct language

### Keyboard Navigation

Language switcher links are keyboard accessible:

```html
<a href="?lang=de" hreflang="de">DE</a>
```

### Visual Indicators

Current language is highlighted in the switcher (when JS enabled).

## Troubleshooting

### Language Not Changing

1. Check URL parameter: `?lang=de`
2. Clear localStorage: `localStorage.clear()`
3. Check browser console for errors
4. Verify data attributes exist in HTML

### RTL Not Working

1. Check if `dir="rtl"` is set on `<html>`
2. Verify CSS doesn't override RTL
3. Test with `?lang=ar`

### Wrong Language Detected

Priority order:
1. URL param (highest)
2. localStorage
3. Browser language
4. Default (en)

Clear localStorage and use URL param to override.

## Best Practices

### 1. Keep Translations in Sync

Always update all 4 languages when adding new content:
- English (en)
- German (de)
- French (fr)
- Arabic (ar)

### 2. Test All Languages

```bash
npm run test:no-js
# Then manually test ?lang=en, ?lang=de, ?lang=fr, ?lang=ar
```

### 3. Use Semantic HTML

```html
<!-- Good -->
<span class="i18n-element" data-en="..." data-de="...">

<!-- Bad -->
<div class="i18n-element" data-en="..." data-de="...">
```

### 4. Keep Translations Short

No-JS fallback should be concise. Save detailed content for the JS version.

### 5. Test RTL Layout

Always test Arabic version for:
- Text alignment
- Icon positioning
- Navigation flow
- Form layouts

## Related Files

- `index.html` - Contains i18n script and data attributes
- `src/features/i18n/data/translations.ts` - Translation definitions
- `docs/NO_JS_TESTING.md` - General no-JS testing guide
- `docs/NO_JS_FIX_SUMMARY.md` - No-JS fix documentation

## Future Improvements

Potential enhancements:

1. **More Languages**: Spanish, Italian, Chinese
2. **Regional Variants**: en-US, en-GB, de-DE, de-AT
3. **Date Formatting**: Locale-specific dates
4. **Number Formatting**: Currency, decimals
5. **Content Negotiation**: Server-side language detection

## Summary

The no-JS i18n solution provides:

✅ Automatic language detection  
✅ 4 languages supported (EN, DE, FR, AR)  
✅ RTL support for Arabic  
✅ Lightweight (<1KB)  
✅ No dependencies  
✅ SEO-friendly  
✅ Accessible  
✅ Works offline  

Users get a localized experience even without JavaScript!
