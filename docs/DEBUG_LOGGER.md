# Debug Logger

## Why This Exists

Debugging production builds is a pain when you can't easily access the console. So I built this floating logger that shows console logs right on the page. Simple as that.

## What It Does

### Captures Everything
- Hooks into all console methods: `log()`, `info()`, `warn()`, `error()`
- Shows logs in real-time
- Auto-scrolls to newest entries

### Makes It Pretty
- **Color-coded by level**:
  - 📝 Blue = regular logs
  - ℹ️ Green = info
  - ⚠️ Orange = warnings
  - ❌ Red = errors
- Timestamps with milliseconds
- JSON objects get pretty-printed

### Easy to Use
- Filter logs by typing keywords
- Clear button to wipe everything
- Minimize/maximize toggle
- Close it completely (shows a "Show Logs" button)

### Smart Position
- Floats in bottom-right corner
- Works on mobile
- Doesn't get in your way
- (TODO: make it draggable)

## How to Use

### It's Already There

The logger loads automatically in dev and prod:

```tsx
// Already in index.tsx
const DebugLogger = lazy(() => 
  import('@/shared/components/debug/DebugLogger').then(m => ({ default: m.DebugLogger }))
);

<Suspense fallback={null}>
  <DebugLogger />
</Suspense>
```

### Using It

1. Open your page - logger appears bottom-right
2. Type keywords to filter (like "Loading", "Error", etc.)
3. Watch logs update in real-time
4. Click 🗑️ to clear
5. Click ⬇️ to minimize
6. Click ✖️ to close

### What You'll See

When the page loads, you get a detailed log sequence:

```
12:34:56.123 📝 [DebugLogger] Logger initialized
12:34:56.125 📝 [App Init] Starting initialization...
12:34:56.127 📝 [LoadingManager] startLoading() called with total: 10
12:34:56.130 📝 [App Render] Rendering with loading state
12:34:56.645 📝 [Loading] Timer fired - completing...
12:34:56.647 📝 [Loading] ✅ Complete!
```

Super helpful for tracking down issues during initialization.

## Why It's Useful

### Production Builds
- No need to open browser console
- Easy to screenshot and share with team
- Works great on mobile where console access sucks
- See exact timing of everything

### Development
- Keep logs visible while using DevTools
- Filter out noise quickly
- History persists (unlike console that clears)

## Controls

| Button | What it does |
|--------|-------------|
| 🗑️ | Clear all logs |
| ⬇️ / ⬆️ | Minimize / Maximize |
| ✖️ | Close |
| Filter box | Search logs |

## Customization

Want to move it? Edit `DebugLogger.css`:

```css
.debug-logger {
  bottom: 20px;  /* vertical position */
  right: 20px;   /* horizontal position */
  width: 600px;  /* width */
  max-height: 500px; /* max height */
}
```

Change colors:

```css
.debug-logger-log {
  border-left-color: #4299e1; /* Blue */
}

.debug-logger-error {
  border-left-color: #f56565; /* Red */
}
```

## Performance

- Minimal overhead (just intercepts console)
- Lazy loaded on demand
- Uses React's virtual DOM efficiently
- Cleans up properly when closed

## TODO

- [ ] Make it draggable
- [ ] Make it resizable
- [ ] Export logs to file
- [ ] Regex search
- [ ] Collapsible log groups
- [ ] Show network requests
- [ ] Save to localStorage

## Troubleshooting

**Logger not showing?**
- Check browser console for errors
- Make sure it's actually rendered
- Check z-index (might be behind something)

**Logs not updating?**
- Are you actually calling console methods?
- Any JS errors blocking React updates?

**Slow performance?**
- Clear logs (🗑️)
- You're probably logging too much

## Files

- `src/shared/components/debug/DebugLogger.tsx`
- `src/shared/components/debug/DebugLogger.css`
- `src/shared/components/debug/index.ts`
- `index.tsx` (where it's loaded)

Pretty handy for debugging, honestly.
