import React from 'react'
import { Link } from 'react-router-dom'
// CSS now loaded globally via App.css

/**
 * Left Vertical Navigation Header
 * Neo Glass 3D effects with traditional horizontal text
 */
export function HeaderLeftVertical() {
  return (
    <nav className="ravie-left-nav" aria-label="Main navigation">
      <Link to="/" className="ravie-logo-pod" aria-label="Ravie home">
        <img 
          src="/Ravie/Ravie Logos/Ravie_Logo_icon.png" 
          alt="Ravie" 
          className="w-10 h-10 object-contain"
        />
        <span className="logo-text">RAVIE</span>
      </Link>
      
      <Link to="/" className="ravie-nav-item">loops</Link>
      <Link to="/work" className="ravie-nav-item">work</Link>
      <Link to="/about" className="ravie-nav-item">about</Link>
      <Link to="/contact" className="ravie-nav-item">contact</Link>
      <a href="mailto:hello@ravie.co" className="ravie-nav-item">talk</a>
    </nav>
  )
}