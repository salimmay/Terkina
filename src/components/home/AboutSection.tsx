'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useLanguageStore } from '@/store/useLanguageStore';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { damping: 30, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      motionVal.set(value);
    }
  }, [isInView, value, motionVal]);

  useEffect(() => {
    return springVal.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = (value % 1 !== 0 ? latest.toFixed(2) : Math.round(latest).toString()) + suffix;
      }
    });
  }, [springVal, suffix, value]);

  return <span ref={ref}>0{suffix}</span>;
}

interface MultilingualField {
  en?: string;
  fr?: string;
  ar?: string;
}

export default function AboutSection() {
  const { language: lang, dir } = useLanguageStore();

  const [aboutData, setAboutData] = useState<{
    badge?: MultilingualField;
    heading?: MultilingualField;
    paragraph1?: MultilingualField;
    paragraph2?: MultilingualField;
  }>({
    badge: { en: 'Who We Are', fr: 'Qui Sommes-Nous', ar: 'من نحن' },
    heading: {
      en: 'Fusing Visual Artistry With Physical Precision.',
      fr: 'Fusionner l\'art visuel et la précision physique.',
      ar: 'ندمج بين الفن البصري والهندسة الدقيقة.',
    },
    paragraph1: {
      en: 'TERKINA is a hybrid multimedia studio operating at the intersection of cinematic photography, high-end videography, and industrial-grade 3D additive manufacturing.',
      fr: 'TERKINA est un studio multimédia hybride opérant à l\'intersection de la photographie cinématographique et de la fabrication additive 3D.',
      ar: 'تيركينا هو استوديو وسائط متقدم متخصص في إنتاج المحتوى البصري والحلول الفيزيائية ثلاثية الأبعاد.',
    },
    paragraph2: {
      en: 'From editorial architectural shoots to micron-precise custom prototypes, our dual-pipeline infrastructure allows creators to scale visions without medium boundaries.',
      fr: 'Des prises de vue architecturales éditoriales aux prototypes sur mesure de précision micronique.',
      ar: 'سواء كنت بحاجة إلى جلسة تصوير معمارية سينمائية أو نموذج أولي مطبوع بدقة ميكرونية، نضمن لك جودة استثنائية.',
    },
  });

  const [stats, setStats] = useState({
    stat1: { val: 500, suffix: '+', label: { en: 'Photo Sets', fr: 'Projets Photo', ar: 'مشروع تصوير' } },
    stat2: { val: 0.05, suffix: 'mm', label: { en: '3D Tolerance', fr: 'Précision 3D', ar: 'دقة الطباعة' } },
    stat3: { val: 100, suffix: '%', label: { en: 'Bespoke Craft', fr: 'Sur Mesure', ar: 'حرفية مخصصة' } },
  });

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((items) => {
        if (Array.isArray(items)) {
          items.forEach((item) => {
            if (item.key === 'about_section' && item.content) setAboutData(item.content);
            if (item.key === 'manifesto' && item.content) setAboutData((prev) => ({ ...prev, ...item.content }));
            if (item.key === 'stats' && item.content) setStats(item.content);
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
    <section id="about" className="relative py-24 sm:py-32 px-5 sm:px-8 md:px-16 border-t border-white/10 bg-[#060609] overflow-hidden">
      {/* Background Ambient Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[300px] bg-purple-900/10 blur-[120px] sm:blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10" dir={dir}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60 uppercase tracking-widest mb-6 sm:mb-8"
        >
          {getLangText(aboutData.badge, lang === 'ar' ? 'من نحن' : 'Who We Are')}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          <motion.h3 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[1.1] break-words"
          >
            {getLangText(aboutData.heading, 'Fusing Visual Artistry With Physical Precision.')}
          </motion.h3>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 flex flex-col gap-5 sm:gap-6 text-white/70 text-sm sm:text-base md:text-lg font-light leading-relaxed"
          >
            <p>
              {getLangText(aboutData.paragraph1, 'TERKINA is a hybrid multimedia studio operating at the intersection of cinematic photography, high-end videography, and industrial-grade 3D additive manufacturing.')}
            </p>
            <p className="text-xs sm:text-sm text-white/50">
              {getLangText(aboutData.paragraph2, 'From editorial architectural shoots to micron-precise custom prototypes, our dual-pipeline infrastructure allows creators to scale visions without medium boundaries.')}
            </p>
            
            {/* Animated Dynamic Counters - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 sm:pt-8 border-t border-white/10 mt-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] sm:bg-transparent border sm:border-0 border-white/5">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                  <AnimatedNumber value={stats.stat1.val} suffix={stats.stat1.suffix} />
                </div>
                <div className="text-xs font-mono text-white/40 uppercase mt-1">
                  {getLangText(stats.stat1.label, 'Photo Sets')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] sm:bg-transparent border sm:border-0 border-white/5">
                <div className="text-3xl sm:text-4xl font-black text-purple-400 font-mono">
                  <AnimatedNumber value={stats.stat2.val} suffix={stats.stat2.suffix} />
                </div>
                <div className="text-xs font-mono text-white/40 uppercase mt-1">
                  {getLangText(stats.stat2.label, '3D Tolerance')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] sm:bg-transparent border sm:border-0 border-white/5">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                  <AnimatedNumber value={stats.stat3.val} suffix={stats.stat3.suffix} />
                </div>
                <div className="text-xs font-mono text-white/40 uppercase mt-1">
                  {getLangText(stats.stat3.label, 'Bespoke Craft')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
