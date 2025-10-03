# Troubleshooting Guide

This guide helps you resolve common issues when developing with Vite.

## Table of Contents
- [WebSocket Connection Failures](#websocket-connection-failures)
- [404 Errors for Vendor Chunks](#404-errors-for-vendor-chunks)
- [Preload Resource Warnings](#preload-resource-warnings)
- [Certificate Image Loading Issues](#certificate-image-loading-issues)
- [Performance Optimization Issues](#performance-optimization-issues)

---

## WebSocket Connection Failures

### Symptoms
```
WebSocket connection to 'ws://localhost:5177/' failed
[vite] server connection lost. Polling for restart...
```

### Causes
1. **Dev server crashed** - The Vite development server stopped running
2. **Port conflict** - Another process is using port 5177
3. **Network issues** - Firewall or network configuration blocking WebSocket connections

### Solutions

#### 1. Restart the Development Server
```bash
# Kill any hanging processes on port 5177
lsof -ti:5177 | xargs kill -9

# Restart the dev server
npm run dev
```

#### 2. Check if Port is Available
```bash
# Check what's using port 5177
lsof -i :5177

# Or use netstat
netstat -an | grep 5177
```

#### 3. Use a Different Port
If port 5177 is consistently problematic, the `vite.config.ts` is already configured with `strictPort: false`, which will automatically try another port if 5177 is unavailable.

#### 4. Check for Browser Extensions
Some browser extensions (especially ad-blockers) can interfere with WebSocket connections. Try:
- Disabling browser extensions temporarily
- Using incognito/private browsing mode
- Testing in a different browser

---

## 404 Errors for Vendor Chunks

### Symptoms
```
react-vendor.js:1  Failed to load resource: the server responded with a status of 404 (Not Found)
three-vendor.js:1  Failed to load resource: the server responded with a status of 404 (Not Found)
```

### Cause
The application is trying to preload production build chunks (`react-vendor.js`, `three-vendor.js`) during **development mode**. These chunks only exist after running `npm run build`.

### Solution
✅ **Already Fixed!** The updated `src/utils/lazyLoading.ts` now includes:

```typescript
export const preloadCriticalChunks = () => {
  // Only preload in production when chunks actually exist
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️ Skipping chunk preload in development mode');
    return;
  }
  // ... rest of the code
};
```

After restarting the dev server, you should see:
```
⚠️ Skipping chunk preload in development mode
```

Instead of 404 errors.

---

## Preload Resource Warnings

### Symptoms
```
The resource <URL> was preloaded using link preload but not used within a few seconds 
from the window's load event. Please make sure it has an appropriate `as` value 
and it is preloaded intentionally.
```

### Causes
1. Resources are preloaded but not actually needed for initial render
2. Resources are loaded too early (before they're actually requested)
3. Incorrect `as` attribute value

### Solutions

#### 1. Development Mode Skip
✅ **Already Fixed!** The preload logic now skips in development mode, preventing unnecessary preloading.

#### 2. Use `modulepreload` Instead of `preload`
✅ **Already Fixed!** The `preloadResource` function now uses `modulepreload` for better ES module support:

```typescript
link.rel = 'modulepreload'; // Better for ES modules
```

#### 3. Conditional Preloading
Three.js is now only preloaded on capable devices and in production:

```typescript
if (process.env.NODE_ENV === 'production') {
  preloadResource('/assets/three-vendor.js', 'script');
}
```

#### 4. If Warnings Persist in Production
After building, verify the preloaded resources are actually used:
```bash
npm run build
npm run preview
```

Then check the Network tab in DevTools to ensure preloaded resources are consumed.

---

## Certificate Image Loading Issues

### Symptoms
```
Certificate Recognizing an E-Health Talk... .jpeg:1  Failed to load resource: net::ERR_CONNECTION_REFUSED
```

### Causes
1. **Dev server is down** - Primary cause (fixes with server restart)
2. **Incorrect image paths** - Images not in the public directory or wrong path references
3. **Image files missing** - Files deleted or moved

### Solutions

#### 1. Verify Images Exist
```bash
# Check if images are in the asset folder
ls -la asset/*.jpeg

# Should show:
# Certificate of Attendance for DAAD E-Health Workshop in Sfax 2016.jpeg
# Certificate of Participation in an E-Health Workshop on Heart Failure.jpeg
# Certificate of Participation in E-Health Workshop on Cardiac Patient Monitoring.jpeg
# Certificate Recognizing an E-Health Talk Presentation on Cardiac Monitoring.jpeg
# Certificate Template from Second DAAD Theralytics Workshop in Darmstadt 2016.jpeg
```

#### 2. Ensure Dev Server is Running
```bash
# Check server status
curl -I http://localhost:5177/

# Should return: HTTP/1.1 200 OK
```

#### 3. Move Images to Public Directory (if needed)
If images are referenced from HTML/React components, they might need to be in the `public` folder:

```bash
# Copy images to public folder
cp asset/*.jpeg public/assets/
```

Then reference them as:
```html
<img src="/assets/Certificate-Name.jpeg" alt="..." />
```

#### 4. Use Import Statements (Recommended)
For better optimization, import images in your React components:

```typescript
import certificateImg from './asset/Certificate-Name.jpeg';

<img src={certificateImg} alt="..." />
```

---

## Performance Optimization Issues

### Excessive Console Logging

If you see too many performance logs in development:

✅ **Already Fixed!** Performance logging is now conditional:

```typescript
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  console.log('📊 Performance metric:', value);
}
```

### High Memory Usage

If the dev server consumes too much memory:

1. **Reduce particle count** - Already optimized with device detection
2. **Disable Three.js** - Set `localStorage.setItem('enableAnimations', 'false')`
3. **Clear browser cache** - Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
4. **Restart dev server regularly** - After major changes

### Slow Hot Module Replacement (HMR)

If changes take too long to reflect:

1. **Reduce file watchers**:
   ```bash
   # Increase file watcher limit (macOS)
   sudo sysctl -w kern.maxfiles=65536
   sudo sysctl -w kern.maxfilesperproc=65536
   ```

2. **Exclude node_modules**:
   Already configured in `vite.config.ts` with proper includes/excludes

3. **Use smaller dependency tree**:
   Consider lazy loading heavy dependencies

---

## Quick Diagnostics Checklist

When encountering issues, run through this checklist:

- [ ] Is the dev server running? (`curl http://localhost:5177/`)
- [ ] Are there any errors in the terminal where dev server is running?
- [ ] Clear browser cache and hard reload (Cmd+Shift+R / Ctrl+Shift+R)
- [ ] Check browser console for errors (F12)
- [ ] Restart the dev server
- [ ] Check if port 5177 is available
- [ ] Disable browser extensions temporarily
- [ ] Try incognito/private mode
- [ ] Verify `node_modules` is up to date (`npm install`)
- [ ] Check for conflicting processes (`lsof -i :5177`)

---

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Kill process on port 5177
lsof -ti:5177 | xargs kill -9

# Check what's using port 5177
lsof -i :5177

# Clear npm cache (if dependency issues)
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Vite version
npx vite --version
```

---

## Still Having Issues?

If problems persist:

1. **Check the Vite logs** - Look for error messages in the terminal where `npm run dev` is running
2. **Check browser console** - F12 → Console tab for JavaScript errors
3. **Check Network tab** - F12 → Network tab to see failed requests
4. **Review recent changes** - Use `git diff` to see what changed
5. **Try a clean build**:
   ```bash
   rm -rf node_modules dist .vite
   npm install
   npm run dev
   ```

---

## Prevention Tips

1. **Always run dev server in a dedicated terminal** - Don't close it accidentally
2. **Monitor memory usage** - Restart server if it gets sluggish
3. **Keep dependencies updated** - Run `npm outdated` regularly
4. **Use version control** - Commit working states frequently
5. **Test production builds** - Run `npm run build && npm run preview` before deploying

---

## Environment-Specific Issues

### Development
- WebSocket issues → Usually server crash, restart it
- 404 errors → Check if file paths are correct and files exist
- Slow performance → Reduce active browser tabs, close other apps

### Production
- Missing chunks → Run `npm run build` before deploying
- Large bundle size → Check bundle analysis at `dist/bundle-analysis.html`
- Slow loading → Enable CDN, check network throttling

---

**Last Updated:** 2025-10-03  
**Vite Version:** 5.x  
**Node Version:** 18+

