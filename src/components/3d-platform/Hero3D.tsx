'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

function HeroMesh() {
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.6}>
      <mesh castShadow receiveShadow scale={1.8}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#220e3a"
          emissive="#7c3aed"
          emissiveIntensity={0.4}
          roughness={0.15}
          metalness={0.85}
          distort={0.3}
          speed={2}
          wireframe={true}
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  const { lang, dir } = useLanguage();
  const [mounted, setMounted] = useState(false);

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
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-xs font-mono text-purple-300 uppercase tracking-widest"
        >
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          {lang === 'ar' ? 'تصنيع إضافي عالي الدقة' : lang === 'fr' ? 'Fabrication Additive & Prototypage Rapide' : 'Additive Manufacturing & Rapid Prototyping'}
        </motion.div>

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
          <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} className="w-full h-full">
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#c084fc" />
            <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#3b82f6" />
            
            <Suspense fallback={null}>
              <Center>
                <HeroMesh />
              </Center>
              <Sparkles count={40} scale={4} size={1.8} speed={0.3} opacity={0.6} color="#c084fc" />
            </Suspense>

            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        )}

        <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/60 pointer-events-none">
          ✦ Interactive WebGL Mesh
        </div>
      </div>
    </section>
  );
}
