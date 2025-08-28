import React, { useEffect } from 'react'
import { ReducedMotionProvider } from '../../providers/ReducedMotionProvider'
import { GridViewport } from './GridViewport'
import projectsJson from '../../data/projects.json'
import '../../styles/portfolio.css'
import '../../styles/work-cinematic.css'

/**
 * Work page adapter for GridViewport
 * Uses the same infinite scroll system as portfolio but for /work route
 */
export default function WorkGridViewport() {
  const projects = Array.isArray(projectsJson) ? projectsJson : []
  
  useEffect(() => {
    // Apply the same CSS classes as portfolio route for proper scrolling
    document.body.classList.add('cinematic-tiles')
    document.documentElement.classList.add('no-scrollbars')
    document.body.classList.add('no-scrollbars')
    
    // Ensure critical styles are applied
    const id = 'work-grid-viewport-critical'
    if (!document.getElementById(id)) {
      const style = document.createElement('style')
      style.id = id
      style.textContent = `
        :root { --nav-height: 64px; }
        .portfolio-scroll { 
          height: auto;
          min-height: 300vh;
          overflow: visible;
        }
        .portfolio-viewport { 
          position: sticky; 
          top: var(--nav-height, 0px); 
          height: calc(100vh - var(--nav-height, 0px)); 
          overflow: hidden; 
        }
        .portfolio-grid { 
          width: 100%; 
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding: 20px;
        }
        .portfolio-tile { 
          width: 100%;
          aspect-ratio: 2.5 / 1 !important;
          height: auto !important;
          position: relative;
          overflow: hidden;
          background: #000;
          border-radius: 8px;
        }
        .portfolio-tile > * {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
        .masonry-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }
        @media (max-width: 768px) {
          .portfolio-grid {
            grid-template-columns: 1fr;
          }
        }
      `
      document.head.appendChild(style)
    }
    
    return () => {
      document.body.classList.remove('cinematic-tiles')
      document.documentElement.classList.remove('no-scrollbars')
      document.body.classList.remove('no-scrollbars')
      const el = document.getElementById(id)
      if (el) el.remove()
    }
  }, [])
  
  return (
    <ReducedMotionProvider>
      <GridViewport projects={projects} speed={0.6} />
    </ReducedMotionProvider>
  )
}