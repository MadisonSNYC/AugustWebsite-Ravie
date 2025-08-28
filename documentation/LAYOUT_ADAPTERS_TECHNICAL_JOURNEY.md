# Layout Adapters Technical Journey - Environment-Driven Layout System

**Absolute Path:** `/Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/LAYOUT_ADAPTERS_TECHNICAL_JOURNEY.md`
**File URL:** `file:///Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/LAYOUT_ADAPTERS_TECHNICAL_JOURNEY.md`
**VS Code:** `code -g /Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/LAYOUT_ADAPTERS_TECHNICAL_JOURNEY.md:1`

## 1. System Overview

### What Are Layout Adapters?
Layout adapters are wrapper components that transform the `/work` page's project data to work with different portfolio display systems. They act as bridges between a single data source and multiple presentation layers, enabling environment variable-driven layout switching without modifying the original components.

### The Adapter Pattern
```
projects.json (Single Data Source)
          ↓
    Work Page Router
          ↓
    [ENV Variable Check]
          ↓
    Layout Adapter (Transform)
          ↓
    Target Component (Display)
```

### Available Adapters
1. **WorkHorizontalAdapter** → Horizontal3DGallery
2. **WorkHomeGridAdapter** → SmoothGrid
3. **WorkGridViewport** → GridViewport
4. **WorkGrid3x3** → Direct implementation
5. **WorkGridLegacy** → Original spotlight grid

## 2. Environment Variable System

### Configuration in work/index.tsx
```typescript
const USE_GRID_VIEWPORT = import.meta.env.VITE_WORK_GRID_VIEWPORT === 'true';
const USE_WORK_3X3 = import.meta.env.VITE_WORK_3X3 === 'true';
const USE_HOME_GRID = import.meta.env.VITE_WORK_USE_HOME_GRID === 'true';
const USE_HORIZONTAL = import.meta.env.VITE_WORK_HORIZ_3D === 'true';
const USE_LEGACY_GRID = import.meta.env.VITE_WORK_LEGACY_GRID === 'true';
```

### Priority Order
```javascript
if (USE_HORIZONTAL) return <WorkHorizontalAdapter />
if (USE_HOME_GRID) return <WorkHomeGridAdapter />
if (USE_GRID_VIEWPORT) return <WorkGridViewport />
if (USE_WORK_3X3) return <WorkGrid3x3 />
if (USE_LEGACY_GRID) return <WorkGridLegacy />
// Default fallback
```

## 3. WorkHorizontalAdapter

### Purpose
Transforms project data for horizontal 3D wheel scrolling experience

### Location
`src/components/portfolio/WorkHorizontalAdapter.tsx`

### Data Transformation
```typescript
const unified: ProjectData = useMemo(() => {
  const tiles: Tile[] = projects.map((p) => {
    // Infer best media type
    if (p.videoUrl) {
      return {
        type: 'video',
        data: {
          poster: p.posterSrc,
          title: p.title,
          src: p.videoUrl
        }
      }
    }
    if (p.posterSrc) {
      return {
        type: 'image',
        data: {
          url: p.posterSrc,
          caption: p.client,
          alt: p.title
        }
      }
    }
    return {
      type: 'text',
      data: {
        title: p.title,
        description: p.description
      }
    }
  })
  
  return {
    id: 'work-unified',
    title: 'Work',
    tiles
  }
}, [projects])
```

### Result
```typescript
return <Horizontal3DGallery project={unified} />
```

### Activation
```bash
VITE_WORK_HORIZ_3D=true npm run dev
```

### Visual Result
- Horizontal scrolling with mouse wheel
- 3D perspective rotation
- Cards arranged in carousel

## 4. WorkHomeGridAdapter

### Purpose
Makes the work page use the exact same grid as the homepage

### Location
`src/components/portfolio/WorkHomeGridAdapter.tsx`

### Implementation (Minimal)
```typescript
export default function WorkHomeGridAdapter() {
  const projects = useMemo(() => 
    Array.isArray(projectsJson) ? projectsJson : []
  , [])
  
  return (
    <ReducedMotionProvider>
      <SmoothGrid projects={projects} />
    </ReducedMotionProvider>
  )
}
```

