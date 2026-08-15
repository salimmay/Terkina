'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';
import { MOCK_3D_PROJECTS, ThreeDProjectItem } from '@/lib/mockData';
import ThreeDModal from '@/components/portfolio/ThreeDModal';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getTranslation } from '@/lib/i18n';

export default function ThreeDPortfolioPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  const [selectedProject, setSelectedProject] = useState<ThreeDProjectItem | null>(null);

  return (
    <div className="min-h-screen px-4 sm:px-8 py-12 max-w-7xl mx-auto flex flex-col gap-10">
      
      {/* Header Section */}
      <div className="flex flex-col gap-4 text-center md:text-left pt-6">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5" />
            {t.hero.threeD.badge}
          </span>
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight">
          {t.hero.threeD.title}
        </h1>
        <p className="text-zinc-400 max-w-2xl text-base sm:text-lg">
          {t.hero.threeD.subtitle}
        </p>
      </div>

      {/* Sleek Digital Shelf Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {MOCK_3D_PROJECTS.map((project) => (
          <ThreeDProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {/* Interactive WebGL 3D Detail Modal with auto-centered camera & Bounds */}
      <ThreeDModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

// 3D Card on Digital Shelf with Shadow Plane Effect
function ThreeDProjectCard({
  project,
  onClick,
}: {
  project: ThreeDProjectItem;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      layoutId={`card-3d-${project.id}`}
      onClick={onClick}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-3xl bg-[#121218] border border-zinc-800/80 hover:border-purple-500/50 p-6 flex flex-col gap-4 cursor-pointer shadow-xl overflow-hidden"
      data-cursor="media"
      data-cursor-text="INTERACT"
    >
      {/* Visual Canvas / PNG resting on Shadow Plane */}
      <div className="relative w-full h-64 rounded-2xl bg-gradient-to-b from-[#181822] to-[#09090b] overflow-hidden flex items-center justify-center p-4">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
        />

        {/* Digital Shelf Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 border border-purple-500/30 text-purple-300 text-xs font-mono">
          3D MODEL
        </div>
      </div>

      {/* Info Header */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
          {project.category}
        </span>
        <h3 className="font-heading font-bold text-xl text-white group-hover:text-purple-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}
