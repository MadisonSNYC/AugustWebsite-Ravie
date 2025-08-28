# VideoPreview Technical Journey - Smart Video Playback System

**Absolute Path:** `/Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/VIDEOPREVIEW_TECHNICAL_JOURNEY.md`
**File URL:** `file:///Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/VIDEOPREVIEW_TECHNICAL_JOURNEY.md`
**VS Code:** `code -g /Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/VIDEOPREVIEW_TECHNICAL_JOURNEY.md:1`

## 1. Component Identity & Purpose

### Component Identification
- **Location:** `src/components/portfolio/VideoPreview.tsx`
- **Used In:** ProjectCard, all portfolio tiles
- **Type:** Forwardref media component
- **Display Name:** VideoPreview - Smart Video Player

### Primary Purpose
A sophisticated video preview component that handles lazy loading, viewport detection, single-active playback control, and memory management. Provides the video preview functionality for all project tiles while maintaining excellent performance through intelligent resource management.

### Key Features
- Viewport-based lazy loading
- Single-active video enforcement
- Memory cleanup on unmount
- iOS-specific optimizations
- Intersection observer integration
- Imperative playback control

## 2. Technical Architecture

### Component Structure
```typescript
// Forwardref implementation for parent control
export const VideoPreview = forwardRef<VideoPreviewHandle, VideoPreviewProps>(
  ({ posterSrc, previewSrc, autoPlayAllowed = true, className = '', freeOnLeave = true }, ref) => {
    // Component implementation
  }
)

// Public interfaces
export interface VideoPreviewProps {
  posterSrc: string         // Fallback image
  previewSrc: string        // Video URL
  autoPlayAllowed?: boolean // Respect reduced motion
  className?: string        // Additional styles
  freeOnLeave?: boolean     // Clear source on leave
}

export interface VideoPreviewHandle {
  play: () => void         // Imperative play
  pause: () => void        // Imperative pause
}
```

### Dependencies
```typescript
// React hooks
import { useRef, useImperativeHandle, forwardRef, useEffect } from 'react'

// Custom hook for viewport detection
import { useIntersectionVideo } from '../../hooks/useIntersectionVideo'

// Singleton controller for single-active video
import { claim, release } from '../../lib/previewController'
```

## 3. Video Lifecycle Management

### Lazy Loading Strategy
```typescript
// Only load video when in viewport
const { ref: intersectionRef, isIntersecting } = useIntersectionVideo({
  rootMargin: '200px 0px',    // 200px early trigger
  threshold: 0.25,             // 25% visible
  onEnter: () => {
    if (autoPlayAllowed && videoRef.current && !videoRef.current.src) {
      videoRef.current.src = previewSrc
      videoRef.current.load()
    }
  },
  onLeave: () => {
    safePause()
  }
})
```

### Source Management
```typescript
const ensureSrc = () => {
  const v = videoRef.current
  if (!v) return
  if (!v.src) {
    v.src = previewSrc
    v.load()
  }
}

// Memory cleanup on leave
if (freeOnLeave) {
  setTimeout(() => {
    const video = videoRef.current
    if (!video) return
    // Only clear if not actively interacted
    if (!video.matches(':hover') && document.activeElement !== video) {
      video.removeAttribute('src')
      video.load()  // Clears buffer
    }
  }, 250)
}
```

## 4. Single-Active Video Control

### Preview Controller Integration
```typescript
// previewController.ts - Singleton pattern
let current: HTMLVideoElement | null = null

export function claim(video: HTMLVideoElement) {
  if (current && current !== video) {
    try { 
      current.pause()  // Pause previous
    } catch {}
  }
  current = video      // Set new active
}

export function release(video: HTMLVideoElement) {
  if (current === video) {
    current = null
  }
}
```

### Usage in Component
```typescript
const onEnter = () => {
  if (!autoPlayAllowed || !videoRef.current) return
  
  ensureSrc()
  claim(videoRef.current)  // Claim exclusive playback
  void tryPlay()
}

const onLeave = () => {
  const v = videoRef.current
  if (!v) return
  
  safePause()
  release(v)               // Release control
  
  // Memory cleanup follows...
}
```

## 5. Interaction Handling

### Multi-Event Support
```typescript
<div
  onMouseEnter={onEnter}    // Mouse hover
  onMouseLeave={onLeave}
  onPointerEnter={onEnter}  // Touch/stylus
  onPointerLeave={onLeave}
  onFocus={onEnter}         // Keyboard focus
  onBlur={onLeave}
>
```

### Playback Control
```typescript
const tryPlay = async () => {
  const v = videoRef.current
  if (!v) return
  try {
    await v.play()
  } catch {
    // Silently handle autoplay errors
    // Common on mobile or low-power mode
  }
}

const safePause = () => {
  const v = videoRef.current
  if (v) {
    try {
      v.pause()
    } catch {}
  }
}
```

## 6. iOS-Specific Optimizations

