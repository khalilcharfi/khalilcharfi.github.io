# Testing No-JS Mode (Progressive Enhancement)

This guide explains how to test your portfolio when JavaScript is disabled to ensure progressive enhancement and accessibility.

## 🎯 Why Test No-JS Mode?

- **Accessibility**: Some users browse with JS disabled for security/privacy
- **Search Engines**: Crawlers may not execute JavaScript
- **Performance**: Test fallback content and core functionality
- **Progressive Enhancement**: Ensure basic content is always accessible

## 🧪 Testing Methods

### Method 1: Browser DevTools (Recommended)

#### Chrome/Edge
1. Open DevTools (`F12` or `Cmd+Option+I` on Mac)
2. Open Command Palette:
   - Windows/Linux: `Ctrl+Shift+P`
   - Mac: `Cmd+Shift+P`
3. Type "JavaScript" and select **"Disable JavaScript"**
4. Refresh the page (`F5` or `Cmd+R`)
5. Test the site
6. Re-enable: Same steps, select **"Enable JavaScript"**

**Quick Toggle:**
```
Settings (⚙️) → Preferences → Debugger → Disable JavaScript
```

#### Firefox
1. Type `about:config` in address bar
2. Accept the warning
3. Search for `javascript.enabled`
4. Toggle to `false`
5. Refresh the page
6. Toggle back to `true` when done

#### Safari
1. Go to Safari → Preferences (or `Cmd+,`)
2. Click **Advanced** tab
3. Check "Show Develop menu in menu bar"
4. Go to Develop → Disable JavaScript
5. Refresh the page
6. Re-enable: Develop → Enable JavaScript

### Method 2: Browser Extensions

