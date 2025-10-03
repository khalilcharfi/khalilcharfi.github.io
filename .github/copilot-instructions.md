# AI Coding Agent Instructions for Khalil Charfi Portfolio

## Project Overview
A multilingual React portfolio with 3D background (Three.js), AI chat integration, and WebAssembly performance optimizations. Built with Vite, featuring comprehensive i18n support (EN/DE/FR/AR) and advanced performance monitoring.

## Architecture & Key Components

### 📁 Core Structure
- **`index.tsx`** (2729 lines): Monolithic main file containing entire app - components, Three.js setup, AI chat, and all sections
- **`translations.ts`**: Complete translation definitions for 4 languages with type-safe interfaces
- **`src/i18n.ts`**: Enhanced i18next configuration with debugging and language detection
- **`src/hooks/useTranslation.ts`**: Custom hook with missing translation warnings and debugging
- **`wasm-modules/`**: Rust WebAssembly modules for particle system optimization

### 🎯 Performance-First Architecture
- **Chunk splitting**: Configured in `vite.config.ts` with vendor-specific bundles (`three-vendor`, `ai-vendor`, `react-vendor`)
- **Service Worker**: `public/sw.js` handles static/dynamic caching with versioned strategies
- **Lazy loading**: AI components and heavy imports use dynamic imports with Suspense
- **Animation pausing**: `AnimationPauseContext` pauses Three.js when tab inactive

## Critical Developer Workflows

### 🌐 Internationalization (Complete System)
```bash
# Validate all translations
npm run i18n:validate

# Fix missing translations
npm run i18n:fix-missing

# Complete translation workflow
npm run i18n:complete
```

**Translation Structure**: All content in `translations.ts` with nested objects (`nav`, `about`, `skills`, etc.). Use `useTranslation()` hook for type-safe access.

### 🚀 Performance Optimization & Monitoring
```bash
# Full performance analysis workflow
npm run perf:report

# Bundle analysis with visualization  
npm run build:analyze

# Production build with monitoring
npm run build:prod && npm run perf:monitor

# Lighthouse audit (automated)
npm run perf:audit

# Complete optimization pipeline
npm run optimize
```

**Performance Targets**: Bundle <1.6MB (current), LCP <2.5s, Service Worker 90%+ cache hit

**Advanced Monitoring**: 
- Real-time FPS tracking via `usePerformanceMonitor` hook
- Memory usage monitoring with `performance.memory` API
- Service Worker cache hit rates in DevTools Application tab
- WebGL performance adaptive rendering based on device capabilities

### 🔧 Development & Build
```bash
# Development (port 5177)
npm run dev

# Production preview (same port for consistency)
npm run preview:prod
```

## Project-Specific Conventions

### 🎨 Component Patterns
- **Monolithic approach**: Main app logic in `index.tsx` rather than component splitting
- **Three.js integration**: Direct Canvas usage with custom particle systems and WebGL error boundaries
- **Feature flags**: Environment variables control AI chat, dynamic content, personas (`VITE_ENABLE_CHATBOT`, etc.)

### 🔍 Error Handling & Debugging
- **WebGL fallbacks**: `WebGLErrorBoundary` provides graceful degradation
- **Translation debugging**: Missing keys logged in development with similar key suggestions
- **Performance monitoring**: Real-time metrics logged to console in development

### 🏗️ WASM Integration
- **Rust modules**: Performance-critical particle systems in `wasm-modules/src/lib.rs`
- **Build pipeline**: WASM compiled to `pkg/` directory, imported as ES modules
- **Performance critical**: Used for complex calculations and animations

## Key Integration Points

### 🤖 AI Chat System
- **Google GenAI**: Integrated with `@google/genai` package
- **Lazy loading**: `AIChatBox` component loaded on-demand
- **Environment dependent**: Controlled by `GEMINI_API_KEY` and feature flags

### 🎭 Persona & Dynamic Content
- **Visitor profiling**: Advanced fingerprinting in `src/utils/advancedFingerprinting.ts`
- **Content adaptation**: Dynamic content based on visitor type and preferences
- **Analytics**: User behavior tracking with privacy-first approach

