'use client';

import React from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useT } from '@/lib/translations/TranslationsProvider';
import PackBuilder from '@/components/weddings/PackBuilder';
import JsonLd from '@/components/seo/JsonLd';

export default function WeddingPacksPage() {
  const { dir } = useLocale();
  const t = useT();

  return (
    <div
      className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#050508] text-white selection:bg-amber-400 selection:text-black"
      dir={dir}
    >
      <JsonLd
        type="gallery"
        data={{
          title: 'Med Art Wedding Packages & Pricing',
          description:
            'Wedding photography and cinematography packages in Tunisia, with transparent pricing and à-la-carte services.',
        }}
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-4xl h-[350px] bg-amber-600/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-12 pt-28 sm:pt-36">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] sm:text-xs font-mono text-amber-300 uppercase tracking-widest mb-4">
          ✨ {t('packs.pageBadge', 'MED ART — PACKAGES')}
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05] break-words">
          {t('packs.pageTitle', 'Build your wedding package')}
        </h1>

        <p className="mt-3 mb-12 text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed max-w-2xl">
          {t(
            'packs.pageIntro',
            'Pick a package from each category that interests you — the total updates as you go. When your selection is ready, send it straight to us.'
          )}
        </p>

        <PackBuilder />
      </div>
    </div>
  );
}
