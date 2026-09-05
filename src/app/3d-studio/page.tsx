'use client';

import React from 'react';
import Hero3D from '@/components/3d-platform/Hero3D';
import MarketplaceGrid from '@/components/3d-platform/MarketplaceGrid';
import CustomPrintSection from '@/components/3d-platform/CustomPrintSection';
import { Cpu, Zap, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import JsonLd from '@/components/seo/JsonLd';
import { useT } from '@/lib/translations/TranslationsProvider';

export default function ThreeDStudioPage() {
  const { dir } = useLanguage();
  const t = useT();

  return (
    <main className="min-h-screen bg-[#050409] text-white selection:bg-purple-600 selection:text-white" dir={dir}>
      {/* Schema.org 3D Lab / Physical Objects Rich Snippet */}
      <JsonLd
        type="product"
        data={{
          title: 'TERKINA 3D Additive Fabrication & Ready-Made Objects',
          description:
            'Precision 3D printing, rapid prototyping, and physical custom design manufacturing.',
          imageUrl: '/og-preview.jpg',
          price: '95',
          is_in_stock: true,
        }}
      />

      {/* 1. Interactive 3D Real-time Hero */}
      <Hero3D />

      {/* 2. Industrial Capabilities Micro-Feature Section */}
      <section className="py-16 px-6 md:px-16 border-t border-b border-white/10 bg-[#07050d]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white mb-1">
                {t('threeDStudio.feature1Title', 'Micron Precision & Tolerances')}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                {t('threeDStudio.feature1Desc', 'SLA resin and precision sintered layers down to 0.025mm for ultra-smooth surface finish and mechanical fit.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white mb-1">
                {t('threeDStudio.feature2Title', 'Rapid Turnaround (24-48h)')}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                {t('threeDStudio.feature2Desc', 'Fast-track fabrication workflows with rapid batch prototyping and direct dispatch for time-sensitive launches.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white mb-1">
                {t('threeDStudio.feature3Title', 'Certified Engineering Polymers')}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                {t('threeDStudio.feature3Desc', 'Industrial-grade materials including Carbon Fiber Nylon, PC High-Temp, Translucent Resin, and Flexible TPU.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Physical Product Marketplace Grid */}
      <MarketplaceGrid />

      {/* 4. Custom 3D Print / CAD Order Section */}
      <CustomPrintSection />
    </main>
  );
}
