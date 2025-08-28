import { test as base } from '@playwright/test'

// Define custom fixtures for the portfolio website
export const test = base.extend({
  // Navigation helper fixture
  navigation: async ({ page }, use) => {
    const navigation = {
      // Wait for left navigation to be visible and interactive
      async waitForNavigation() {
        await page.locator('.ravie-left-nav').waitFor({ state: 'visible' })
        await page.locator('.ravie-nav-item').first().waitFor({ state: 'visible' })
      },
      
      // Click navigation item with mechanical keyboard effect
      async clickNavItem(text: string) {
        const navItem = page.locator('.ravie-nav-item', { hasText: text })
        await navItem.hover()
        await navItem.click()
        // Wait for any navigation transitions
        await page.waitForLoadState('networkidle')
      },
      
      // Check if navigation is hidden on mobile
      async isHiddenOnMobile() {
        return await page.locator('.ravie-left-nav').isHidden()
      }
    }
    await use(navigation)
  },

  // Video preview helper fixture
  videoPreview: async ({ page }, use) => {
    const videoPreview = {
      // Wait for video to start playing
      async waitForVideoPlay(selector: string) {
        const video = page.locator(selector)
        await video.waitFor({ state: 'visible' })
        
        // Wait for video to actually start playing
        await page.waitForFunction(
          (videoSelector) => {
            const vid = document.querySelector(videoSelector) as HTMLVideoElement
            return vid && !vid.paused && vid.currentTime > 0
          },
          selector
        )
      },
      
      // Check video loading state
      async getVideoState(selector: string) {
        return await page.locator(selector).evaluate((video: HTMLVideoElement) => ({
          paused: video.paused,
          currentTime: video.currentTime,
          readyState: video.readyState,
          networkState: video.networkState
        }))
      }
    }
    await use(videoPreview)
  },

  // Scroll behavior helper fixture
  scrollBehavior: async ({ page }, use) => {
    const scrollBehavior = {
      // Smooth scroll to element
      async smoothScrollTo(selector: string) {
        await page.locator(selector).scrollIntoViewIfNeeded({ timeout: 10000 })
        // Wait for scroll animations to complete
        await page.waitForTimeout(500)
      },
      
      // Check if element is in viewport
      async isInViewport(selector: string) {
        return await page.locator(selector).isInViewport()
      },
      
      // Measure scroll performance
      async measureScrollPerformance() {
        return await page.evaluate(() => {
          return new Promise((resolve) => {
            const startTime = performance.now()
            let frameCount = 0
            
            function countFrames() {
              frameCount++
              if (performance.now() - startTime < 1000) {
                requestAnimationFrame(countFrames)
              } else {
                resolve(frameCount)
              }
            }
            
            requestAnimationFrame(countFrames)
          })
        })
      }
    }
    await use(scrollBehavior)
  }
})

export { expect } from '@playwright/test'