# Priority Sections - Now Disabled by Default

## Summary

Priority sections (the "Recommended for you" section) are now **disabled by default** and will only render when explicitly enabled.

## Changes Made

### 1. Code Changes

**File: `src/components/DynamicContent.tsx`**
- Updated the `SHOW_RECOMMENDED_SECTIONS` configuration to be explicitly disabled by default
- Added clear documentation comments explaining the default behavior
- The feature now requires explicitly setting `VITE_SHOW_RECOMMENDED_SECTIONS=true` to enable

```typescript
// Recommended sections configuration - DISABLED BY DEFAULT
// Priority sections will only render when explicitly enabled via VITE_SHOW_RECOMMENDED_SECTIONS=true
export const SHOW_RECOMMENDED_SECTIONS: boolean = (import.meta as any).env?.VITE_SHOW_RECOMMENDED_SECTIONS === 'true';
```

### 2. Documentation Updates

Updated all documentation files to reflect the new default value:

- **`docs/GITHUB_PAGES_DEPLOYMENT.md`**: Changed default from `true` to `false`
- **`docs/GH_PAGES_BRANCH_DEPLOYMENT.md`**: Changed default from `true` to `false`
- **`docs/DEPLOYMENT_QUICK_START.md`**: Changed default from `true` to `false` and added clarification
- **`docs/GITHUB_ENV_GUIDE.md`**: Added "default: false" note
- **`scripts/verify-deployment.js`**: Updated output to show correct default value

## Behavior

### Default Behavior (No Environment Variable Set)
- Priority sections **will NOT render**
- The "Recommended for you" section will be hidden
- No conditional content based on visitor analytics

### To Enable Priority Sections
Set the environment variable:
```bash
VITE_SHOW_RECOMMENDED_SECTIONS=true
```

Or in GitHub Secrets:
```
Repository → Settings → Secrets and variables → Actions
Add secret: VITE_SHOW_RECOMMENDED_SECTIONS = true
```

## Impact

- **Production**: By default, priority sections are disabled
- **Development**: Same behavior - disabled unless explicitly enabled
- **GitHub Pages**: Requires secret to be set to `true` to enable the feature

## Related Files

The priority sections feature is controlled by:
- `src/components/DynamicContent.tsx` - Feature flag definition
- `index.tsx` - Rendering logic (lines 110-130)
- `index.css` - Styling (lines 1300-1450)
- `src/services/userAnalytics.ts` - Content generation

## Testing

To verify the change is working:

1. **Default (disabled)**: Run `npm run dev` without setting the variable
   - Priority sections should NOT appear
   
2. **Enabled**: Set `VITE_SHOW_RECOMMENDED_SECTIONS=true` in `.env.local`
   - Priority sections should appear when visitor type is detected

## Notes

- This change aligns with privacy-first design principles
- Reduces default bundle size and complexity
- Users can opt-in to the feature when needed
- The implementation remains unchanged - only the default value changed

