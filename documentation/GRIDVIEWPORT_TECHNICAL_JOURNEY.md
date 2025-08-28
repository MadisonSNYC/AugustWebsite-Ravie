# GridViewport Technical Journey - 3-Column Infinite Scroll Portfolio System

**Absolute Path:** `/Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/GRIDVIEWPORT_TECHNICAL_JOURNEY.md`
**File URL:** `file:///Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/GRIDVIEWPORT_TECHNICAL_JOURNEY.md`
**VS Code:** `code -g /Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/GRIDVIEWPORT_TECHNICAL_JOURNEY.md:1`

## 1. Component Identity & Purpose

### Component Identification
- **Location:** `src/components/portfolio/GridViewport.tsx`
- **Used In:** `/portfolio` route, `/work` page (with VITE_WORK_GRID_VIEWPORT=true)
- **Type:** Portfolio display system
- **Display Name:** GridViewport - 3-Column Counter-Scroll Gallery

### Primary Purpose
A sophisticated 3-column portfolio grid with counter-scrolling columns creating a dynamic parallax effect. Uses sticky positioning for smooth native scrolling while columns move at different speeds and directions, creating an engaging infinite scroll experience.

### Key Features
- 3-column masonry layout
- Counter-scrolling columns (up-down-up)
- Sticky viewport technique
- Virtual scroll physics
- Infinite scroll via wrapping
- Responsive with mobile fallback
- Cinematic 2.5:1 aspect ratio tiles

## 2. Technical Architecture

### Component Structure
```typescript
export interface GridViewportProps {
  projects: Project[]
  speed?: number  // Default 0.6
}

// Core refs
const viewportRef = useRef<HTMLDivElement>(null)  // Sticky viewport
const scrollRef = useRef<HTMLDivElement>(null)    // Scroll container

// State
const [viewportHeight, setViewportHeight] = useState(window.innerHeight)
const [scrollLength, setScrollLength] = useState<number | null>(null)
```

### Dependencies
```typescript
// Components
import { MasonryColumn } from './MasonryColumn'
import { ProjectCard } from './ProjectCard'
import { SpotlightProvider } from './SpotlightContext'

// Hooks
import { useVirtualScroll } from '../../hooks/useVirtualScroll'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useReducedMotionContext } from '../../providers/ReducedMotionProvider'
```

## 3. Sticky Viewport Technique

### How It Works
```
1. Outer container has large height (200vh+)
2. Inner viewport is sticky positioned
3. User scrolls the outer container
4. Sticky viewport stays in view
5. Scroll progress drives column animations
```

### Implementation
```tsx
<div
  ref={scrollRef}
  className="portfolio-scroll w-full"
  style={{ height: computedScrollLength }}  // e.g., "300vh"
>
  <div
    ref={viewportRef}
    className="portfolio-viewport w-full"  // sticky positioned via CSS
  >
    {/* Grid content */}
  </div>
</div>
```

### CSS for Sticky
```css
.portfolio-viewport {
  position: sticky;
  top: var(--nav-height, 0px);
  height: calc(100vh - var(--nav-height, 0px));
  overflow: hidden;
}
```

## 4. Column Distribution Logic

### Round-Robin Distribution
```typescript
const columns = useMemo(() => {
  const numColumns = 3
  const cols: Project[][] = [[], [], []]
  
  // Distribute projects evenly
  projects.forEach((project, index) => {
    cols[index % numColumns].push(project)
  })
  
  return cols
}, [projects])
```

### Example Distribution
```
Projects: [A, B, C, D, E, F, G, H, I]
Column 0: [A, D, G]  // indices 0, 3, 6
Column 1: [B, E, H]  // indices 1, 4, 7
Column 2: [C, F, I]  // indices 2, 5, 8
```

## 5. Counter-Scrolling System

### Direction Configuration
```typescript
// Mobile: all columns scroll down (same direction)
const directionsMobile: Array<'up' | 'down'> = ['down', 'down', 'down']

// Desktop: alternating for dynamic effect
const directionsDesktop: Array<'up' | 'down'> = ['up', 'down', 'up']

const directions = isMobile ? directionsMobile : directionsDesktop
```

### Speed Settings
```typescript
const desktopSpeed = 0.25  // Slower for smoothness
const mobileSpeed = 0.2    // Even slower on mobile
const columnSpeed = isMobile ? mobileSpeed : desktopSpeed
```

### Phase Staggering
```typescript
// Each column starts at different offset
phase={index * 0.33}  // 33% stagger

// Creates visual rhythm:
Column 0: phase = 0.00 (starts at top)
Column 1: phase = 0.33 (starts 1/3 down)
Column 2: phase = 0.66 (starts 2/3 down)
```

## 6. Virtual Scroll Physics

### useVirtualScroll Hook
```typescript
const { scrollY } = useVirtualScroll(scrollRef, {
  friction: 0.15,    // Smoothing factor
  maxVelocity: 60    // Speed limit
})

// Provides smooth, momentum-based scrolling
// scrollY is a MotionValue that updates smoothly
```

### Benefits
- Smooth 60fps scrolling
- Momentum and friction
- Consistent across devices
- Better than native scroll events

## 7. Dynamic Scroll Length

