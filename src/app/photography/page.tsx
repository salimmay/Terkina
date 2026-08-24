'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';
import { MOCK_PHOTO_PROJECTS, CATEGORIES_PHOTO, PhotoProjectItem } from '@/lib/mockData';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getTranslation } from '@/lib/i18n';
import OrbitalGalleryModal, { AlbumData } from '@/components/OrbitalGalleryModal';

export default function PhotographyPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);

  // Filtered projects
  const filteredProjects = activeCategory === 'All'
    ? MOCK_PHOTO_PROJECTS
    : MOCK_PHOTO_PROJECTS.filter((p) => p.category === activeCategory);

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
    <div className="min-h-screen px-4 sm:px-8 py-12 max-w-7xl mx-auto flex flex-col gap-10">
      
      {/* Header Section */}
      <div className="flex flex-col gap-4 text-center md:text-left pt-6">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            {t.hero.photo.badge}
          </span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight break-words">
          {t.hero.photo.title}
        </h1>
        <p className="text-zinc-400 max-w-2xl text-sm sm:text-base md:text-lg">
          {t.hero.photo.subtitle}
        </p>
      </div>

      {/* Dynamic Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
        {CATEGORIES_PHOTO.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all min-h-[44px] cursor-pointer ${
                isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterPill"
                  className="absolute inset-0 bg-blue-600 rounded-full z-0 shadow-lg shadow-blue-600/30"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Responsive Grid Gallery: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <PhotoCard
              key={project.id}
              project={project}
              onClick={() => handleOpenAlbum(project)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 360° Orbital Roaming Gallery Modal */}
      <OrbitalGalleryModal
        album={selectedAlbum}
        isOpen={!!selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
    </div>
  );
}

// PhotoCard Component with Touch Friendly Layout
function PhotoCard({
  project,
  onClick,
}: {
  project: PhotoProjectItem;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Slideshow interval on hover (desktop only)
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
      layoutId={`card-${project.id}`}
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true);
        setCurrentSlideIndex(0);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 border border-zinc-800 shadow-xl"
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

      {/* Dark Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/95 transition-all duration-300" />

      {/* Card Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col gap-1.5 z-10">
        <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-widest">
          {project.category}
        </span>
        <h3 className="font-heading font-bold text-lg sm:text-xl text-white group-hover:text-blue-200 transition-colors">
          {project.title}
        </h3>
        <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}
