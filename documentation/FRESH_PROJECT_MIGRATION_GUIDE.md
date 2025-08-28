
# Fresh Project Migration Guide - Complete File List

**Created:** 2024
**Purpose:** Complete guide for migrating all working, documented components to a fresh project

## 🎯 Quick Start Commands

```bash
# 1. Create new Vite project
npm create vite@latest ravie-portfolio-fresh -- --template react-ts
cd ravie-portfolio-fresh

# 2. Install exact dependencies
npm install \
  framer-motion@^12.15.0 \
  react-router-dom@^7.6.1 \
  clsx@^2.1.1 \
  lucide-react@^0.510.0

# 3. Install dev dependencies
npm install -D \
  @tailwindcss/vite@^4.1.11 \
  tailwindcss@^4.1.7 \
  @types/react@^19.1.11 \
  @types/react-dom@^19.1.2
```

## 📁 Complete File Copy Checklist

### ✅ Core Components (Must Have)

#### Homepage Components
```
□ src/components/homepage/SmoothGrid.tsx
□ src/components/portfolio/ProjectCard.tsx
□ src/components/portfolio/VideoPreview.tsx
□ src/components/portfolio/SpotlightContext.tsx
□ src/components/portfolio/TitleOverlay.tsx
```

#### Portfolio Grid System
```
□ src/components/portfolio/GridViewport.tsx
□ src/components/portfolio/MasonryColumn.tsx
□ src/components/portfolio/CounterScrollColumn.tsx
□ src/components/portfolio/ProjectDetailOverlay.tsx
```

#### Animation Components
```
□ src/components/ScrollReveal.jsx
□ src/components/FloatingNavigation.jsx
□ src/components/InteractiveTimeline.jsx
□ src/components/portfolio/TransitionLayer.tsx
```

#### Layout Adapters
```
□ src/components/portfolio/WorkHorizontalAdapter.tsx
□ src/components/portfolio/WorkHomeGridAdapter.tsx
□ src/components/portfolio/WorkGridViewport.tsx
```

### ✅ Required Hooks

```
□ src/hooks/useVirtualScroll.ts
□ src/hooks/useBreakpoint.ts
□ src/hooks/useInfiniteWrap.ts
□ src/hooks/useScrollVelocity.js
□ src/hooks/useEffects.js
```

### ✅ Providers

```
□ src/providers/ReducedMotionProvider.tsx
```

### ✅ Styles (Critical)

```
□ src/styles/portfolio.css
□ src/styles/homepage.css
□ src/styles/work-cinematic.css
□ src/styles/variables.css
□ src/index.css (main Tailwind imports)
```

### ✅ Data Files

```
□ src/data/projects.json
□ src/data/projects.js (if using JS version)
```

### ✅ Route Components

```
□ src/routes/homepage/index.tsx
□ src/routes/work/index.tsx
□ src/routes/portfolio/index.tsx
```

### ✅ Type Definitions

Create new file: `src/types/index.ts`
```typescript
export interface Project {
  id: string
  title: string
  client?: string
  categories: string[]
  slug: string
  posterSrc: string
  previewSrc: string
  videoUrl?: string
  durationSec?: number
  description?: string
  media?: Array<{
    type: 'image' | 'video'
    src: string
    alt?: string
  }>
}

export interface Section {
  id: string
  label: string
  ref: React.RefObject<HTMLElement>
}
```

## 📄 Configuration Files

### Vite Config (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true
  }
})
```

### Package.json (essential parts)
```json
{
  "name": "ravie-portfolio-fresh",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "framer-motion": "^12.15.0",
    "react-router-dom": "^7.6.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.510.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "@tailwindcss/vite": "^4.1.11",
    "tailwindcss": "^4.1.7",
    "typescript": "^5.9.2",
    "vite": "^7.1.2"
  }
}
```

### Main App Structure (App.tsx)
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ReducedMotionProvider } from './providers/ReducedMotionProvider'
import HomePage from './routes/homepage'
import WorkPage from './routes/work'
import PortfolioPage from './routes/portfolio'

export default function App() {
  return (
    <BrowserRouter>
      <ReducedMotionProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<WorkPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:slug" element={<PortfolioPage />} />
        </Routes>
      </ReducedMotionProvider>
    </BrowserRouter>
  )
}
```

### Main Entry (main.tsx)
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Index CSS (src/index.css)
```css
@import 'tailwindcss';
@import './styles/variables.css';
@import './styles/portfolio.css';
@import './styles/homepage.css';
@import './styles/work-cinematic.css';
```

## 🗂️ Project Structure

