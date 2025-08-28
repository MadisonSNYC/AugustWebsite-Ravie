import React from 'react'
import { getAllProjects } from '../data/projects'
import ErrorBoundary from '../components/ErrorBoundary'
import { GridViewport } from '../components/portfolio/GridViewport'

export default function WorkPage() {
  const rawProjects = getAllProjects()
  
  // Transform projects to match GridViewport/ProjectCard expected structure
  const adaptedProjects = rawProjects.map(project => ({
    id: project.id,
    title: project.title,
    client: project.client,
    categories: [project.category],
    slug: project.url?.replace('https://ravie.co/the-work/', '') || project.id,
    posterSrc: project.image || `/Thumbs/${project.thumbnail}`,
    previewSrc: project.videoUrl,
    durationSec: 30, // Default duration
    description: project.description
  }))

  return (
    <ErrorBoundary fallbackMessage="Failed to load the work page. Please refresh.">
      <div className="min-h-screen bg-black">
        {/* Header spacing for fixed navigation */}
        <div className="h-20" />
        
        {/* Counter-scrolling Portfolio Grid */}
        <GridViewport 
          projects={adaptedProjects} 
          speed={0.3}
        />
      </div>
    </ErrorBoundary>
  )
}