### Key Points
- No data transformation needed
- SmoothGrid expects same format
- Wraps with ReducedMotionProvider
- Includes SpotlightProvider internally

### Activation
```bash
VITE_WORK_USE_HOME_GRID=true npm run dev
```

### Visual Result
- Single column layout
- 6-layer atmospheric effects
- Physics-based spring scroll
- Identical to homepage

## 5. WorkGridViewport

### Purpose
Adapts the 3-column counter-scrolling GridViewport for work page

### Location
`src/components/portfolio/WorkGridViewport.tsx`

### Critical Style Injection
```typescript
useEffect(() => {
  // Apply portfolio-style classes
  document.body.classList.add('cinematic-tiles')
  document.documentElement.classList.add('no-scrollbars')
  
  // Inject critical styles
  const style = document.createElement('style')
  style.textContent = `
    :root { --nav-height: 64px; }
    .portfolio-viewport { 
      position: sticky; 
      top: var(--nav-height, 0px); 
      height: calc(100vh - var(--nav-height, 0px)); 
    }
    .portfolio-grid { 
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .portfolio-tile { 
      aspect-ratio: 2.5 / 1 !important;
    }
  `
  document.head.appendChild(style)
}, [])
```

### Implementation
```typescript
return (
  <ReducedMotionProvider>
    <GridViewport projects={projects} />
  </ReducedMotionProvider>
)
```

### Activation
```bash
VITE_WORK_GRID_VIEWPORT=true npm run dev
```

### Visual Result
- 3-column grid
- Counter-scrolling (up-down-up)
- Sticky viewport technique
- Infinite scroll

## 6. Direct Grid Components (No Adapter)

### WorkGrid3x3
```typescript
// Used directly, no adapter needed
if (USE_WORK_3X3) {
  return <WorkGrid3x3 projects={visibleProjects} />
}
```

**Status:** ❌ Not documented yet
- Fixed 3x3 grid layout
- No infinite scroll
- Simple hover states

### WorkGridLegacy
```typescript
// Original implementation
if (USE_LEGACY_GRID) {
  return <WorkGridLegacy projects={visibleProjects} />
}
```

**Status:** ❌ Not documented yet
- Original spotlight system
- Multi-column masonry
- First iteration of the grid

## 7. Why Use Adapters?

### Problems They Solve

#### 1. Data Format Mismatch
```typescript
// Projects.json format
{ title, client, videoUrl, posterSrc }

// Horizontal3DGallery expects
{ tiles: [{ type, data }] }

// Adapter transforms between them
```

#### 2. Style Requirements
Each layout needs different CSS:
- GridViewport needs sticky positioning
- Horizontal3D needs hidden overflow
- SmoothGrid needs atmospheric layers

#### 3. Provider Requirements
```typescript
// SmoothGrid needs
<ReducedMotionProvider>
  <SpotlightProvider> // Built-in
    <SmoothGrid />
```

#### 4. Clean Switching
```bash
# No code changes, just ENV variable
VITE_WORK_GRID_VIEWPORT=true npm run dev
# vs
VITE_WORK_HORIZ_3D=true npm run dev
```

## 8. Common Adapter Patterns

### Pattern 1: Data Transformation
```typescript
const transformed = useMemo(() => {
  return originalData.map(item => ({
    // New structure
  }))
}, [originalData])
```

### Pattern 2: Style Injection
```typescript
useEffect(() => {
  document.body.classList.add('required-class')
  const style = document.createElement('style')
  style.textContent = `/* Critical styles */`
  document.head.appendChild(style)
  
  return () => {
    // Cleanup
  }
}, [])
```

### Pattern 3: Provider Wrapping
```typescript
return (
  <RequiredProvider>
    <TargetComponent data={transformed} />
  </RequiredProvider>
)
```

## 9. Testing Different Layouts

### Quick Commands
```bash
# Homepage style (single column, atmospheric)
VITE_WORK_USE_HOME_GRID=true npm run dev

# 3-column counter-scroll
VITE_WORK_GRID_VIEWPORT=true npm run dev

# Horizontal 3D wheel
VITE_WORK_HORIZ_3D=true npm run dev

# Fixed 3x3 grid
VITE_WORK_3X3=true npm run dev

# Original legacy grid
VITE_WORK_LEGACY_GRID=true npm run dev
```

### Multiple Servers
```bash
# Run different layouts simultaneously
npm run dev                                    # Default (port 5173)
VITE_WORK_HORIZ_3D=true npm run dev -- --port 5174
VITE_WORK_GRID_VIEWPORT=true npm run dev -- --port 5175
```

## 10. Creating New Adapters

### Template
```typescript
import React, { useMemo, useEffect } from 'react'
import TargetComponent from './TargetComponent'
import projectsJson from '../../data/projects.json'

export default function WorkNewAdapter() {
  // 1. Get data
  const projects = Array.isArray(projectsJson) ? projectsJson : []
  
  // 2. Transform if needed
  const transformed = useMemo(() => {
    return projects.map(p => ({
      // New format
    }))
  }, [projects])
  
  // 3. Apply styles/classes
  useEffect(() => {
    document.body.classList.add('new-layout')
    return () => {
      document.body.classList.remove('new-layout')
    }
  }, [])
  
  // 4. Return with providers
  return (
    <RequiredProvider>
      <TargetComponent data={transformed} />
    </RequiredProvider>
  )
}
```

## 11. Undocumented Grid Systems

### Still Need Documentation
1. **WorkGrid3x3** ❌
   - Fixed 3x3 grid layout
   - Simple implementation
   - No infinite scroll

2. **WorkGridLegacy** ❌
   - Original spotlight implementation
   - First iteration
   - Multi-column masonry

3. **GridGallery** ❌
   - Base grid system
   - Foundation for other grids

4. **WorkGridSimple** ❌
   - Minimal implementation
   - Performance focused

5. **ThreeDFoldGalleryLight** ❌
   - 3D fold effect (currently broken)
   - Signature effect

6. **Horizontal3DGallery** ❌
   - Horizontal wheel scroll (currently broken)
   - 3D perspective

### Already Documented ✅
- GridViewport
- MasonryColumn
- CounterScrollColumn
- TransitionLayer
- SmoothGrid
- ProjectCard
- VideoPreview
- SpotlightContext

## 12. Performance Considerations

### Adapter Overhead
- Minimal - mostly configuration
- Data transformation cached with useMemo
- Style injection happens once
- No runtime performance impact

### Memory Management
```typescript
// Cleanup on unmount
useEffect(() => {
  // Add classes/styles
  return () => {
    // Remove classes/styles
    // Prevent memory leaks
  }
}, [])
```

## 13. Common Issues & Solutions

### Issue: Styles Bleeding Between Layouts
```typescript
// Solution: Explicit cleanup
return () => {
  document.body.classList.remove('layout-specific-class')
  document.getElementById('injected-styles')?.remove()
}
```

### Issue: Scroll Behavior Conflicts
```typescript
// Solution: Reset overflow
useEffect(() => {
  const prevOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden' // or 'auto'
  return () => {
    document.body.style.overflow = prevOverflow
  }
}, [])
```

### Issue: Provider Conflicts
```typescript
// Solution: Check if already provided
const hasProvider = useContext(SomeContext)
if (hasProvider) {
  return <Component />
} else {
  return <Provider><Component /></Provider>
}
```

## TL;DR

**Layout Adapters** are a clever architecture pattern featuring:
- **5 different layouts** for the same /work page
- **Environment variable switching** (no code changes)
- **Data transformation** to match component expectations
- **Style injection** for layout-specific CSS
- **Provider wrapping** for required contexts
- **Clean separation** between data and presentation
- **Zero modification** to original components
- **Isolated side effects** with proper cleanup
- **WorkHorizontalAdapter** transforms for 3D carousel
- **WorkHomeGridAdapter** reuses homepage SmoothGrid
- **WorkGridViewport** adapts 3-column counter-scroll

The adapter pattern allows one page to have multiple completely different visual presentations, selected at build time via environment variables, without duplicating code or modifying the original display components. This creates maximum flexibility with minimal complexity.