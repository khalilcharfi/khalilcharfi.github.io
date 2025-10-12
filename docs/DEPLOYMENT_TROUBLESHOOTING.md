# Deployment Troubleshooting Guide

## Issue: File Truncation in GitHub Actions Deployment

### Problem Description
JavaScript bundle files were being truncated to 1,398 bytes when deployed through GitHub Actions CI/CD pipeline, causing `Uncaught SyntaxError: Invalid or unexpected token` errors on the live site.

**Expected:** `vendor-three-C2c03BIj.js` should be **655,212 bytes**  
**Actual (via CI):** File was truncated to **1,398 bytes**  

### Root Cause
The issue occurs specifically in the GitHub Actions environment when pushing to the `gh-pages` branch. The exact cause is likely:

1. **Git LFS interference**: Even with LFS disabled in the workflow, GitHub's infrastructure may have LFS configurations that affect large file handling
2. **Actions artifact size limits**: The `actions/upload-pages-artifact@v4` and similar actions have issues with files >500KB
3. **CI environment git configuration**: Some git filters or hooks in the Actions environment cause truncation during push operations

### Verified Working Solution: Manual Deployment

A manual deployment script successfully bypasses all CI issues:

```bash
npm run deploy:manual
```

**Script:** `scripts/deploy-manual.sh`

#### What the Script Does:
1. ✅ Builds production locally (`npm run build:prod`)
2. ✅ Initializes a clean git repo in `dist/`
3. ✅ Completely disables Git LFS and line-ending conversions
4. ✅ Verifies file sizes in git's index match filesystem
5. ✅ Commits and force-pushes to `gh-pages` branch
6. ✅ Verifies files on GitHub after push

#### Why Manual Deployment Works:
- Runs in **local environment** without CI restrictions
- **Direct git push** without intermediary actions/artifacts
- **Full control** over git configuration
- **No action size limits** or hidden filters

### Deployment Methods Comparison

| Method | Status | File Size | Notes |
|--------|--------|-----------|-------|
| **Manual Script** | ✅ **WORKS** | 655,212 bytes | Recommended for production |
| `peaceiris/actions-gh-pages@v3` | ❌ Fails | 1,398 bytes | Truncates large files |
| `actions/upload-pages-artifact@v4` | ❌ Fails | 1,398 bytes | Size limit issues |
| Direct `git push` in CI | ❌ Fails | 1,398 bytes | CI environment issue |
| Chunked push (per-file) | ❌ Fails | 1,398 bytes | Still truncates in CI |

### Attempted Fixes (That Didn't Work)

1. ❌ **Code splitting** - Helped reduce bundle size but didn't fix truncation
2. ❌ **Pre-compression** - `.gz` files still truncated
3. ❌ **Disabling LFS in workflow** - CI environment still had issues
4. ❌ **Binary file marking** - Prevented git from reading content at all
5. ❌ **Chunked commits** - Each file still truncated during CI push
6. ❌ **Different GitHub Actions** - All had same truncation issue

### Recommended Workflow

#### For Production Deployments:
```bash
# Use manual deployment script
npm run deploy:manual
```

#### For Development/Testing:
- Continue using CI for validation and checks
- Use manual deployment for actual releases
- CI workflow can still run tests, linting, and build verification

### Future Improvements

To eventually enable CI deployment, investigate:

1. **GitHub support ticket** - This may be a platform issue
2. **Alternative hosting** - Consider Vercel, Netlify, or Cloudflare Pages
3. **CDN preprocessing** - Upload to CDN directly, bypass git
4. **Git submodules** - Separate large assets from main repo

### Verification Commands

Check file size on live site:
```bash
curl -sI https://khalilcharfi.github.io/assets/vendor-three-C2c03BIj.js | grep content-length
# Should return: content-length: 655212
```

Check file in gh-pages branch:
```bash
git fetch origin gh-pages
git show origin/gh-pages:assets/vendor-three-C2c03BIj.js | wc -c
# Should return: 655212
```

### Timeline of Investigation

1. **Initial Error**: Build failed due to missing `chatbotConfig.ts`
2. **Syntax Error**: Deployed site showing JS syntax errors
3. **Discovery**: Files truncated to 1,398 bytes on live site
4. **Investigation**: Tried code splitting, compression, LFS disabling
5. **Root Cause**: Issue isolated to CI environment only
6. **Solution**: Manual deployment script successfully deployed full files

### Success Metrics

✅ **Manual deployment verified working:**
- Build completes: 655KB bundle created
- Git staging: 655KB in git index
- GitHub push: 655KB in gh-pages branch  
- Live site: 655KB file served
- Site loads: No JavaScript errors

---

**Last Updated:** 2025-10-12  
**Status:** Manual deployment working, CI deployment blocked by platform issue

