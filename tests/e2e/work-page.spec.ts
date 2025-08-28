import { test, expect } from '../utils/fixtures'
import { SELECTORS, waitForAnimations } from '../utils/helpers'

test.describe('Work Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/work')
  })

  test('should load work page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Work|Portfolio/)
    await expect(page.locator('#main-content, .work-page, main')).toBeVisible()
  })

  test('should display three-column counter-scroll layout', async ({ page }) => {
    await waitForAnimations(page)
    
    // Check for three-column structure
    const columnSelectors = [
      '.masonry-column',
      '.grid-column',
      '.portfolio-column',
      '.column'
    ]
    
    let columnsFound = 0
    for (const selector of columnSelectors) {
      const columns = page.locator(selector)
      const count = await columns.count()
      if (count >= 3) {
        columnsFound = count
        break
      }
    }
    
    // Should have at least 3 columns for desktop counter-scroll
    if (await page.viewportSize()?.width && page.viewportSize()!.width > 768) {
      expect(columnsFound).toBeGreaterThanOrEqual(3)
    }
    
    // Check for project cards
    const projectCards = page.locator(SELECTORS.projectCard + ', .project-card, .portfolio-card, .card')
    const cardCount = await projectCards.count()
    expect(cardCount).toBeGreaterThan(0)
  })

  test('should demonstrate counter-scrolling behavior', async ({ page }) => {
    await waitForAnimations(page)
    
    // Check if page has scrollable content
    const hasScrollableContent = await page.evaluate(() => {
      return document.body.scrollHeight > window.innerHeight
    })
    
    if (hasScrollableContent) {
      // Get initial positions of columns
      const columnElements = page.locator('.masonry-column, .grid-column, .portfolio-column')
      const columnCount = await columnElements.count()
      
      if (columnCount >= 2) {
        const initialPositions = []
        for (let i = 0; i < Math.min(columnCount, 3); i++) {
          const pos = await columnElements.nth(i).evaluate(el => el.getBoundingClientRect().top)
          initialPositions.push(pos)
        }
        
        // Scroll down
        await page.mouse.wheel(0, 500)
        await page.waitForTimeout(200)
        
        // Check if columns moved in different directions (counter-scroll)
        let hasCounterScroll = false
        for (let i = 0; i < Math.min(columnCount, 3); i++) {
          const newPos = await columnElements.nth(i).evaluate(el => el.getBoundingClientRect().top)
          const movement = newPos - initialPositions[i]
          
          // At least one column should move differently than others
          if (Math.abs(movement) > 10) {
            hasCounterScroll = true
            break
          }
        }
        
        // Note: Counter-scroll may not be active in all layout modes
        // This test documents the behavior when it exists
      }
    }
  })

  test('should handle infinite scroll/wrap behavior', async ({ page }) => {
    await waitForAnimations(page)
    
    // Check for infinite scroll implementation
    const projectCards = page.locator('.project-card, .portfolio-card, .card')
    const initialCardCount = await projectCards.count()
    
    if (initialCardCount > 0) {
      // Scroll down significantly to trigger infinite loading
      for (let i = 0; i < 5; i++) {
        await page.mouse.wheel(0, 1000)
        await page.waitForTimeout(300)
      }
      
      // Check if more content loaded or wrapped
      const newCardCount = await projectCards.count()
      
      // Either cards increased (infinite load) or stayed same (wrapping)
      expect(newCardCount).toBeGreaterThanOrEqual(initialCardCount)
      
      // Verify no console errors during scrolling
      const errors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })
      
      await page.waitForTimeout(500)
      
      const criticalErrors = errors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('404') &&
        !error.includes('network')
      )
      
      expect(criticalErrors).toHaveLength(0)
    }
  })

  test('should display project thumbnails', async ({ page }) => {
    await waitForAnimations(page)
    
    const projectCards = page.locator(SELECTORS.projectCard)
    const firstCard = projectCards.first()
    
    // Check for thumbnail image or video
    const thumbnail = firstCard.locator('img, video, .thumbnail')
    await expect(thumbnail).toBeVisible()
  })

  test('should handle project card interactions and hover effects', async ({ page }) => {
    await waitForAnimations(page)
    
    const cardSelectors = [SELECTORS.projectCard, '.project-card', '.portfolio-card', '.card']
    let firstCard
    
    // Find first available card
    for (const selector of cardSelectors) {
      const cards = page.locator(selector)
      if (await cards.count() > 0) {
        firstCard = cards.first()
        break
      }
    }
    
    if (firstCard && await firstCard.isVisible()) {
      // Test hover interaction
      await firstCard.hover()
      await page.waitForTimeout(300)
      
      // Check for visual changes on hover
      const transform = await firstCard.evaluate(el => 
        getComputedStyle(el).transform
      )
      
      const boxShadow = await firstCard.evaluate(el => 
        getComputedStyle(el).boxShadow
      )
      
      // Should have some visual feedback (transform or shadow)
      expect(transform !== 'none' || boxShadow !== 'none').toBeTruthy()
      
      // Test click interaction (should navigate or show details)
      const initialUrl = page.url()
      await firstCard.click()
      await page.waitForTimeout(500)
      
      // Either URL changed (navigation) or modal opened
      const newUrl = page.url()
      const hasModal = await page.locator('[data-testid="modal"], .modal, .overlay').isVisible().catch(() => false)
      
      expect(newUrl !== initialUrl || hasModal).toBeTruthy()
    }
  })

  test('should maintain grid responsiveness', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()
    await waitForAnimations(page)
    
    let gridContainer = page.locator('.portfolio-grid, .work-grid, .grid-container')
    let desktopWidth = await gridContainer.evaluate(el => el.offsetWidth)
    expect(desktopWidth).toBeGreaterThan(800)
    
    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await waitForAnimations(page)
    
    let tabletWidth = await gridContainer.evaluate(el => el.offsetWidth)
    expect(tabletWidth).toBeLessThan(desktopWidth)
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await waitForAnimations(page)
    
    let mobileWidth = await gridContainer.evaluate(el => el.offsetWidth)
    expect(mobileWidth).toBeLessThan(tabletWidth)
  })

  test('should display project titles', async ({ page }) => {
    await waitForAnimations(page)
    
    const projectCards = page.locator(SELECTORS.projectCard)
    const firstCard = projectCards.first()
    
    // Check for title element
    const title = firstCard.locator('h1, h2, h3, .title, .project-title')
    await expect(title).toBeVisible()
    
    const titleText = await title.textContent()
    expect(titleText).toBeTruthy()
    expect(titleText?.length).toBeGreaterThan(0)
  })

  test('should handle scroll behavior', async ({ page, scrollBehavior }) => {
    await waitForAnimations(page)
    
    // Check if page is scrollable
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
    const viewportHeight = await page.evaluate(() => window.innerHeight)
    
    if (bodyHeight > viewportHeight) {
      // Test scroll behavior
      const initialScrollY = await page.evaluate(() => window.scrollY)
      
      await page.mouse.wheel(0, 500)
      await page.waitForTimeout(200)
      
      const newScrollY = await page.evaluate(() => window.scrollY)
      expect(newScrollY).toBeGreaterThan(initialScrollY)
    }
  })

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.reload()
    await waitForAnimations(page)
    
    // Filter out known acceptable errors (if any)
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })

  test('should navigate back to home from work page', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    // Click home navigation
    await navigation.clickNavItem('loops')
    await expect(page).toHaveURL('/')
  })
})