#### Chrome/Edge
- [Quick Javascript Switcher](https://chrome.google.com/webstore/detail/quick-javascript-switcher/)
- [JavaScript Toggle On and Off](https://chrome.google.com/webstore/detail/javascript-toggle-on-and/)

#### Firefox
- [NoScript](https://addons.mozilla.org/en-US/firefox/addon/noscript/)
- [JavaScript Toggle](https://addons.mozilla.org/en-US/firefox/addon/javascript-toggle/)

### Method 3: Using curl (Command Line)

Test what search engines and no-JS users see:

```bash
# View the raw HTML
curl http://localhost:5177 | less

# Save to file for inspection
curl http://localhost:5177 > no-js-output.html

# View with lynx (text browser)
lynx http://localhost:5177

# View with w3m (text browser)
w3m http://localhost:5177
```

### Method 4: Playwright/Puppeteer (Automated Testing)

Create a test script:

```javascript
// tests/no-js.spec.ts
import { test, expect } from '@playwright/test';

test('should display content without JavaScript', async ({ page, context }) => {
  // Disable JavaScript
  await context.addInitScript(() => {
    delete (window as any).navigator;
  });
  
  await page.goto('http://localhost:5177', {
    waitUntil: 'domcontentloaded'
  });
  
  // Test that basic content is visible
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
  
  // Test noscript tag content
  const noscript = await page.locator('noscript').textContent();
  expect(noscript).toBeTruthy();
});
```

Run with:
```bash
npx playwright test tests/no-js.spec.ts
```

## 📋 What to Test

### ✅ Should Work Without JS

1. **Content Visibility**
   - [ ] All text content is visible
   - [ ] Headings and structure are clear
   - [ ] Images load with proper alt text
   - [ ] Links are clickable

2. **Navigation**
   - [ ] Anchor links work (e.g., `#about`, `#contact`)
   - [ ] Skip links are functional
   - [ ] Navigation menu is accessible

3. **SEO Elements**
   - [ ] Meta tags are present
   - [ ] Structured data is in HTML
   - [ ] Semantic HTML is used

4. **Accessibility**
   - [ ] Screen readers can access content
   - [ ] Keyboard navigation works
   - [ ] ARIA labels are present

### ⚠️ Expected Limitations Without JS

1. **Interactive Features**
   - ❌ Theme toggle (dark/light mode)
   - ❌ Language switcher
   - ❌ Chatbot
   - ❌ 3D background animations
   - ❌ Smooth scrolling
   - ❌ Modal dialogs

2. **Dynamic Content**
   - ❌ Lazy-loaded sections
   - ❌ Certificate modal
   - ❌ Form validation
   - ❌ Analytics tracking

## 🛠️ Improving No-JS Experience

### Add Noscript Tags

```html
<!-- In index.html -->
<noscript>
  <div class="no-js-warning">
    <h2>JavaScript is Disabled</h2>
    <p>
      For the best experience, please enable JavaScript in your browser.
      You can still view the content below, but some features will be unavailable.
    </p>
  </div>
  
  <style>
    .no-js-warning {
      background: #fff3cd;
      border: 2px solid #ffc107;
      padding: 20px;
      margin: 20px;
      border-radius: 8px;
      text-align: center;
    }
  </style>
</noscript>
```

### Server-Side Rendering (SSR)

For better no-JS support, consider:
- Next.js (React SSR)
- Gatsby (Static Site Generation)
- Astro (Partial Hydration)

### Progressive Enhancement Pattern

```jsx
// Component with progressive enhancement
const MyComponent = () => {
  return (
    <>
      {/* Fallback content (works without JS) */}
      <div className="static-content">
        <h2>Contact Information</h2>
        <a href="mailto:email@example.com">email@example.com</a>
      </div>
      
      {/* Enhanced version (requires JS) */}
      <div className="enhanced-content" style={{ display: 'none' }}>
        <ContactForm />
      </div>
      
      <script dangerouslySetInnerHTML={{__html: `
        document.querySelector('.static-content').style.display = 'none';
        document.querySelector('.enhanced-content').style.display = 'block';
      `}} />
    </>
  );
};
```

## 🧪 Testing Checklist

### Before Release

- [ ] Test homepage without JS
- [ ] Verify all sections are visible
- [ ] Check navigation links work
- [ ] Test on mobile viewport
- [ ] Verify SEO meta tags
- [ ] Check print stylesheet
- [ ] Test with screen reader
- [ ] Validate HTML structure
- [ ] Check image alt texts
- [ ] Verify skip links work

### Tools to Use

```bash
# HTML Validation
npx html-validate dist/index.html

# Accessibility Check
npx pa11y http://localhost:5177

# Lighthouse (no-JS mode)
lighthouse http://localhost:5177 --disable-javascript

# Check with text browser
lynx -dump http://localhost:5177 | less
```

## 📊 Current Portfolio Status

### ✅ Works Without JS
- ✅ All content is in HTML
- ✅ Semantic structure
- ✅ SEO meta tags
- ✅ Anchor navigation
- ✅ Images with alt text

### ⚠️ Requires JS
- Theme toggle
- Language switcher
- 3D background
- Chatbot
- Certificate modal
- Lazy-loaded sections
- Analytics

### 💡 Recommendations

1. **Add noscript warning** in index.html
2. **Ensure core content** is in initial HTML
3. **Use semantic HTML** for structure
4. **Add print stylesheet** for offline viewing
5. **Consider SSR** for critical content

## 🔗 Resources

- [MDN: Progressive Enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)
- [WebAIM: JavaScript Accessibility](https://webaim.org/techniques/javascript/)
- [A11y Project: No JavaScript](https://www.a11yproject.com/posts/no-js/)
- [Google: Progressive Enhancement](https://web.dev/progressively-enhance-your-pwa/)

## 📝 Quick Test Script

```bash
#!/bin/bash
# Quick no-JS test script

echo "🧪 Testing No-JS Mode..."
echo ""

# Start dev server in background
npm run dev &
SERVER_PID=$!
sleep 3

# Test with curl
echo "📄 Fetching HTML..."
curl -s http://localhost:5177 > /tmp/no-js-test.html

# Check for content
echo ""
echo "✅ Checking for key content..."
grep -q "<h1" /tmp/no-js-test.html && echo "  ✓ H1 found" || echo "  ✗ H1 missing"
grep -q "<main" /tmp/no-js-test.html && echo "  ✓ Main element found" || echo "  ✗ Main missing"
grep -q "id=\"root\"" /tmp/no-js-test.html && echo "  ✓ Root div found" || echo "  ✗ Root missing"

# Check for noscript
echo ""
echo "⚠️  Checking for noscript tag..."
grep -q "<noscript" /tmp/no-js-test.html && echo "  ✓ Noscript found" || echo "  ✗ Noscript missing (consider adding)"

# Kill server
kill $SERVER_PID

echo ""
echo "📁 Full HTML saved to: /tmp/no-js-test.html"
echo "   View with: cat /tmp/no-js-test.html | less"
```

Save as `scripts/test-no-js.sh` and run:
```bash
chmod +x scripts/test-no-js.sh
./scripts/test-no-js.sh
```
