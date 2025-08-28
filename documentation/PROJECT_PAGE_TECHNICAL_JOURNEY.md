# Project Page Technical Journey - Ravie Website

**Absolute Path:** `/Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/PROJECT_PAGE_TECHNICAL_JOURNEY.md`
**File URL:** `file:///Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/PROJECT_PAGE_TECHNICAL_JOURNEY.md`
**VS Code:** `code -g /Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/PROJECT_PAGE_TECHNICAL_JOURNEY.md:1`
**Finder:** `open -R "/Users/madisonrayesutton/Ravieco/Mock1M/ravie-website/PROJECT_PAGE_TECHNICAL_JOURNEY.md"`

## 1. Page Identity & Purpose

### Page Identification
- **Routes:** 
  - `/work/:id` - Standard project page
  - `/portfolio/:slug` - Modal/page hybrid
  - `/the-work/:slug` - Legacy route
- **Component Paths:**
  - Main: `/src/pages/ProjectPage.jsx`
  - Content: `/src/pages/ProjectPageContent.jsx`  
  - Modal: `/src/components/portfolio/TransitionLayer.tsx`
- **Display Name:** Project Detail Page
- **URL Patterns:** 
  - `https://domain.com/work/coinbase`
  - `https://domain.com/portfolio/jhene-aiko`

### Primary Purpose
Immersive project case study presentation with hero media, process documentation, results metrics, and related project discovery. Supports both full-page navigation and modal overlay patterns.

### Target User Personas

#### Primary: Prospective Clients
- **Goals:** Understand capabilities, see process, evaluate results
- **Needs:** Detailed case studies, metrics, visual examples
- **Success:** Gains confidence, initiates contact

#### Secondary: Creative Teams
- **Goals:** Evaluate collaboration potential, understand workflow
- **Needs:** Process insights, team credits, technical details
- **Success:** Appreciates expertise, considers partnership

#### Tertiary: Industry Peers
- **Goals:** Technical appreciation, inspiration, benchmarking
- **Needs:** Innovation examples, execution quality, unique approaches
- **Success:** Shares work, follows updates

## 2. Technical User Journey

### Entry Points
```javascript
// Multiple route patterns
<Route path="/work/:id" element={<ProjectPage />} />
<Route path="/portfolio/:slug" element={<PortfolioPage />} />

// Navigation sources
1. Work gallery click
2. Homepage project tile
3. Related projects carousel
4. Direct URL/sharing
5. Search engine result
```

### API Calls and Data Requirements
```typescript
// Static data lookup - no API calls
import { projects } from '../data/projects'

// Project lookup by ID
const foundProject = projects.find(p => p.id === id)

// Data structure
interface Project {
  id: string
  slug?: string
  title: string
  client: string
  clientName?: string
  category: string
  brandColor?: string
  videoUrl?: string
  thumbnail?: string
  description?: string
  services?: string[]
  industries?: string[]
  metrics?: {
    engagement?: string
    views?: string
    conversion?: string
  }
  media?: Array<{
    type: 'video' | 'image'
    src: string
    caption?: string
  }>
  timeline?: TimelineEvent[]
  process?: ProcessStep[]
  relatedProjects?: string[]
}
```

### Authentication/Authorization
- **Required:** None for public projects
- **Optional:** Client-specific projects (future)
- **Analytics:** View tracking, engagement metrics

### State Management Architecture
```typescript
// Component state hierarchy
ProjectPage
├── Local State
│   ├── project: Project | null
│   ├── mounted: boolean (hydration guard)
│   └── CSS Variables (--project-accent)
└── ProjectPageContent
    ├── Refs (scroll tracking)
    │   ├── containerRef
    │   ├── heroRef
    │   ├── aboutRef
    │   ├── deliverablesRef
    │   ├── processRef
    │   └── resultsRef
    ├── Scroll State
    │   ├── scrollYProgress
    │   ├── activeSection (scroll spy)
    │   └── Animation transforms
    └── Memoized Data
        ├── teamMembers
        └── sectionNav

// Modal variant (portfolio route)
PortfolioPage
├── ReducedMotionProvider
├── GridViewport (background)
└── TransitionLayer (modal)
    ├── slug prop
    ├── onClose callback
    └── prefersReducedMotion
```

