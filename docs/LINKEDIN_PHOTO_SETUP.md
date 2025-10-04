# LinkedIn Profile Photo Setup Guide

## Overview
Your portfolio now attempts to fetch your LinkedIn profile photo with multiple fallback strategies:
1. Try LinkedIn CDN URLs (if accessible)
2. Fallback to local asset (`/asset/profile-photo.jpg`)
3. Final fallback to a user icon SVG

## Quick Setup (Recommended)

### Step 1: Get Your LinkedIn Photo URL

#### Method A: Right-click Method (Easiest)
1. Open your LinkedIn profile: https://www.linkedin.com/in/khalil-charfi/
2. **Right-click** on your profile photo
3. Select **"Copy Image Address"** or **"Copy Image Link"**
4. Paste this URL into the code (see Step 3)

#### Method B: Inspect Element Method
1. Open your LinkedIn profile: https://www.linkedin.com/in/khalil-charfi/
2. **Right-click** on your profile photo → Select **"Inspect"** or **"Inspect Element"**
3. Look for the `<img>` tag in the developer tools
4. Find the `src` attribute - it will look like:
   ```
   https://media.licdn.com/dms/image/v2/D4D03AQH.../profile-displayphoto-shrink_800_800/...
   ```
5. Copy the entire URL

#### Method C: Download and Use Local File (Most Reliable)
1. Go to your LinkedIn profile
2. Click on your profile photo to open it in full size
3. Right-click → **"Save Image As..."**
4. Save it as `profile-photo.jpg`
5. Move it to: `/asset/profile-photo.jpg` in your project

### Step 2: Update the LinkedIn Photo URL in Code

Open `index.tsx` and find the `About` component (around line 148):

```typescript
const linkedinPhotoUrls = [
    // Method 1: REPLACE THIS with your actual LinkedIn CDN URL
    'https://media.licdn.com/dms/image/v2/D4D03AQH.../profile-displayphoto-shrink_800_800/...',
    // Method 2: Try alternative CDN pattern
    'https://media.licdn.com/dms/image/D4D03AQH.../profile-displayphoto-shrink_400_400/',
    // Method 3: Fallback to asset
    '/asset/profile-photo.jpg'
];
```

### Step 3: Add Local Fallback (Recommended)

Even if you use the LinkedIn URL, it's good to have a local backup:

1. Download your profile photo from LinkedIn
2. Save it to: `/asset/profile-photo.jpg`
3. Commit this file to your repository

## How It Works

### Photo Loading Strategy:
```
┌─────────────────────────────────────┐
│  1. Try LinkedIn CDN URL            │
│     (high resolution - 800x800)     │
└──────────────┬──────────────────────┘
               │
               ├─ Success → Display
               │
               ├─ Fail ↓
┌──────────────▼──────────────────────┐
│  2. Try Alternative LinkedIn URL    │
│     (medium resolution - 400x400)   │
└──────────────┬──────────────────────┘
               │
               ├─ Success → Display
               │
               ├─ Fail ↓
┌──────────────▼──────────────────────┐
│  3. Load from Local Assets          │
│     /asset/profile-photo.jpg        │
└──────────────┬──────────────────────┘
               │
               ├─ Success → Display
               │
               ├─ Fail ↓
┌──────────────▼──────────────────────┐
│  4. Show Default User Icon (SVG)    │
└─────────────────────────────────────┘
```

## Styling Features

Your profile photo includes:
- ✨ **Hover effects** - Slight zoom and rotation on hover
- 🎨 **Gradient background** - Beautiful accent color gradient
- 📱 **Responsive design** - Automatically adjusts for mobile
- 🔄 **Smooth transitions** - Professional animations
- 🌓 **Theme-aware** - Works in both light and dark modes

## Troubleshooting

### Photo Not Loading?
1. **Check CORS**: LinkedIn CDN URLs might have CORS restrictions
   - Solution: Use local asset fallback
   
2. **URL Expired**: LinkedIn photo URLs can expire
   - Solution: Update the URL or use local asset

3. **Path Issues**: Asset path might be incorrect
   - Try: `/asset/profile-photo.jpg`
   - Or: `./asset/profile-photo.jpg`
   - Or: `/public/asset/profile-photo.jpg`

### Best Practice
**Always use the local asset fallback** by placing your profile photo in `/asset/profile-photo.jpg`. This ensures your photo always displays, regardless of LinkedIn URL changes.

## Advanced: Automatic LinkedIn Scraping (Future)

For automatic fetching, you would need:
1. A backend proxy server (to avoid CORS)
2. LinkedIn API access (requires OAuth)
3. Web scraping service (may violate ToS)

**Current Implementation**: Simple, reliable, manual setup with automatic fallbacks.

## File Locations

```
khalilcharfi.github.io/
├── asset/
│   └── profile-photo.jpg          ← Place your photo here
├── index.tsx                       ← Photo loading logic (line 148)
├── index.css                       ← Photo styling (line 776)
└── src/utils/
    └── linkedinPhoto.ts            ← Utility functions (optional)
```

## Quick Commands

```bash
# Download and add your photo
cd /Users/mac134/Downloads/khalilcharfi.github.io/asset/
# Place your profile-photo.jpg here

# Test locally
npm run dev
# Navigate to About section and verify photo displays

# Deploy
npm run build
npm run deploy
```

## Notes

- The profile photo has a 1:1.2 aspect ratio on desktop
- On mobile, it uses 1:1 aspect ratio and appears at the top
- Maximum container size on mobile: 280px
- Includes loading="lazy" for performance
- crossOrigin="anonymous" for CORS-friendly loading

