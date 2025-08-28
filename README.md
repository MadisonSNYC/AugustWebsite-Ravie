# Portfolio Migration Package

This package contains all the working, documented components from the Ravie portfolio website.

## Quick Setup

1. **Create new Vite project:**
```bash
npm create vite@latest my-portfolio -- --template react-ts
cd my-portfolio
```

2. **Install dependencies:**
```bash
npm install framer-motion react-router-dom clsx lucide-react
npm install -D @tailwindcss/vite tailwindcss
```

3. **Copy this package contents:**
- Copy all files from `src/` to your new project's `src/`
- Copy `vite.config.js` to your project root
- Copy dependencies from `package.json`

4. **Run the project:**
```bash
npm run dev
```

## What's Included

### ✅ Working Components
- **Homepage System** - SmoothGrid with atmospheric effects
- **Portfolio Grids** - Counter-scrolling, infinite scroll
- **Video System** - Singleton pattern, lazy loading
- **Animation Layer** - ScrollReveal, FloatingNavigation, Timeline
- **Layout Adapters** - Environment variable switching

### 📁 Folder Structure
```
src/
├── components/
│   ├── homepage/      # Homepage components
│   ├── portfolio/     # All portfolio components
│   └── (animations)   # Animation components
├── hooks/             # Custom React hooks
├── providers/         # Context providers
├── routes/            # Page components
├── styles/            # CSS files
└── data/             # Project data
```

### 📚 Documentation
The `documentation/` folder contains detailed technical journeys for every component.

## Testing Different Layouts

```bash
# Homepage style
VITE_WORK_USE_HOME_GRID=true npm run dev

# 3-column counter-scroll
VITE_WORK_GRID_VIEWPORT=true npm run dev

# Default work page
npm run dev
```

## Key Features
- 3-column counter-scrolling portfolio
- Video preview on hover
- Smooth scroll animations
- Responsive design
- Accessibility features
- Multiple layout modes

## Notes
- All components are fully documented
- No broken/incomplete components included
- Ready for production use
- Minimal dependencies

Happy building! 🚀