### Exit Points and Transitions
```typescript
// Navigation patterns
1. Back to Work button → navigate('/work')
2. Related project click → navigate(`/work/${relatedId}`)
3. Modal close → router.back() or navigate to background
4. Header navigation → standard routes
5. Contact CTA → navigate('/contact')

// Cleanup on unmount
return () => {
  document.documentElement.style.removeProperty('--project-accent')
}
```

## 3. User Journey & Interactions

### User Goals Hierarchy
1. **Project Understanding** - Grasp scope and outcome
2. **Process Discovery** - Learn approach and methodology
3. **Results Validation** - See impact and metrics
4. **Team Recognition** - Identify collaborators
5. **Next Action** - Contact or explore more

### Key User Actions and Workflows

#### Scroll-Driven Experience
```typescript
// Parallax hero animation
const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100])
const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3])

// Progress indicator
const progressBar = useSpring(scrollYProgress, { 
  stiffness: 400, 
  damping: 90 
})

// Smooth section scrolling
scrollToSection = (sectionRef) => {
  sectionRef.current?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  })
}
```

#### Floating Navigation
```typescript
// Scroll spy for active section
const activeSection = useScrollSpy(sectionNav)

// Section configuration
const sectionNav = [
  { id: 'hero', label: 'Top', ref: heroRef },
  { id: 'about', label: 'About', ref: aboutRef },
  { id: 'deliverables', label: 'Deliverables', ref: deliverablesRef },
  { id: 'process', label: 'Process', ref: processRef },
  { id: 'results', label: 'Results', ref: resultsRef }
]
```

#### Modal vs Page Navigation
```typescript
// Modal route (portfolio)
<Link 
  to={`/portfolio/${project.slug}`} 
  state={{ background: location }}
>
  // Opens as modal overlay

// Standard route (work)  
<Link to={`/work/${project.id}`}>
  // Full page navigation
```

### Success Scenarios
- **Engagement:** Watches hero video, scrolls to process
- **Understanding:** Reads case study, views metrics
- **Exploration:** Clicks related projects
- **Conversion:** Uses contact CTA or nav

### Error Scenarios and Recovery
```typescript
// Project not found
if (!foundProject) {
  navigate('/work') // Redirect to gallery
}

// Hydration mismatch prevention
if (!mounted) {
  return <LoadingState />
}

// Video loading failure
<video onError={(e) => {
  console.error('Video failed to load')
  // Show poster image fallback
}} />

// Missing data fallbacks
services: project.services || ['Product Launch', 'Brand Design']
industries: project.industries || ['Entertainment', 'Web3 & AI']
clientName: project.clientName || "Marketing Director"
```

### Edge Cases
1. **Direct URL Access:** Project loads without gallery context
2. **Invalid Project ID:** Redirects to work gallery
3. **Slow Media Loading:** Progressive enhancement with placeholders
4. **Back Navigation:** Preserves scroll position with state
5. **Modal on Mobile:** Falls back to full page navigation

## 4. Components & Layout

### Component Hierarchy
```
ProjectPage (pages/ProjectPage.jsx)
├── Loading States (2 variations)
└── ProjectPageContent (pages/ProjectPageContent.jsx)
    ├── Progress Bar (motion.div)
    ├── FloatingNavigation
    │   └── Section dots with labels
    ├── Sticky Sub-Header
    │   ├── Back button
    │   └── Project breadcrumb
    ├── ProjectHero
    │   ├── Video/Image media
    │   ├── Title overlay
    │   └── Parallax transforms
    ├── Results Section
    │   ├── ScrollReveal wrapper
    │   ├── MetricCards (3)
    │   └── Testimonial
    ├── Tags Section
    │   ├── Service tags
    │   └── Industry tags
    ├── About Section
    │   └── ScrollReveal content
    ├── Deliverables Section
    │   └── Media grid
    ├── Process Section
    │   ├── InteractiveTimeline
    │   └── ProcessVisualization
    ├── Team Section
    │   └── Team member cards
    ├── RelatedProjectsCarousel
    └── ProjectEndCTA
```