## Visitor Analytics & Fingerprinting System

### 🔍 Advanced Browser Fingerprinting
The project includes sophisticated user profiling using browser-native APIs in `src/utils/advancedFingerprinting.ts`:

**Core Fingerprinting Techniques**:
- **Canvas Fingerprinting**: Renders complex graphics to detect GPU/rendering differences
- **WebGL Fingerprinting**: Detects graphics card vendor and renderer information  
- **Audio Context Fingerprinting**: Generates unique audio signatures using Web Audio API
- **Hardware Profiling**: CPU cores, RAM, device memory, touch capabilities
- **Feature Detection**: WebGL, WebAssembly, WebRTC, Web Workers support
- **Behavioral Analysis**: Mouse movements, scroll patterns, interaction timing (privacy-limited)
- **Privacy Indicators**: Incognito mode detection, ad blocker presence

### 📊 User Analytics & Classification
`src/services/userAnalytics.ts` provides comprehensive visitor profiling:

```typescript
// Visitor types automatically detected
type VisitorType = 'recruiter' | 'hr_manager' | 'startup_founder' | 'peer_developer' | 'client'

// Enhanced profile with fingerprinting
interface UserProfile {
  type: VisitorType;
  confidence: number;
  fingerprint: AdvancedFingerprint;
  sessionData: SessionData;
  preferences: UserPreferences;
}
```

**Classification Methods**:
- **Referrer Analysis**: LinkedIn → recruiter, GitHub → peer_developer
- **UTM Parameters**: Campaign-based visitor type detection
- **Device Characteristics**: Mobile vs desktop, hardware capabilities
- **Behavioral Patterns**: Interaction timing, section focus, engagement depth
- **Fingerprint Correlation**: Hardware profiles, feature support patterns

### 🎯 Dynamic Content Adaptation
`src/adapters/contentAdapter.ts` personalizes content based on visitor profiles:

**Content Variations by Visitor Type**:
- **Recruiters**: Professional achievements, team leadership, scalability focus
- **Clients**: Business impact, solution delivery, ROI emphasis
- **Developers**: Technical depth, code quality, open source contributions
- **Unknown**: Balanced presentation with broad appeal

**Adaptive Elements**:
- Hero section messaging and CTAs
- Skills prioritization and presentation
- Project highlighting and descriptions
- Contact preferences and messaging
- Meta tags and SEO optimization

### 🔧 Privacy-First Implementation
**Data Collection Principles**:
- Browser-native APIs only (no external dependencies)
- Limited behavioral tracking (max 10 mouse movements, 5 scroll events)
- Transparent operation via debug panel (`VITE_SHOW_PROFILE_INSIGHTS=true`)
- Local storage only (no external data transmission)
- Consent integration via `react-hook-consent`
- Fallback mode for privacy-conscious users

### 🎛️ Persona Configuration System
`src/config/personaSettings.ts` provides granular control:

```bash
# Environment-based persona control
VITE_ENABLED_PERSONAS="recruiter,client,peer_developer"
VITE_DISABLED_PERSONAS="c_level_executive"  # Takes precedence
VITE_ENABLE_PERSONAS=true                   # Master toggle
```

**Available Personas**:
- **Professional**: recruiter, hr_manager, technical_lead, c_level_executive
- **Business**: startup_founder, product_manager, business_owner, enterprise_client  
- **Geographic**: local_business, remote_work_advocate, international_client
- **General**: general_visitor, returning_visitor, potential_collaborator

### 🔍 Analytics Debugging & Monitoring
```bash
# Enable visitor profiling debug panel
VITE_SHOW_PROFILE_INSIGHTS=true

# Show visitor type selector (manual override)
VITE_SHOW_VISITOR_CONTROLS=true

# Translation debug with persona context
VITE_SHOW_TRANSLATION_DEBUG=true
```

**Debug Information Available**:
- Real-time visitor classification with confidence scores
- Fingerprinting data collection status and results
- Session analytics (time spent, interactions, scroll depth)
- Content adaptation decisions and reasoning
- Privacy settings and consent status

