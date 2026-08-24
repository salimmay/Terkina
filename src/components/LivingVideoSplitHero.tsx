'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import ScrollIndicator from './home/ScrollIndicator';
import { useLanguage } from '@/context/LanguageContext';
import { useCursor } from '@/components/ui/CustomCursor';

export default function LivingVideoSplitHero() {
  const { lang, dir } = useLanguage();
  const { setCursorVariant } = useCursor();
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);

  // Mouse Coordinates for the Floating Magnetic Lens
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 300, mass: 0.4 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 300, mass: 0.4 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const MED_ART_VIDEO = '/videos/med-art-hero.mp4';
  const TERKINA_VIDEO = '/videos/terkina-hero.mp4';

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursorVariant('hidden')}
      onMouseLeave={() => setCursorVariant('default')}
      className="relative w-full h-[100dvh] min-h-[640px] overflow-hidden flex flex-col md:flex-row bg-black select-none md:cursor-none"
    >
      {/* ========================================================================= */}
      {/* ----------------- FLOATING MAGNETIC LENS (FOLLOWS MOUSE) ----------------- */}
      {/* ========================================================================= */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: hoveredSide ? 1 : 0,
          opacity: hoveredSide ? 1 : 0,
          borderColor:
            hoveredSide === 'left' ? 'rgba(251, 191, 36, 0.6)' : 'rgba(6, 182, 212, 0.6)',
          backgroundColor:
            hoveredSide === 'left' ? 'rgba(251, 191, 36, 0.12)' : 'rgba(6, 182, 212, 0.12)',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 280 }}
        className="hidden md:flex fixed top-0 left-0 z-50 pointer-events-none w-28 h-28 rounded-full border backdrop-blur-md items-center justify-center text-center shadow-2xl"
      >
        <span className="text-[10px] font-mono tracking-widest font-extrabold text-white uppercase px-2 leading-tight">
          {hoveredSide === 'left'
            ? lang === 'ar' ? 'دخول المعرض ↗' : 'ENTER MED ART ↗'
            : lang === 'ar' ? 'دخول الإنتاج ↗' : 'ENTER TERKINA ↗'}
        </span>
      </motion.div>

      {/* ========================================================================= */}
      {/* -------------------- LEFT PANEL: MED ART (WEDDINGS) --------------------- */}
      {/* ========================================================================= */}
      <motion.div
        onMouseEnter={() => setHoveredSide('left')}
        onMouseLeave={() => setHoveredSide(null)}
        animate={{
          flex: hoveredSide === 'left' ? 1.65 : hoveredSide === 'right' ? 0.65 : 1,
        }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        className="relative flex-1 h-1/2 md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/10 group bg-[#07060a]"
      >
        {/* The entire panel is a clickable Link wrapper */}
        <Link
          href="/weddings"
          className="relative w-full h-full flex flex-col justify-end p-5 sm:p-8 md:p-14 lg:p-18 z-20 block pt-20 md:pt-0"
        >
          {/* Background Video */}
          <motion.div
            animate={{
              scale: hoveredSide === 'left' ? 1.06 : 1,
              filter:
                hoveredSide === 'right'
                  ? 'brightness(0.25) grayscale(80%)'
                  : 'brightness(0.75) grayscale(0%)',
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            >
              <source src="/videos/med-art-hero.webm" type="video/webm" />
              <source src={MED_ART_VIDEO} type="video/mp4" />
            </video>

            {/* Amber Ambient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20 z-10" />
            <div className="absolute inset-0 bg-amber-950/20 mix-blend-color z-10" />
          </motion.div>

          {/* Typography Content */}
          <div className="relative z-20 flex flex-col items-start gap-1.5 sm:gap-3 max-w-lg mb-2 sm:mb-4" dir={dir}>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-[9px] sm:text-[10px] font-mono text-amber-300 uppercase tracking-widest">
              <span>[01]</span>
              <span>{lang === 'ar' ? 'تصوير الأعراس الفاخرة' : 'Wedding & Bridal Cinema'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">
              MED ART
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-amber-100/75 font-light leading-relaxed max-w-sm drop-shadow line-clamp-2 sm:line-clamp-none">
              {lang === 'ar'
                ? 'توثيق أجمل لحظات العمر، العواطف الصادقة، وقصص الحب الخالدة بلمسة سينمائية راقية.'
                : 'Capturing timeless love stories, raw emotions, and wedding celebrations with cinematic warmth.'}
            </p>

            {/* Subtle Inline Kinetic Prompt */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono tracking-widest text-amber-300 uppercase mt-0.5 sm:mt-2">
              <span>{lang === 'ar' ? 'استكشف المعرض' : 'Explore Weddings'}</span>
              <span>↗</span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ========================================================================= */}
      {/* ------------------ RIGHT PANEL: TERKINA (COMMERCIAL) -------------------- */}
      {/* ========================================================================= */}
      <motion.div
        onMouseEnter={() => setHoveredSide('right')}
        onMouseLeave={() => setHoveredSide(null)}
        animate={{
          flex: hoveredSide === 'right' ? 1.65 : hoveredSide === 'left' ? 0.65 : 1,
        }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        className="relative flex-1 h-1/2 md:h-full overflow-hidden group bg-[#05060a]"
      >
        {/* The entire panel is a clickable Link wrapper */}
        <Link
          href="/production"
          className="relative w-full h-full flex flex-col justify-end p-5 sm:p-8 md:p-14 lg:p-18 z-20 block pb-12 sm:pb-8 md:pb-14"
        >
          {/* Background Video */}
          <motion.div
            animate={{
              scale: hoveredSide === 'right' ? 1.06 : 1,
              filter:
                hoveredSide === 'left'
                  ? 'brightness(0.25) grayscale(80%)'
                  : 'brightness(0.75) grayscale(0%)',
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            >
              <source src="/videos/terkina-hero.webm" type="video/webm" />
              <source src={TERKINA_VIDEO} type="video/mp4" />
            </video>

            {/* Cyan Ambient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20 z-10" />
            <div className="absolute inset-0 bg-cyan-950/20 mix-blend-color z-10" />
          </motion.div>

          {/* Typography Content */}
          <div className="relative z-20 flex flex-col items-start gap-1.5 sm:gap-3 max-w-lg mb-2 sm:mb-4" dir={dir}>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/30 text-[9px] sm:text-[10px] font-mono text-cyan-300 uppercase tracking-widest">
              <span>[02]</span>
              <span>{lang === 'ar' ? 'الإنتاج التجاري والفعاليات' : 'Commercial & Event Prod'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">
              TERKINA
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-cyan-100/75 font-light leading-relaxed max-w-sm drop-shadow line-clamp-2 sm:line-clamp-none">
              {lang === 'ar'
                ? 'إنتاج محتوى إعلاني عالي التأثير، تصوير المنتجات، وتغطية الفعاليات الكبرى بأعلى معايير الإخراج.'
                : 'High-impact commercial photography, luxury product shoots, and cinematic brand campaigns.'}
            </p>

            {/* Subtle Inline Kinetic Prompt */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono tracking-widest text-cyan-300 uppercase mt-0.5 sm:mt-2">
              <span>{lang === 'ar' ? 'استكشف الإنتاج' : 'Explore Production'}</span>
              <span>↗</span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Scroll Down Indicator — hidden on very small screens to avoid text collision */}
      <div className="hidden sm:block">
        <ScrollIndicator targetId="about" />
      </div>
    </section>
  );
}