### Reusable Components
```typescript
// UI Components
- ScrollReveal: components/ScrollReveal.jsx
- MetricCard: components/MetricCard.jsx
- FloatingNavigation: components/FloatingNavigation.jsx
- ProjectHero: components/ProjectHero.jsx
- ProjectEndCTA: components/ProjectEndCTA.jsx
- InteractiveTimeline: components/InteractiveTimeline.jsx
- ProcessVisualization: components/ProcessVisualization.jsx
- RelatedProjectsCarousel: components/RelatedProjectsCarousel.jsx

// Hooks
- useScrollSpy: hooks/useScrollSpy.js
- useModalRoute: hooks/useModalRoute.js
```

### Layout Structure
```css
/* Full viewport sections */
.project-hero {
  min-height: 100vh;
  position: relative;
}

/* Sticky navigation layers */
.sticky.top-20 {
  top: 80px; /* Below main nav */
  z-index: 30;
}

/* Max width content containers */
.max-w-7xl {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Wide padding system */
.px-10.md:px-20.lg:px-44 {
  /* Matches homepage spacing */
  padding-left: 2.5rem;  /* Mobile */
  padding-left: 5rem;    /* Tablet */
  padding-left: 11rem;   /* Desktop */
}
```

### Responsive Breakpoints
```css
/* Mobile First */
@media (max-width: 768px) {
  /* Stack metrics vertically */
  /* Hide testimonial */
  /* Simplify navigation */
}

@media (min-width: 769px) {
  /* Horizontal metrics */
  /* Show floating nav */
}

@media (min-width: 1024px) {
  /* Full layout with sidebars */
  /* Enhanced animations */
}
```

## 5. Data & Integrations

### Data Models/Schemas
```typescript
// Timeline event structure
interface TimelineEvent {
  date: string
  title: string
  description: string
  milestone?: boolean
}

// Process step structure
interface ProcessStep {
  phase: string
  title: string
  description: string
  deliverables: string[]
  duration: string
}

// Media item structure
interface MediaItem {
  type: 'video' | 'image'
  src: string
  caption?: string
  thumbnail?: string
}

// Metric structure
interface Metric {
  value: string
  label: string
  change?: string
  icon?: string
}
```

### External Service Integrations
- **None currently** - All data is static
- **Future integrations:**
  - Video hosting (Vimeo, Mux)
  - Analytics events
  - Social sharing APIs
  - Client feedback systems

### Real-time Updates
- **Not implemented** - Static project data
- **Potential real-time features:**
  - Live view counts
  - Real-time comments
  - Collaborative annotations

### Caching Strategies
```javascript
// Memoization for expensive computations
const teamMembers = useMemo(() => [...], [])
const sectionNav = useMemo(() => [...], [])

// Media caching
<video preload="metadata" />
<img loading="lazy" />

// Navigation state preservation
state={{ background: location }} // For back button
```

## 6. Business Logic

### Validation Rules
```typescript
// Project validation
if (!foundProject) {
  navigate('/work') // Redirect if invalid
}

// Mounted state check (SSR hydration)
if (!mounted) {
  return <LoadingState />
}

// Data fallbacks
const services = project.services || DEFAULT_SERVICES
const metrics = project.metrics || DEFAULT_METRICS
```

### Calculations and Transformations
```typescript
// Scroll progress (0 to 1)
const scrollYProgress = useScroll({
  target: containerRef,
  offset: ["start start", "end end"]
})

// Parallax calculations
heroY: [0, 0.5] → [0, -100]  // 50% scroll = -100px Y
heroOpacity: [0, 0.3] → [1, 0.3] // 30% scroll = 30% opacity

// Spring physics for smooth progress
const progressBar = useSpring(scrollYProgress, { 
  stiffness: 400,  // Response speed
  damping: 90      // Oscillation control
})

// Section visibility calculation (scroll spy)
const isInView = (element) => {
  const rect = element.getBoundingClientRect()
  return rect.top <= window.innerHeight / 2 && 
         rect.bottom >= window.innerHeight / 2
}
```

### Conditional Rendering Logic
```typescript
// Brand color adaptation
document.documentElement.style.setProperty(
  '--project-accent', 
  foundProject.brandColor || '#8B5CF6'
)

// Service tags rendering
{(project.services || DEFAULT_SERVICES).map(service => (
  <Tag key={service}>{service}</Tag>
))}

// Metric display logic
{project.metrics?.engagement && (
  <MetricCard value={project.metrics.engagement} />
)}

// Video vs Image hero
{project.videoUrl ? (
  <video src={project.videoUrl} />
) : (
  <img src={project.thumbnail} />
)}
```

