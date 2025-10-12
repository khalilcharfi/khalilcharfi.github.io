# Khalil Charfi - Portfolio

My personal portfolio site built with React, TypeScript, and Three.js. Nothing fancy, just wanted something that loads fast and looks good.

## 📚 Documentation

- **[Architecture Guide](./docs/ARCHITECTURE.md)** - Comprehensive architecture documentation
- **[Error Handling Guide](./docs/ERROR_HANDLING.md)** - Error handling patterns and best practices
- **[CI/CD & Git Hooks](./docs/CI_HOOKS.md)** - CI/CD workflows and Git hooks setup
- **[Deployment Troubleshooting](./docs/DEPLOYMENT_TROUBLESHOOTING.md)** - GitHub Pages deployment issues and solutions
- **[HTML Templating](./docs/HTML_TEMPLATING_GUIDE.md)** - Handlebars templating system for static HTML generation
- **[Templating Options](./docs/TEMPLATING_OPTIONS.md)** - Comparison of templating approaches
- **[No-JS Testing Guide](./docs/NO_JS_TESTING.md)** - Testing progressive enhancement and no-JS fallback
- **[No-JS i18n Guide](./docs/NO_JS_I18N.md)** - Multilingual support without JavaScript
- **[Multilingual No-JS](./docs/MULTILINGUAL_NO_JS.md)** - Pre-rendered language-specific HTML files
- **[HTML5 Native Components](./docs/HTML5_NATIVE_COMPONENTS.md)** - Modern HTML5 elements for no-JS functionality
- **[Improvements Summary](./docs/IMPROVEMENTS_SUMMARY.md)** - Detailed changelog of recent improvements

## What's Inside

- React 18 + TypeScript + Vite (because 2025 and we're not using create-react-app anymore)
- Three.js for some particle eye-candy in the background
- Supports 4 languages: English, Arabic, French, German
- Works offline (PWA setup)
- Actually accessible (tested with screen readers)
- Optimized for performance - no 10MB bundles here
- SEO optimized so recruiters can actually find it

## Quick Start

```bash
# Install
npm install

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## Scripts

### Development
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Deployment
| Command | Description |
|---------|-------------|
| `npm run deploy:manual` | Manual deployment to GitHub Pages (recommended) |

**Note:** Due to CI environment issues with large files, use manual deployment for production releases. See [Deployment Troubleshooting](./docs/DEPLOYMENT_TROUBLESHOOTING.md) for details.

### Testing & CI
| Command | Description |
|---------|-------------|
| `npm run test:playwright` | Run Playwright tests |
| `npm run test:no-js` | Test no-JS fallback (production build) |
| `npm run ci:test` | Run all CI tests locally |
| `npm run ci:validate-translations` | Validate translations |
| `npm run ci:bundle-size` | Check bundle size |

**Heads up:** Testing no-JS? Use the prod build (`npm run preview` on 4173). Dev server on 5177 won't work for this. See the [No-JS Testing Guide](./docs/NO_JS_TESTING.md) if you're confused.

### Git Hooks
| Command | Description |
|---------|-------------|
| `npm run hooks:setup` | Install Git hooks |
| `npm run hooks:remove` | Remove Git hooks |

See [CI/CD & Git Hooks Guide](./docs/CI_HOOKS.md) for more details.

## Structure

```
src/
├── features/         # Feature modules
├── shared/           # Shared components & utilities
├── context/          # Global contexts
└── styles/           # Global styles
```

## Configuration

Create `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
VITE_ENABLE_CHATBOT=false
```

## HTML Templating

Yeah, I'm using Handlebars to generate the HTML from translation files. Makes it easier to keep everything in sync across languages.

- Templates live in `templates/*.hbs`
- Run `npm run generate:html` if you need to regenerate
- Happens automatically before builds anyway

Check the [HTML Templating Guide](./docs/HTML_TEMPLATING_GUIDE.md) if you want the full story.

## Contact

- **LinkedIn**: [linkedin.com/in/khalil-charfi](https://www.linkedin.com/in/khalil-charfi/)
- **GitHub**: [github.com/khalil-charfi](https://github.com/khalil-charfi)

---

Made by Khalil Charfi • 2025
