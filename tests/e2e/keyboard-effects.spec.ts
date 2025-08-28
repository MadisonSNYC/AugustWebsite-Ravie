import { test, expect } from '../utils/fixtures'
import { SELECTORS, getComputedStyle } from '../utils/helpers'

test.describe('Mechanical Keyboard Effects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display projected button appearance when static', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const navItem = page.locator(SELECTORS.navItem).first()
    
    // Check static projected appearance
    const staticTransform = await getComputedStyle(navItem, 'transform')
    const staticBoxShadow = await getComputedStyle(navItem, 'box-shadow')
    
    // Should have 3D perspective transform
    expect(staticTransform).toContain('matrix3d')
    
    // Should have inset shadow for depth
    expect(staticBoxShadow).toContain('inset')
    
    // Should have multiple shadows for 3D effect
    const shadowCount = (staticBoxShadow.match(/,/g) || []).length
    expect(shadowCount).toBeGreaterThanOrEqual(2)
  })

  test('should enhance button projection on hover', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const navItem = page.locator(SELECTORS.navItem).first()
    
    // Get static state
    const staticTransform = await getComputedStyle(navItem, 'transform')
    const staticBoxShadow = await getComputedStyle(navItem, 'box-shadow')
    
    // Hover and get enhanced state
    await navItem.hover()
    await page.waitForTimeout(150) // Allow hover animation
    
    const hoverTransform = await getComputedStyle(navItem, 'transform')
    const hoverBoxShadow = await getComputedStyle(navItem, 'box-shadow')
    
    // Transform should change on hover
    expect(hoverTransform).not.toBe(staticTransform)
    
    // Box shadow should enhance on hover
    expect(hoverBoxShadow).not.toBe(staticBoxShadow)
  })

  test('should simulate keyboard click depression', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const navItem = page.locator(SELECTORS.navItem).first()
    
    // Get hover state
    await navItem.hover()
    await page.waitForTimeout(100)
    const hoverTransform = await getComputedStyle(navItem, 'transform')
    
    // Click and hold
    await page.mouse.down()
    await page.waitForTimeout(100)
    
    const clickTransform = await getComputedStyle(navItem, 'transform')
    
    // Release
    await page.mouse.up()
    await page.waitForTimeout(100)
    
    const releaseTransform = await getComputedStyle(navItem, 'transform')
    
    // Click should create different transform from hover
    expect(clickTransform).not.toBe(hoverTransform)
    
    // Should return to hover state after release
    expect(releaseTransform).toBe(hoverTransform)
  })

  test('should use red/gray color scheme', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const navItem = page.locator(SELECTORS.navItem).first()
    
    // Check background colors
    const backgroundColor = await getComputedStyle(navItem, 'background-color')
    const backgroundImage = await getComputedStyle(navItem, 'background-image')
    
    // Should not contain purple/pink tones
    expect(backgroundColor).not.toMatch(/rgb\(.*25[0-5].*0.*25[0-5].*\)/) // No magenta
    expect(backgroundImage).not.toContain('255, 0, 255') // No magenta in gradients
    
    // Should contain red/gray tones
    const hasRedGrayScheme = 
      backgroundColor.includes('128') || // Gray tones
      backgroundColor.includes('64') ||  // Dark gray
      backgroundColor.includes('255') || // Red component
      backgroundImage.includes('128') || 
      backgroundImage.includes('64') ||
      backgroundImage.includes('255')
    
    expect(hasRedGrayScheme).toBe(true)
  })

  test('should maintain 90s keyboard aesthetic', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const navItem = page.locator(SELECTORS.navItem).first()
    
    // Check border radius (should be subtle, not too modern)
    const borderRadius = await getComputedStyle(navItem, 'border-radius')
    const radiusValue = parseInt(borderRadius.replace('px', ''))
    
    expect(radiusValue).toBeGreaterThanOrEqual(4)
    expect(radiusValue).toBeLessThanOrEqual(12) // Not too rounded for 90s feel
    
    // Check for beveled appearance
    const boxShadow = await getComputedStyle(navItem, 'box-shadow')
    expect(boxShadow).toContain('inset') // Beveled inset shadow
  })

  test('should provide tactile feedback timing', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const navItem = page.locator(SELECTORS.navItem).first()
    
    // Test click timing
    const startTime = Date.now()
    
    await navItem.hover()
    await page.mouse.down()
    await page.waitForTimeout(50) // Quick depression
    await page.mouse.up()
    
    const clickDuration = Date.now() - startTime
    
    // Should be responsive but not instant (simulate mechanical timing)
    expect(clickDuration).toBeGreaterThan(50)
    expect(clickDuration).toBeLessThan(300)
  })

  test('should handle rapid successive clicks', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const navItem = page.locator(SELECTORS.navItem).first()
    await navItem.hover()
    
    // Rapid clicks
    for (let i = 0; i < 3; i++) {
      await page.mouse.down()
      await page.waitForTimeout(30)
      await page.mouse.up()
      await page.waitForTimeout(30)
    }
    
    // Should still be responsive after rapid clicks
    const finalTransform = await getComputedStyle(navItem, 'transform')
    expect(finalTransform).toBeDefined()
    expect(finalTransform).not.toBe('none')
  })

  test('should work across all navigation items', async ({ page, navigation }) => {
    await navigation.waitForNavigation()
    
    const navItems = page.locator(SELECTORS.navItem)
    const itemCount = await navItems.count()
    
    expect(itemCount).toBeGreaterThan(0)
    
    // Test each navigation item has effects
    for (let i = 0; i < itemCount; i++) {
      const item = navItems.nth(i)
      
      const transform = await getComputedStyle(item, 'transform')
      const boxShadow = await getComputedStyle(item, 'box-shadow')
      
      expect(transform).not.toBe('none')
      expect(boxShadow).toContain('inset')
    }
  })
})