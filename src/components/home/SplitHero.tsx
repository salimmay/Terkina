'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ScrollIndicator from './ScrollIndicator';
import { useLanguage } from '@/context/LanguageContext';

export default function SplitHero() {
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);
  const { lang, dir } = useLanguage();

  return (
    <section className="relative w-full min-h-[100dvh] md:h-screen overflow-hidden flex flex-col md:flex-row bg-[#050508]">
      {/* ================= LEFT PANEL: MED ART (WEDDINGS) ================= */}
      <motion.div
        onMouseEnter={() => setHoveredSide('left')}
        onMouseLeave={() => setHoveredSide(null)}
        whileTap={{ scale: 0.99 }}
        animate={{
          flex: hoveredSide === 'left' ? 1.55 : hoveredSide === 'right' ? 0.75 : 1,
        }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        className="relative flex-1 min-h-[50dvh] md:min-h-0 h-full flex flex-col justify-end p-6 sm:p-10 md:p-14 lg:p-20 border-b md:border-b-0 md:border-r border-white/10 group cursor-pointer overflow-hidden bg-[#0a0807]"
      >
        {/* Warm Golden / Amber Ambient Glow */}
        <motion.div 
          animate={{ scale: hoveredSide === 'left' ? 1.2 : 1, opacity: hoveredSide === 'left' ? 0.45 : 0.2 }}
          transition={{ duration: 1 }}
          className="absolute -top-32 -left-32 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-amber-500/30 blur-[130px] pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-start gap-3 sm:gap-4 max-w-lg mb-6 sm:mb-8" dir={dir}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 backdrop-blur-md border border-amber-500/20 text-[10px] sm:text-[11px] font-mono text-amber-300 uppercase tracking-widest"
          >
            <span>💍</span> {lang === 'ar' ? 'تصوير الأعراس الفاخرة' : lang === 'fr' ? 'Mariage & Art Nuptial' : 'Wedding & Bridal Art'}
          </motion.div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none break-words">
            MED ART
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed max-w-sm">
            {lang === 'ar' 
              ? 'توثيق أجمل لحظات العمر، العواطف الصادقة، وقصص الحب الخالدة بلمسة سينمائية راقية.'
              : lang === 'fr'
              ? 'Immortaliser les plus beaux moments d\'émotion, de romance et de célébration nuptiale avec une élégance cinématographique.'
              : 'Capturing timeless love stories, raw emotions, and wedding celebrations with cinematic elegance.'}
          </p>

          <Link
            href="/weddings"
            className="mt-1 sm:mt-2 inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-amber-100 hover:bg-white text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 min-h-[44px]"
          >
            <span>{lang === 'ar' ? 'معرض الأعراس' : lang === 'fr' ? 'Explorer les Mariages' : 'Explore Weddings'}</span>
            <span>→</span>
          </Link>
        </div>
      </motion.div>

      {/* ================= RIGHT PANEL: TERKINA (PRODUCTION & EVENTS) ================= */}
      <motion.div
        onMouseEnter={() => setHoveredSide('right')}
        onMouseLeave={() => setHoveredSide(null)}
        whileTap={{ scale: 0.99 }}
        animate={{
          flex: hoveredSide === 'right' ? 1.55 : hoveredSide === 'left' ? 0.75 : 1,
        }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        className="relative flex-1 min-h-[50dvh] md:min-h-0 h-full flex flex-col justify-end p-6 sm:p-10 md:p-14 lg:p-20 group cursor-pointer overflow-hidden bg-[#06080d]"
      >
        {/* Electric Blue / Cyan Ambient Glow */}
        <motion.div 
          animate={{ scale: hoveredSide === 'right' ? 1.2 : 1, opacity: hoveredSide === 'right' ? 0.45 : 0.2 }}
          transition={{ duration: 1 }}
          className="absolute -top-32 -right-32 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-cyan-600/30 blur-[130px] pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-start gap-3 sm:gap-4 max-w-lg mb-6 sm:mb-8" dir={dir}>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 backdrop-blur-md border border-cyan-500/20 text-[10px] sm:text-[11px] font-mono text-cyan-300 uppercase tracking-widest"
          >
            <span>🎬</span> {lang === 'ar' ? 'الإنتاج الإعلاني والفعاليات' : lang === 'fr' ? 'Production & Événements' : 'Commercial & Events Prod'}
          </motion.div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none break-words">
            TERKINA
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed max-w-sm">
            {lang === 'ar'
              ? 'إنتاج محتوى إعلاني عالي التأثير، تغطية الفعاليات والمؤتمرات، وإعلانات الفيديو الاحترافية.'
              : lang === 'fr'
              ? 'Production publicitaire à fort impact, couverture d\'événements corporate, campagnes de marque et créations vidéo.'
              : 'High-impact commercial photography, corporate event coverage, brand campaigns, and cinematic video.'}
          </p>

          <Link
            href="/production"
            className="mt-1 sm:mt-2 inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-cyan-500 text-black hover:bg-cyan-400 font-semibold text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 min-h-[44px]"
          >
            <span>{lang === 'ar' ? 'معرض الإنتاج' : lang === 'fr' ? 'Explorer la Production' : 'Explore Production'}</span>
            <span>→</span>
          </Link>
        </div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <ScrollIndicator targetId="about" />
    </section>
  );
}