'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useT } from '@/lib/translations/TranslationsProvider';

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

export default function AboutSection() {
  const { dir } = useLanguageStore();
  const t = useT();

  const [stats, setStats] = useState({
    stat1: { val: 350, suffix: '+' },
    stat2: { val: 100, suffix: '%' },
    stat3: { val: 180, suffix: '+' },
  });

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((items) => {
        if (Array.isArray(items)) {
          items.forEach((item) => {
            if (item.key === 'stats' && item.content) setStats(item.content);
          });
        }
      })
      .catch(() => {});
  }, []);


  return (
    <section id="about" className="relative py-24 sm:py-32 px-5 sm:px-8 md:px-16 border-t border-white/10 bg-[#060609] overflow-hidden">
      {/* Background Ambient Spotlight with dual amber & cyan tones */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[300px] bg-amber-600/10 blur-[130px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[320px] sm:w-[500px] h-[300px] bg-cyan-600/10 blur-[130px] sm:blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10" dir={dir}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60 uppercase tracking-widest mb-6 sm:mb-8"
        >
          {t('home.about.badge', 'Who We Are')}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          <motion.h3 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[1.1] break-words"
          >
            {t('home.about.heading', 'Two Specialized Visions. One Cinematic Standard.')}
          </motion.h3>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 flex flex-col gap-5 sm:gap-6 text-white/70 text-sm sm:text-base md:text-lg font-light leading-relaxed"
          >
            <p>
              {t('home.about.paragraph1', 'TERKINA operates as a premier visual creative agency uniting two specialized divisions: MED ART, dedicated to luxury wedding cinematography and bespoke bridal storytelling, and TERKINA PRODUCTION, specializing in high-impact commercial advertising, corporate campaigns, and live event coverage.')}
            </p>
            <p className="text-xs sm:text-sm text-white/50">
              {t('home.about.paragraph2', 'Whether capturing the raw emotional beauty of wedding vows or directing high-production commercial sets and festival stages, our multi-camera cinema infrastructure and masterclass color science ensure unforgettable visual masterpieces.')}
            </p>
            
            {/* Animated Dynamic Counters - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 sm:pt-8 border-t border-white/10 mt-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] sm:bg-transparent border sm:border-0 border-white/5">
                <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono">
                  <AnimatedNumber value={stats.stat1.val} suffix={stats.stat1.suffix} />
                </div>
                <div className="text-xs font-mono text-white/40 uppercase mt-1">
                  {t('home.about.stat1Label', 'Weddings & Films')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] sm:bg-transparent border sm:border-0 border-white/5">
                <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">
                  <AnimatedNumber value={stats.stat2.val} suffix={stats.stat2.suffix} />
                </div>
                <div className="text-xs font-mono text-white/40 uppercase mt-1">
                  {t('home.about.stat2Label', 'Cinematic 4K/8K')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] sm:bg-transparent border sm:border-0 border-white/5">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                  <AnimatedNumber value={stats.stat3.val} suffix={stats.stat3.suffix} />
                </div>
                <div className="text-xs font-mono text-white/40 uppercase mt-1">
                  {t('home.about.stat3Label', 'Brands & Events')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
