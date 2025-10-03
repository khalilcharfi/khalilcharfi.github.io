# Project Structure

This document outlines the cleaned and organized structure of the portfolio project.

## Root Directory
```
khalilcharfi.github.io/
├── src/                          # Source code
├── public/                       # Static assets and service workers
├── docs/                         # Documentation files
├── scripts/                      # Build and utility scripts
├── wasm-modules/                 # WebAssembly modules
├── asset/                        # Certificate images
├── icons/                        # App icons
├── pkg/                          # Generated WASM package
├── index.tsx                     # Main application entry
├── index.html                    # HTML template
├── index.css                     # Global styles
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts               # Vite build configuration
├── manifest.json                # PWA manifest
├── metadata.json                # App metadata
└── README.md                    # Project documentation
```

## Source Directory (`src/`)
```
src/
├── components/                   # React components
│   ├── AIChatBox.tsx
│   ├── ThreeBackground.tsx
│   └── TranslationTest.tsx
├── hooks/                        # Custom React hooks
│   ├── usePerformanceMonitor.ts
│   └── useTranslation.ts
├── i18n/                         # Internationalization
│   └── index.ts
├── types/                        # TypeScript type definitions
│   └── translations.ts
├── utils/                        # Utility functions
│   ├── lazyLoading.ts
│   ├── performanceInit.ts
│   └── translationValidator.ts
├── adapters/                     # Adapter pattern implementations
├── context/                      # React context providers
├── decorators/                   # Decorator pattern implementations
├── examples/                     # Example implementations
├── factories/                    # Factory pattern implementations
├── observers/                    # Observer pattern implementations
├── ports/                        # Port pattern implementations
├── services/                     # Service layer
├── strategies/                   # Strategy pattern implementations
├── styles/                       # Styling utilities
├── advancedFingerprinting.ts     # Advanced fingerprinting logic
├── contentAdapter.ts             # Content adaptation logic
├── CookieConsentBanner.tsx       # Cookie consent component
├── dynamicContent.tsx            # Dynamic content management
├── ErrorBoundary.tsx             # Error boundary component
├── i18n.ts                       # i18n configuration
├── personaSettings.ts            # Persona configuration
├── translations.ts               # Translation definitions
├── userAnalytics.ts              # User analytics
└── VisitorTypeSelector.tsx       # Visitor type selection component
```

## Documentation (`docs/`)
All documentation files have been moved to the `docs/` directory for better organization:
- `CONTENT_MODE_README.md`
- `DYNAMIC_PORTFOLIO_README.md`
- `ENHANCED_FINGERPRINTING_README.md`
- `GITHUB_ENV_GUIDE.md`
- `IMPLEMENTATION_COMPLETE.md`
- `OPTIMIZATION_SUMMARY.md`
- `PERFORMANCE_ANALYSIS_REPORT.md`
- `PERFORMANCE_OPTIMIZATION_GUIDE.md`
- `PERFORMANCE_README.md`
- `QUICK_REFERENCE.md`

## Scripts (`scripts/`)
Build and utility scripts for development and deployment:
- Translation validation and completion scripts
- Performance monitoring and optimization
- GitHub deployment scripts

## Public Assets (`public/`)
Static assets served directly:
- Service worker files (`sw.js`)
- Other static assets

## WASM Modules (`wasm-modules/`)
WebAssembly modules for performance-critical operations:
- Rust source code in `src/`
- Cargo configuration
- Build artifacts are excluded from git

## Cleaned Up Items
The following items were removed during cleanup:
- Temporary test files (`test-*.html`, `test-*.js`)
- Diagnostic scripts (`diagnostic.js`, `react-diagnostic.js`)
- Cache clearing scripts (`clear-sw-cache.js`, `nuclear-reset.js`)
- Build artifacts (`dist/` directory)
- WASM build artifacts (`wasm-modules/target/`)
- Unused dependencies (`@lingual/i18n-check`)
- Shell scripts (`toggle-git-user.sh`, `run-emulator-advanced.sh`)

## Key Features
- **TypeScript**: Full TypeScript support with proper type definitions
- **React**: Modern React with hooks and functional components
- **Three.js**: 3D graphics and animations
- **i18n**: Internationalization support
- **PWA**: Progressive Web App capabilities
- **WASM**: WebAssembly modules for performance
- **Performance Monitoring**: Built-in performance tracking
- **Analytics**: User analytics and tracking
