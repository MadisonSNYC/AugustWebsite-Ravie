# Ravie Portfolio Website

A premium React portfolio website featuring advanced scroll effects, 3D animations, and sophisticated video preview systems. Built with React 19, Vite 7, and modern web technologies.

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation
```bash
# Clone repository
git clone https://github.com/MadisonSNYC/AugustWebsite-Ravie.git
cd AugustWebsite-Ravie

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration
Copy `.env.example` to `.env` and configure as needed:
```bash
cp .env.example .env
```

## 📜 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run dev:portfolio` - Alternative dev command
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Testing
- `npm run test` - Run unit tests (Vitest)
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate test coverage
- `npm run e2e` - Run Playwright E2E tests
- `npm run e2e:ui` - Run E2E tests with UI
- `npm run e2e:update` - Update test snapshots

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── header/          # Navigation header variants
│   │   ├── _archive/    # Archived implementations  
│   │   ├── _shared/     # Shared header logic
│   │   └── left-vertical/ # Active header variant
│   ├── homepage/        # Homepage-specific components
│   ├── intro/           # Intro sequence components
│   ├── portfolio/       # Portfolio grid systems
│   └── (other components)
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── providers/           # Context providers
├── routes/              # Route components
├── styles/              # Global CSS styles
├── data/                # Static data (projects, etc.)
└── types/               # TypeScript type definitions

task-md/                 # Task management & documentation
├── TASK-PROTOCOL.md     # Development workflow protocol
├── Task.md              # Active task tracking
└── (task plans)

documentation/           # Technical documentation
tests/                   # E2E and integration tests
```

## ✨ Key Features

### Advanced Scroll Systems
- **Counter-scrolling grids** - 3-column portfolios with opposing scroll directions
- **Infinite scroll** - Seamless content loading with triple duplication
- **Smooth animations** - 60fps GPU-accelerated scroll effects
- **Virtual scrolling** - Performance-optimized for large content sets

### Interactive Elements
- **Video previews** - Hover-triggered video playback with singleton pattern
- **3D transforms** - Perspective-based card rotations and depth effects
- **Spotlight coordination** - Global hover state management
- **Keyboard navigation** - Full accessibility support

### Layout Systems
Environment-controlled layout switching:
```bash
# Homepage-style grid
VITE_WORK_USE_HOME_GRID=true npm run dev

# 3-column counter-scroll (default)
VITE_WORK_GRID_VIEWPORT=true npm run dev

# Legacy layouts
VITE_WORK_LEGACY=true npm run dev
VITE_WORK_3X3=true npm run dev
```

### Performance Features
- **Code splitting** - Lazy-loaded routes and components
- **Image optimization** - WebP with fallbacks
- **Bundle optimization** - Tree-shaking and compression
- **Memory management** - Automatic cleanup of video resources

## 🎨 Design System

### Core Technologies
- **React 19.1.1** - UI framework with latest features
- **Vite 7.1.2** - Lightning-fast build tool  
- **Framer Motion 12.15.0** - Advanced animations
- **Tailwind CSS 4.1.7** - Utility-first styling
- **TypeScript 5.9.2** - Type safety

### Animation Principles  
- **Duration:** 200-600ms for interactions
- **Easing:** cubic-bezier(0.23, 1, 0.32, 1)
- **GPU acceleration:** transform/opacity only
- **Reduced motion:** Respects user preferences

### Safe-Space Architecture
- **No deletions:** Old implementations preserved in `_archive/`
- **No duplicates:** Shared logic extracted to `_shared/`
- **CSP compliance:** No unsafe-inline styles or scripts
- **A11y standards:** WCAG 2.1 compliant

## 🧪 Testing Strategy

### Unit Testing (Vitest)
- Component behavior testing
- Hook functionality testing
- Utility function testing

### E2E Testing (Playwright)
- Cross-browser compatibility (Chrome, Firefox, Safari)
- User flow validation
- Performance monitoring
- Visual regression testing

### Accessibility Testing
- Keyboard navigation
- Screen reader compatibility
- Color contrast validation
- Reduced motion support

## 📈 Performance Targets

### Core Web Vitals
- **LCP:** < 2.5s (Largest Contentful Paint)
- **FID:** < 100ms (First Input Delay)
- **CLS:** < 0.1 (Cumulative Layout Shift)
- **FPS:** 60fps for all animations

### Bundle Optimization
- Main bundle: < 200KB gzipped
- Route-based code splitting
- Dynamic imports for heavy components
- Asset compression and caching

## 🔧 Development Workflow

This project follows **TASK Protocol** for development:

1. **Branch Creation** - `feat/<feature>`, `fix/<issue>`, `chore/<task>`
2. **Phase-Level Gates** - Each phase requires verification before proceeding
3. **Performance Pre-Checks** - Analysis before each phase completion
4. **Safe-Space Replacement** - No destructive changes, always preserve old code

See `task-md/TASK-PROTOCOL.md` for complete workflow details.

## 📚 Documentation

### Technical Journeys
Complete documentation available in `documentation/`:
- Component architecture deep-dives
- Performance optimization guides  
- Animation system explanations
- Accessibility implementation details

### Key Documentation Files
- `WEBSITE_ARCHITECTURE_OVERVIEW.md` - High-level system overview
- `WORKING_FEATURES_AND_EFFECTS.md` - Feature inventory and status
- `HOMEPAGE_TECHNICAL_JOURNEY.md` - Homepage implementation details
- `WORK_PAGE_TECHNICAL_JOURNEY.md` - Portfolio system documentation

## 🚨 Development Guidelines

### Code Style
- 200-line file length limit (split larger files)
- 60-line function length maximum
- One responsibility per file
- Surgical edits only - preserve existing patterns

### Performance Rules
- Cache repeated API calls
- Memoize expensive renders  
- Use code splitting for large components
- Optimize assets (images, videos)

### Accessibility Requirements
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Reduced motion fallbacks

## 🤝 Contributing

1. Follow TASK Protocol workflow
2. Create feature branches from `main`
3. Write tests for new functionality
4. Update documentation for changes
5. Ensure performance targets are met
6. Request verification before merging

## 📝 License

This project is private and proprietary to Ravie.

---

## 📞 Support

For development questions or issues:
- Review `task-md/` documentation
- Check `documentation/` technical guides  
- Follow TASK Protocol for new features

**Happy building!** 🚀