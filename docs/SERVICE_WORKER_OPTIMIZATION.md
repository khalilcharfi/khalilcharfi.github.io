# Service Worker Setup

## What This Does

The service worker caches your site so it loads instantly on repeat visits and works offline.

## Caching Strategy

**Static files** (HTML, CSS, JS): Cached first for instant loading  
**Images**: Shows cached version immediately, updates in background  
**API calls**: Tries network first, falls back to cache if offline

## Update Handling

When there's a new version:
1. User sees a nice banner asking to update
2. Click "Update Now" to get the latest version
3. Page reloads automatically with new features

## Cache Management

- Automatically limits cache size to prevent storage bloat
- Cleans up old caches when new version installs
- Tracks what's cached vs what needs downloading

## Debugging

Check what's cached:
```javascript
// In browser console
caches.keys().then(console.log);
```

Clear all caches:
```javascript
caches.keys().then(keys => 
  Promise.all(keys.map(key => caches.delete(key)))
);
```

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge).

## Result

Before: Slow loading, no offline support  
After: Instant loading on repeat visits, works offline

