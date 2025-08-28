# 📚 Components and Effects Overview

## 🎨 Core Visual Effects

### 1. Counter-Scrolling Columns (GridViewport)
**Location**: `src/components/portfolio/GridViewport.tsx` (Lines 64-66)
**Pattern**: `['up', 'down', 'up']` for desktop
```typescript
const directionsDesktop: Array<'up' | 'down'> = ['up', 'down', 'up']
```
- Column 1: Scrolls UP (inverted)
- Column 2: Scrolls DOWN (normal)  
- Column 3: Scrolls UP (inverted)
- Creates dynamic counter-movement effect
- Mobile fallback: All columns scroll down

### 2. Infinite Scroll Implementation (MasonryColumn)
**Location**: `src/components/portfolio/MasonryColumn.tsx`
- Triple content duplication (top, middle, bottom)
- Seamless teleportation at boundaries
- RAF-throttled updates for 60fps
- GPU-accelerated transforms

### 3. Atmospheric Effects (SmoothGrid)
**Location**: `src/styles/homepage.css`
- 6 CSS layers creating depth
- Animated smoke overlays
- Radial gradients for lighting
- Pure CSS, no JavaScript overhead

### 4. Video Preview System
**Location**: `src/components/portfolio/VideoPreview.tsx`
- Singleton pattern (one video at a time)
- 100ms hover delay
- 250ms cleanup delay
- Memory optimization with src cleanup

---

## 🏗️ Component Architecture

### Homepage Components

#### SmoothGrid
**File**: `src/components/homepage/SmoothGrid.tsx`
**Purpose**: Single-column infinite-feel scroll with atmospheric effects
**Key Features**:
- Spring-based reveal animations
- 90vw wide tiles
- 64vh height per card
- Framer Motion physics

#### ProjectCard  
**File**: `src/components/portfolio/ProjectCard.tsx`
**Purpose**: Individual project display with hover interactions
**Key Features**:
- Video preview on hover
- Gradient overlays
- Category badges
- Link to project details

### Portfolio Grid Components

#### GridViewport
**File**: `src/components/portfolio/GridViewport.tsx`
**Purpose**: 3-column counter-scrolling grid (main portfolio layout)
**Key Features**:
- Counter-scroll pattern: up-down-up
- Sticky viewport technique
- Responsive breakpoints
- Virtual scroll for performance

#### MasonryColumn
**File**: `src/components/portfolio/MasonryColumn.tsx`
**Purpose**: Individual column with infinite scroll mechanics
**Key Features**:
- Triple content duplication
- Seamless wrap-around
- Direction control (up/down)
- Phase staggering

#### CounterScrollColumn
**File**: `src/components/portfolio/CounterScrollColumn.tsx`
**Purpose**: Alternative column implementation
**Key Features**:
- Similar to MasonryColumn
- Different scroll physics
- Used in experimental layouts

### Support Components

#### SpotlightContext
**File**: `src/components/portfolio/SpotlightContext.tsx`
**Purpose**: Global hover state coordination
**Key Features**:
- Prevents multiple videos playing
- Coordinates hover states across cards
- Performance optimized

#### VideoPreview
**File**: `src/components/portfolio/VideoPreview.tsx`
**Purpose**: Singleton video player for previews
**Key Features**:
- Memory management
- Auto-play on hover
- Cleanup on leave
- Native HTML5 API

#### TitleOverlay
**File**: `src/components/portfolio/TitleOverlay.tsx`
**Purpose**: Project title display overlay
**Key Features**:
- Animated entrance
- Typography hierarchy
- Category display

#### TransitionLayer
**File**: `src/components/portfolio/TransitionLayer.tsx`
**Purpose**: Modal and route transition orchestration
**Key Features**:
- AnimatePresence integration
- Exit animations
- Smooth transitions

---

## 🎭 Animation Systems

### ScrollReveal
**File**: `src/components/ScrollReveal.jsx`
**Purpose**: Scroll-triggered animations
**Technique**: IntersectionObserver API
**Features**:
- Fade in on viewport entry
- Configurable thresholds
- Performance optimized

### FloatingNavigation
**File**: `src/components/FloatingNavigation.jsx`
**Purpose**: Navigation dots with scroll spy
**Features**:
- Active section tracking
- Smooth scroll to section
- Visual feedback

### InteractiveTimeline
**File**: `src/components/InteractiveTimeline.jsx`
**Purpose**: Project timeline visualization
**Features**:
- SVG-based graphics
- Framer Motion animations
- Interactive hover states

---

## 🔄 Layout Adapters

### WorkHomeGridAdapter
**File**: `src/components/portfolio/WorkHomeGridAdapter.tsx`
**Purpose**: Adapts work page to use homepage grid
**Usage**: `VITE_WORK_USE_HOME_GRID=true`

### WorkHorizontalAdapter
**File**: `src/components/portfolio/WorkHorizontalAdapter.tsx`
**Purpose**: Adapts for horizontal 3D gallery
**Usage**: `VITE_WORK_HORIZ_3D=true`
**Status**: Experimental

### WorkGridViewport
**File**: `src/components/portfolio/WorkGridViewport.tsx`
**Purpose**: Main work grid orchestrator
**Features**:
- Environment variable switching
- Multiple layout support
- Data transformation

---

## 🪝 Custom Hooks