### Height Calculation
```typescript
// MasonryColumn measures its content
onHeightMeasured={(height) => {
  if (!scrollLength && height > 0) {
    // Use 1.5x height for smoother scrolling
    setScrollLength(Math.max(height * 1.5, viewportHeight * 3))
  }
}}

// Ensures enough scroll distance for full effect
const computedScrollLength = scrollLength || '200vh'
```

### Why 1.5x?
- Provides enough scroll distance
- Prevents abrupt stops
- Allows full column rotation
- Better user experience

## 8. Responsive Behavior

### Breakpoint Detection
```typescript
const isMobile = useBreakpoint('(max-width: 640px)')
const isSingleColumn = window.innerWidth < 480
```

### Layout Adaptations
```typescript
// Ultra-mobile: Single column fallback
if (isSingleColumn) {
  return (
    <div className="space-y-4 px-4">
      {projects.map((project) => (
        <div className="aspect-video">
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  )
}

// Mobile: 3 columns, all scroll down
// Desktop: 3 columns, counter-scroll
```

## 9. MasonryColumn Integration

### Column Props
```typescript
<MasonryColumn
  items={columnProjects}           // Projects for this column
  direction={directions[index]}    // 'up' or 'down'
  speed={columnSpeed}              // 0.2-0.25
  viewportHeight={viewportHeight}  // For calculations
  scrollY={scrollY}                // Scroll progress
  phase={index * 0.33}             // Stagger offset
  onHeightMeasured={handler}       // Height callback
/>
```

### Column Behavior
- Each column scrolls independently
- Infinite wrap via modulo
- Lazy loads videos in viewport
- Smooth transforms via Framer Motion

## 10. Performance Optimizations

### Memoization
```typescript
// Columns only recalculated when projects change
const columns = useMemo(() => {
  // Distribution logic
}, [projects])
```

### Lazy Video Loading
```typescript
// In MasonryColumn: IntersectionObserver
if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
  if (!video.src && video.dataset.src) {
    video.src = video.dataset.src  // Load on demand
  }
}
```

### GPU Acceleration
```css
.will-change-transform {
  will-change: transform;
  transform: translateZ(0);
}
```

## 11. Infinite Scroll Mechanics

### How Infinite Works
```typescript
// In MasonryColumn:
// 1. Render content 3 times
{[0, 1, 2].map((setIndex) => (
  <div key={`set-${setIndex}`}>
    {/* Same content repeated */}
  </div>
))}

// 2. Use modulo for wrapping
offset = offset % (contentHeight || 1)
if (offset > 0) offset -= contentHeight

// Creates seamless loop
```

### Visual Result
```
Viewport shows: [visible portion]
Actual content: AAA BBB CCC AAA BBB CCC AAA BBB CCC
                        ↑
                   [viewport]
As you scroll, viewport slides along infinite content
```

## 12. Accessibility Features

### ARIA Attributes
```html
<div
  tabIndex={0}
  role="region"
  aria-label="Portfolio projects"
>
```

### Keyboard Support
- Tab navigation through projects
- Focus management in columns
- Reduced motion support

### Reduced Motion
```typescript
if (prefersReducedMotion) {
  // Static layout, no counter-scroll
  return (
    <div className="masonry-list space-y-3">
      {/* Simple static grid */}
    </div>
  )
}
```

## 13. CSS Architecture

### Core Styles
```css
/* Scroll container */
.portfolio-scroll {
  height: calc(100vh * 3); /* Dynamic via JS */
  overflow: visible;
}

/* Sticky viewport */
.portfolio-viewport {
  position: sticky;
  top: var(--nav-height, 64px);
  height: calc(100vh - var(--nav-height));
  overflow: hidden;
}

/* Grid layout */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  height: 100%;
}

/* Tiles */
.portfolio-tile {
  aspect-ratio: 2.5 / 1;  /* Cinematic ratio */
}
```

## 14. Common Patterns

### Pattern: Sticky Viewport
```typescript
// Outer: scrollable height
// Inner: sticky positioned
// Content: transformed by scroll
```

### Pattern: Round-Robin Distribution
```typescript
items.forEach((item, index) => {
  columns[index % columnCount].push(item)
})
```

### Pattern: Counter-Scroll
```typescript
const sign = direction === 'up' ? -1 : 1
const offset = sign * scrollProgress * speed
```

## 15. Testing Considerations

### Visual Tests
- Counter-scroll directions correct
- Infinite scroll seamless
- Phase staggering visible
- Mobile fallback works

### Performance Tests
- 60fps scroll maintained
- Videos lazy load properly
- Memory usage stable
- No layout shifts

### Interaction Tests
- Hover states work
- Click navigation functional
- Keyboard accessible
- Touch scrolling smooth

## TL;DR

**GridViewport** is a sophisticated 3-column portfolio system featuring:
- **Sticky viewport technique** for smooth native scrolling
- **Counter-scrolling columns** (up-down-up) for dynamic effect
- **Round-robin distribution** for even column heights
- **Virtual scroll physics** with friction and momentum
- **Infinite scroll** via content triplication and modulo wrapping
- **Phase staggering** (33% offset per column) for visual rhythm
- **Cinematic 2.5:1 tiles** for consistent aspect ratio
- **Responsive design** with mobile-specific behavior
- **Lazy video loading** via IntersectionObserver
- **Performance optimized** with GPU acceleration and memoization

This creates an engaging, cinematic portfolio experience where projects flow continuously in an mesmerizing counter-scrolling pattern, all while maintaining excellent performance and accessibility.