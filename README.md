# Khalil Charfi - Portfolio

Modern, interactive portfolio website with React, TypeScript, and Three.js.

## 📚 Documentation

- **[Architecture Guide](./docs/ARCHITECTURE.md)** - Comprehensive architecture documentation
- **[Error Handling Guide](./docs/ERROR_HANDLING.md)** - Error handling patterns and best practices
- **[CI/CD & Git Hooks](./docs/CI_HOOKS.md)** - CI/CD workflows and Git hooks setup
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
| `npm run ci:test` | Run all CI tests locally |
| `npm run ci:validate-translations` | Validate translations |
| `npm run ci:bundle-size` | Check bundle size |

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

## Contact

- **LinkedIn**: [linkedin.com/in/khalil-charfi](https://www.linkedin.com/in/khalil-charfi/)
- **GitHub**: [github.com/khalil-charfi](https://github.com/khalil-charfi)

---

Built with ❤️ by Khalil Charfi