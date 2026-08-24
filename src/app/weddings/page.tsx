'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle } from 'lucide-react';
import { MOCK_WEDDING_PROJECTS, CATEGORIES_WEDDINGS, PhotoProjectItem } from '@/lib/mockData';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getTranslation } from '@/lib/i18n';
import OrbitalGalleryModal, { AlbumData } from '@/components/OrbitalGalleryModal';

export default function WeddingsPage() {
  const { language, dir } = useLanguageStore();
  const t = getTranslation(language);

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);

  // Filtered projects
  const filteredProjects = activeCategory === 'All'
    ? MOCK_WEDDING_PROJECTS
    : MOCK_WEDDING_PROJECTS.filter((p) => p.category === activeCategory);

  const handleOpenAlbum = (project: PhotoProjectItem) => {
    const imagesList = project.gallery && project.gallery.length > 0 ? project.gallery : [project.coverImage];
    setSelectedAlbum({
      id: project.id,
      title: project.title,
      category: project.category,
      images: imagesList.map((url, idx) => ({
        id: `${project.id}-${idx}`,
        url: url,
        title: `${project.title} — Frame 0${idx + 1}`,
      })),
    });
  };

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#050508] text-white selection:bg-amber-400 selection:text-black" dir={dir}>

      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-4xl h-[350px] bg-amber-600/10 blur-[140px] pointer-events-none" />

      {/* ================= PAGE HEADER ================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-28 sm:pt-36 pb-8">

        {/* Category Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] sm:text-xs font-mono text-amber-300 uppercase tracking-widest mb-4">
          ✨ {t.weddingsPage?.badge || 'MED ART CINEMA & STILLS'}
        </div>

        {/* Title — break-words prevents horizontal overflow */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05] break-words max-w-full">
          {t.weddingsPage?.title || 'Luxury Wedding Stories'}
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed max-w-xl break-words">
          {t.weddingsPage?.subtitle || 'Editorial bridal portraits, emotional candid rituals, and cinematic wedding films crafted across breathtaking destinations.'}
        </p>

        {/* ================= TOUCH-SCROLL FILTER BAR ================= */}
        {/* overflow-x-auto + flex-shrink-0 + whitespace-nowrap stops the page blowing out on mobile */}
        <div className="mt-8 flex items-center gap-2 w-full overflow-x-auto pb-3 pt-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
          {CATEGORIES_WEDDINGS.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 relative px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[44px] cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= ALBUM GRID ================= */}
      {/* min-w-0 on grid cards prevents CSS grid items from blowing out viewport bounds */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-24">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <WeddingPhotoCard
                key={project.id}
                project={project}
                onClick={() => handleOpenAlbum(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 360° Orbital Roaming Gallery Modal */}
      <OrbitalGalleryModal
        album={selectedAlbum}
        isOpen={!!selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
    </div>
  );
}

// Wedding PhotoCard Component with Hover Slideshow
function WeddingPhotoCard({
  project,
  onClick,
}: {
  project: PhotoProjectItem;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Slideshow interval on hover
  useEffect(() => {
    if (!isHovered || project.gallery.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % project.gallery.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isHovered, project.gallery]);

  return (
    <motion.div
      layout
      layoutId={`card-wedding-${project.id}`}
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true);
        setCurrentSlideIndex(0);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative min-w-0 h-80 sm:h-96 rounded-2xl overflow-hidden cursor-pointer bg-[#0e0c0a] border border-amber-500/20 hover:border-amber-400/50 shadow-xl transition-colors duration-300"
    >
      {/* Slideshow Container */}
      <div className="relative w-full h-full overflow-hidden">
        <motion.div
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="w-full h-full relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Image
                src={project.gallery[currentSlideIndex] || project.coverImage}
                alt={project.title}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Amber Tint Dark Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/95 transition-all duration-300" />

      {/* Card Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col gap-1.5 z-10">
        <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-widest">
          {project.category}
        </span>
        <h3 className="font-heading font-bold text-lg sm:text-xl text-white group-hover:text-amber-200 transition-colors">
          {project.title}
        </h3>
        <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}
