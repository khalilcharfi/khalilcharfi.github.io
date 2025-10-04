# Accessibility Testing Guide

## Quick Start

### Prerequisites
1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5173`

3. **Run accessibility tests** (in a new terminal):
   ```bash
   npm run test:a11y
   ```

## Available Test Commands

### Full Test Suite
```bash
npm run test:a11y
```
Runs both Lighthouse and axe-core tests, generates detailed reports.

### Lighthouse Only
```bash
npm run test:a11y:lighthouse
```
Opens interactive Lighthouse report in browser.

### Quick Lighthouse Check
```bash
npm run test:a11y:quick
```
Quick accessibility score without opening browser.

## Manual Testing

### 1. Start the Dev Server
```bash
npm run dev
```

### 2. Run Tests in Another Terminal
```bash
# Full test suite
npm run test:a11y

# Or individual tests
npm run test:a11y:lighthouse
```

## Test Reports

After running tests, reports are generated in `test-results/`:

- **`lighthouse-report.report.html`** - Interactive Lighthouse report
- **`lighthouse-report.report.json`** - Raw Lighthouse data
- **`axe-report.html`** - Interactive axe-core report
- **`axe-results.json`** - Raw axe-core data

## Understanding Results

### Lighthouse Accessibility Score

- **90-100**: Excellent ✅
- **75-89**: Good, but room for improvement ⚠️
- **0-74**: Needs attention ❌

### axe-core Violations

- **0 violations**: Perfect ✅
- **1-5 violations**: Minor issues ⚠️
- **6+ violations**: Significant issues ❌

## Common Issues and Fixes

### Issue: "Development server is not running"
**Fix**: Start the dev server first:
```bash
npm run dev
```

### Issue: Lighthouse fails to run
**Fix**: Check that port 5173 is accessible:
```bash
curl http://localhost:5173
```

### Issue: Tests timeout
**Fix**: Increase timeout in test script or ensure app loads quickly.

## Manual Accessibility Testing

### Keyboard Navigation Test
1. Open `http://localhost:5173`
2. Press `Tab` key repeatedly
3. Verify:
   - ✅ Skip links appear on first Tab
   - ✅ All interactive elements are reachable
   - ✅ Focus indicator is visible
   - ✅ Tab order is logical
   - ✅ No keyboard traps

### Screen Reader Test (VoiceOver on Mac)
1. Enable VoiceOver: `Cmd + F5`
2. Navigate with `VO + Arrow keys`
3. Verify:
   - ✅ All content is announced
   - ✅ Images have alt text
   - ✅ Buttons have labels
   - ✅ Forms are labeled correctly
   - ✅ Landmarks are identified

