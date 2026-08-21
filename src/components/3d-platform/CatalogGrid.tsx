'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Layers, Clock, Weight, Sparkles } from 'lucide-react';
import { MOCK_3D_PROJECTS, ThreeDProjectItem } from '@/lib/mockData';
import ThreeDModal from '@/components/portfolio/ThreeDModal';
import { useLanguage } from '@/context/LanguageContext';

export const CATEGORIES_3D = ['All', 'Parametric Design', 'Lighting Fixtures', 'Kinetic Art', 'Industrial Design'];

export default function CatalogGrid() {
  const { lang, dir } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<ThreeDProjectItem | null>(null);
  const [projects, setProjects] = useState<ThreeDProjectItem[]>(MOCK_3D_PROJECTS);

  useEffect(() => {
    // Optionally fetch from Supabase table if available
    fetch('/api/content')
      .then((res) => res.json())
      .then(() => {})
      .catch(() => {});
  }, []);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="catalog" className="py-24 px-6 md:px-16 max-w-7xl mx-auto flex flex-col gap-12" dir={dir}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'الرف الرقمي للنماذج' : '3D Models & Artifacts'}
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
            {lang === 'ar' ? 'معرض النماذج الهندسية 3D' : lang === 'fr' ? 'Galerie des Modèles 3D' : 'Digital Shelf & Artifacts'}
          </h2>
          <p className="text-white/60 text-sm sm:text-base max-w-xl mt-2 font-light">
            {lang === 'ar'
              ? 'تصفح النماذج ثلاثية الأبعاد التفاعلية، وافحص تفاصيل المواد، دقة الطباعة، والمواصفات الميكانيكية.'
              : lang === 'fr'
              ? 'Explorez nos modèles 3D interactifs, spécifications de tolérance micronique et propriétés des matériaux.'
              : 'Explore interactive 3D models, micron tolerances, and technical material specs in our WebGL studio.'}
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {CATEGORIES_3D.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[40px] cursor-pointer ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active3dFilterPill"
                    className="absolute inset-0 bg-purple-600 rounded-full z-0 shadow-lg shadow-purple-600/30"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Digital Shelf Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedProject(project)}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group relative rounded-3xl bg-[#0c0a14] border border-white/10 hover:border-purple-500/50 p-6 flex flex-col gap-5 cursor-pointer shadow-2xl overflow-hidden transition-colors duration-300"
            >
              {/* Visual Canvas / PNG Resting on Shadow Plane */}
              <div className="relative w-full h-72 rounded-2xl bg-gradient-to-b from-[#181528] to-[#07050d] overflow-hidden flex items-center justify-center p-4">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                />

                {/* Digital Shelf Gradient Shadows */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a14] via-transparent to-transparent pointer-events-none" />

                {/* Interactive Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                  <span>3D WebGL</span>
                </div>

                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/70">
                  {project.specs.layerHeight}
                </div>
              </div>

              {/* Info Header */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    {project.category}
                  </span>
                  <span className="text-[11px] font-mono text-white/40">
                    {project.specs.material}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white group-hover:text-purple-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 leading-relaxed font-light">
                  {project.description}
                </p>
              </div>

              {/* Technical Specs Micro-Grid */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-xs text-white/60">
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col">
                  <span className="text-[10px] text-white/40 font-mono uppercase flex items-center gap-1">
                    <Layers className="w-3 h-3 text-purple-400" /> Infill
                  </span>
                  <span className="font-mono font-semibold text-white mt-0.5">{project.specs.infill}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col">
                  <span className="text-[10px] text-white/40 font-mono uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-400" /> Time
                  </span>
                  <span className="font-mono font-semibold text-white mt-0.5">{project.specs.printTime}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col">
                  <span className="text-[10px] text-white/40 font-mono uppercase flex items-center gap-1">
                    <Weight className="w-3 h-3 text-purple-400" /> Weight
                  </span>
                  <span className="font-mono font-semibold text-white mt-0.5">{project.specs.weight}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Interactive WebGL 3D Detail Modal */}
      <ThreeDModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
