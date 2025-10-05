# Khalil Charfi - Portfolio

A modern, interactive portfolio website showcasing professional experience, technical skills, projects, publications, and certifications.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Three.js
- **Interactive 3D Background**: WebGL-powered particle effects
- **Internationalization**: Multi-language support (EN, AR, FR, DE)
- **PWA Support**: Offline functionality and installable
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Optimized bundle splitting and lazy loading
- **SEO Optimized**: Comprehensive SEO with AI/LLM support
- **Responsive Design**: Mobile-first, works on all devices

## 📊 SEO Implementation

This portfolio includes comprehensive SEO optimization:

✅ **On-Page SEO**
- Optimized title tags and meta descriptions
- Proper heading hierarchy
- Semantic HTML structure
- Image alt text
- Internal linking

✅ **Technical SEO**
- `robots.txt` with AI bot support
- `sitemap.xml` auto-generated
- Canonical URLs
- Structured data (Schema.org)
- HTTPS enabled

✅ **AI/LLM Optimization**
- `llms.txt` for AI discovery
- Supports GPT, Claude, Perplexity, and more
- Structured content overview

✅ **Social Media**
- Open Graph tags
- Twitter Cards
- Optimized sharing images

### Quick SEO Commands

```bash
# Generate sitemap
npm run seo:generate

# Validate SEO implementation
npm run seo:validate

# Complete SEO check
npm run seo:check
```

📖 **Full Documentation**: [SEO Quick Start Guide](./docs/SEO_QUICK_START.md)

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/khalil-charfi/khalilcharfi.github.io.git
cd khalilcharfi.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📦 Build & Deploy

```bash
# Development build
npm run build

# Production build
npm run build:prod

# Preview production build
npm run preview

# Deploy to GitHub Pages (automatic via GitHub Actions)
git push origin main
```

## 🧪 Testing

```bash
# Accessibility testing
npm run test:a11y

# Playwright tests
npm run test:playwright

# Run all tests
npm run test:all

# SEO validation
npm run seo:validate
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:prod` | Build with production optimizations |
| `npm run build:analyze` | Build and open bundle analyzer |
| `npm run preview` | Preview production build |
| `npm run seo:generate` | Generate sitemap.xml |
| `npm run seo:validate` | Validate SEO implementation |
| `npm run seo:check` | Generate + validate SEO |
| `npm run test:a11y` | Run accessibility tests |
| `npm run test:playwright` | Run Playwright tests |
| `npm run perf:audit` | Run Lighthouse performance audit |

## 🗂️ Project Structure

```
khalilcharfi.github.io/
├── src/
│   ├── components/        # React components
│   ├── data/             # Translation data
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── styles/           # CSS stylesheets
│   ├── utils/            # Utility functions
│   └── i18n.ts           # i18n configuration
├── public/               # Static assets
│   ├── robots.txt        # Crawler instructions
│   ├── llms.txt          # AI/LLM content overview
│   └── sitemap.xml       # Generated sitemap
├── scripts/              # Build and utility scripts
│   ├── generate-sitemap.js
│   ├── seo-validator.js
│   └── copy-assets.js
├── docs/                 # Documentation
│   ├── SEO_QUICK_START.md
│   └── SEO_COMPLETE_GUIDE.md
├── tests/                # Test files
├── index.html            # Entry HTML
├── index.tsx             # Entry point
└── vite.config.ts        # Vite configuration
```

## 🌐 Internationalization

The portfolio supports multiple languages:

- **English** (default)
- **Arabic** (RTL support)
- **French**
- **German**

Language detection is automatic based on browser settings.

## ♿ Accessibility

This portfolio follows WCAG 2.1 Level AA standards:

- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast compliance
- Reduced motion support

## 🚀 Performance

Performance optimizations include:

- Code splitting
- Lazy loading
- Image optimization
- CSS minification
- Tree shaking
- Bundle analysis
- Resource hints (preconnect, dns-prefetch)
- Service worker for offline support

### Core Web Vitals

| Metric | Target | Status |
|--------|--------|--------|
| LCP | < 2.5s | ✅ Pass |
| FID | < 100ms | ✅ Pass |
| CLS | < 0.1 | ✅ Pass |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Optional: Gemini API for chatbot
GEMINI_API_KEY=your_api_key_here

# Feature flags
VITE_ENABLE_CHATBOT=false
VITE_ENABLE_PERSONAS=false
VITE_SHOW_DEV_ELEMENTS=false
```

### Section Configuration

Enable/disable portfolio sections in `src/config/sections.ts`:

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

## 📝 SEO Best Practices

This portfolio implements modern SEO best practices:

1. **Semantic HTML** - Proper use of HTML5 semantic elements
2. **Meta Tags** - Comprehensive meta tags for search engines and social media
3. **Structured Data** - Schema.org markup for rich snippets
4. **Sitemap** - Auto-generated XML sitemap
5. **Robots.txt** - Proper crawler directives with AI bot support
6. **LLMs.txt** - AI/LLM content overview for better AI understanding
7. **Performance** - Fast loading times and Core Web Vitals optimization
8. **Mobile-First** - Responsive design for all devices
9. **Accessibility** - WCAG 2.1 AA compliance
10. **Content Quality** - Well-structured, relevant content

### AI/LLM Optimization

The portfolio is optimized for AI-powered search engines:

- **llms.txt**: Provides structured overview for AI models
- **AI Bot Support**: Allows GPTBot, ClaudeBot, PerplexityBot, etc.
- **Structured Data**: Schema.org markup for better AI understanding
- **Clean URLs**: SEO-friendly URL structure

Learn more: [llms.txt Specification](https://llmstxt.org/)

## 📈 Monitoring

After deployment, monitor your site with:

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Google Analytics](https://analytics.google.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

- **LinkedIn**: [linkedin.com/in/khalil-charfi](https://www.linkedin.com/in/khalil-charfi/)
- **GitHub**: [github.com/khalil-charfi](https://github.com/khalil-charfi)
- **Website**: [khalilcharfi.github.io](https://khalilcharfi.github.io)

---

**Built with** ❤️ **by Khalil Charfi**

*Last updated: October 4, 2025*