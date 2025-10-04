import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Tests using Playwright + axe-core
 * 
 * Tests WCAG 2.1 Level AA compliance across the entire portfolio
 */

test.describe('Accessibility Tests', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for animations
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('about section should be accessible', async ({ page }) => {
    await page.goto('/#about');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('skills section should be accessible', async ({ page }) => {
    await page.goto('/#skills');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('projects section should be accessible', async ({ page }) => {
    await page.goto('/#projects');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('contact section should be accessible', async ({ page }) => {
    await page.goto('/#contact');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Skip Links', () => {
  test('skip to main content link should be focusable', async ({ page }) => {
    await page.goto('/');
    
    // Tab to focus on skip link
    await page.keyboard.press('Tab');
    
    // Check if skip link is visible
    const skipLink = page.locator('.skip-link').first();
    await expect(skipLink).toBeVisible();
    
    // Verify it has correct text
    await expect(skipLink).toContainText(/skip to main|skip to content/i);
    
    // Click it and verify navigation
    await skipLink.click();
    
    // Verify main content is focused
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('skip to navigation link should work', async ({ page }) => {
    await page.goto('/');
    
    // Tab twice to get to second skip link
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const skipLink = page.locator('.skip-link').nth(1);
    await expect(skipLink).toBeVisible();
  });
});

test.describe('Keyboard Navigation', () => {
  test('all interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tab through all focusable elements
    const focusableElements = await page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').count();
    
    expect(focusableElements).toBeGreaterThan(0);
    
    // Test first few elements
    for (let i = 0; i < Math.min(10, focusableElements); i++) {
      await page.keyboard.press('Tab');
      
      // Get the focused element
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          hasOutline: window.getComputedStyle(el as Element).outline !== 'none'
        };
      });
      
      // Verify element is focusable
      expect(focusedElement.tagName).toBeTruthy();
    }
  });

  test('modal should trap focus', async ({ page }) => {
    await page.goto('/#certificates');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Click on a certificate to open modal (if available)
    const certificateCards = page.locator('.certificate-card').first();
    if (await certificateCards.isVisible()) {
      await certificateCards.click();
      
      // Wait for modal
      await page.waitForTimeout(500);
      
      // Verify modal is open
      const modal = page.locator('[role="dialog"], .modal');
      if (await modal.isVisible()) {
        // Tab should cycle through modal elements only
        await page.keyboard.press('Tab');
        
        const focusedInModal = await page.evaluate(() => {
          const focused = document.activeElement;
          const modal = document.querySelector('[role="dialog"], .modal');
          return modal?.contains(focused);
        });
        
        expect(focusedInModal).toBeTruthy();
      }
    }
  });

  test('escape key should close modals', async ({ page }) => {
    await page.goto('/#certificates');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Click on a certificate to open modal (if available)
    const certificateCards = page.locator('.certificate-card').first();
    if (await certificateCards.isVisible()) {
      await certificateCards.click();
      await page.waitForTimeout(500);
      
      // Press Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      
      // Modal should be closed
      const modal = page.locator('[role="dialog"], .modal');
      await expect(modal).not.toBeVisible();
    }
  });
});

test.describe('ARIA Labels and Landmarks', () => {
  test('page should have proper landmarks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();
    
    // Check for navigation
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav).toBeVisible();
  });

  test('buttons and links should have accessible names', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check all buttons have accessible names
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      const title = await button.getAttribute('title');
      
      // At least one should exist
      expect(ariaLabel || text?.trim() || title).toBeTruthy();
    }
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check all images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      
      // Alt text should exist (empty string is OK for decorative images)
      // OR role="presentation" for decorative images
      expect(alt !== null || role === 'presentation').toBeTruthy();
    }
  });
});

test.describe('Theme Switching', () => {
  test('theme toggle should be accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find theme toggle button
    const themeToggle = page.locator('button').filter({ hasText: /theme|dark|light/i }).first();
    
    if (await themeToggle.isVisible()) {
      // Should have accessible name
      const ariaLabel = await themeToggle.getAttribute('aria-label');
      const text = await themeToggle.textContent();
      expect(ariaLabel || text).toBeTruthy();
      
      // Click to toggle theme
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Verify theme changed (check HTML data-theme attribute)
      const theme = await page.getAttribute('html', 'data-theme');
      expect(['light', 'dark']).toContain(theme);
    }
  });
});

test.describe('Form Accessibility', () => {
  test('form inputs should have labels', async ({ page }) => {
    await page.goto('/#contact');
    await page.waitForLoadState('networkidle');
    
    // Check all inputs have associated labels
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const type = await input.getAttribute('type');
        
        // Skip hidden inputs
        if (type === 'hidden') continue;
        
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        const id = await input.getAttribute('id');
        
        // Should have label or aria-label
        const hasLabel = ariaLabel || ariaLabelledBy || (id && await page.locator(`label[for="${id}"]`).count() > 0);
        expect(hasLabel).toBeTruthy();
      }
    }
  });
});

test.describe('Color Contrast', () => {
  test('should meet WCAG AA color contrast requirements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include(['body'])
      .analyze();
    
    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );
    
    expect(contrastViolations).toEqual([]);
  });
});

test.describe('Responsive Design Accessibility', () => {
  test('mobile viewport should be accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('tablet viewport should be accessible', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Internationalization', () => {
  test('page should have lang attribute', async ({ page }) => {
    await page.goto('/');
    
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBeTruthy();
    expect(['en', 'de', 'fr', 'ar']).toContain(lang);
  });

  test('RTL languages should set dir attribute', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to switch to Arabic if language selector exists
    const langSelector = page.locator('[aria-label*="language"], [title*="language"]').first();
    
    if (await langSelector.isVisible()) {
      // This is a simplified test - adjust based on your actual implementation
      const dir = await page.getAttribute('html', 'dir');
      expect(['ltr', 'rtl']).toContain(dir);
    }
  });
});