### Performance Requirements
```javascript
// Performance targets
- Initial Load: < 1.5s
- Hero Media Start: < 2s
- Smooth Scroll: 60fps
- Parallax: GPU accelerated
- Section Transitions: < 200ms

// Optimization techniques
1. Lazy load below-fold content
2. Memoize expensive computations
3. Use CSS transforms for animations
4. Preload critical media
5. Progressive image loading
6. Debounce scroll handlers
```

## 🎬 Hero Section Implementation

### Video Background Strategy
```typescript
// Optimal video configuration
<video
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster={project.thumbnail}
>
  <source src={`${project.videoUrl}.webm`} type="video/webm" />
  <source src={`${project.videoUrl}.mp4`} type="video/mp4" />
</video>

// Parallax animation
<motion.div
  style={{
    y: heroY,
    opacity: heroOpacity
  }}
  className="absolute inset-0"
>
```

## 📊 Metrics & Results Section

### Impact Display Pattern
```typescript
// Glowing border container
<div className="relative p-6 rounded-xl bg-black/30 backdrop-blur-sm 
            border border-gray-400/20 
            shadow-[0_0_20px_rgba(156,163,175,0.2)]">
  
  {/* Metrics grid */}
  <div className="flex gap-8">
    <MetricDisplay value="250%" label="Increase in engagement" />
    <MetricDisplay value="3M+" label="Video views" />
    <MetricDisplay value="45%" label="Conversion rate boost" />
  </div>
  
  {/* Testimonial */}
  <blockquote className="italic text-white/80">
    "{testimonial}"
  </blockquote>
</div>
```

## 🔄 Navigation Patterns

### Floating Dots Navigation
```typescript
// Sticky sidebar navigation
<FloatingNavigation 
  sections={[
    { id: 'hero', label: 'Top', ref: heroRef },
    { id: 'about', label: 'About', ref: aboutRef },
    // ...
  ]}
  activeSection={activeSection}
  onSectionClick={scrollToSection}
/>

// Visual states
.dot {
  opacity: 0.3;
  scale: 1;
}
.dot.active {
  opacity: 1;
  scale: 1.5;
}
```

### Modal vs Page Routes
```typescript
// Modal pattern (portfolio route)
if (slug) {
  return (
    <TransitionLayer
      projects={projects}
      slug={slug}
      onClose={() => navigate(-1)}
    />
  )
}

// Page pattern (work route)
return <ProjectPageContent project={project} />
```

## 🚀 Performance Optimizations

### Critical Rendering Path
```javascript
// 1. Immediate shell render
if (!mounted) return <LoadingState />

// 2. Hero media priority
<video preload="auto" priority="high" />

// 3. Progressive content loading
<ScrollReveal threshold={0.1}>
  {/* Content reveals on scroll */}
</ScrollReveal>

// 4. Lazy load below fold
const ProcessSection = lazy(() => import('./ProcessSection'))
```

### Animation Performance
```css
/* GPU-accelerated properties only */
.parallax {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU layer */
}

/* Reduce motion support */
@media (prefers-reduced-motion: reduce) {
  .parallax {
    transform: none !important;
  }
}
```

## TL;DR

- **Dual Navigation:** Full page (`/work/:id`) or modal (`/portfolio/:slug`)
- **Static Data:** No API calls, projects from JSON
- **Scroll-Driven:** Parallax hero, progress bar, section spy
- **Rich Sections:** Hero, metrics, process, team, related
- **Performance:** Memoized data, lazy loading, GPU animations
- **Responsive:** Mobile-first with progressive enhancement
- **No Auth:** Public access, optional future gates
- **Fallbacks:** Graceful handling of missing data

## Quick Reference

```bash
# Component locations
Main: src/pages/ProjectPage.jsx
Content: src/pages/ProjectPageContent.jsx
Hero: src/components/ProjectHero.jsx
Modal: src/components/portfolio/TransitionLayer.tsx

# Routes
/work/:id - Standard page
/portfolio/:slug - Modal overlay
/the-work/:slug - Legacy route

# Key features
- Parallax hero animations
- Floating dot navigation
- Scroll spy sections
- Impact metrics display
- Related projects carousel
```