```
ravie-portfolio-fresh/
├── public/
│   └── (copy video/image assets as needed)
├── src/
│   ├── components/
│   │   ├── homepage/
│   │   │   └── SmoothGrid.tsx
│   │   ├── portfolio/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── VideoPreview.tsx
│   │   │   ├── SpotlightContext.tsx
│   │   │   ├── GridViewport.tsx
│   │   │   ├── MasonryColumn.tsx
│   │   │   ├── CounterScrollColumn.tsx
│   │   │   ├── TransitionLayer.tsx
│   │   │   ├── ProjectDetailOverlay.tsx
│   │   │   ├── TitleOverlay.tsx
│   │   │   ├── WorkHorizontalAdapter.tsx
│   │   │   ├── WorkHomeGridAdapter.tsx
│   │   │   └── WorkGridViewport.tsx
│   │   ├── ScrollReveal.jsx
│   │   ├── FloatingNavigation.jsx
│   │   └── InteractiveTimeline.jsx
│   ├── data/
│   │   └── projects.json
│   ├── hooks/
│   │   ├── useVirtualScroll.ts
│   │   ├── useBreakpoint.ts
│   │   ├── useInfiniteWrap.ts
│   │   └── useScrollVelocity.js
│   ├── providers/
│   │   └── ReducedMotionProvider.tsx
│   ├── routes/
│   │   ├── homepage/
│   │   │   └── index.tsx
│   │   ├── work/
│   │   │   └── index.tsx
│   │   └── portfolio/
│   │       └── index.tsx
│   ├── styles/
│   │   ├── variables.css
│   │   ├── portfolio.css
│   │   ├── homepage.css
│   │   └── work-cinematic.css
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── documentation/
│   ├── WEBSITE_ARCHITECTURE_OVERVIEW.md
│   ├── HOMEPAGE_TECHNICAL_JOURNEY.md
│   ├── WORK_PAGE_TECHNICAL_JOURNEY.md
│   ├── PROJECT_PAGE_TECHNICAL_JOURNEY.md
│   ├── SMOOTHGRID_TECHNICAL_JOURNEY.md
│   ├── PROJECTCARD_TECHNICAL_JOURNEY.md
│   ├── VIDEOPREVIEW_TECHNICAL_JOURNEY.md
│   ├── SPOTLIGHTCONTEXT_TECHNICAL_JOURNEY.md
│   ├── GRIDVIEWPORT_TECHNICAL_JOURNEY.md
│   ├── MASONRYCOLUMN_TECHNICAL_JOURNEY.md
│   ├── COUNTERSCROLLCOLUMN_TECHNICAL_JOURNEY.md
│   ├── TRANSITIONLAYER_TECHNICAL_JOURNEY.md
│   ├── SCROLLREVEAL_TECHNICAL_JOURNEY.md
│   ├── FLOATINGNAVIGATION_TECHNICAL_JOURNEY.md
│   ├── INTERACTIVETIMELINE_TECHNICAL_JOURNEY.md
│   ├── LAYOUT_ADAPTERS_TECHNICAL_JOURNEY.md
│   └── WORKING_FEATURES_AND_EFFECTS.md
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 Environment Variables

Create `.env.example`:
```bash
# Layout Controls
VITE_WORK_GRID_VIEWPORT=false
VITE_WORK_USE_HOME_GRID=false
VITE_WORK_HORIZ_3D=false
VITE_WORK_3X3=false
VITE_WORK_LEGACY_GRID=false

# Features
VITE_ENABLE_DEBUG=false
```

## 📦 Assets to Copy

### Essential Assets
```
□ public/videos/ (sample videos for testing)
□ public/images/ (poster images)
□ Any fonts used
```

### Sample Data Structure (projects.json)
```json
[
  {
    "id": "project-1",
    "title": "Sample Project",
    "client": "Client Name",
    "categories": ["Video", "Animation"],
    "slug": "sample-project",
    "posterSrc": "/images/poster1.jpg",
    "previewSrc": "/videos/preview1.mp4",
    "videoUrl": "/videos/full1.mp4",
    "description": "Project description here",
    "durationSec": 30
  }
]
```

## 🚀 Testing Commands

```bash
# Test homepage
npm run dev

# Test different work layouts
VITE_WORK_GRID_VIEWPORT=true npm run dev
VITE_WORK_USE_HOME_GRID=true npm run dev

# Build for production
npm run build
npm run preview
```

## ✨ Features Included

### Working Components
- ✅ Homepage with atmospheric effects
- ✅ 3-column counter-scrolling portfolio
- ✅ Video preview system with singleton pattern
- ✅ Spotlight hover coordination
- ✅ Scroll-triggered animations
- ✅ Floating navigation dots
- ✅ Interactive timeline
- ✅ Modal transitions
- ✅ Layout adapter system

### What's Not Included
- ❌ Broken 3D effects (ThreeDFoldGalleryLight, Horizontal3DGallery)
- ❌ Simple grid variations (WorkGrid3x3, WorkGridLegacy)
- ❌ Pages being redesigned (Header, Footer, About, Contact)
- ❌ Authentication system
- ❌ Firebase integration
- ❌ Test infrastructure
- ❌ Dev tools/panels

## 📝 Migration Steps

1. **Create Project**
   - Use commands from Quick Start
   - Setup folder structure

2. **Copy Core Files**
   - Use checklist above
   - Copy in order listed

3. **Copy Styles**
   - All CSS files
   - Ensure imports in index.css

4. **Copy Hooks & Providers**
   - All custom hooks
   - ReducedMotionProvider

5. **Setup Routes**
   - Homepage route
   - Work page with adapters
   - Portfolio route

6. **Add Sample Data**
   - Create projects.json
   - Add test videos/images

7. **Test Each Layout**
   - Homepage
   - Each work layout mode
   - Animations
   - Video playback

## 🎉 Success Criteria

- [ ] Homepage loads with SmoothGrid
- [ ] Videos play on hover
- [ ] Counter-scrolling works
- [ ] Layout switching via ENV works
- [ ] Animations trigger on scroll
- [ ] Modal transitions work
- [ ] No console errors
- [ ] Performance is smooth

## 📚 Documentation

All technical journey documents should be copied to the `documentation/` folder for reference. These contain detailed information about how each component works.

## 💡 Tips

1. Start with homepage - it's the simplest
2. Test each component in isolation first
3. Use sample data before real content
4. Check browser console for errors
5. Reference technical journeys for troubleshooting
6. Keep same folder structure for easy updates

This guide contains everything needed to recreate the working portfolio system in a fresh project!