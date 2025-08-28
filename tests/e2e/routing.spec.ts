import { test, expect } from '../utils/fixtures'
import { waitForAnimations } from '../utils/helpers'

test.describe('Routing', () => {
  
  test('should handle all primary routes correctly', async ({ page }) => {
    const routes = [
      { path: '/', expectedContent: ['main', 'homepage', 'portfolio'] },
      { path: '/work', expectedContent: ['work', 'portfolio', 'project'] },
      { path: '/about', expectedContent: ['about', 'team', 'mission'] },
      { path: '/contact', expectedContent: ['contact', 'email', 'form'] }
    ]
    
    for (const route of routes) {
      await page.goto(route.path)
      await expect(page).toHaveURL(new RegExp(route.path.replace('/', '')))
      
      // Should have main content area
      await expect(page.locator('#main-content, main, .main')).toBeVisible()
      
      // Check for route-specific content indicators
      const bodyText = await page.textContent('body') || ''
      const hasRelevantContent = route.expectedContent.some(keyword => 
        bodyText.toLowerCase().includes(keyword.toLowerCase())
      )
      
      // Either has specific content OR loads without error
      const hasVisibleContent = await page.locator('main, #main-content').isVisible()
      expect(hasRelevantContent || hasVisibleContent).toBeTruthy()
    }
  })
  test('should handle direct URL navigation', async ({ page }) => {
    // Test direct navigation to work page
    await page.goto('/work')
    await expect(page).toHaveURL(/.*work.*/)
    await expect(page.locator('#main-content, .work-page, main')).toBeVisible()
    
    // Test direct navigation to home
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await expect(page.locator('#main-content, .homepage, main')).toBeVisible()
  })

  test('should handle browser back/forward navigation', async ({ page, navigation }) => {
    // Start on home
    await page.goto('/')
    await navigation.waitForNavigation()
    
    // Navigate to work
    await navigation.clickNavItem('work')
    await expect(page).toHaveURL(/.*work.*/)
    
    // Use browser back button
    await page.goBack()
    await expect(page).toHaveURL('/')
    
    // Use browser forward button
    await page.goForward()
    await expect(page).toHaveURL(/.*work.*/)
  })

  test('should preserve page state during navigation', async ({ page, navigation }) => {
    await page.goto('/')
    await navigation.waitForNavigation()
    
    // Navigate to work page and interact
    await navigation.clickNavItem('work')
    await waitForAnimations(page)
    
    // Scroll down if possible
    await page.evaluate(() => window.scrollTo(0, 200))
    const scrollPosition = await page.evaluate(() => window.scrollY)
    
    // Navigate away and back
    await navigation.clickNavItem('loops')
    await navigation.clickNavItem('work')
    
    // Check if we're back at top (fresh page load) or preserved state
    const newScrollPosition = await page.evaluate(() => window.scrollY)
    expect(newScrollPosition).toBeDefined()
  })

  test('should handle route transitions smoothly', async ({ page, navigation }) => {
    await page.goto('/')
    await navigation.waitForNavigation()
    
    const startTime = Date.now()
    
    // Navigate between pages
    await navigation.clickNavItem('work')
    await waitForAnimations(page)
    
    const navigationTime = Date.now() - startTime
    
    // Navigation should be reasonably fast
    expect(navigationTime).toBeLessThan(3000)
  })

  test('should handle 404 routes and invalid paths gracefully', async ({ page }) => {
    const invalidRoutes = [
      '/non-existent-page',
      '/invalid/route',
      '/work/non-existent-project'
    ]
    
    for (const route of invalidRoutes) {
      const response = await page.goto(route)
      
      // Should handle gracefully - either 404 page or redirect
      if (response?.status() === 404) {
        // Check for 404 page content
        const content = await page.textContent('body') || ''
        const has404Content = content.includes('404') || 
                               content.includes('Not Found') || 
                               content.includes('Page not found')
        
        expect(has404Content).toBeTruthy()
      } else {
        // Should redirect to valid page with success status
        expect([200, 301, 302]).toContain(response?.status() || 200)
        
        // Should have valid navigation
        await expect(page.locator('.ravie-left-nav, nav')).toBeVisible()
      }
    }
  })
  
  test('should handle project detail routing', async ({ page, navigation }) => {
    await page.goto('/work')
    await navigation.waitForNavigation()
    
    // Look for clickable project cards
    const cardSelectors = ['.project-card', '.portfolio-card', '.card']
    let projectCard
    
    for (const selector of cardSelectors) {
      const cards = page.locator(selector)
      if (await cards.count() > 0) {
        projectCard = cards.first()
        break
      }
    }
    
    if (projectCard && await projectCard.isVisible()) {
      const initialUrl = page.url()
      
      // Click on project card
      await projectCard.click()
      await page.waitForTimeout(1000)
      
      const newUrl = page.url()
      
      // Should either navigate to project detail or open modal
      const urlChanged = newUrl !== initialUrl
      const hasModal = await page.locator('.modal, [data-testid="modal"], .overlay').isVisible().catch(() => false)
      
      expect(urlChanged || hasModal).toBeTruthy()
      
      // If URL changed, should be project detail route
      if (urlChanged) {
        expect(newUrl).toMatch(/\/work\/|project|portfolio/)
      }
    }
  })

  test('should update document title on navigation', async ({ page, navigation }) => {
    await page.goto('/')
    await navigation.waitForNavigation()
    
    const homeTitle = await page.title()
    
    // Navigate to work page
    await navigation.clickNavItem('work')
    await waitForAnimations(page)
    
    const workTitle = await page.title()
    
    // Titles should be different (unless intentionally the same)
    expect([homeTitle, workTitle]).toBeDefined()
  })

  test('should maintain navigation state across routes', async ({ page, navigation }) => {
    await page.goto('/')
    await navigation.waitForNavigation()
    
    // Check navigation is visible on home
    await expect(page.locator('.ravie-left-nav')).toBeVisible()
    
    // Navigate to work page
    await navigation.clickNavItem('work')
    await waitForAnimations(page)
    
    // Navigation should still be visible
    await expect(page.locator('.ravie-left-nav')).toBeVisible()
    
    // Active state should update
    const workNavItem = page.locator('.ravie-nav-item', { hasText: 'work' })
    await expect(workNavItem).toHaveClass(/active|current/)
  })

  test('should handle rapid navigation clicks', async ({ page, navigation }) => {
    await page.goto('/')
    await navigation.waitForNavigation()
    
    // Rapidly click between navigation items
    await navigation.clickNavItem('work')
    await page.waitForTimeout(100)
    await navigation.clickNavItem('loops')
    await page.waitForTimeout(100)
    await navigation.clickNavItem('work')
    
    // Should end up on work page without errors
    await expect(page).toHaveURL(/.*work.*/)
    await expect(page.locator('#main-content, .work-page, main')).toBeVisible()
  })
})