import { Page, Locator } from '@playwright/test'

/**
 * Common helper functions for Playwright tests
 */

// Wait for animations to complete
export async function waitForAnimations(page: Page, timeout = 2000) {
  await page.waitForTimeout(300) // Initial wait for animations to start
  await page.waitForFunction(
    () => {
      const elements = document.querySelectorAll('*')
      for (const element of elements) {
        const style = window.getComputedStyle(element)
        const animationName = style.animationName
        const transitionProperty = style.transitionProperty
        
        if (animationName !== 'none' || transitionProperty !== 'none') {
          // Check if element is currently animating
          const animations = element.getAnimations()
          if (animations.some(anim => anim.playState === 'running')) {
            return false
          }
        }
      }
      return true
    },
    undefined,
    { timeout }
  )
}

// Check if element has specific CSS class
export async function hasClass(locator: Locator, className: string): Promise<boolean> {
  const classes = await locator.getAttribute('class')
  return classes?.includes(className) || false
}

// Get computed style property
export async function getComputedStyle(locator: Locator, property: string): Promise<string> {
  return await locator.evaluate((element, prop) => {
    return window.getComputedStyle(element).getPropertyValue(prop)
  }, property)
}

// Wait for element to be stable (no movement for specified duration)
export async function waitForElementStable(locator: Locator, stableDuration = 500) {
  let lastPosition = await locator.boundingBox()
  const startTime = Date.now()
  
  while (Date.now() - startTime < 5000) { // Max 5 second wait
    await new Promise(resolve => setTimeout(resolve, 100))
    const currentPosition = await locator.boundingBox()
    
    if (
      lastPosition &&
      currentPosition &&
      lastPosition.x === currentPosition.x &&
      lastPosition.y === currentPosition.y &&
      lastPosition.width === currentPosition.width &&
      lastPosition.height === currentPosition.height
    ) {
      // Element has been stable, wait a bit more to be sure
      await new Promise(resolve => setTimeout(resolve, stableDuration))
      return
    }
    
    lastPosition = currentPosition
  }
}

// Measure Web Vitals
export async function measureWebVitals(page: Page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals: Record<string, number> = {}
      
      // LCP - Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        vitals.lcp = lastEntry.startTime
      }).observe({ entryTypes: ['largest-contentful-paint'] })
      
      // FID - First Input Delay
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          vitals.fid = entry.processingStart - entry.startTime
        }
      }).observe({ entryTypes: ['first-input'] })
      
      // CLS - Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let clsValue = 0
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        vitals.cls = clsValue
      }).observe({ entryTypes: ['layout-shift'] })
      
      // FCP - First Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          vitals.fcp = entry.startTime
        }
      }).observe({ entryTypes: ['paint'] })
      
      // Wait for initial measurements
      setTimeout(() => resolve(vitals), 3000)
    })
  })
}

// Check for console errors
export async function getConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = []
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })
  
  return errors
}

// Simulate slow network conditions
export async function simulateSlowNetwork(page: Page) {
  await page.route('**/*', (route) => {
    // Add delay to simulate slow network
    setTimeout(() => route.continue(), 100)
  })
}

// Take full page screenshot with timestamp
export async function takeFullPageScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  await page.screenshot({
    path: `tests/screenshots/${name}-${timestamp}.png`,
    fullPage: true
  })
}

// Constants for common selectors
export const SELECTORS = {
  leftNav: '.ravie-left-nav',
  navItem: '.ravie-nav-item',
  logoPod: '.ravie-logo-pod',
  projectCard: '.portfolio-card',
  videoPreview: 'video',
  mainContent: '#main-content'
} as const