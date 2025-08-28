import { test, expect } from '../utils/fixtures'
import { SELECTORS, waitForAnimations } from '../utils/helpers'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate between pages using left nav', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    // Navigate to work page
    await navigation.clickNavItem('work')
    await expect(page).toHaveURL(/.*work.*/)
    
    // Navigate back to home
    await navigation.clickNavItem('loops')
    await expect(page).toHaveURL('/')
  })

  test('should highlight active navigation item', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    // Check home is active
    const homeNav = page.locator(SELECTORS.navItem, { hasText: 'loops' })
    await expect(homeNav).toHaveClass(/active|current/)
    
    // Navigate to work and check active state
    await navigation.clickNavItem('work')
    await waitForAnimations(page)
    
    const workNav = page.locator(SELECTORS.navItem, { hasText: 'work' })
    await expect(workNav).toHaveClass(/active|current/)
  })

  test('should apply keyboard effects on hover', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const navItem = page.locator(SELECTORS.navItem).first()
    
    // Get initial transform
    const initialTransform = await navItem.evaluate(el => 
      getComputedStyle(el).transform
    )
    
    // Hover and check transform changes
    await navItem.hover()
    await page.waitForTimeout(100) // Allow hover animation
    
    const hoverTransform = await navItem.evaluate(el => 
      getComputedStyle(el).transform
    )
    
    expect(hoverTransform).not.toBe(initialTransform)
  })

  test('should maintain keyboard effects on click', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const navItem = page.locator(SELECTORS.navItem, { hasText: 'work' })
    
    // Click and hold briefly
    await navItem.hover()
    await page.mouse.down()
    await page.waitForTimeout(100)
    
    const clickTransform = await navItem.evaluate(el => 
      getComputedStyle(el).transform
    )
    
    await page.mouse.up()
    
    // Should show depressed/clicked state
    expect(clickTransform).toContain('matrix')
  })

  test('should be keyboard accessible', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    // Tab through navigation items
    await page.keyboard.press('Tab')
    
    let focusedElement = await page.evaluate(() => document.activeElement?.textContent)
    expect(['loops', 'work', 'about', 'team', 'contact']).toContain(focusedElement)
    
    // Press Enter to navigate
    await page.keyboard.press('Enter')
    await page.waitForLoadState('networkidle')
    
    // Should have navigated
    expect(await page.url()).not.toBe('/')
  })

  test('should handle logo click navigation', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    // Navigate away from home first
    await navigation.clickNavItem('work')
    await expect(page).toHaveURL(/.*work.*/)
    
    // Click logo to return home
    await page.locator(SELECTORS.logoPod).click()
    await expect(page).toHaveURL('/')
  })

  test('should maintain consistent spacing', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const navItems = page.locator(SELECTORS.navItem)
    const count = await navItems.count()
    
    for (let i = 0; i < count - 1; i++) {
      const item1 = navItems.nth(i)
      const item2 = navItems.nth(i + 1)
      
      const box1 = await item1.boundingBox()
      const box2 = await item2.boundingBox()
      
      if (box1 && box2) {
        const spacing = box2.y - (box1.y + box1.height)
        expect(spacing).toBeGreaterThanOrEqual(10)
        expect(spacing).toBeLessThanOrEqual(30)
      }
    }
  })
})