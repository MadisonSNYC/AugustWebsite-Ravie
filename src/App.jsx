import './App.css'
import { lazy, Suspense, useState } from 'react'
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom'
import React from 'react'
// import Header from './components/HeaderFrosted' // Archived at _archive/classic/
import { HeaderLeftVertical } from './components/header/left-vertical'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from './components/ScrollToTop'
import { IntroSequence } from './components/intro'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./routes/homepage/index'))
const WorkPage = lazy(() => import('./pages/WorkPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const AboutPageNew = lazy(() => import('./pages/AboutPageNew'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const ProjectDirectory = lazy(() => import('./components/ProjectDirectory'))
const PortfolioPage = lazy(() => import('./routes/portfolio/index'))
// Dev routes - using placeholders for now (these are experimental/in-progress)
const DevPlaceholder = lazy(() => import('./routes/dev/placeholder').then(m => ({ default: m.DevPlaceholder })))
const CoderopsPure = DevPlaceholder
const CodropsWorking = DevPlaceholder
const Working3DFold = DevPlaceholder
const Reversed3DFoldTemplateFixed = DevPlaceholder
const Reversed3DFoldStatic = DevPlaceholder
const PortfolioInfiniteScroll = DevPlaceholder
const PortfolioInfiniteScrollFixed = DevPlaceholder
const PortfolioMinimal = DevPlaceholder
const PortfolioInfiniteScrollDebug = DevPlaceholder
const TestPortfolio = DevPlaceholder
const Backup3DLight = DevPlaceholder
const AuthPlayground = DevPlaceholder
const PortfolioHorizontal = DevPlaceholder
const Grid3DPerspective = DevPlaceholder
const Grid3DInfiniteScroll = DevPlaceholder
const Grid3DScrollFixed = DevPlaceholder
const DevDashboard = DevPlaceholder
const WorkIndex = lazy(() => import('./routes/work'))

// Redirect component for legacy portfolio route
const PortfolioRedirect = () => {
  const navigate = useNavigate()
  React.useEffect(() => {
    navigate('/work', { replace: true })
  }, [navigate])
  return null
}

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-white/60">Loading...</p>
    </div>
  </div>
)

function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const location = useLocation()

  return (
    <ErrorBoundary fallbackMessage="The application encountered an error. Please refresh the page to continue.">
      {/* Intro Sequence Overlay - Commented out for debugging */}
      {/* <IntroSequence onComplete={() => setIntroComplete(true)} /> */}
      
      {/* Navigation Selection - Dev Override (DISABLED) */}
      {/* To enable classic header for demos, uncomment this block:
      {window.location.search.includes('nav=classic') ? (
        <ClassicHeader /> // Import from _archive/classic/ if needed
      ) : (
        <HeaderLeftVertical />
      )}
      */}
      
      {/* Active Navigation - Left Vertical */}
      <HeaderLeftVertical />

      {/* Main App Content */}
      <div className="min-h-screen bg-black" id="main-content" tabIndex={-1}>
        <ScrollToTop />
        {/* Project Directory Sidebar - Temporarily Hidden */}
        {/* <Suspense fallback={<div className="w-12 h-12" />}>
          <ProjectDirectory />
        </Suspense> */}
        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/:slug" element={<PortfolioPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/work" element={<WorkIndex />} />
              <Route path="/work/:id" element={<ProjectPage />} />
              <Route path="/portfolio" element={<PortfolioRedirect />} />
              <Route path="/portfolio/:slug" element={<PortfolioPage />} />
              <Route path="/about" element={<AboutPageNew />} />
              <Route path="/about-old" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/dev/codrops" element={<CoderopsPure />} />
              <Route path="/dev/working" element={<CodropsWorking />} />
              <Route path="/dev/3dfold" element={<Working3DFold />} />
              <Route path="/dev/reversed-fixed" element={<Reversed3DFoldTemplateFixed />} />
              <Route path="/dev/reversed-static" element={<Reversed3DFoldStatic />} />
              <Route path="/dev/portfolio-infinite" element={<PortfolioInfiniteScroll />} />
              <Route path="/dev/portfolio-minimal" element={<PortfolioMinimal />} />
              <Route path="/dev/portfolio-infinite-fixed" element={<PortfolioInfiniteScrollFixed />} />
              <Route path="/dev/portfolio-infinite-debug" element={<PortfolioInfiniteScrollDebug />} />
              <Route path="/dev/test-portfolio" element={<TestPortfolio />} />
              <Route path="/dev/backup-3d-light" element={<Backup3DLight />} />
              <Route path="/dev/auth" element={<AuthPlayground />} />
              <Route path="/dev/portfolio-horizontal" element={<PortfolioHorizontal />} />
              <Route path="/dev/3d-grid" element={<Grid3DPerspective />} />
              <Route path="/dev/3d-infinite" element={<Grid3DInfiniteScroll />} />
              <Route path="/dev/3d-scroll-fixed" element={<Grid3DScrollFixed />} />
              <Route path="/dev/dashboard" element={<DevDashboard />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default App