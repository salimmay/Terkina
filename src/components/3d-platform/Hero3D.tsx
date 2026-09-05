'use client';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import PrintRig from './PrintRig';

export default function Hero3D() {
  const { lang, dir } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const layerRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 pt-28 pb-16 bg-[#050409] overflow-hidden">
      {/* Background Ambient Violet Light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-900/15 blur-[160px] pointer-events-none" />

      {/* Cyber Grid Background Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" 
      />

      {/* Left Column: Technical Headline & CTAs */}
      <div className="w-full lg:w-1/2 flex flex-col items-start gap-6 z-10 my-10" dir={dir}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.05]"
        >
          {lang === 'ar' ? (
            <>هندسة دقيقة <br /><span className="text-purple-400">لأفكارك الفيزيائية.</span></>
          ) : lang === 'fr' ? (
            <>Ingénierie 3D <br /><span className="text-purple-400">De Haute Précision.</span></>
          ) : (
            <>Precision 3D <br /><span className="text-purple-400">Engineering Lab.</span></>
          )}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-lg"
        >
          {lang === 'ar'
            ? 'نحوّل التصاميم الرقمية ثلاثية الأبعاد إلى نماذج فيزيائية ملموسة بدقة ميكرونية فائقة باستخدام أحدث تقنيات الراتنج (SLA) والألياف الصناعية (FDM).'
            : lang === 'fr'
            ? 'Des modèles CAO numériques aux prototypes physiques d\'une précision micronique. Résines SLA de pointe et polymères composites pour créateurs et industries.'
            : 'From generative digital CAD models to micron-precise physical prototypes. Industrial-grade SLA resin and composite engineering for creators, architects, and brands.'}
        </motion.p>

        {/* Action CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <a
            href="#marketplace"
            className="px-7 py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 min-h-[44px] flex items-center justify-center cursor-pointer"
          >
            {lang === 'ar' ? 'تصفح المتجر والمصنوعات' : lang === 'fr' ? 'Explorer la Boutique 3D' : 'Shop 3D Collection'} →
          </a>
          <a
            href="#custom-print"
            className="px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs uppercase tracking-wider transition-all min-h-[44px] flex items-center justify-center cursor-pointer"
          >
            {lang === 'ar' ? 'طلب طباعة خاصة' : lang === 'fr' ? 'Commande Sur Mesure' : 'Custom Print Order'}
          </a>
        </motion.div>

        {/* Micro Tech Specs */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 w-full max-w-md">
          <div>
            <div className="text-2xl font-black text-white font-mono">0.025<span className="text-xs text-purple-400">mm</span></div>
            <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">{lang === 'ar' ? 'أدنى سمك طبقة' : 'Min Layer Height'}</div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-300 font-mono">12+</div>
            <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">{lang === 'ar' ? 'مواد وراتنجات' : 'Resin & Polymers'}</div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">24-48<span className="text-xs text-purple-400">h</span></div>
            <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">{lang === 'ar' ? 'سرعة الإنجاز' : 'Rapid Turnaround'}</div>
          </div>
        </div>
      </div>

      {/* Right Column: Live Interactive 3D Canvas */}
      <div className="w-full lg:w-1/2 h-[420px] lg:h-[550px] relative flex items-center justify-center">
        {mounted ? (
          <>
            <Canvas
              shadows
              camera={{ position: [0, 0.9, 4.6], fov: 42 }}
              className="w-full h-full"
              onCreated={({ gl }) => {
                // Required for the per-material build-plane clipping.
                gl.localClippingEnabled = true;
              }}
            >
              <ambientLight intensity={0.45} />
              <directionalLight position={[6, 8, 5]} intensity={1.1} color="#e9d5ff" castShadow />
              <directionalLight position={[-8, -4, -6]} intensity={0.5} color="#3b82f6" />
              <spotLight position={[0, 6, 0]} angle={0.7} penumbra={1} intensity={2.2} color="#a855f7" />

              <Suspense fallback={null}>
                <PrintRig layerRef={layerRef} progressRef={progressRef} />
              </Suspense>

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 1.9}
              />
            </Canvas>

            {/* Live build readout, driven straight from the render loop */}
            <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6 pointer-events-none select-none">
              <div className="flex items-end justify-between mb-2 font-mono">
                <div>
                  <div className="text-[9px] tracking-[0.2em] text-purple-300/60 uppercase">
                    {lang === 'ar' ? 'جاري الطباعة' : lang === 'fr' ? 'Impression en cours' : 'Printing'}
                  </div>
                  <div className="text-sm text-white/90 tabular-nums">
                    {lang === 'ar' ? 'طبقة' : 'LAYER'}{' '}
                    <span ref={layerRef}>0000</span>
                    <span className="text-white/30"> / 1240</span>
                  </div>
                </div>
                <div className="text-[10px] text-purple-300/70 tabular-nums">0.025 mm</div>
              </div>
              <div className="h-px w-full bg-white/10 overflow-hidden">
                <div ref={progressRef} className="h-full bg-purple-400/80" style={{ width: '0%' }} />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        )}

      </div>
    </section>
  );
}
