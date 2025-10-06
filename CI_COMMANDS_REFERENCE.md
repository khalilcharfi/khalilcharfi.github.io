# 🚀 CI/CD Commands Quick Reference

## Running GitHub Actions Locally

### Option 1: Using NPM Scripts (Recommended)
```bash
# Run translation validation (fast)
npm run ci:validate-translations

# Run bundle size check (includes build)
npm run ci:bundle-size

# Run build verification
npm run ci:build

# Run validation + bundle size
npm run ci:test

# Run all CI checks
npm run ci:all
```

### Option 2: Manual Steps (Mimics GitHub Actions exactly)
```bash
# Translation Validation Workflow
npm ci
npm run i18n:validate

# Bundle Size Check Workflow
npm ci
npm run build
node scripts/check-bundle-size.js

# Deploy Workflow (Build + Verify)
npm ci
npm run build:prod
node scripts/verify-build.js
```

## Git Hooks

### Setup
```bash
# Install hooks (auto-runs after npm install)
npm run hooks:setup

# Remove hooks
npm run hooks:remove
```

### Behavior
- **pre-commit**: Validates translations (runs on `git commit`)
- **pre-push**: Runs full CI suite (runs on `git push`)

### Bypassing Hooks
```bash
# Skip pre-commit hook
git commit --no-verify -m "message"

# Skip pre-push hook
git push --no-verify

# Skip only build tests in pre-push (faster)
SKIP_BUILD_TESTS=1 git push
```

## Testing Hooks Without Pushing

```bash
# Test what pre-push hook will do
npm run ci:test

# Test full suite including build
npm run ci:all
```

## Current Status

Run these to check your current state:
```bash
# Check translations
npm run ci:validate-translations

# Check bundle size (requires build)
npm run ci:bundle-size

# View git status
git status

# View recent commits
git log --oneline -5
```

## Troubleshooting

```bash
# Hooks not working?
npm run hooks:setup

# Clean build
npm run clean
rm -rf node_modules dist
npm install

# View hook files
cat .git/hooks/pre-commit
cat .git/hooks/pre-push
```

---

📖 Full documentation: [docs/CI_HOOKS.md](./docs/CI_HOOKS.md)
