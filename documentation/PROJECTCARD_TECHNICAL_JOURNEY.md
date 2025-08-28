# ProjectCard Technical Journey - Interactive Project Tile Component

**Absolute Path:** `/Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/PROJECTCARD_TECHNICAL_JOURNEY.md`
**File URL:** `file:///Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/PROJECTCARD_TECHNICAL_JOURNEY.md`
**VS Code:** `code -g /Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/PROJECTCARD_TECHNICAL_JOURNEY.md:1`

## 1. Component Identity & Purpose

### Component Identification
- **Location:** `src/components/portfolio/ProjectCard.tsx`
- **Used In:** SmoothGrid (homepage), GridViewport, MasonryColumn, all portfolio grids
- **Type:** Reusable presentation component
- **Display Name:** ProjectCard - Interactive Project Tile

### Primary Purpose
A sophisticated project tile that manages video preview playback, hover interactions, and navigation. Serves as the fundamental building block for all portfolio displays, coordinating with SpotlightContext for multi-tile hover state management.

### Key Features
- Video preview with 100ms hover delay
- Spotlight coordination (single active video)
- Muted state for non-active cards
- Keyboard navigation support
- Modal/page route handling
- Accessibility-first design

## 2. Technical Architecture

### Component Dependencies
```typescript
// External
import { Link, useLocation } from 'react-router-dom'

// Internal Components
import { VideoPreview, VideoPreviewHandle } from './VideoPreview'
import TitleOverlay from './TitleOverlay'

// Context/Providers
import { useReducedMotionContext } from '../../providers/ReducedMotionProvider'
import { useSpotlight } from './SpotlightContext'
```

### Type Definitions
```typescript
// Project data structure
export interface Project {
  id: string
  title: string
  client?: string
  categories: string[]
  slug: string
  posterSrc: string     // Static image fallback
  previewSrc: string    // Video preview URL
  durationSec?: number  // Video duration
  description?: string
}

// Component props
export interface ProjectCardProps {
  project: Project
}
```

### State Management
```typescript
// Local Component State
const [active, setActive] = useState(false)              // Local activation state
const [pointerInside, setPointerInside] = useState(false) // Pointer tracking

// Refs
const videoRef = useRef<VideoPreviewHandle>(null)        // Video control handle
const hoverTimer = useRef<number | null>(null)           // Hover delay timer

// Context State
const { activeId, setActiveId } = useSpotlight()         // Global active card
const { prefersReducedMotion } = useReducedMotionContext() // Accessibility

// Computed State
const isActive = activeId === project.id                 // Is this card active?
const isMuted = activeId !== null && !isActive          // Should mute visuals?
```

## 3. Interaction System

### Hover Delay Mechanism
```typescript
const HOVER_DELAY_MS = 100  // Prevents accidental triggers

// Delayed pointer activation
const handlePointerEnter = () => {
  setPointerInside(true)
  if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
  hoverTimer.current = window.setTimeout(() => {
    activate()  // Triggers after 100ms
  }, HOVER_DELAY_MS)
}

// Immediate deactivation on leave
const handlePointerLeave = () => {
  setPointerInside(false)
  if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
  deactivate()
}
```

### Activation/Deactivation Logic
```typescript
const activate = () => {
  setActive(true)                    // Local state
  setActiveId(project.id)            // Global spotlight
  if (!prefersReducedMotion) {
    videoRef.current?.play()          // Start video
  }
}

const deactivate = () => {
  setActive(false)                   // Local state
  setActiveId(null)                  // Clear global
  videoRef.current?.pause()          // Stop video
}
```

### Keyboard Navigation
```typescript
// Instant activation on focus (no delay)
const handleFocus = () => activate()
const handleBlur = () => deactivate()

// Applied to Link component
<Link
  onFocus={handleFocus}
  onBlur={handleBlur}
>
```

## 4. Spotlight Coordination

### Multi-Card State Management
```typescript
// SpotlightContext provides:
const { activeId, setActiveId } = useSpotlight()

// Coordination logic:
1. Card A hoverd → setActiveId('A')
2. All cards check: isActive = activeId === myId
3. Non-active cards: isMuted = true
4. CSS filter applied via data-muted attribute
```

### Visual Muting System
```typescript
// Data attribute for CSS targeting
<article data-muted={isMuted ? 'true' : 'false'}>

// CSS (from portfolio.css)
article[data-muted="true"] .spotlight-content {
  filter: grayscale(1) brightness(0.85) contrast(1.08);
  transition: filter 100ms ease;
}
```

## 5. Navigation & Routing

### Link Configuration
```typescript
<Link
  to={`/portfolio/${project.slug}`}        // Target route
  state={{ background: location }}         // Preserve background for modal
  aria-label={project.title}                // Accessibility
>
```

### Modal vs Page Navigation
```typescript
// State preservation enables modal behavior
state={{ background: location }}

// In portfolio route:
if (state?.background) {
  // Render as modal overlay
} else {
  // Render as full page
}
```

## 6. Video Integration

