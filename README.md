# Khalil Charfi - Portfolio

Modern, interactive portfolio website with React, TypeScript, and Three.js.

## 📚 Documentation

- **[Architecture Guide](./docs/ARCHITECTURE.md)** - Comprehensive architecture documentation
- **[Error Handling Guide](./docs/ERROR_HANDLING.md)** - Error handling patterns and best practices
- **[CI/CD & Git Hooks](./docs/CI_HOOKS.md)** - CI/CD workflows and Git hooks setup
- **[HTML Templating](./docs/HTML_TEMPLATING_GUIDE.md)** - Handlebars templating system for static HTML generation
- **[Templating Options](./docs/TEMPLATING_OPTIONS.md)** - Comparison of templating approaches
- **[No-JS Testing Guide](./docs/NO_JS_TESTING.md)** - Testing progressive enhancement and no-JS fallback
- **[Improvements Summary](./docs/IMPROVEMENTS_SUMMARY.md)** - Detailed changelog of recent improvements

## ✨ Features

- **Tech Stack**: React 18, TypeScript, Vite, Three.js
- **3D Background**: WebGL particle effects
- **i18n**: Multi-language support (EN, AR, FR, DE)
- **PWA**: Offline functionality
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Optimized bundle splitting
- **SEO**: Comprehensive optimization

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

### Testing & CI
| Command | Description |
|---------|-------------|
| `npm run test:playwright` | Run Playwright tests |
| `npm run test:no-js` | Test no-JS fallback (production build) |
| `npm run ci:test` | Run all CI tests locally |
| `npm run ci:validate-translations` | Validate translations |
| `npm run ci:bundle-size` | Check bundle size |

**Note:** For no-JS testing, always use the production build (`npm run preview` on port 4173), not the dev server (port 5177). See [No-JS Testing Guide](./docs/NO_JS_TESTING.md) for details.

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

This project uses **Handlebars** to generate `index.html` from translation data:

- Templates: `templates/*.hbs`
- Generator: `scripts/generate-html.mjs`
- Command: `npm run generate:html`
- Auto-runs: Before every build (`prebuild` hook)

See [HTML Templating Guide](./docs/HTML_TEMPLATING_GUIDE.md) for details.

## Contact

- **LinkedIn**: [linkedin.com/in/khalil-charfi](https://www.linkedin.com/in/khalil-charfi/)
- **GitHub**: [github.com/khalil-charfi](https://github.com/khalil-charfi)

---

Built with ❤️ by Khalil Charfi