### Motion & Scroll Hooks

#### useCounterScroll
**File**: `src/hooks/useCounterScroll.ts`
**Purpose**: Counter-scrolling physics management
**Features**:
- RAF throttling
- Smooth interpolation
- Direction control

#### useInfiniteWrap
**File**: `src/hooks/useInfiniteWrap.ts`
**Purpose**: Infinite scroll boundary detection
**Features**:
- Teleportation logic
- Seamless wrapping
- Boundary detection

#### useVirtualScroll
**File**: `src/hooks/useVirtualScroll.ts`
**Purpose**: Virtual scrolling for performance
**Features**:
- Momentum physics
- Touch support
- Friction control

#### useScrollDriver
**File**: `src/hooks/useScrollDriver.ts`
**Purpose**: Scroll-based animation driver
**Features**:
- Progress tracking
- Animation timing
- Performance optimized

### Utility Hooks

#### useReducedMotion
**File**: `src/hooks/useReducedMotion.ts`
**Purpose**: Accessibility for motion preferences
**Features**:
- System preference detection
- Fallback animations
- WCAG compliance

#### useBreakpoint
**File**: `src/hooks/useBreakpoint.ts`
**Purpose**: Responsive design utilities
**Features**:
- Media query matching
- SSR safe
- React-optimized

#### useIntersectionVideo
**File**: `src/hooks/useIntersectionVideo.ts`
**Purpose**: Video playback on viewport entry
**Features**:
- Intersection Observer
- Play/pause control
- Memory management

---

## 🎨 CSS Architecture

### Core Stylesheets

#### homepage.css
**Purpose**: Homepage-specific styles and atmospheric effects
**Key Features**:
- 6-layer gradient system
- Smoke animations
- Grid layouts
- Responsive styles

#### portfolio.css
**Purpose**: Portfolio grid and card styles
**Features**:
- Counter-scroll styles
- Card hover effects
- Video preview styles

#### variables.css
**Purpose**: Design system variables
**Contents**:
- Color palette
- Spacing scales
- Typography scales
- Animation timing

#### work-cinematic.css
**Purpose**: Cinematic effects for work page
**Features**:
- Dramatic transitions
- Enhanced hover states
- Visual effects

---

## 🚀 Performance Optimizations

### Rendering Optimizations
- GPU-accelerated transforms (`transform: translateY()`)
- RAF throttling (60fps cap)
- Will-change hints for animations
- CSS containment for reflow prevention

### Memory Management
- Singleton video pattern
- Component lazy loading
- Image lazy loading
- Cleanup on unmount

### Bundle Optimizations
- Code splitting by route
- Tree shaking enabled
- CSS purging with Tailwind
- Dynamic imports

---

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px (single column)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

### Mobile Adaptations
- Single column layout
- Reduced animations
- Touch-optimized interactions
- Simplified effects

### Desktop Features
- Full counter-scrolling
- All atmospheric effects
- Video previews
- Complex animations

---

## 🔧 Environment Variables

### Layout Control
```bash
VITE_WORK_GRID_VIEWPORT=true    # 3-column counter-scroll
VITE_WORK_USE_HOME_GRID=true    # Homepage style
VITE_WORK_HORIZ_3D=true         # Horizontal 3D (experimental)
VITE_WORK_3X3=false              # 3x3 grid (not implemented)
VITE_WORK_LEGACY_GRID=false     # Legacy grid (deprecated)
```

### Debug Features
```bash
VITE_ENABLE_DEBUG=true          # Debug panels and logs
```

---

## 🎯 Key Interactions

### Hover System
- 100ms delay before triggering
- Video preview activation
- Card scale transform
- Gradient overlay fade

### Scroll Interactions
- Counter-scrolling columns
- Parallax effects
- Reveal animations
- Progress tracking

### Click Interactions
- Route navigation
- Modal opening
- Video controls
- Filter toggles

---

## 📊 Component Statistics

| Component Type | Count | Lines of Code | Complexity |
|----------------|-------|---------------|------------|
| Page Components | 5 | ~1,500 | Medium |
| Grid Components | 6 | ~2,000 | High |
| Animation Components | 3 | ~500 | Low |
| Support Components | 8 | ~1,200 | Medium |
| Hooks | 13 | ~1,800 | High |
| Adapters | 3 | ~400 | Low |
| **TOTAL** | **38** | **~7,400** | **Medium-High** |

---

## 🔄 Data Flow

```
projects.json
    ↓
WorkPage/HomePage
    ↓
Layout Adapter (based on ENV)
    ↓
GridViewport/SmoothGrid
    ↓
MasonryColumn (×3)
    ↓
ProjectCard (×n)
    ↓
VideoPreview (singleton)
```

---

## ✨ Special Effects Summary

1. **Counter-Scrolling**: Columns move in opposite directions
2. **Infinite Scroll**: Seamless content loop
3. **Atmospheric Layers**: 6 CSS gradient/smoke layers
4. **Spring Physics**: Natural motion with Framer Motion
5. **Singleton Video**: Memory-optimized preview system
6. **Sticky Viewport**: Smooth native scrolling
7. **Phase Staggering**: 33% offset per column
8. **RAF Throttling**: 60fps performance cap
9. **Virtual Scroll**: Momentum-based scrolling
10. **Intersection Animations**: Viewport-triggered reveals