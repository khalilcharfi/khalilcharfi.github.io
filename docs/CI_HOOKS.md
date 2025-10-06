# CI/CD and Git Hooks Guide

This document explains how to use the CI/CD scripts and Git hooks in this project.

## 🚀 Quick Start

After cloning the repository, Git hooks are automatically installed via `postinstall` script. If you need to manually set them up:

```bash
npm run hooks:setup
```

## 📋 Available CI Scripts

### Translation Validation
```bash
npm run ci:validate-translations
```
Validates that all translation keys are present in all languages (en, de, fr, ar).

### Bundle Size Check
```bash
npm run ci:bundle-size
```
Builds the project and checks if the bundle size is within acceptable limits:
- **Target:** 350 KB (gzipped)
- **Stretch Goal:** 300 KB (gzipped)
- **Critical:** 450 KB (gzipped)

### Build Verification
```bash
npm run ci:build
```
Builds the project in production mode and verifies:
- All required files exist (index.html, robots.txt, sitemap.xml, llms.txt)
- Assets directory is properly generated
- HTML structure is valid
- SEO files have correct content

### Run All CI Tests
```bash
npm run ci:test          # Validation + Bundle Size
npm run ci:all           # Validation + Build + Bundle Size
```

## 🪝 Git Hooks

### Pre-Commit Hook
Runs automatically before each commit:
- ✅ Validates translations (fast check)

**Skip if needed:**
```bash
git commit --no-verify -m "your message"
```

### Pre-Push Hook
Runs automatically before pushing to remote:
- ✅ Validates translations
- ✅ Builds project in production mode
- ✅ Verifies build output
- ✅ Checks bundle size

**Skip if needed (not recommended):**
```bash
git push --no-verify
```

**Skip only build tests (faster):**
```bash
SKIP_BUILD_TESTS=1 git push
```

## 🔧 Hook Management

### Install Hooks
```bash
npm run hooks:setup
```

### Remove Hooks
```bash
npm run hooks:remove
```

### Reinstall Hooks
```bash
npm run hooks:remove && npm run hooks:setup
```

## 🎯 GitHub Actions Workflows

This project has three GitHub Actions workflows:

### 1. Validate Translations
- **Trigger:** Push/PR to main, next, develop
- **Actions:** Validates translation completeness
- **Local equivalent:** `npm run ci:validate-translations`

### 2. Bundle Size Check
- **Trigger:** Push/PR to main, next, develop
- **Actions:** Checks bundle size and compares with base branch
- **Local equivalent:** `npm run ci:bundle-size`

### 3. Deploy to GitHub Pages
- **Trigger:** Push to main, or manual workflow dispatch
- **Actions:** Builds and deploys to GitHub Pages
- **Local equivalent:** `npm run ci:build`

## 📊 Running GitHub Actions Locally

While the Git hooks provide the same validation, you can also run the exact GitHub Actions steps:

```bash
# Translation validation (from workflow)
npm ci
npm run i18n:validate

# Bundle size check (from workflow)
npm ci
npm run build
node scripts/check-bundle-size.js

# Build and deploy (from workflow)
npm ci
npm run build:prod
node scripts/verify-build.js
```

## 💡 Best Practices

1. **Always run tests locally** before pushing:
   ```bash
   npm run ci:test
   ```

2. **Don't skip hooks** unless absolutely necessary - they catch issues early

3. **Monitor bundle size** - keep it under 350 KB for optimal performance

4. **Keep translations complete** - all languages should have all keys

5. **Use `SKIP_BUILD_TESTS=1`** for quick pushes when you know the build is fine:
   ```bash
   SKIP_BUILD_TESTS=1 git push
   ```

## 🐛 Troubleshooting

### Hooks not running?
```bash
# Check if hooks are installed
ls -la .git/hooks/

# Reinstall hooks
npm run hooks:setup
```

### Build failing locally but not in CI?
```bash
# Clean and rebuild
npm run clean
rm -rf node_modules dist
npm install
npm run build
```

### Bundle size too large?
```bash
# Analyze bundle
npm run build:analyze

# Check what's taking up space in the bundle analysis report
```

### Translation validation failing?
```bash
# See detailed report
npm run i18n:validate

# Auto-fix missing keys (adds placeholders)
npm run i18n:fix-missing
```

## 📝 Notes

- The `postinstall` script automatically sets up hooks after `npm install`
- Hooks are local to your repository and not committed to Git
- Each developer needs to have hooks installed on their machine
- CI/CD workflows in GitHub Actions are the source of truth for deployment
