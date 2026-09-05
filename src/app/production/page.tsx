'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, MessageSquare } from 'lucide-react';
import { CATEGORIES_PRODUCTION } from '@/lib/categories';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useT } from '@/lib/translations/TranslationsProvider';
import OrbitalGalleryModal, { AlbumData } from '@/components/OrbitalGalleryModal';
import { usePhotoProjects, LivePhotoProject } from '@/lib/usePhotoProjects';
import JsonLd from '@/components/seo/JsonLd';

export default function ProductionPage() {
  const { dir } = useLanguageStore();
  const t = useT();

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);

  // Live Supabase albums
  const { projects: liveProjects, loading } = usePhotoProjects('TERKINA_PROD');

  // Dynamic category list derived from live data
  const liveCategories = [...new Set(liveProjects.map((p) => p.category))];
  const availableCategories =
    liveCategories.length > 0 ? ['All', ...liveCategories] : CATEGORIES_PRODUCTION;

  // Filtered projects
  const filteredProjects =
    activeCategory === 'All'
      ? liveProjects
      : liveProjects.filter((p) => p.category === activeCategory);

  const handleOpenAlbum = (project: LivePhotoProject) => {
    const imagesList =
      project.gallery && project.gallery.length > 0 ? project.gallery : [project.coverImage];
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
    <div
      className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#050508] text-white selection:bg-cyan-400 selection:text-black"
      dir={dir}
    >
      {/* Schema.org Commercial Video Production Structured Data */}
      <JsonLd
        type="gallery"
        data={{
          title: 'TERKINA Commercial Video Production House',
          description:
            'Commercial advertising campaigns, luxury product photography, and corporate documentary video.',
        }}
      />

      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-4xl h-[350px] bg-cyan-600/10 blur-[140px] pointer-events-none" />

      {/* ================= PAGE HEADER ================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-28 sm:pt-36 pb-8 sm:pb-12">
        {/* Category Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[10px] sm:text-xs font-mono text-cyan-300 uppercase tracking-widest mb-4">
          🎬 {t('productionPage.badge', 'TERKINA PRODUCTION HOUSE')}
        </div>

        {/* Title — break-words prevents horizontal overflow */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05] break-words max-w-full">
          {t('productionPage.title', 'Commercial & Video Production')}
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed max-w-xl break-words">
          {t('productionPage.subtitle', 'High-octane brand campaigns, commercial shoots, corporate conferences, and dynamic event coverage with industry-grade cinema equipment.')}
        </p>

        {/* ================= TOUCH-SCROLL FILTER BAR ================= */}
        <div className="mt-8 flex items-center gap-2 w-full overflow-x-auto pb-3 pt-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
          {availableCategories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 relative px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[44px] cursor-pointer ${
                  isActive
                    ? 'bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/20'
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full animate-pulse">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 sm:h-96 rounded-2xl bg-white/[0.03] border border-white/5"
              />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-24 text-center rounded-2xl border border-white/5 bg-white/[0.01]">
            <span className="text-3xl block mb-3">🎬</span>
            <p className="text-xs font-mono text-white/50">
              {t('productionPage.emptyText', 'No commercial projects published in this category yet.')}
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProductionPhotoCard
                  key={project.id}
                  project={project}
                  onClick={() => handleOpenAlbum(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
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

// Production PhotoCard Component with Hover Slideshow
function ProductionPhotoCard({
  project,
  onClick,
}: {
  project: LivePhotoProject;
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
      layoutId={`card-prod-${project.id}`}
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true);
        setCurrentSlideIndex(0);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative min-w-0 h-80 sm:h-96 rounded-2xl overflow-hidden cursor-pointer bg-[#070b10] border border-cyan-500/20 hover:border-cyan-400/50 shadow-xl transition-colors duration-300"
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

      {/* Cyan Tint Dark Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/95 transition-all duration-300" />

      {/* Card Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col gap-1.5 z-10">
        <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-widest">
          {project.category}
        </span>
        <h3 className="font-heading font-bold text-lg sm:text-xl text-white group-hover:text-cyan-200 transition-colors">
          {project.title}
        </h3>
        <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}
