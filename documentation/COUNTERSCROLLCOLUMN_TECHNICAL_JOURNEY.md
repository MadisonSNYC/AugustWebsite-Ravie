# CounterScrollColumn Technical Journey - Counter-Scrolling Column Effect

**Absolute Path:** `/Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/COUNTERSCROLLCOLUMN_TECHNICAL_JOURNEY.md`
**File URL:** `file:///Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/COUNTERSCROLLCOLUMN_TECHNICAL_JOURNEY.md`
**VS Code:** `code -g /Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/COUNTERSCROLLCOLUMN_TECHNICAL_JOURNEY.md:1`

## 1. Component Identity & Purpose

### Component Identification
- **Location:** `src/components/portfolio/CounterScrollColumn.tsx`
- **Used In:** Currently unused (standalone component)
- **Type:** Portfolio column component
- **Display Name:** CounterScrollColumn - Directional Scroll Column

### Primary Purpose
A specialized column component that creates counter-scrolling effects based on native page scroll. Designed as an alternative to MasonryColumn with different wrapping logic and phase offset calculations. Creates seamless infinite scrolling with duplicated content sets.

### Key Features
- Directional scrolling (up/down)
- Phase-based tile offsetting
- CSS variable tile scaling
- Lazy video loading
- Infinite wrap with modulo
- ResizeObserver for dynamic height
- Reduced motion support

## 2. Technical Architecture

### Component Structure
```typescript
export interface CounterScrollColumnProps {
  items: Project[]                    // Projects to display
  direction: 'up' | 'down'           // Scroll direction
  speed?: number                      // Speed multiplier (default 0.6)
  viewportHeight: number              // Viewport height for calculations
  scrollY: MotionValue<number>       // Scroll progress from parent
  phase?: number                      // Phase offset (0-1 of tile height)
  onHeightMeasured?: (height: number) => void  // Height callback
}

// Core state
const [contentHeight, setContentHeight] = useState(0)
const [tileScale, setTileScale] = useState(0.5)
```

### Dependencies
```typescript
import { motion, MotionValue, useTransform } from 'framer-motion'
import { wrapOffset } from '../../hooks/useInfiniteWrap'
import { ProjectCard, Project } from './ProjectCard'
import { useReducedMotionContext } from '../../providers/ReducedMotionProvider'
```

## 3. Tile Scale System

### CSS Variable Integration
```typescript
// Get tile scale from CSS variable
useEffect(() => {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--tile-scale')
  const val = parseFloat(raw) || 0.5
  setTileScale(val)
}, [])

const tileHeightPx = Math.max(0, viewportHeight * tileScale)
```

### Benefits
- Dynamic tile sizing via CSS
- Responsive to viewport changes
- Single source of truth
- Runtime adjustable

## 4. Scroll Transform Pipeline

### Transform Chain
```typescript
// 1. Direction sign
const sign = direction === 'up' ? -1 : 1

// 2. Base offset from scroll
const baseOffset = useTransform(scrollY, (sy) => sign * sy * speed)

// 3. Apply phase offset
const phasedOffset = useTransform(
  baseOffset, 
  (v) => v + phase * tileHeightPx
)

// 4. Wrap to infinite range
const wrappedOffset = useTransform(phasedOffset, (v) => {
  if (contentHeight <= 0) return 0
  return wrapOffset(v % contentHeight, contentHeight)
})
```

### Phase Offset Calculation
```
Phase = 0.0: No offset (aligned)
Phase = 0.5: Half tile offset
Phase = 1.0: Full tile offset

Example with tileHeight = 200px:
Phase 0.5 = 200 * 0.5 = 100px offset
```

## 5. Infinite Wrap Logic

### wrapOffset Function
```typescript
// From useInfiniteWrap.ts
export function wrapOffset(y: number, H: number): number {
  // Keep y in [-H, 0) range
  if (H <= 0) return 0
  let wrapped = y
  while (wrapped <= -H) wrapped += H
  while (wrapped > 0) wrapped -= H
  return wrapped
}
```

### How It Works
```
Input: y = -1500, H = 1000
Process:
  -1500 <= -1000? Yes -> -1500 + 1000 = -500
  -500 <= -1000? No
  -500 > 0? No
Output: -500 (wrapped into [-1000, 0) range)
```

## 6. Content Duplication Strategy

### Two-Set Approach
```tsx
<motion.div style={{ y: wrappedOffset }}>
  {/* First set of items */}
  <div className="column-list">
    {items.map((project) => (
      <ProjectCard key={`${project.id}-1`} project={project} />
    ))}
  </div>

  {/* Duplicate set for seamless loop */}
  <div className="column-list">
    {items.map((project) => (
      <ProjectCard key={`${project.id}-2`} project={project} />
    ))}
  </div>
</motion.div>
```

### Visual Result
```
Viewport: [    visible area    ]
Content:  SET1 SET2 SET1 SET2...
               ↑
          [viewport sees this]
```

## 7. Height Measurement System

### Dynamic Height Detection
```typescript
const measureHeight = () => {
  const firstList = contentRef.current?.querySelector('.column-list')
  if (firstList) {
    const height = firstList.scrollHeight
    setContentHeight(height)
    onHeightMeasured?.(height)  // Notify parent
  }
}

// ResizeObserver for changes
const resizeObserver = new ResizeObserver(measureHeight)
```

