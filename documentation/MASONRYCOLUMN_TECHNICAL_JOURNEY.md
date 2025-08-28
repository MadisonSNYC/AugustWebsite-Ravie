# MasonryColumn Technical Journey - Core Infinite Scroll Mechanics

**Absolute Path:** `/Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/MASONRYCOLUMN_TECHNICAL_JOURNEY.md`
**File URL:** `file:///Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/MASONRYCOLUMN_TECHNICAL_JOURNEY.md`
**VS Code:** `code -g /Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/MASONRYCOLUMN_TECHNICAL_JOURNEY.md:1`

## 1. Component Identity & Purpose

### Component Identification
- **Location:** `src/components/portfolio/MasonryColumn.tsx`
- **Used In:** GridViewport.tsx (3-column counter-scrolling grid)
- **Type:** Infinite scroll column component
- **Display Name:** MasonryColumn - Infinite Wrap Column

### Primary Purpose
The core building block for counter-scrolling portfolio grids. Creates a single column that scrolls infinitely in either direction, with content triplication for seamless wrapping. Used as the foundation for multi-column parallax effects in GridViewport.

### Key Features
- Directional scrolling (up/down)
- Triple content duplication
- Viewport-based phase offsets
- Lazy video loading
- Dynamic height measurement
- Smooth infinite wrapping
- Reduced motion support

## 2. Technical Architecture

### Component Structure
```typescript
export interface MasonryColumnProps {
  items: Project[]                    // Projects to display
  direction: 'up' | 'down'           // Scroll direction
  speed?: number                      // Speed multiplier (default 0.6)
  viewportHeight: number              // For calculations
  scrollY: MotionValue<number>       // Scroll progress from parent
  phase?: number                      // Phase offset (0-1)
  onHeightMeasured?: (height: number) => void  // Height callback
}
```

### State Management
```typescript
const [contentHeight, setContentHeight] = useState(0)
// No tile scale state - uses fixed aspect ratio 2.5:1
```

## 3. Infinite Scroll Mathematics

### Transform Calculation
```typescript
const sign = direction === 'up' ? -1 : 1

const columnOffset = useTransform(scrollY, (sy) => {
  if (contentHeight <= 0) return 0
  
  // Calculate offset with direction and speed
  const baseOffset = sign * sy * speed
  const phaseOffset = phase * viewportHeight * 0.2
  let offset = baseOffset + phaseOffset
  
  // Simple modulo wrap for infinite scroll
  offset = offset % (contentHeight || 1)
  if (offset > 0) offset -= contentHeight
  
  return offset
})
```

### How Wrapping Works
```
Content Height: 1000px
Current offset: -1200px

Modulo wrap:
-1200 % 1000 = -200
Result: -200px (wrapped back to visible range)

Visual:
[---SET1---][---SET2---][---SET3---]
     ↑
   -200px (shows part of SET1)
```

## 4. Triple Content Strategy

### Why Three Sets?
```tsx
{[0, 1, 2].map((setIndex) => (
  <div key={`set-${setIndex}`} className="masonry-list space-y-3">
    {items.map((project) => (
      <div key={`${project.id}-${setIndex}`}>
        <ProjectCard project={project} />
      </div>
    ))}
  </div>
))}
```

### Benefits
- **Smoother transitions** at wrap points
- **No visible gaps** during fast scrolling
- **Buffer zones** above and below viewport
- **Prevents pop-in** at boundaries

## 5. Phase Offset System

### Phase Calculation
```typescript
const phaseOffset = phase * viewportHeight * 0.2

// Examples:
phase = 0.00: offset = 0px (aligned)
phase = 0.33: offset = 0.33 * 800 * 0.2 = 52.8px
phase = 0.66: offset = 0.66 * 800 * 0.2 = 105.6px
```

### Visual Staggering
```
Column 0 (phase=0.00): [A][B][C]
Column 1 (phase=0.33):    [A][B][C]
Column 2 (phase=0.66):       [A][B][C]

Creates diagonal flow pattern
```

## 6. Height Measurement System

### ResizeObserver Implementation
```typescript
useEffect(() => {
  const measureHeight = () => {
    const firstList = contentRef.current?.querySelector('.masonry-list')
    if (firstList) {
      const height = firstList.scrollHeight
      setContentHeight(height)
      onHeightMeasured?.(height)  // Notify parent
    }
  }

  const resizeObserver = new ResizeObserver(measureHeight)
  const firstList = contentRef.current?.querySelector('.masonry-list')
  if (firstList) {
    resizeObserver.observe(firstList)
  }

  // Initial + delayed measurement
  measureHeight()
  const timer = setTimeout(measureHeight, 500)
  
  return () => {
    resizeObserver.disconnect()
    clearTimeout(timer)
  }
}, [items, onHeightMeasured])
```

### Why Measure Height?
- **Dynamic content** sizes vary
- **Image loading** changes height
- **Responsive layouts** affect dimensions
- **Accurate wrapping** needs real height

## 7. Video Lazy Loading