### VideoPreview Component Usage
```typescript
<VideoPreview
  ref={videoRef}                           // Control handle
  posterSrc={project.posterSrc}            // Fallback image
  previewSrc={project.previewSrc}          // Video URL
  autoPlayAllowed={!prefersReducedMotion}  // Respect preferences
  className="w-full h-full rounded-none object-cover"
/>

// VideoPreviewHandle interface:
interface VideoPreviewHandle {
  play: () => void
  pause: () => void
}
```

### Media Strategy
1. **Initial State:** Shows poster image
2. **Hover Trigger:** After 100ms delay
3. **Video Load:** Lazy loads on first hover
4. **Playback:** Muted autoplay
5. **Leave:** Pause and reset

## 7. Title Overlay System

### TitleOverlay Integration
```typescript
<TitleOverlay
  title={project.title}
  client={project.client}
  categories={project.categories}
  show={active}              // Visibility tied to activation
  compact={true}             // Layout variant
  className=""
/>
```

### Overlay Behavior
- Appears on hover/focus
- Fades in with animation
- Shows title, client, categories
- Positioned absolutely over video

## 8. Accessibility Features

### ARIA Implementation
```html
<article>                              <!-- Semantic container -->
  <Link aria-label={project.title}>    <!-- Screen reader label -->
    <!-- Content -->
  </Link>
  
  <!-- Visual focus indicator -->
  <div className="group-focus-within:ring-2 group-focus-within:ring-white/70" />
</article>
```

### Keyboard Support
- **Tab:** Navigate through cards
- **Enter/Space:** Activate link
- **Focus:** Triggers video preview
- **Blur:** Stops video playback

### Reduced Motion
```typescript
// Video autoplay disabled
autoPlayAllowed={!prefersReducedMotion}

// In activate():
if (!prefersReducedMotion) {
  videoRef.current?.play()
}
```

## 9. CSS Classes & Styling

### Core Classes
```css
.portfolio-card {
  position: relative;
  height: 100%;
  /* Container fills parent dimensions */
}

.spotlight-content {
  width: 100%;
  height: 100%;
  /* Muting filter applied here */
}

/* Focus ring */
.group-focus-within:ring-2 {
  ring: 2px solid rgba(255, 255, 255, 0.7);
}
```

### Responsive Behavior
- Fills parent container dimensions
- Maintains aspect ratio via parent
- No internal sizing logic
- Fully flexible/reusable

## 10. Performance Optimizations

### Hover Delay Benefits
```typescript
const HOVER_DELAY_MS = 100

// Prevents:
- Accidental video loads during fast scrolling
- Multiple rapid video starts/stops
- Unnecessary network requests
```

### Video Lazy Loading
- Videos don't load until first hover
- Poster image shown initially
- Reduces initial page weight
- Progressive enhancement pattern

### Spotlight Optimization
- Only one video plays at a time
- Others show static poster
- Reduces GPU/CPU load
- Improves battery life

## 11. Integration Examples

### Homepage (SmoothGrid)
```typescript
// In SmoothGrid.tsx
{transformedProjects.map((project, index) => (
  <motion.div key={project.id}>
    <ProjectCard project={project} />
  </motion.div>
))}
```

### Portfolio Grid (GridViewport)
```typescript
// In MasonryColumn.tsx
{projects.map(project => (
  <div className="portfolio-tile">
    <ProjectCard project={project} />
  </div>
))}
```

## 12. Common Patterns & Best Practices

### Pattern: Delayed Hover Activation
```typescript
// Use setTimeout with cleanup
const handlePointerEnter = () => {
  if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
  hoverTimer.current = window.setTimeout(() => {
    // Delayed action
  }, DELAY_MS)
}
```

### Pattern: Ref-based Media Control
```typescript
// Define handle interface
interface MediaHandle {
  play: () => void
  pause: () => void
}

// Use imperative handle in child
// Control via ref.current in parent
```

### Pattern: Context-based Coordination
```typescript
// Single source of truth in context
// Components react to shared state
// No direct component communication
```

## 13. Testing Considerations

### Interaction Tests
- Hover delay triggers after exactly 100ms
- Video starts/stops correctly
- Focus/blur handlers work
- Navigation preserves state

### Accessibility Tests
- ARIA labels present
- Keyboard navigation functional
- Focus indicators visible
- Reduced motion respected

### Integration Tests
- Works with SpotlightContext
- VideoPreview integration
- TitleOverlay visibility
- Route navigation

## TL;DR

**ProjectCard** is the core interactive tile component featuring:
- **100ms hover delay** to prevent accidental triggers
- **Video preview integration** with lazy loading
- **Spotlight coordination** for single-active-video
- **Visual muting** of non-active cards via CSS filters
- **Keyboard navigation** with instant focus response
- **Modal/page routing** with state preservation
- **Full accessibility** with ARIA labels and reduced motion
- **Performance optimized** with lazy loading and single video playback

The component serves as the fundamental building block for all portfolio displays, providing consistent interaction patterns across the application while maintaining excellent performance through intelligent video management and hover delay mechanisms.