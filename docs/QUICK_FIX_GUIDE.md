# Quick Fix Guide

## 🚨 Emergency Fixes

### Dev Server Not Working?
```bash
# Kill and restart
lsof -ti:5177 | xargs kill -9
npm run dev
```

### Browser Shows Old Code?
```bash
# Hard refresh in browser
# Mac: Cmd + Shift + R
# Windows/Linux: Ctrl + Shift + R
```

### Still Seeing Errors?
```bash
# Nuclear option - clean rebuild
rm -rf node_modules dist .vite
npm install
npm run dev
```

---

## ✅ What We Fixed

### 1. **404 Errors for react-vendor.js and three-vendor.js**
   - **Problem**: Trying to load production chunks in development
   - **Fix**: Added production check before preloading
   - **Result**: You'll now see `⚠️ Skipping chunk preload in development mode`

### 2. **Preload Resource Warnings**
   - **Problem**: Resources preloaded but not used immediately
   - **Fix**: 
     - Skip preloading in development
     - Use `modulepreload` instead of `preload`
     - Conditional Three.js preloading
   - **Result**: Fewer browser warnings

### 3. **Excessive Console Logging**
   - **Problem**: Too many performance logs cluttering console
   - **Fix**: Made logging conditional (only in development when needed)
   - **Result**: Cleaner console output

### 4. **WebSocket Connection Failures**
   - **Problem**: Dev server crashed
   - **Fix**: Restarted server, added `strictPort: false` for flexibility
   - **Result**: Server auto-recovers or uses different port

---

## 📋 Current Status

After restarting the server, your console should show:
```
✅ [vite] connected.
✅ i18next: initialized
✅ 🚀 Initializing performance optimizations...
✅ ⚠️ Skipping chunk preload in development mode
✅ Performance optimizations initialized
✅ 📊 FID: [some number]
```

### ❌ You Should NOT See:
- `react-vendor.js:1 Failed to load resource: 404`
- `three-vendor.js:1 Failed to load resource: 404`
- Multiple preload warnings
- WebSocket connection failures (unless you stopped the server)

---

## 🔍 Verify Everything Works

1. **Open**: http://localhost:5177/
2. **Check Console** (F12): Should show minimal, clean logs
3. **Check Network Tab**: No 404 errors for vendor chunks
4. **Test HMR**: Edit a file, save, changes should appear instantly

---

## 🎯 Best Practices Going Forward

1. **Keep dev server running** - Don't close the terminal
2. **Check console first** - Most issues show up there
3. **Hard refresh after big changes** - Cmd/Ctrl + Shift + R
4. **Restart server if sluggish** - Every few hours during heavy dev

---

## 📱 Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| 404 errors | Restart dev server |
| WebSocket failures | `lsof -ti:5177 \| xargs kill -9 && npm run dev` |
| Old code showing | Hard refresh (Cmd+Shift+R) |
| Memory issues | Restart server, reduce browser tabs |
| Preload warnings | Already fixed, restart server |
| Certificate images not loading | Restart server (was server down issue) |

---

For detailed explanations, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