### Screen Reader Test (NVDA on Windows)
1. Install [NVDA](https://www.nvaccess.org/download/)
2. Start NVDA
3. Navigate with arrow keys
4. Verify same items as above

### Color Contrast Test
1. Use browser dev tools
2. Inspect elements
3. Check contrast ratios in Accessibility panel
4. Verify:
   - ✅ Text: 4.5:1 minimum
   - ✅ Large text: 3:1 minimum
   - ✅ UI elements: 3:1 minimum

### Reduced Motion Test
1. Enable reduced motion:
   - **Mac**: System Preferences > Accessibility > Display > Reduce motion
   - **Windows**: Settings > Ease of Access > Display > Show animations
2. Reload page
3. Verify animations are disabled or minimal

### High Contrast Test (Windows)
1. Enable High Contrast:
   - Settings > Ease of Access > High contrast
2. Select a high contrast theme
3. Verify:
   - ✅ Text is readable
   - ✅ Interactive elements have borders
   - ✅ Focus is visible

## Browser DevTools Testing

### Chrome/Edge DevTools
1. Open DevTools (`F12`)
2. Go to **Lighthouse** tab
3. Select **Accessibility** category
4. Click **Generate report**

### Firefox Accessibility Inspector
1. Open DevTools (`F12`)
2. Go to **Accessibility** tab
3. Review issues and structure

### Chrome Accessibility Insights
1. Install [Accessibility Insights extension](https://accessibilityinsights.io/)
2. Click extension icon
3. Run **FastPass** or **Assessment**

## Automated Testing with CI/CD

### GitHub Actions Example

Create `.github/workflows/a11y-tests.yml`:

```yaml
name: Accessibility Tests

on:
  pull_request:
  push:
    branches: [main, next]

jobs:
  a11y-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Start preview server
        run: npm run preview &
        
      - name: Wait for server
        run: npx wait-on http://localhost:5173 --timeout 60000
      
      - name: Run accessibility tests
        run: npm run test:a11y
      
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: accessibility-reports
          path: test-results/
```

## WCAG 2.1 Compliance Checklist

### Level A (Must Have)
- [ ] 1.1.1 Non-text Content - All images have alt text
- [ ] 1.3.1 Info and Relationships - Semantic HTML used
- [ ] 1.3.2 Meaningful Sequence - Logical reading order
- [ ] 2.1.1 Keyboard - All functionality available via keyboard
- [ ] 2.1.2 No Keyboard Trap - Focus can escape all components
- [ ] 2.4.1 Bypass Blocks - Skip links present
- [ ] 2.4.2 Page Titled - Descriptive page titles
- [ ] 3.1.1 Language of Page - HTML lang attribute set
- [ ] 4.1.1 Parsing - Valid HTML
- [ ] 4.1.2 Name, Role, Value - ARIA attributes correct

### Level AA (Should Have)
- [ ] 1.4.3 Contrast (Minimum) - 4.5:1 for text
- [ ] 1.4.5 Images of Text - Using real text, not images
- [ ] 2.4.6 Headings and Labels - Descriptive headings
- [ ] 2.4.7 Focus Visible - Keyboard focus indicator
- [ ] 3.2.3 Consistent Navigation - Navigation is consistent
- [ ] 3.2.4 Consistent Identification - Consistent component identification
- [ ] 3.3.1 Error Identification - Errors clearly identified
- [ ] 3.3.2 Labels or Instructions - Form fields labeled
- [ ] 3.3.3 Error Suggestion - Helpful error messages
- [ ] 4.1.3 Status Messages - ARIA live regions for updates

## Testing Tools

### Browser Extensions
- **axe DevTools** - Chrome/Firefox - Free
- **WAVE** - Chrome/Firefox/Edge - Free
- **Accessibility Insights** - Chrome/Edge - Free
- **Lighthouse** - Chrome/Edge - Built-in

### Command Line Tools
- **Lighthouse** - `npm install -g lighthouse`
- **axe-core** - Included in test suite
- **Pa11y** - `npm install -g pa11y`

### Screen Readers
- **NVDA** - Windows - Free
- **JAWS** - Windows - Commercial
- **VoiceOver** - Mac/iOS - Built-in
- **TalkBack** - Android - Built-in
- **ChromeVox** - Chrome extension - Free

## Continuous Testing

### Pre-commit Hook
Add to `.husky/pre-commit`:
```bash
#!/bin/sh
npm run test:a11y:quick
```

### Pre-push Hook
Add to `.husky/pre-push`:
```bash
#!/bin/sh
npm run test:a11y
```

## Resources

### Official Guidelines
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)

### Testing Guides
- [Accessibility Testing Guide](https://www.a11yproject.com/checklist/)
- [Manual Testing Guide](https://www.w3.org/WAI/test-evaluate/preliminary/)
- [Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

### Tools Documentation
- [Lighthouse Docs](https://developers.google.com/web/tools/lighthouse)
- [axe-core Docs](https://www.deque.com/axe/)
- [WAVE Docs](https://wave.webaim.org/)

## Getting Help

### Issues Found?
1. Review test reports for specific issues
2. Check [Comprehensive i18n/a11y Guide](./I18N_A11Y_COMPREHENSIVE_GUIDE.md)
3. Consult WCAG guidelines for best practices
4. Test with real assistive technologies

### Common Questions

**Q: Tests pass but screen reader doesn't work well?**  
A: Automated tests catch ~30-40% of issues. Always test with real screen readers.

**Q: How often should I run tests?**  
A: Run automated tests on every commit. Manual testing on major changes.

**Q: What's the minimum score needed?**  
A: Aim for 90+ on Lighthouse and 0 violations on axe-core.

**Q: Tests are slow, how to speed up?**  
A: Use `test:a11y:quick` for rapid checks during development.

## Next Steps

1. ✅ Run `npm run test:a11y`
2. ✅ Review generated reports
3. ✅ Fix any violations found
4. ✅ Test manually with keyboard
5. ✅ Test with screen reader
6. ✅ Set up CI/CD testing
7. ✅ Document any known issues

---

**Remember**: Automated tests catch many issues, but manual testing with real assistive technologies is essential for true accessibility!

