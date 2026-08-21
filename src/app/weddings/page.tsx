'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronLeft, ChevronRight, MapPin, Calendar, Users, Tag, MessageCircle } from 'lucide-react';
import { MOCK_WEDDING_PROJECTS, CATEGORIES_WEDDINGS, PhotoProjectItem } from '@/lib/mockData';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getTranslation } from '@/lib/i18n';

export default function WeddingsPage() {
  const { language, dir } = useLanguageStore();
  const t = getTranslation(language);

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<PhotoProjectItem | null>(null);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState(0);

  // Filtered projects
  const filteredProjects = activeCategory === 'All'
    ? MOCK_WEDDING_PROJECTS
    : MOCK_WEDDING_PROJECTS.filter((p) => p.category === activeCategory);

  const handleOpenModal = (project: PhotoProjectItem) => {
    setSelectedProject(project);
    setActiveModalImageIndex(0);
  };

  const handleNextImage = () => {
    if (!selectedProject) return;
    setActiveModalImageIndex((prev) => (prev + 1) % selectedProject.gallery.length);
  };

  const handlePrevImage = () => {
    if (!selectedProject) return;
    setActiveModalImageIndex((prev) => (prev - 1 + selectedProject.gallery.length) % selectedProject.gallery.length);
  };

  const handleBookWeddingInquiry = (projectName: string) => {
    const text = `Hello MED ART! I am interested in wedding & bridal photography inspired by your project: *${projectName}*. Could we discuss availability and packages?`;
    window.open(`https://wa.me/21612345678?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 py-16 md:py-20 max-w-7xl mx-auto flex flex-col gap-10" dir={dir}>
      
      {/* Header Section with Warm Amber / Gold Aesthetic */}
      <div className="flex flex-col gap-4 text-center md:text-left pt-6 relative">
        {/* Warm Golden ambient blur */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-amber-500/15 blur-[140px] pointer-events-none" />

        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-widest uppercase flex items-center gap-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t.weddingsPage?.badge || 'MED ART CINEMA & STILLS'}
          </span>
        </div>
        
        <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight break-words">
          {t.weddingsPage?.title || 'Luxury Wedding Stories'}
        </h1>
        
        <p className="text-white/70 max-w-2xl text-sm sm:text-base md:text-lg font-light leading-relaxed">
          {t.weddingsPage?.subtitle || 'Editorial bridal portraits, emotional candid rituals, and cinematic wedding films crafted across breathtaking destinations.'}
        </p>
      </div>

      {/* Dynamic Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
        {CATEGORIES_WEDDINGS.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all min-h-[44px] cursor-pointer ${
                isActive ? 'text-black font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeWeddingFilterPill"
                  className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-400 rounded-full z-0 shadow-lg shadow-amber-500/20"
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
            <WeddingPhotoCard
              key={project.id}
              project={project}
              onClick={() => handleOpenModal(project)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Centered Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-8">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
            />

            {/* Modal Container */}
            <motion.div
              layoutId={`card-wedding-${selectedProject.id}`}
              className="relative w-full max-w-5xl bg-[#120f0d] border border-amber-500/20 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90dvh] flex flex-col lg:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-30 min-w-[44px] min-h-[44px] rounded-full bg-black/70 border border-amber-500/30 text-white flex items-center justify-center hover:bg-black/90 transition-all shadow-lg cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Interactive Gallery Slider */}
              <div className="relative lg:w-3/5 h-64 sm:h-80 lg:h-auto min-h-[260px] sm:min-h-[350px] bg-black flex items-center justify-center overflow-hidden group shrink-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModalImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={selectedProject.gallery[activeModalImageIndex] || selectedProject.coverImage}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Slider Controls */}
                {selectedProject.gallery.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 min-w-[44px] min-h-[44px] rounded-full bg-black/70 border border-amber-500/30 text-amber-200 flex items-center justify-center hover:bg-black/90 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 min-w-[44px] min-h-[44px] rounded-full bg-black/70 border border-amber-500/30 text-amber-200 flex items-center justify-center hover:bg-black/90 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/70 px-3 py-1.5 rounded-full border border-amber-500/20 backdrop-blur-md">
                      {selectedProject.gallery.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveModalImageIndex(idx)}
                          className={`min-w-[12px] min-h-[12px] rounded-full transition-all ${
                            activeModalImageIndex === idx ? 'bg-amber-400 w-5' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Right Side: Details Panel */}
              <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between gap-6 overflow-y-auto bg-[#120f0d] border-t lg:border-t-0 lg:border-l border-amber-500/15">
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                      {selectedProject.category}
                    </span>
                    <h2 className="font-heading font-bold text-xl sm:text-2xl text-white mt-1">
                      {selectedProject.title}
                    </h2>
                  </div>

                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">
                    {selectedProject.description}
                  </p>

                  {/* Metadata */}
                  <div className="grid grid-cols-1 gap-2.5 pt-4 border-t border-amber-500/20 text-xs text-white/60">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span className="font-medium text-white/90">Couple:</span> {selectedProject.client}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span className="font-medium text-white/90">Date:</span> {selectedProject.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span className="font-medium text-white/90">Venue:</span> {selectedProject.location}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-amber-500/20">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3 text-amber-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Consultation CTA */}
                <button
                  onClick={() => handleBookWeddingInquiry(selectedProject.title)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 hover:from-amber-100 hover:to-amber-200 text-black font-bold uppercase text-xs tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4 min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.weddingsPage?.bookCta || 'Book Wedding Consultation'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
      className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden cursor-pointer bg-[#0e0c0a] border border-amber-500/20 hover:border-amber-400/50 shadow-xl transition-colors duration-300"
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
