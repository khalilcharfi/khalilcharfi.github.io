import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests
 * 
 * Takes screenshots and compares them to baselines
 * Run with: npx playwright test --update-snapshots (to update baselines)
 */

test.describe('Visual Regression Tests', () => {
  test('homepage should match screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for animations
    
    // Hide dynamic elements that change (e.g., current time, live data)
    await page.evaluate(() => {
      // Hide any elements with current time/date
      document.querySelectorAll('[class*="time"], [class*="date"]').forEach(el => {
        (el as HTMLElement).style.visibility = 'hidden';
      });
    });
    
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixels: 100 // Allow small differences
    });
  });

  test('about section should match screenshot', async ({ page }) => {
    await page.goto('/#about');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const aboutSection = page.locator('#about, [id*="about"]').first();
    await expect(aboutSection).toHaveScreenshot('about-section.png', {
      maxDiffPixels: 50
    });
  });

  test('skills section should match screenshot', async ({ page }) => {
    await page.goto('/#skills');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const skillsSection = page.locator('#skills, [id*="skills"]').first();
    await expect(skillsSection).toHaveScreenshot('skills-section.png', {
      maxDiffPixels: 50
    });
  });

  test('light theme should match screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Switch to light theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage-light-theme.png', {
      fullPage: false, // Just viewport
      maxDiffPixels: 100
    });
  });

  test('dark theme should match screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Switch to dark theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage-dark-theme.png', {
      fullPage: false,
      maxDiffPixels: 100
    });
  });

  test('mobile viewport should match screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('tablet viewport should match screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });
});

test.describe('Component Screenshots', () => {
  test('navigation bar should match screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const navbar = page.locator('nav').first();
    await expect(navbar).toHaveScreenshot('navbar.png');
  });

  test('certificate modal should match screenshot', async ({ page }) => {
    await page.goto('/#certificates');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const certificateCard = page.locator('.certificate-card').first();
    if (await certificateCard.isVisible()) {
      await certificateCard.click();
      await page.waitForTimeout(500);
      
      const modal = page.locator('[role="dialog"], .modal').first();
      if (await modal.isVisible()) {
        await expect(modal).toHaveScreenshot('certificate-modal.png');
      }
    }
  });

  test('contact section should match screenshot', async ({ page }) => {
    await page.goto('/#contact');
    await page.waitForLoadState('networkidle');
    
    const contactSection = page.locator('#contact, [id*="contact"]').first();
    await expect(contactSection).toHaveScreenshot('contact-section.png');
  });
});

