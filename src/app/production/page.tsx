'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, X, ChevronLeft, ChevronRight, MapPin, Calendar, Building, Tag, MessageSquare } from 'lucide-react';
import { MOCK_PRODUCTION_PROJECTS, CATEGORIES_PRODUCTION, PhotoProjectItem } from '@/lib/mockData';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getTranslation } from '@/lib/i18n';

export default function ProductionPage() {
  const { language, dir } = useLanguageStore();
  const t = getTranslation(language);

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<PhotoProjectItem | null>(null);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState(0);

  // Filtered projects
  const filteredProjects = activeCategory === 'All'
    ? MOCK_PRODUCTION_PROJECTS
    : MOCK_PRODUCTION_PROJECTS.filter((p) => p.category === activeCategory);

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

  const handleProductionQuoteInquiry = (projectName: string) => {
    const text = `Hello TERKINA! I am inquiring about commercial production / event coverage inspired by your project: *${projectName}*. Could we discuss a project brief and quote?`;
    window.open(`https://wa.me/21612345678?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 py-16 md:py-20 max-w-7xl mx-auto flex flex-col gap-10" dir={dir}>
      
      {/* Header Section with Electric Cyan / Cobalt Aesthetic */}
      <div className="flex flex-col gap-4 text-center md:text-left pt-6 relative">
        {/* Cyan ambient blur */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-cyan-600/15 blur-[140px] pointer-events-none" />

        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-widest uppercase flex items-center gap-2 shadow-sm">
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            {t.productionPage?.badge || 'TERKINA PRODUCTION HOUSE'}
          </span>
        </div>
        
        <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight break-words">
          {t.productionPage?.title || 'Commercial & Video Production'}
        </h1>
        
        <p className="text-white/70 max-w-2xl text-sm sm:text-base md:text-lg font-light leading-relaxed">
          {t.productionPage?.subtitle || 'High-octane brand campaigns, commercial shoots, corporate conferences, and dynamic event coverage with industry-grade cinema equipment.'}
        </p>
      </div>

      {/* Dynamic Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
        {CATEGORIES_PRODUCTION.map((cat) => {
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
                  layoutId="activeProductionFilterPill"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-cyan-500 rounded-full z-0 shadow-lg shadow-cyan-500/20"
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
            <ProductionPhotoCard
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
              layoutId={`card-prod-${selectedProject.id}`}
              className="relative w-full max-w-5xl bg-[#090d14] border border-cyan-500/20 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90dvh] flex flex-col lg:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-30 min-w-[44px] min-h-[44px] rounded-full bg-black/70 border border-cyan-500/30 text-white flex items-center justify-center hover:bg-black/90 transition-all shadow-lg cursor-pointer"
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
                      className="absolute left-3 min-w-[44px] min-h-[44px] rounded-full bg-black/70 border border-cyan-500/30 text-cyan-200 flex items-center justify-center hover:bg-black/90 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 min-w-[44px] min-h-[44px] rounded-full bg-black/70 border border-cyan-500/30 text-cyan-200 flex items-center justify-center hover:bg-black/90 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/70 px-3 py-1.5 rounded-full border border-cyan-500/20 backdrop-blur-md">
                      {selectedProject.gallery.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveModalImageIndex(idx)}
                          className={`min-w-[12px] min-h-[12px] rounded-full transition-all ${
                            activeModalImageIndex === idx ? 'bg-cyan-400 w-5' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Right Side: Details Panel */}
              <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between gap-6 overflow-y-auto bg-[#090d14] border-t lg:border-t-0 lg:border-l border-cyan-500/15">
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
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
                  <div className="grid grid-cols-1 gap-2.5 pt-4 border-t border-cyan-500/20 text-xs text-white/60">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-cyan-400" />
                      <span className="font-medium text-white/90">Client / Brand:</span> {selectedProject.client}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span className="font-medium text-white/90">Date:</span> {selectedProject.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span className="font-medium text-white/90">Location:</span> {selectedProject.location}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-cyan-500/20">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3 text-cyan-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Consultation CTA */}
                <button
                  onClick={() => handleProductionQuoteInquiry(selectedProject.title)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-bold uppercase text-xs tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4 min-h-[44px]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.productionPage?.inquireCta || 'Request Production Proposal'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Production PhotoCard Component with Hover Slideshow
function ProductionPhotoCard({
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
      layoutId={`card-prod-${project.id}`}
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true);
        setCurrentSlideIndex(0);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden cursor-pointer bg-[#070b10] border border-cyan-500/20 hover:border-cyan-400/50 shadow-xl transition-colors duration-300"
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
