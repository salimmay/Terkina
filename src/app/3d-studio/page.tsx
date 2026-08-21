'use client';

import React from 'react';
import Hero3D from '@/components/3d-platform/Hero3D';
import MarketplaceGrid from '@/components/3d-platform/MarketplaceGrid';
import CustomPrintSection from '@/components/3d-platform/CustomPrintSection';
import { Cpu, Zap, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ThreeDStudioPage() {
  const { lang, dir } = useLanguage();

  return (
    <main className="min-h-screen bg-[#050409] text-white selection:bg-purple-600 selection:text-white" dir={dir}>
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
                {lang === 'ar' ? 'دقة ميكرونية فائقة' : 'Micron Precision & Tolerances'}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                {lang === 'ar'
                  ? 'طباعة ثلاثية الأبعاد بدقة تصل إلى 25 ميكرون لضمان تطابق الأجزاء الميكانيكية والنماذج المعمارية.'
                  : 'SLA resin and precision sintered layers down to 0.025mm for ultra-smooth surface finish and mechanical fit.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white mb-1">
                {lang === 'ar' ? 'تسليم سريع (24-48 ساعة)' : 'Rapid Turnaround (24-48h)'}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                {lang === 'ar'
                  ? 'إنتاج النماذج الأولية والمصنوعات بسرعة قياسية مع فحص الجودة قبل التسليم والشحن الفوري.'
                  : 'Fast-track fabrication workflows with rapid batch prototyping and direct dispatch for time-sensitive launches.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white mb-1">
                {lang === 'ar' ? 'بوليمرات وراتنجات معتمدة' : 'Certified Engineering Polymers'}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                {lang === 'ar'
                  ? 'خيارات متعددة تشمل الكربون فايبر، الراتنج الشفاف، والـ TPU المرن للاستخدامات الصناعية والجمالية.'
                  : 'Industrial-grade materials including Carbon Fiber Nylon, PC High-Temp, Translucent Resin, and Flexible TPU.'}
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
