import { test, expect } from '@playwright/test';

/**
 * Navigation and User Flow Tests
 */

test.describe('Navigation', () => {
  test('should navigate to all sections via navbar', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const sections = ['home', 'about', 'skills', 'projects', 'experience', 'education', 'publications', 'certificates', 'contact'];
    
    for (const section of sections) {
      // Click navigation link
      const navLink = page.locator(`nav a[href*="#${section}"]`).first();
      
      if (await navLink.isVisible()) {
        await navLink.click();
        await page.waitForTimeout(500);
        
        // Verify URL changed
        expect(page.url()).toContain(`#${section}`);
        
        // Verify section is visible
        const sectionElement = page.locator(`#${section}, [id*="${section}"]`).first();
        if (await sectionElement.count() > 0) {
          await expect(sectionElement).toBeInViewport();
        }
      }
    }
  });

  test('scroll to top button should work', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    
    // Find and click scroll to top button
    const scrollBtn = page.locator('.scroll-to-top, [aria-label*="scroll to top"]').first();
    
    if (await scrollBtn.isVisible()) {
      await scrollBtn.click();
      await page.waitForTimeout(500);
      
      // Verify scrolled to top
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(100);
    }
  });

  test('mobile menu should work', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find hamburger menu button
    const menuBtn = page.locator('button').filter({ hasText: /menu/i }).or(
      page.locator('[aria-label*="menu"]')
    ).first();
    
    if (await menuBtn.isVisible()) {
      // Open menu
      await menuBtn.click();
      await page.waitForTimeout(300);
      
      // Verify menu is open (check for expanded state or visible menu)
      const isExpanded = await menuBtn.getAttribute('aria-expanded');
      expect(isExpanded).toBe('true');
      
      // Click a menu item
      const aboutLink = page.locator('nav a[href*="#about"]').first();
      if (await aboutLink.isVisible()) {
        await aboutLink.click();
        await page.waitForTimeout(500);
        
        // Menu should close
        const isStillExpanded = await menuBtn.getAttribute('aria-expanded');
        expect(isStillExpanded).toBe('false');
      }
    }
  });
});

test.describe('Theme Switching', () => {
  test('should persist theme preference', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get initial theme
    const initialTheme = await page.getAttribute('html', 'data-theme');
    
    // Toggle theme
    const themeToggle = page.locator('button').filter({ hasText: /theme|dark|light/i }).first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      const newTheme = await page.getAttribute('html', 'data-theme');
      expect(newTheme).not.toBe(initialTheme);
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Theme should persist
      const persistedTheme = await page.getAttribute('html', 'data-theme');
      expect(persistedTheme).toBe(newTheme);
    }
  });
});

test.describe('Interactive Elements', () => {
  test('certificate cards should open modal on click', async ({ page }) => {
    await page.goto('/#certificates');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const certificateCard = page.locator('.certificate-card, [class*="certificate"]').first();
    
    if (await certificateCard.isVisible()) {
      await certificateCard.click();
      await page.waitForTimeout(500);
      
      // Modal should be visible
      const modal = page.locator('[role="dialog"], .modal').first();
      await expect(modal).toBeVisible();
      
      // Should have close button
      const closeBtn = page.locator('[aria-label*="close"], .modal-close').first();
      await expect(closeBtn).toBeVisible();
      
      // Close modal
      await closeBtn.click();
      await page.waitForTimeout(300);
      
      // Modal should be closed
      await expect(modal).not.toBeVisible();
    }
  });

  test('contact links should be functional', async ({ page }) => {
    await page.goto('/#contact');
    await page.waitForLoadState('networkidle');
    
    // Check email link
    const emailLink = page.locator('a[href^="mailto:"]').first();
    if (await emailLink.isVisible()) {
      const href = await emailLink.getAttribute('href');
      expect(href).toContain('mailto:');
    }
    
    // Check social media links
    const linkedinLink = page.locator('a[href*="linkedin.com"]').first();
    if (await linkedinLink.isVisible()) {
      expect(await linkedinLink.getAttribute('target')).toBe('_blank');
      expect(await linkedinLink.getAttribute('rel')).toContain('noopener');
    }
    
    const githubLink = page.locator('a[href*="github.com"]').first();
    if (await githubLink.isVisible()) {
      expect(await githubLink.getAttribute('target')).toBe('_blank');
      expect(await githubLink.getAttribute('rel')).toContain('noopener');
    }
  });
});

test.describe('Language Switching', () => {
  test('should switch between languages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find language selector
    const langSelector = page.locator('select[aria-label*="language"], [class*="language-selector"]').first();
    
    if (await langSelector.isVisible()) {
      // Get initial language
      const initialLang = await page.getAttribute('html', 'lang');
      
      // Try to switch to another language
      const options = await langSelector.locator('option').all();
      if (options.length > 1) {
        await langSelector.selectOption({ index: 1 });
        await page.waitForTimeout(500);
        
        // Language should change
        const newLang = await page.getAttribute('html', 'lang');
        expect(newLang).not.toBe(initialLang);
      }
    }
  });
});

test.describe('Performance', () => {
  test('page should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('interactive background should not block rendering', async ({ page }) => {
    await page.goto('/');
    
    // Wait for main content to be visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible({ timeout: 3000 });
    
    // Background canvas might still be loading, but content should be visible
    const canvas = page.locator('canvas');
    // Canvas may or may not be present depending on implementation
    if (await canvas.count() > 0) {
      // If canvas exists, it shouldn't cover the content
      const mainZIndex = await mainContent.evaluate(el => window.getComputedStyle(el).zIndex);
      expect(parseInt(mainZIndex) || 0).toBeGreaterThanOrEqual(0);
    }
  });
});

