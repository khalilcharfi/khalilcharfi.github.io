# Portfolio Development Guide

Complete guide for developing, deploying, and maintaining this portfolio.

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Development](#development)
3. [Deployment](#deployment)
4. [Performance](#performance)
5. [SEO](#seo)
6. [Accessibility](#accessibility)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Installation

```bash
# Clone and install
git clone https://github.com/khalil-charfi/khalilcharfi.github.io.git
cd khalilcharfi.github.io
npm install

# Start development
npm run dev
```

### Available Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview build

# Testing
npm run test:a11y        # Accessibility tests
npm run test:playwright  # E2E tests

# SEO
npm run seo:generate     # Generate sitemap
npm run seo:validate     # Validate SEO
npm run seo:check        # Full SEO check

# Performance
npm run build:analyze    # Bundle analysis
npm run perf:audit       # Lighthouse audit
```

---

## Development

### Project Structure

```
src/
├── components/     # React components
├── data/          # Translation data
├── hooks/         # Custom hooks
├── services/      # API services
├── styles/        # CSS files
├── utils/         # Utilities
└── i18n.ts        # i18n config

public/            # Static assets
scripts/           # Build scripts
tests/             # Test files
docs/              # Documentation
```

### Configuration

#### Environment Variables

Create `.env` file:

```env
# Optional: Gemini API for chatbot
GEMINI_API_KEY=your_api_key

# Feature flags
VITE_ENABLE_CHATBOT=false
VITE_ENABLE_PERSONAS=false
VITE_SHOW_DEV_ELEMENTS=false
```

#### Section Configuration

Edit `src/config/sections.ts`:

```typescript
export const SECTION_CONFIG = {
  home: true,
  about: true,
  skills: true,
  projects: true,
  experience: true,
  education: true,
  publications: true,
  certificates: true,
  contact: true
};
```

---

## Deployment

### GitHub Pages (Automatic)

#### 1. Configure Secrets

Go to: `Settings → Secrets and variables → Actions`

Add secret:
- **Name**: `GEMINI_API_KEY`
- **Value**: Your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

#### 2. Enable GitHub Pages

Go to: `Settings → Pages → Source → Select "GitHub Actions"`

#### 3. Deploy

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

Your site will be live at: `https://YOUR_USERNAME.github.io/khalilcharfi.github.io`

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting
```

---

## Performance

### Optimization Checklist

- ✅ Code splitting and lazy loading
- ✅ Image optimization (WebP format)
- ✅ Bundle size optimization
- ✅ Service worker for caching
- ✅ Resource hints (preconnect, dns-prefetch)
- ✅ Dynamic particle count based on device

### Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| LCP | < 2.5s | ✅ Pass |
| FID | < 100ms | ✅ Pass |
| CLS | < 0.1 | ✅ Pass |
| Bundle Size | < 1MB | ✅ Pass |

### Testing Performance

```bash
# Build and analyze
npm run build:analyze

# Lighthouse audit
npm run perf:audit

# Preview production build
npm run preview
```

### Performance Tips

1. **Reduce particle count** on low-end devices (auto-detected)
2. **Lazy load heavy components** (Three.js, AI chatbot)
3. **Use WebP images** with JPEG fallback
4. **Enable service worker** for offline support
5. **Monitor Core Web Vitals** in production

---

## SEO

### What's Implemented

✅ **On-Page SEO**
- Optimized title tags and meta descriptions
- Proper heading hierarchy
- Semantic HTML structure
- Image alt text
- Internal linking

✅ **Technical SEO**
- `robots.txt` with AI bot support
- Auto-generated `sitemap.xml`
- Canonical URLs
- Structured data (Schema.org)
- HTTPS enabled

✅ **AI/LLM Optimization**
- `llms.txt` for AI discovery
- Supports GPT, Claude, Perplexity
- Structured content overview

✅ **Social Media**
- Open Graph tags
- Twitter Cards
- Optimized sharing images

### Quick SEO Setup

```bash
# Generate sitemap
npm run seo:generate

# Validate implementation
npm run seo:validate

# Complete check
npm run seo:check
```

### Post-Deployment SEO

#### 1. Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://khalilcharfi.github.io`
3. Verify ownership
4. Submit sitemap: `https://khalilcharfi.github.io/sitemap.xml`

#### 2. Test Social Sharing

**Facebook/LinkedIn:**
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

**Twitter:**
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

#### 3. Verify Schema Markup

- [Google Rich Results Test](https://search.google.com/test/rich-results)

### SEO Checklist

- [ ] Site accessible via HTTPS
- [ ] `robots.txt` accessible
- [ ] `sitemap.xml` accessible
- [ ] `llms.txt` accessible
- [ ] Images load correctly
- [ ] No broken links
- [ ] Mobile responsive
- [ ] Page loads < 3 seconds
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] Social sharing tested
- [ ] Schema markup validated

---

## Accessibility

### Features

This portfolio is WCAG 2.1 Level AA compliant:

- ✅ Semantic HTML
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ Color contrast compliance
- ✅ Reduced motion support

### Testing

#### Automated Tests

```bash
# Full accessibility test suite
npm run test:a11y

# Quick check
npm run test:a11y:quick

# Lighthouse only
npm run test:a11y:lighthouse
```

#### Manual Testing

**Keyboard Navigation:**
1. Press `Tab` repeatedly
2. Verify all interactive elements are reachable
3. Check focus indicator is visible
4. Ensure no keyboard traps

**Screen Reader (VoiceOver on Mac):**
1. Enable: `Cmd + F5`
2. Navigate with `VO + Arrow keys`
3. Verify all content is announced

**Screen Reader (NVDA on Windows):**
1. Install [NVDA](https://www.nvaccess.org/download/)
2. Navigate with arrow keys
3. Verify content is accessible

**Reduced Motion:**
1. Enable in system preferences
2. Reload page
3. Verify animations are minimal

### Accessibility Targets

- **Lighthouse Score:** 90+ ✅
- **axe-core Violations:** 0 ✅
- **Keyboard Navigation:** 100% ✅
- **Screen Reader:** Fully compatible ✅

---

## Troubleshooting

### Common Issues

#### WebSocket Connection Failed

**Symptoms:**
```
WebSocket connection to 'ws://localhost:5177/' failed
```

**Solutions:**
```bash
# Kill process and restart
lsof -ti:5177 | xargs kill -9
npm run dev
```

#### 404 Errors for Assets

**Symptoms:**
```
Failed to load resource: 404 (Not Found)
```

**Solutions:**
1. Verify dev server is running
2. Check file paths are correct
3. Ensure files exist in correct directory
4. Clear browser cache and hard reload

#### Build Fails

**Solutions:**
```bash
# Clean install
rm -rf node_modules dist .vite
npm install
npm run build
```

#### Slow Performance

**Solutions:**
1. Reduce particle count (auto-detected)
2. Disable animations: `localStorage.setItem('enableAnimations', 'false')`
3. Clear browser cache
4. Restart dev server

### Quick Diagnostics

```bash
# Check server status
curl http://localhost:5177/

# Check port availability
lsof -i :5177

# Verify build
npm run build
npm run preview

# Check dependencies
npm outdated
```

### Environment-Specific Issues

**Development:**
- WebSocket issues → Restart server
- 404 errors → Check file paths
- Slow HMR → Clear cache, restart server

**Production:**
- Missing chunks → Run `npm run build`
- Large bundle → Check `dist/bundle-analysis.html`
- Slow loading → Enable CDN, optimize images

---

## Internationalization

### Supported Languages

- **English** (default)
- **Arabic** (RTL support)
- **French**
- **German**

Language detection is automatic based on browser settings.

### Adding Translations

Edit `src/data/translations.ts`:

```typescript
export const translations = {
  en: {
    nav: {
      home: "Home",
      // ...
    }
  },
  ar: {
    nav: {
      home: "الرئيسية",
      // ...
    }
  }
};
```

---

## Resources

### Official Documentation
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Three.js](https://threejs.org/)

### Testing Tools
- [Playwright](https://playwright.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe-core](https://www.deque.com/axe/)

### SEO Resources
- [Google Search Console](https://search.google.com/search-console)
- [Schema.org](https://schema.org/)
- [llms.txt Spec](https://llmstxt.org/)

### Accessibility Resources
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)

---

## Support

- **Issues:** Check this guide first
- **Bugs:** Create GitHub issue
- **Questions:** Review documentation
- **Updates:** Check git log

---

**Last Updated:** October 4, 2025  
**Version:** 2.0
