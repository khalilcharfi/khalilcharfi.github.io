# Multilingual No-JS Implementation

## Overview

The portfolio now generates **language-specific static HTML files** during the build process, providing full multilingual support for users without JavaScript. Each language has its own pre-rendered HTML file with all content translated.

## How It Works

### Build-Time Generation

During `npm run build`, the system:

1. **Loads translations** from `translations.ts` for all 4 languages
2. **Compiles Handlebars templates** with language-specific data
3. **Generates 4 HTML files**:
   - `index.html` (English - default)
   - `index.de.html` (German)
   - `index.fr.html` (French)
   - `index.ar.html` (Arabic with RTL)
4. **Copies files to dist/** for production deployment

### File Structure

```
/
├── index.html          # English (default)
├── index.de.html       # German
├── index.fr.html       # French
├── index.ar.html       # Arabic (RTL)
└── dist/
    ├── index.html
    ├── index.de.html
    ├── index.fr.html
    └── index.ar.html
```

## For Users Without JavaScript

### Direct Access

Users can access language-specific versions directly:

```
https://khalilcharfi.github.io/              → English
https://khalilcharfi.github.io/index.de.html → German
https://khalilcharfi.github.io/index.fr.html → French
https://khalilcharfi.github.io/index.ar.html → Arabic
```

### Language Switcher

Each page includes a **no-JS language switcher** at the top:

```
🌐 EN | DE | FR | AR
```

Clicking a language loads the corresponding static HTML file - **no JavaScript required**.

## For Users With JavaScript

### Automatic Detection

When JavaScript is enabled, the system:

1. Detects language from:
   - URL parameter (`?lang=de`)
   - localStorage (previous choice)
   - Browser language
   - Defaults to English

2. Dynamically updates content using translations
3. Enables interactive features (3D animations, chatbot, etc.)

### URL Parameters

```
https://khalilcharfi.github.io/?lang=de  → German (JS)
https://khalilcharfi.github.io/?lang=fr  → French (JS)
https://khalilcharfi.github.io/?lang=ar  → Arabic (JS + RTL)
```

## Features

### ✅ No-JS Support

- [x] Pre-rendered HTML for each language
- [x] Language switcher works without JS
- [x] All content translated at build time
- [x] RTL layout for Arabic
- [x] SEO-optimized with hreflang tags
- [x] Proper lang attributes per file
- [x] Schema.org metadata per language

### ✅ Progressive Enhancement

- [x] Works perfectly without JavaScript
- [x] Enhanced with JS when available
- [x] Automatic language detection (JS)
- [x] URL parameter support (JS)
- [x] localStorage persistence (JS)

## Build Process

### Step 1: Generate HTML

```bash
npm run generate:html
```

This runs `scripts/generate-html.mjs` which:
- Loads translations from TypeScript
- Compiles Handlebars templates
- Generates 4 HTML files (one per language)
- Outputs to project root

### Step 2: Build Production

```bash
npm run build
```

This:
- Runs `generate:html` as prebuild step
- Builds React app with Vite
- Copies language files to `dist/`
- Copies assets and SEO files
- Generates multilingual sitemap

### Step 3: Deploy

```bash
# All files in dist/ are deployed:
dist/
├── index.html        # English
├── index.de.html     # German
├── index.fr.html     # French
├── index.ar.html     # Arabic
├── assets/           # Compiled JS/CSS
└── asset/            # Images, certificates
```

## Testing

### Test No-JS Versions

```bash
# Build and preview
npm run build && npm run preview

# Test each language
open http://localhost:4173/              # English
open http://localhost:4173/index.de.html # German
open http://localhost:4173/index.fr.html # French
open http://localhost:4173/index.ar.html # Arabic
```

### Disable JavaScript

1. Open DevTools (F12)
2. Cmd+Shift+P → "Disable JavaScript"
3. Navigate to different language files
4. Verify all content displays correctly

### Automated Testing

```bash
# Run no-JS tests
npm run test:no-js

# Test with curl
curl http://localhost:4173/index.de.html | grep 'lang="de"'
curl http://localhost:4173/index.ar.html | grep 'dir="rtl"'
```

## Template System

### Main Template

`templates/index.hbs`:
```handlebars
<html lang="{{lang}}"{{#if (eq lang 'ar')}} dir="rtl"{{/if}}>
  <head>
    <title>{{profile.name}} | {{t.seo.title}}</title>
    <meta name="description" content="{{t.seo.description}}">
  </head>
  <body>
    {{> navigation}}
    {{> about}}
    {{> skills}}
    {{> experience}}
    {{> education}}
    {{> projects}}
    {{> contact}}
    {{> footer}}
  </body>
</html>
```

### Language Switcher

`templates/partials/navigation.hbs`:
```handlebars
<nav aria-label="Language Switcher">
  <a href="index.html">EN</a> |
  <a href="index.de.html">DE</a> |
  <a href="index.fr.html">FR</a> |
  <a href="index.ar.html">AR</a>
</nav>
```

### Content Sections

Each partial uses translations:
```handlebars
<h2>{{t.about.title}}</h2>
<p>{{t.about.professionalSummary}}</p>
```

## Generator Script

`scripts/generate-html.mjs`:

```javascript
// Generate for each language
languages.forEach(lang => {
  const html = template({
    lang,
    profile,
    t: translations[lang],
    jsonLd: createJsonLd(lang)
  });
  
  fs.writeFileSync(`index.${lang}.html`, html);
});
```

## SEO Benefits

### Hreflang Tags

Each file includes proper hreflang tags:

```html
<link rel="alternate" hreflang="en" href="https://khalilcharfi.github.io/">
<link rel="alternate" hreflang="de" href="https://khalilcharfi.github.io/index.de.html">
<link rel="alternate" hreflang="fr" href="https://khalilcharfi.github.io/index.fr.html">
<link rel="alternate" hreflang="ar" href="https://khalilcharfi.github.io/index.ar.html">
<link rel="alternate" hreflang="x-default" href="https://khalilcharfi.github.io/">
```

### Language Attributes

```html
<!-- English -->
<html lang="en">

<!-- German -->
<html lang="de">

<!-- French -->
<html lang="fr">

<!-- Arabic (RTL) -->
<html lang="ar" dir="rtl">
```

### Structured Data

Each language has its own Schema.org JSON-LD with translated content:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Khalil Charfi",
  "description": "Translated professional summary...",
  "knowsAbout": ["Translated skills..."],
  "inLanguage": ["en", "de", "fr", "ar"]
}
```

## Performance

### File Sizes

```
index.html     31 KB  (English)
index.de.html  31 KB  (German)
index.fr.html  32 KB  (French)
index.ar.html  33 KB  (Arabic)
Total:        127 KB  (all languages)
```

### Benefits

- **No runtime overhead**: Content pre-rendered
- **Fast loading**: No translation processing
- **SEO-friendly**: Search engines index all versions
- **Offline-ready**: Works without server
- **Accessible**: Screen readers get proper lang attributes

## Deployment

### GitHub Pages

All files are deployed automatically:

```yaml
# .github/workflows/deploy.yml
- name: Build
  run: npm run build

- name: Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    publish_dir: ./dist
```

### Server Configuration

If using a custom server, configure redirects:

```nginx
# Nginx example
location / {
  # Detect browser language
  if ($http_accept_language ~* "^de") {
    rewrite ^/$ /index.de.html last;
  }
  if ($http_accept_language ~* "^fr") {
    rewrite ^/$ /index.fr.html last;
  }
  if ($http_accept_language ~* "^ar") {
    rewrite ^/$ /index.ar.html last;
  }
  
  # Default to English
  try_files $uri $uri/ /index.html;
}
```

## Adding New Languages

### Step 1: Add Translations

Add to `src/features/i18n/data/translations.ts`:

```typescript
es: {
  nav: { /* ... */ },
  about: { /* ... */ },
  // ... all sections
}
```

### Step 2: Update Generator

Add to `scripts/generate-html.mjs`:

```javascript
const languages = ['en', 'de', 'fr', 'ar', 'es'];
```

### Step 3: Update Copy Script

Add to `scripts/copy-assets.js`:

```javascript
const langFiles = [
  'index.de.html',
  'index.fr.html',
  'index.ar.html',
  'index.es.html'  // Add new language
];
```

### Step 4: Update Navigation

Add to `templates/partials/navigation.hbs`:

```handlebars
<a href="index.es.html">ES</a>
```

### Step 5: Rebuild

```bash
npm run build
```

## Maintenance

### Updating Translations

1. Edit `src/features/i18n/data/translations.ts`
2. Run `npm run generate:html`
3. Verify generated files
4. Commit changes

### Testing Checklist

- [ ] All 4 language files generated
- [ ] Language switcher works without JS
- [ ] RTL layout for Arabic
- [ ] Proper lang attributes
- [ ] Hreflang tags present
- [ ] Schema.org data per language
- [ ] Files copied to dist/
- [ ] No console errors
- [ ] Accessibility validated

## Troubleshooting

### Files Not Generated

```bash
# Check if templates exist
ls templates/partials/

# Check if translations load
npm run generate:html
```

### Wrong Language Content

```bash
# Verify translations
grep 'lang="de"' index.de.html
grep 'Über mich' index.de.html
```

### Files Not in dist/

```bash
# Check copy script
npm run build | grep "language-specific"

# Manually copy
cp index.*.html dist/
```

## Related Documentation

- [No-JS Testing Guide](./NO_JS_TESTING.md)
- [No-JS i18n Guide](./NO_JS_I18N.md)
- [HTML Templating Guide](./HTML_TEMPLATING_GUIDE.md)

## Summary

The portfolio provides **true multilingual support without JavaScript** by:

1. ✅ **Pre-rendering** HTML for each language at build time
2. ✅ **Generating** 4 static files (EN, DE, FR, AR)
3. ✅ **Including** language switcher that works without JS
4. ✅ **Supporting** RTL layout for Arabic
5. ✅ **Optimizing** for SEO with proper hreflang tags
6. ✅ **Enhancing** with JavaScript when available

Users get a **fully localized experience** regardless of whether JavaScript is enabled!