### Safari/iOS Attributes
```typescript
useEffect(() => {
  const v = videoRef.current
  if (!v) return
  
  // Force inline playback on iOS
  v.setAttribute('webkit-playsinline', '')
  
  // Disable picture-in-picture
  // @ts-expect-error - iOS specific property
  if ('disablePictureInPicture' in v) {
    v.disablePictureInPicture = true
  }
}, [])
```

### Video Element Configuration
```html
<video
  muted               // Required for autoplay
  loop               // Continuous playback
  playsInline        // No fullscreen on mobile
  preload="metadata" // Load dimensions only
  aria-hidden="true" // Decorative element
  poster={posterSrc} // Fallback image
/>
```

## 7. Imperative Handle Pattern

### Parent Control Interface
```typescript
useImperativeHandle(ref, () => ({
  play: () => {
    if (!autoPlayAllowed) return
    ensureSrc()
    claim(videoRef.current!)
    void tryPlay()
  },
  pause: () => {
    safePause()
    if (videoRef.current) {
      release(videoRef.current)
    }
  }
}))

// Usage in parent (ProjectCard):
const videoRef = useRef<VideoPreviewHandle>(null)
videoRef.current?.play()  // Direct control
videoRef.current?.pause()
```

## 8. Rendering Structure

### Component Markup
```tsx
<div className="relative overflow-hidden rounded-2xl bg-black">
  {/* Always render poster for fallback */}
  <img
    src={posterSrc}
    alt=""
    className="absolute inset-0 w-full h-full object-cover"
    loading="lazy"
  />
  
  {/* Conditionally render video */}
  {autoPlayAllowed && (
    <video
      className="relative w-full h-full object-cover"
      // Video is layered above poster
    />
  )}
</div>
```

### Z-Index Strategy
1. **Poster:** `absolute` - Always present as fallback
2. **Video:** `relative` - Layers above poster when playing

## 9. Performance Optimizations

### Lazy Loading Benefits
```typescript
// Video sources only attached when:
1. In viewport (200px margin)
2. User hovers/focuses
3. Parent calls play()

// Prevents:
- Loading videos below fold
- Network waste
- Memory bloat
```

### Memory Management
```typescript
// Clear video source after interaction
setTimeout(() => {
  if (!video.matches(':hover') && document.activeElement !== video) {
    video.removeAttribute('src')
    video.load()  // Clears internal buffers
  }
}, 250)  // 250ms delay prevents flashing
```

### Single-Active Pattern
```typescript
// Only one video plays globally
- Reduces CPU/GPU load
- Improves battery life
- Prevents audio conflicts
- Better performance on mobile
```

## 10. Accessibility Considerations

### ARIA Implementation
```html
<video aria-hidden="true">  <!-- Decorative only -->
<img alt="">                <!-- Empty alt for decoration -->
```

### Reduced Motion Support
```typescript
autoPlayAllowed?: boolean  // Parent controls based on user preference

// In ProjectCard:
autoPlayAllowed={!prefersReducedMotion}
```

### Keyboard Support
- Focus triggers video playback
- Blur pauses video
- Tab navigation fully supported

## 11. Error Handling

### Graceful Failures
```typescript
// Play errors caught silently
try {
  await v.play()
} catch {
  // User sees poster image
  // No console errors
  // Common on:
  // - Mobile browsers
  // - Low power mode
  // - Autoplay restrictions
}

// Pause errors caught
try {
  v.pause()
} catch {}
```

### Fallback Strategy
1. **Video fails:** Show poster image
2. **Autoplay blocked:** Static image remains
3. **Network issues:** Poster provides content

## 12. Integration Patterns

### With ProjectCard
```tsx
<VideoPreview
  ref={videoRef}
  posterSrc={project.posterSrc}
  previewSrc={project.previewSrc}
  autoPlayAllowed={!prefersReducedMotion}
  className="w-full h-full rounded-none object-cover"
/>

// Control via ref
const activate = () => {
  videoRef.current?.play()
}

const deactivate = () => {
  videoRef.current?.pause()
}
```

### With Viewport Detection
```typescript
// Automatic loading when scrolling
// 200px rootMargin for early load
// Pause when out of view
// Memory cleanup on scroll away
```

## 13. Testing Considerations

### Unit Tests
- Play/pause methods work
- Single-active enforcement
- Memory cleanup triggers
- Error handling graceful

### Integration Tests
- Works with ProjectCard
- Viewport detection accurate
- iOS attributes applied
- Reduced motion respected

### Performance Tests
- Memory freed after use
- Single video limit enforced
- Lazy loading prevents waste
- No memory leaks

## TL;DR

**VideoPreview** is a sophisticated video player featuring:
- **Viewport-based lazy loading** with 200px early trigger
- **Single-active video control** via singleton controller
- **Smart memory management** with source cleanup
- **iOS optimizations** for reliable Safari playback
- **Imperative handle pattern** for parent control
- **Graceful error handling** for autoplay restrictions
- **Accessibility support** with reduced motion respect
- **Performance optimized** with lazy load and memory cleanup

The component ensures smooth video previews across all devices while maintaining excellent performance through intelligent resource management, making it the backbone of the portfolio's interactive media experience.