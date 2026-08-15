'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ScrollIndicator from './ScrollIndicator';
import { useLanguageStore } from '@/store/useLanguageStore';

interface MultilingualField {
  en?: string;
  fr?: string;
  ar?: string;
}

export default function SplitHero() {
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);
  const { language: lang, dir } = useLanguageStore();

  const [photoSide, setPhotoSide] = useState<{
    badge?: MultilingualField;
    title?: MultilingualField;
    subtitle?: MultilingualField;
    button_text?: MultilingualField;
  }>({
    badge: { en: 'Studio & Gallery', fr: 'Studio & Galerie', ar: 'الاستوديو والمعرض' },
    title: { en: 'Photography', fr: 'Photographie', ar: 'التصوير' },
    subtitle: {
      en: 'Capturing light, emotion, and architectural mastery through cinematic lenses.',
      fr: 'Capturer la lumière, l\'émotion et la maîtrise architecturale.',
      ar: 'التقاط الضوء والعاطفة والإتقان المعماري من خلال عدسات سينمائية.',
    },
    button_text: { en: 'Explore Portfolio', fr: 'Explorer la Galerie', ar: 'استكشف المعرض' },
  });

  const [threeDSide, setThreeDSide] = useState<{
    badge?: MultilingualField;
    title?: MultilingualField;
    subtitle?: MultilingualField;
    button_text?: MultilingualField;
  }>({
    badge: { en: 'Interactive Canvas', fr: 'Espace Interactif', ar: 'مساحة ثلاثية الأبعاد' },
    title: { en: '3D Printing', fr: 'Impression 3D', ar: 'الطباعة 3D' },
    subtitle: {
      en: 'Precision 3D modeling, rapid prototyping, and generative physical artifacts.',
      fr: 'Modélisation 3D de précision, prototypage rapide et artefacts physiques.',
      ar: 'نمذجة ثلاثية الأبعاد دقيقة، نماذج أولية، وأعمال فنية رقمية مولّدة.',
    },
    button_text: { en: 'Launch 3D World', fr: 'Lancer le Monde 3D', ar: 'انطلق للعالم 3D' },
  });

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((items) => {
        if (Array.isArray(items)) {
          items.forEach((item) => {
            if (item.key === 'photo_side' && item.content) setPhotoSide(item.content);
            if (item.key === '3d_side' && item.content) setThreeDSide(item.content);
          });
        }
      })
      .catch(() => {});
  }, []);

  const getLangText = (field?: MultilingualField, fallback: string = '') => {
    if (!field) return fallback;
    const currentLang = lang as 'en' | 'fr' | 'ar';
    return field[currentLang] || field.en || fallback;
  };

  return (
    <section className="relative w-full min-h-[100dvh] md:h-screen overflow-hidden flex flex-col md:flex-row bg-[#050508]">
      {/* ---------------- LEFT PANEL: PHOTOGRAPHY ---------------- */}
      <motion.div
        onMouseEnter={() => setHoveredSide('left')}
        onMouseLeave={() => setHoveredSide(null)}
        whileTap={{ scale: 0.98 }}
        animate={{
          flex: hoveredSide === 'left' ? 1.55 : hoveredSide === 'right' ? 0.75 : 1,
        }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className="relative flex-1 min-h-[50dvh] md:min-h-0 h-full flex flex-col justify-end p-6 sm:p-10 md:p-14 lg:p-20 border-b md:border-b-0 md:border-r border-white/10 group cursor-pointer overflow-hidden"
      >
        {/* Animated Radial Glows */}
        <motion.div 
          animate={{ scale: hoveredSide === 'left' ? 1.2 : 1, opacity: hoveredSide === 'left' ? 0.4 : 0.15 }}
          transition={{ duration: 1 }}
          className="absolute -top-32 -left-32 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-blue-600/30 blur-[100px] sm:blur-[120px] pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-start gap-3 sm:gap-4 max-w-lg mb-6 sm:mb-8" dir={dir}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-mono text-white/80 uppercase tracking-widest"
          >
            <span>📷</span> {getLangText(photoSide.badge, lang === 'ar' ? 'الاستوديو والمعرض' : 'Studio & Gallery')}
          </motion.div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none break-words max-w-full">
            {getLangText(photoSide.title, 'Photography')}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed max-w-sm">
            {getLangText(photoSide.subtitle, 'Capturing light, emotion, and architectural mastery through cinematic lenses.')}
          </p>

          <Link
            href="/photography"
            className="mt-1 sm:mt-2 inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-lg min-h-[44px]"
          >
            <span>{getLangText(photoSide.button_text, lang === 'ar' ? 'استكشف المعرض' : 'Explore Portfolio')}</span>
            <span>→</span>
          </Link>
        </div>
      </motion.div>

      {/* ---------------- RIGHT PANEL: 3D PRINTING ---------------- */}
      <motion.div
        onMouseEnter={() => setHoveredSide('right')}
        onMouseLeave={() => setHoveredSide(null)}
        whileTap={{ scale: 0.98 }}
        animate={{
          flex: hoveredSide === 'right' ? 1.55 : hoveredSide === 'left' ? 0.75 : 1,
        }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className="relative flex-1 min-h-[50dvh] md:min-h-0 h-full flex flex-col justify-end p-6 sm:p-10 md:p-14 lg:p-20 group cursor-pointer overflow-hidden bg-[#07050d]"
      >
        {/* Animated Radial Glows */}
        <motion.div 
          animate={{ scale: hoveredSide === 'right' ? 1.2 : 1, opacity: hoveredSide === 'right' ? 0.45 : 0.2 }}
          transition={{ duration: 1 }}
          className="absolute -top-32 -right-32 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-purple-600/30 blur-[100px] sm:blur-[120px] pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-start gap-3 sm:gap-4 max-w-lg mb-6 sm:mb-8" dir={dir}>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 backdrop-blur-md border border-purple-500/20 text-[10px] sm:text-[11px] font-mono text-purple-300 uppercase tracking-widest"
          >
            <span>⬡</span> {getLangText(threeDSide.badge, lang === 'ar' ? 'مساحة ثلاثية الأبعاد' : 'Interactive Canvas')}
          </motion.div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none break-words max-w-full">
            {getLangText(threeDSide.title, '3D Printing')}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed max-w-sm">
            {getLangText(threeDSide.subtitle, 'Precision 3D modeling, rapid prototyping, and generative physical artifacts.')}
          </p>

          <Link
            href="/3d"
            className="mt-1 sm:mt-2 inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-purple-600 text-white font-semibold text-xs uppercase tracking-wider hover:bg-purple-500 transition-all shadow-lg min-h-[44px]"
          >
            <span>{getLangText(threeDSide.button_text, lang === 'ar' ? 'انطلق للعالم 3D' : 'Launch 3D World')}</span>
            <span>→</span>
          </Link>
        </div>
      </motion.div>

      {/* Scroll Down Indicator Component */}
      <ScrollIndicator targetId="about" />
    </section>
  );
}