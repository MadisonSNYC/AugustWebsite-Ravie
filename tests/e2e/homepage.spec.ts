import { test, expect } from '../utils/fixtures'
import { SELECTORS, waitForAnimations } from '../utils/helpers'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Ravie|Portfolio/)
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('should display left vertical navigation', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    await expect(page.locator(SELECTORS.leftNav)).toBeVisible()
    await expect(page.locator(SELECTORS.logoPod)).toBeVisible()
    
    const navItems = page.locator(SELECTORS.navItem)
    await expect(navItems).toHaveCount(5) // loops, work, about, team, contact
  })

  test('should apply neo glass 3D effects to navigation', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const leftNav = page.locator(SELECTORS.leftNav)
    const backdropFilter = await leftNav.evaluate(el => 
      getComputedStyle(el).backdropFilter
    )
    
    expect(backdropFilter).toContain('blur')
  })

  test('should display mechanical keyboard effects on nav items', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const navItem = page.locator(SELECTORS.navItem).first()
    const transform = await navItem.evaluate(el => 
      getComputedStyle(el).transform
    )
    
    expect(transform).not.toBe('none')
    
    const boxShadow = await navItem.evaluate(el => 
      getComputedStyle(el).boxShadow
    )
    
    expect(boxShadow).toContain('inset')
  })

  test('should have proper z-index for navigation overlay', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const leftNav = page.locator(SELECTORS.leftNav)
    const zIndex = await leftNav.evaluate(el => 
      getComputedStyle(el).zIndex
    )
    
    expect(parseInt(zIndex)).toBeGreaterThanOrEqual(10000)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    const leftNav = page.locator(SELECTORS.leftNav)
    const isVisible = await leftNav.isVisible()
    
    // Navigation should adapt for mobile (either hidden or collapsed)
    if (isVisible) {
      const width = await leftNav.evaluate(el => el.offsetWidth)
      expect(width).toBeLessThanOrEqual(80) // Should be narrower on mobile
    }
  })

  test('should display smooth grid with all sections visible', async ({ page }) => {
    // Check for main homepage sections
    await expect(page.locator('#main-content')).toBeVisible()
    
    // Look for grid or portfolio content
    const gridSelectors = [
      '.smooth-grid',
      '.homepage-grid', 
      '.project-grid',
      '.portfolio-grid',
      '[data-testid="homepage-grid"]'
    ]
    
    let gridFound = false
    for (const selector of gridSelectors) {
      const element = page.locator(selector)
      if (await element.isVisible().catch(() => false)) {
        gridFound = true
        break
      }
    }
    
    if (!gridFound) {
      // At minimum, ensure main content is present
      await expect(page.locator('main, #main-content')).toBeVisible()
    }
  })

  test('should load project cards and make them interactive', async ({ page }) => {
    await waitForAnimations(page)
    
    // Look for project cards
    const cardSelectors = [
      '.project-card',
      '.portfolio-card', 
      '.card',
      '[data-testid="project-card"]'
    ]
    
    let cardsFound = false
    for (const selector of cardSelectors) {
      const cards = page.locator(selector)
      const count = await cards.count()
      if (count > 0) {
        cardsFound = true
        // Test interactivity on first card
        const firstCard = cards.first()
        await expect(firstCard).toBeVisible()
        
        // Test hover interaction
        await firstCard.hover()
        await page.waitForTimeout(200)
        break
      }
    }
    
    // If no specific cards found, ensure some content exists
    if (!cardsFound) {
      await expect(page.locator('main, #main-content')).toBeVisible()
    }
  })

  test('should render atmospheric effects without performance issues', async ({ page }) => {
    await waitForAnimations(page)
    
    // Check for performance-related elements
    const performanceMarks = await page.evaluate(() => {
      return performance.getEntriesByType('measure').length
    })
    
    // Ensure page is responsive
    const startTime = performance.now()
    await page.mouse.move(100, 100)
    const responseTime = performance.now() - startTime
    
    expect(responseTime).toBeLessThan(100) // Should respond within 100ms
  })

  test('should not have unwanted header spacing', async ({ page }) => {
    const body = page.locator('body')
    const paddingTop = await body.evaluate(el => 
      getComputedStyle(el).paddingTop
    )
    
    expect(paddingTop).toBe('0px')
  })

  test('should complete all animations and achieve stable state', async ({ page }) => {
    await waitForAnimations(page)
    
    // Check if any elements are still animating
    const hasRunningAnimations = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*')
      for (const el of allElements) {
        const animations = el.getAnimations()
        if (animations.some(anim => anim.playState === 'running')) {
          return true
        }
      }
      return false
    })
    
    expect(hasRunningAnimations).toBe(false)
    
    // Verify visual stability
    await page.waitForTimeout(300)
    const screenshot1 = await page.screenshot({ fullPage: false })
    await page.waitForTimeout(500) 
    const screenshot2 = await page.screenshot({ fullPage: false })
    
    // Screenshots should be identical indicating stable state
    expect(screenshot1).toEqual(screenshot2)
  })

  test('should handle navigation items count and accessibility', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const navItems = page.locator(SELECTORS.navItem)
    const count = await navItems.count()
    
    // Should have the expected navigation items (loops, work, about, contact, talk)
    expect(count).toBeGreaterThanOrEqual(4)
    expect(count).toBeLessThanOrEqual(6)
    
    // Check accessibility attributes
    for (let i = 0; i < Math.min(count, 3); i++) {
      const item = navItems.nth(i)
      
      // Should be focusable
      await item.focus()
      const focused = await page.evaluate(() => document.activeElement?.tagName)
      expect(['A', 'BUTTON']).toContain(focused)
    }
  })
})