# 🚀 Performance Optimization Quick Reference

## 📦 Build & Test Commands

```bash
# Build and analyze bundle
npm run build:analyze

# Build for production
npm run build:prod

# Preview production build
npm run preview:prod

# Run performance audit
npm run perf:audit

# Complete performance report
npm run perf:report

# Full optimization workflow
npm run optimize
```

## 📊 What to Check

### 1. Bundle Analysis
```bash
npm run build:analyze
```
**Look for:**
- Total size < 1.3MB
- three-vendor: ~870KB
- ai-vendor: ~270KB
- react-vendor: ~140KB
- Proper code splitting

### 2. Service Worker
```bash
npm run preview:prod
# Then open DevTools → Application → Service Workers
```
**Verify:**
- Status: Activated and running
- Scope: /
- Static cache: portfolio-static-v1
- Dynamic cache: portfolio-dynamic-v1

### 3. Performance Metrics
**Open console and look for:**
```
🚀 Initializing performance optimizations...
✅ Critical chunks preloaded
✅ Service worker registered
📊 LCP: <2500ms
📊 FID: <100ms
📊 CLS: <0.1
📦 Total JS Size: <1.3MB
```

## 🔧 Key Files Created

| File | Purpose | Status |
|------|---------|--------|
| `src/utils/lazyLoading.ts` | Lazy loading utilities | ✅ Ready |
| `src/utils/performanceInit.ts` | Performance initialization | ✅ Ready |
| `src/components/AIChatBox.tsx` | Lazy-loaded AI chat | ✅ Ready |
| `public/sw.js` | Service Worker | ✅ Active |
| `vite.config.ts` | Build config | ✅ Fixed |

## 🎯 Performance Targets

| Metric | Target | Check With |
|--------|--------|------------|
| Bundle Size | <1MB | `npm run build:analyze` |
| LCP | <2.5s | Lighthouse |
| FID | <100ms | Lighthouse |
| CLS | <0.1 | Lighthouse |
| Performance Score | >90 | Lighthouse |
| Caching | 90%+ | Service Worker |

## 📝 Integration Checklist

- [ ] Read `PERFORMANCE_OPTIMIZATION_GUIDE.md`
- [ ] Add performance init to `index.tsx`
- [ ] Replace AI imports with lazy loading
- [ ] Wrap Canvas with Suspense
- [ ] Replace ChatBox with AIChatBox
- [ ] Test build: `npm run build:analyze`
- [ ] Test service worker: `npm run preview:prod`
- [ ] Run audit: `npm run perf:audit`

## 🚨 Troubleshooting

### Service Worker Not Working
```javascript
// In browser console:
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
  location.reload();
});
```

### Check if AI is Lazy Loading
```javascript
// In browser console:
import('./src/utils/lazyLoading.js').then(m => {
  m.loadAIModule().then(ai => console.log('AI loaded:', !!ai));
});
```

### View All Chunks
```bash
npm run build
ls -lh dist/assets/*.js
```

## 📈 Expected Results

### Before Optimization
- Bundle: 1.6MB
- LCP: ~3s
- FID: ~200ms
- Caching: None
- Performance Score: ~70

### After Optimization
- Bundle: ~1.3MB
- LCP: ~2s
- FID: ~80ms
- Caching: 90%+
- Performance Score: ~90

## 🎉 Success Indicators

You'll know it's working when:
1. ✅ Bundle analysis shows split chunks
2. ✅ Service Worker registered in DevTools
3. ✅ Console shows performance metrics
4. ✅ AI module not in initial load
5. ✅ Lighthouse score >90
6. ✅ Repeat visits are instant

## 📞 Quick Help

**Bundle too large?**
→ Check `dist/bundle-analysis.html`

**Slow loading?**
→ Check Network tab in DevTools

**Service Worker issues?**
→ Check Application tab → Service Workers

**Performance problems?**
→ Run `npm run perf:audit`

---

**Next Step:** Read `PERFORMANCE_OPTIMIZATION_GUIDE.md` for detailed integration instructions.