### 📱 PWA Features
- **Manifest**: `manifest.json` with icon variants in `icons/`
- **Service Worker**: Comprehensive caching strategy for offline support
- **Responsive**: Mobile-first design with Three.js performance scaling

## Performance Monitoring System

### 📊 Real-time Performance Metrics
The project includes comprehensive performance monitoring with `usePerformanceMonitor` hook:

```typescript
// Real-time metrics tracked automatically
const { fps, memoryUsage, loadTime, bundleSize } = usePerformanceMonitor();
```

**Key Metrics Monitored**:
- **FPS**: Real-time frame rate for Three.js animations
- **Memory Usage**: JS heap usage via `performance.memory`
- **Load Time**: Initial page load performance
- **Bundle Size**: Chunk-specific size tracking

### 🔍 Performance Analysis Workflows

#### 1. **Bundle Analysis Pipeline**
```bash
npm run build:analyze  # Generates visual bundle analysis
open dist/bundle-analysis.html  # View treemap of bundle sizes
```

**Expected Output**:
- `three-vendor`: ~870KB (Three.js ecosystem)
- `ai-vendor`: ~270KB (Google GenAI)
- `react-vendor`: ~140KB (React core)
- Total target: <1.6MB

#### 2. **Service Worker Cache Monitoring**
```bash
npm run preview:prod
# DevTools → Application → Storage → Cache Storage
```

**Verify**:
- `portfolio-static-v1`: Core assets cached
- `portfolio-dynamic-v1`: Dynamic content cached
- Cache hit rate >90% for optimal performance

#### 3. **Lighthouse Performance Auditing**
```bash
npm run perf:audit  # Automated Lighthouse audit
open dist/lighthouse-report.html  # View detailed metrics
```

**Target Scores**:
- Performance: >90
- LCP: <2.5s
- FID: <100ms
- CLS: <0.1

#### 4. **Memory Leak Detection**
```bash
# In browser console during development
performance.memory  # Monitor heap usage over time
```

**Monitor for**:
- Steadily increasing `usedJSHeapSize`
- Memory spikes during Three.js animations
- Proper cleanup when components unmount

### 🎯 Performance Debugging Commands

```bash
# Complete performance analysis
npm run perf:report

# Monitor production build
npm run preview:prod && npm run perf:monitor

# Optimization pipeline
npm run optimize

# Memory and cache analysis
npm run build:prod && node scripts/performance-monitor.js
```

## Common Tasks & Patterns

### Adding New Translations
1. Add to interface in `translations.ts`
2. Implement in all 4 language objects
3. Run `npm run i18n:validate` to verify completeness
4. Use `useTranslation()` hook in components

### Performance Optimization
1. Check bundle analysis: `npm run build:analyze`
2. Monitor Service Worker cache hit rates in DevTools → Application → Service Workers
3. Use lazy loading for non-critical components (AI chat, Three.js components)
4. Profile Three.js performance with browser dev tools
5. Monitor real-time metrics: `usePerformanceMonitor` hook tracks FPS, memory, load times
6. Run Lighthouse audits: `npm run perf:audit` for comprehensive performance analysis
7. Optimize based on device capabilities: adaptive particle counts, frame skipping for low-end devices

### Performance Debugging & Profiling
1. **Bundle Analysis**: `npm run build:analyze` opens visual bundle analyzer showing chunk sizes
2. **Service Worker Status**: DevTools → Application → Service Workers shows cache hit rates and status
3. **Real-time Metrics**: Console logs show FPS, memory usage, LCP, FID, CLS in development
4. **Memory Profiling**: `performance.memory` API tracks JS heap usage for memory leaks
5. **WebGL Profiling**: Browser dev tools performance tab for Three.js frame analysis
6. **Network Analysis**: Service Worker caches static/dynamic resources with versioned strategies

### WASM Development
1. Modify Rust code in `wasm-modules/src/lib.rs`
2. Build with `wasm-pack build` (or via npm scripts)
3. Import generated bindings from `pkg/` directory
4. Test performance improvements vs JavaScript equivalent

Remember: This is a showcase portfolio emphasizing performance, accessibility, and international reach. Maintain the monolithic structure where it exists, and prioritize performance metrics in all changes.