### Timing Strategy
- Initial measure on mount
- 500ms delayed remeasure (for images)
- Continuous monitoring via ResizeObserver
- Callback to parent for coordination

## 8. Video Memory Management

### IntersectionObserver Setup
```typescript
const observerOptions: IntersectionObserverInit = {
  root: null,              // Viewport
  rootMargin: '200px 0px', // 200px buffer
  threshold: [0, 0.25, 0.5, 0.75, 1.0]  // Multiple triggers
}
```

### Lazy Loading Logic
```typescript
if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
  // Load video when 25% visible
  if (!video.src && video.dataset.src) {
    video.src = video.dataset.src
  }
} else if (!entry.isIntersecting) {
  // Free memory when out of view
  setTimeout(() => {
    if (!video.matches(':hover') && !video.matches(':focus-within')) {
      video.src = ''
      video.load()  // Clear buffer
    }
  }, 250)
}
```

## 9. Reduced Motion Support

### Static Fallback
```typescript
if (prefersReducedMotion) {
  return (
    <div className="relative h-full overflow-hidden" ref={columnRef}>
      <div className="">
        {items.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
```

### Accessibility Benefits
- No animation for users with vestibular disorders
- Simple scrollable list
- Maintains functionality
- Respects system preferences

## 10. Comparison with MasonryColumn

### Key Differences

| Feature | CounterScrollColumn | MasonryColumn |
|---------|-------------------|---------------|
| **Content Sets** | 2 sets | 3 sets |
| **Phase Calculation** | `phase * tileHeightPx` | `phase * viewportHeight * 0.2` |
| **Tile Scale** | CSS variable `--tile-scale` | Fixed aspect ratio 2.5:1 |
| **Class Names** | `column-list` | `masonry-list` |
| **Offset Logic** | Chained transforms | Single transform |
| **Default Speed** | 0.6 | 0.6 |

### When to Use Each
- **CounterScrollColumn:** When you need phase offsets based on tile height
- **MasonryColumn:** When you need viewport-based phase offsets

## 11. Performance Optimizations

### Transform Efficiency
```typescript
// Chained transforms for clarity
const baseOffset = useTransform(scrollY, transform1)
const phasedOffset = useTransform(baseOffset, transform2)
const wrappedOffset = useTransform(phasedOffset, transform3)

// Each transform is memoized
// Only recalculates when input changes
```

### GPU Acceleration
```css
.will-change-transform {
  will-change: transform;
  transform: translateZ(0);
}
```

### Memory Management
- Videos freed when off-screen
- 250ms delay prevents thrashing
- Hover protection prevents cleanup during interaction

## 12. Common Usage Patterns

### Basic Implementation
```tsx
<CounterScrollColumn
  items={projects}
  direction="up"
  speed={0.4}
  viewportHeight={window.innerHeight}
  scrollY={scrollProgress}
  phase={0.5}  // Half tile offset
/>
```

### Multi-Column Setup
```tsx
{columns.map((items, index) => (
  <CounterScrollColumn
    key={index}
    items={items}
    direction={index % 2 ? 'up' : 'down'}
    phase={index * 0.33}  // Stagger by thirds
    viewportHeight={viewportHeight}
    scrollY={scrollY}
  />
))}
```

## 13. CSS Requirements

### Required Styles
```css
/* Tile scale variable */
:root {
  --tile-scale: 0.5;  /* Tiles are 50% of viewport height */
}

/* Column container */
.relative {
  position: relative;
}

.h-full {
  height: 100%;
}

.overflow-hidden {
  overflow: hidden;
}
```

## 14. Testing Considerations

### Visual Tests
- Direction changes correctly
- Phase offsets apply properly
- Infinite scroll seamless
- Videos load/unload correctly

### Performance Tests
- 60fps maintained during scroll
- Memory stays stable
- No layout shifts
- Transform calculations efficient

### Edge Cases
- Empty items array
- Single item
- Very tall content
- Rapid scrolling
- Browser back/forward

## 15. Migration Path

### From MasonryColumn
```typescript
// MasonryColumn
<MasonryColumn
  items={projects}
  direction="up"
  phase={0.33}  // Viewport-based
/>

// To CounterScrollColumn
<CounterScrollColumn
  items={projects}
  direction="up"
  phase={0.5}  // Tile-based (different scale!)
/>
```

### Key Migration Considerations
1. Phase values need recalculation (different basis)
2. Update CSS classes (`masonry-list` → `column-list`)
3. Add `--tile-scale` CSS variable
4. Test wrap behavior (2 sets vs 3 sets)

## TL;DR

**CounterScrollColumn** is a specialized infinite scroll column featuring:
- **Directional scrolling** with up/down movement control
- **Phase-based offsetting** calculated from tile height (not viewport)
- **CSS variable tile scaling** via `--tile-scale` property
- **Two-set duplication** for infinite scrolling (vs MasonryColumn's 3 sets)
- **Chained transforms** for clear separation of concerns
- **Lazy video loading** with IntersectionObserver
- **Memory management** with 250ms cleanup delay
- **Reduced motion support** with static fallback
- **ResizeObserver** for dynamic height detection
- **wrapOffset utility** for [-H, 0) range wrapping

This component provides an alternative to MasonryColumn with different phase calculation logic based on tile height rather than viewport height, making it ideal for scenarios where you want consistent tile-based offsets regardless of viewport size. Currently unused in the codebase but ready for implementation where precise tile-based phase control is needed.