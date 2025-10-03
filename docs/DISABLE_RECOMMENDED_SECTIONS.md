# Disabling the "Recommended for you" Section

This guide explains how to completely disable the "Recommended for you" section, ensuring it's excluded from both rendering and the final build bundle.

## 🎯 Quick Setup

### Option 1: Environment Variable (Recommended)

Create a `.env` file in your project root:

```bash
# Disable the "Recommended for you" section
VITE_SHOW_RECOMMENDED_SECTIONS=false
```

### Option 2: Build Command

Disable via command line:

```bash
# Development
VITE_SHOW_RECOMMENDED_SECTIONS=false npm run dev

# Production build
VITE_SHOW_RECOMMENDED_SECTIONS=false npm run build
```

### Option 3: GitHub Actions / Deployment

Add to your deployment environment variables:

```yaml
# In your GitHub Actions workflow
env:
  VITE_SHOW_RECOMMENDED_SECTIONS: false
```

## 🛠️ Implementation Details

### Tree-Shaking Benefits

When `VITE_SHOW_RECOMMENDED_SECTIONS=false`:

- ✅ Analytics module is completely excluded from the build
- ✅ Related code paths are eliminated during bundling
- ✅ Bundle size is reduced
- ✅ No performance impact from unused features
- ✅ No network requests to analytics endpoints

### Code Elimination

The implementation uses:

1. **Conditional Imports**: Analytics module only imported when needed
2. **Dead Code Elimination**: Vite/Rollup removes unused code paths
3. **Environment Variable Substitution**: Build-time feature toggling
4. **Type Safety**: Maintains TypeScript compatibility

### Build Verification

Check if the feature is properly disabled:

```bash
# Build and check bundle
npm run build:analyze

# Look for analytics-related chunks - they should be absent when disabled
# Check the bundle visualization at dist/bundle-analysis.html
```

## 🔍 Technical Implementation

### Conditional Analytics Import

```typescript
// src/utils/conditionalAnalytics.ts
export const conditionalAnalytics = SHOW_RECOMMENDED_SECTIONS 
    ? (() => {
        const { analytics } = require('../services/userAnalytics');
        return analytics;
    })()
    : {}; // Empty object when disabled
```

### Safe Method Calls

```typescript
// Only executes when feature is enabled
export const safeAnalyticsCall = (method, ...args) => {
    if (SHOW_RECOMMENDED_SECTIONS && conditionalAnalytics[method]) {
        return conditionalAnalytics[method](...args);
    }
    return null;
};
```

### Component Conditional Rendering

```tsx
// Home component only renders section when enabled
{PERSONAS_FEATURE_ENABLED && SHOW_RECOMMENDED_SECTIONS && analyticsContent?.prioritySections && (
    <div className="priority-sections">
        {/* Recommended sections content */}
    </div>
)}
```

## 📦 Bundle Impact

| State | Bundle Impact |
|-------|---------------|
| **Enabled** | +~85KB (analytics + related code) |
| **Disabled** | No impact (code eliminated) |

## 🧪 Testing

### Development Testing

```bash
# Test enabled state
VITE_SHOW_RECOMMENDED_SECTIONS=true npm run dev

# Test disabled state  
VITE_SHOW_RECOMMENDED_SECTIONS=false npm run dev
```

### Production Testing

```bash
# Build with feature disabled
VITE_SHOW_RECOMMENDED_SECTIONS=false npm run build

# Verify bundle size reduction
npm run build:analyze
```

## 🔧 Default Behavior

- **Default**: `true` (feature enabled)
- **Explicit disable**: Set to `"false"` (string)
- **Build-time**: Value is baked into the bundle
- **Runtime**: Cannot be changed after build

## 📝 Related Files

- `.env.example` - Environment variable documentation
- `src/components/DynamicContent.tsx` - Feature flag definition
- `src/utils/conditionalAnalytics.ts` - Conditional import logic
- `vite.config.ts` - Build-time variable substitution
- `docs/GITHUB_ENV_GUIDE.md` - Deployment environment setup

This implementation ensures optimal performance by completely excluding unused code from the final bundle when the feature is disabled.