### IntersectionObserver Setup
```typescript
const observerOptions: IntersectionObserverInit = {
  root: null,              // Viewport
  rootMargin: '200px 0px', // 200px buffer
  threshold: [0, 0.25, 0.5, 0.75, 1.0]
}
```

### Loading Strategy
```typescript
if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
  // Load when 25% visible
  if (!video.src && video.dataset.src) {
    video.src = video.dataset.src
  }
} else if (!entry.isIntersecting) {
  // Cleanup when off-screen
  setTimeout(() => {
    if (!video.matches(':hover') && !video.matches(':focus-within')) {
      video.src = ''
      video.load()  // Free memory
    }
  }, 250)
}
```

## 8. Fixed Aspect Ratio

### Consistent Tile Sizing
```tsx
<div 
  className="portfolio-tile overflow-hidden"
  style={{ aspectRatio: '2.5 / 1' }}  // Cinematic ratio
>
  <ProjectCard project={project} />
</div>
```

### Benefits
- **Predictable layouts** across columns
- **No content jumps** during scroll
- **Consistent visual rhythm**
- **Easier infinite wrap calculations**

## 9. Reduced Motion Support

### Static Fallback
```typescript
if (prefersReducedMotion) {
  return (
    <div className="relative h-full overflow-hidden">
      <div className="masonry-list space-y-3">
        {items.map((project) => (
          <div key={project.id} style={{ aspectRatio: '2.5 / 1' }}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Accessibility Benefits
- Respects system preferences
- No motion sickness triggers
- Maintains functionality
- Simple scrollable list

## 10. Performance Optimizations

### GPU Acceleration
```tsx
<motion.div
  className="relative overflow-hidden will-change-transform"
  style={{
    y: columnOffset,
    willChange: 'transform'
  }}
>
```

### Optimization Techniques
- `will-change: transform` hints
- Transform-only animations (no reflow)
- Lazy video loading
- Observer cleanup on unmount

## 11. Integration with GridViewport

### Usage in Parent
```tsx
// In GridViewport.tsx
<MasonryColumn
  items={columnProjects}
  direction={directions[index]}    // 'up' or 'down'
  speed={columnSpeed}              // 0.2-0.25
  viewportHeight={viewportHeight}
  scrollY={scrollY}                // From useVirtualScroll
  phase={index * 0.33}             // Stagger columns
  onHeightMeasured={(height) => {
    if (!scrollLength && height > 0) {
      setScrollLength(Math.max(height * 1.5, viewportHeight * 3))
    }
  }}
/>
```

## 12. Comparison with CounterScrollColumn

| Feature | MasonryColumn | CounterScrollColumn |
|---------|--------------|-------------------|
| **Content Sets** | 3 (triple) | 2 (double) |
| **Phase Base** | Viewport height * 0.2 | Tile height |
| **Aspect Ratio** | Fixed 2.5:1 | CSS variable |
| **Transform** | Single calculation | Chained transforms |
| **Use Case** | GridViewport | Currently unused |

## 13. Common Issues & Solutions

### Issue: Content Gap at Wrap Point
```typescript
// Solution: Triple content sets
{[0, 1, 2].map(setIndex => ...)}  // More buffer
```

### Issue: Height Changes After Load
```typescript
// Solution: ResizeObserver + delayed measure
const timer = setTimeout(measureHeight, 500)
```

### Issue: Videos Not Cleaning Up
```typescript
// Solution: Hover/focus protection
if (!video.matches(':hover') && !video.matches(':focus-within'))
```

## 14. Testing Strategies

### Visual Tests
```typescript
// Test wrapping seamlessness
// Verify no gaps during scroll
// Check phase offsets work
// Validate video loading/cleanup
```

### Performance Tests
```typescript
// Monitor frame rate during scroll
// Check memory usage with videos
// Verify observer cleanup
// Test with many items
```

### Edge Cases
```typescript
// Empty items array
// Single item
// Very tall content
// Rapid direction changes
// Browser back/forward
```

## 15. Advanced Patterns

### Custom Speed Curves
```typescript
// Could implement easing
const columnOffset = useTransform(scrollY, (sy) => {
  const eased = easeInOutQuad(sy)  // Custom easing
  return sign * eased * speed
})
```

### Dynamic Phase
```typescript
// Phase could animate over time
const animatedPhase = useSpring(phase, {
  stiffness: 50,
  damping: 20
})
```

## TL;DR

**MasonryColumn** is the core infinite scroll engine featuring:
- **Triple content duplication** for seamless infinite scrolling
- **Directional control** with up/down movement
- **Viewport-based phase offsets** (viewportHeight * 0.2)
- **Fixed 2.5:1 aspect ratio** for consistent layouts
- **Simple modulo wrapping** for infinite scroll math
- **ResizeObserver** for dynamic height tracking
- **Lazy video loading** with IntersectionObserver
- **Memory cleanup** with hover protection
- **GPU-accelerated transforms** for smooth 60fps
- **Reduced motion support** with static fallback

This component is the workhorse of the counter-scrolling grid system, handling all the complex infinite scroll mechanics while maintaining excellent performance through lazy loading and efficient transform calculations. It's currently used exclusively in GridViewport to create the signature 3-column counter-scrolling effect.