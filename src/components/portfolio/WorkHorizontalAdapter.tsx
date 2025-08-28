import React, { useMemo } from 'react';
// import Horizontal3DGallery from './Horizontal3DGallery'; // Experimental - not included
import projectsJson from '../../data/projects.json';

// Placeholder for experimental 3D gallery
const Horizontal3DGallery = () => <div className="p-10 text-center">3D Gallery Coming Soon</div>;

// Minimal ProjectData the gallery expects
type Tile = { type: 'image' | 'video' | 'text'; data: any };
type ProjectData = { id: string | number; title: string; tiles: Tile[] };

// Map your work items into tiles the gallery knows how to render
export default function WorkHorizontalAdapter() {
  // Use the JSON data source
  const projects: any[] = Array.isArray(projectsJson) ? projectsJson : [];

  const unified: ProjectData = useMemo(() => {
    const tiles: Tile[] = projects.map((p) => {
      // try to infer best media
      const poster = p.posterSrc || p.image || p.thumbnail || (p.media && p.media[0]?.src);
      // If there is a video url, surface it as 'video' tile; else 'image'; else a 'text' tile
      if (p.videoUrl || (p.media && p.media[0]?.type === 'video')) {
        return {
          type: 'video',
          data: {
            poster: poster || p.poster,
            title: p.title || p.client || 'Video',
            src: p.videoUrl || p.media?.[0]?.src,
          },
        };
      }
      if (poster) {
        return {
          type: 'image',
          data: {
            url: poster,
            caption: p.client || p.title || '',
            alt: p.title || p.client || 'Project',
          },
        };
      }
      return {
        type: 'text',
        data: {
          title: p.title || p.client || 'Untitled',
          description: p.description || '',
        },
      };
    });

    return {
      id: 'work-unified',
      title: 'Work',
      tiles,
    };
  }, [projects]);

  // The Horizontal3DGallery itself owns its 3D scene + wheel; we just hand it one "project"
  return <Horizontal3DGallery project={unified} />;
}