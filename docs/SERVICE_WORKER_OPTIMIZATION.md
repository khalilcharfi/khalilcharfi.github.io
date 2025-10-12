# Service Worker

## What It Does

Caches your site so it loads instantly on repeat visits and works offline. Pretty standard PWA stuff.

## Caching Strategy

**Static files** (HTML, CSS, JS)  
→ Cache-first. Shows cached version immediately for speed.

**Images**  
→ Stale-while-revalidate. Shows cached version, updates in background.

**API calls**  
→ Network-first. Tries live data, falls back to cache if offline.

## Updates

When there's a new version:
1. User sees a banner asking if they want to update
2. Click "Update Now" and boom - fresh version
3. Page auto-reloads with new stuff

No weird bugs from stale caches hopefully.

## Cache Management

- Auto-limits cache size so it doesn't eat all storage
- Cleans up old caches when new version installs
- Tracks what's cached vs what needs fetching

## Debugging

**See what's cached:**
```javascript
// In browser console
caches.keys().then(console.log);
```

**Clear everything:**
```javascript
caches.keys().then(keys => 
  Promise.all(keys.map(key => caches.delete(key)))
);
```

## Browser Support

Works on Chrome, Firefox, Safari, Edge. All modern browsers basically.

## Results

Before: Slow loading every time, no offline  
After: Instant on repeat visits, works offline

Not rocket science, just proper caching.
