'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeDViewer from './ThreeDViewer';
import { useFocusTrap } from '@/lib/useFocusTrap';

export interface ThreeDProjectItem {
  id: string;
  category: string;
  title: string;
  description: string;
  modelUrl?: string;
  specs: {
    material: string;
    dimensions: string;
    layerHeight: string;
    printTime: string;
    weight: string;
  };
}

interface ThreeDModalProps {
  project: ThreeDProjectItem | null;
  onClose: () => void;
}

export default function ThreeDModal({ project, onClose }: ThreeDModalProps) {
  const focusTrapRef = useFocusTrap(!!project);

  // Esc key handler
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="threed-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10"
      >
        {/* Backdrop Glassmorphism */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          className="relative w-full max-w-6xl max-h-[90dvh] overflow-y-auto lg:overflow-hidden rounded-3xl bg-[#09080e] border border-white/10 shadow-2xl z-10 flex flex-col lg:flex-row"
        >
          {/* Close Button - Sticky on Mobile, min 44x44px touch target */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 min-w-[44px] min-h-[44px] rounded-full bg-black/60 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-base transition-colors duration-200 cursor-pointer shadow-lg"
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* LEFT COLUMN: Perfectly Centered 3D Viewport */}
          <div className="w-full lg:w-[58%] h-[320px] sm:h-[400px] lg:h-auto p-2 sm:p-6 flex items-center justify-center shrink-0">
            <ThreeDViewer modelUrl={project.modelUrl} />
          </div>

          {/* RIGHT COLUMN: Specifications & Details */}
          <div className="w-full lg:w-[42%] p-5 sm:p-8 md:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0c0a14]/60 overflow-y-auto">
            <div className="space-y-5">
              {/* Category Tag */}
              <div className="text-[10px] sm:text-[11px] font-mono tracking-widest text-purple-400 uppercase font-semibold">
                {project.category}
              </div>

              {/* Title & Description */}
              <div>
                <h3 id="threed-modal-title" className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {project.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Specs Header */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/10 text-xs font-mono tracking-wider text-white/50 uppercase">
                <span>✦</span>
                <span>Technical Print Specifications</span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/50 mb-0.5">
                    <span>⚙</span> Material
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white">
                    {project.specs.material}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/50 mb-0.5">
                    <span>↗</span> Dimensions
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white">
                    {project.specs.dimensions}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/50 mb-0.5">
                    <span>≡</span> Layer Height
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white">
                    {project.specs.layerHeight}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/50 mb-0.5">
                    <span>⏱</span> Print Time
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white">
                    {project.specs.printTime}
                  </div>
                </div>

                <div className="col-span-2 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/50 mb-0.5">
                    <span>⚖</span> Weight & Structure
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white">
                    {project.specs.weight}
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-5">
              <a
                href="/#contact"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg min-h-[48px]"
              >
                <span>Request Custom 3D Print</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
