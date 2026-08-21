'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, Language } from '@/context/LanguageContext';

export default function Navbar() {
  const { lang, setLang, dir } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if currently on the 3D platform
  const is3DPlatform = pathname.includes('3d');

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const isCurrentPageSection = 
      (is3DPlatform && (targetId === 'marketplace' || targetId === 'custom-print')) ||
      (pathname === '/' && (targetId === 'about' || targetId === 'contact'));

    if (isCurrentPageSection) {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      if (targetId === 'about' || targetId === 'contact') {
        e.preventDefault();
        router.push(`/#${targetId}`);
      } else if (targetId === 'marketplace' || targetId === 'custom-print') {
        e.preventDefault();
        router.push(`/3d#${targetId}`);
      }
    }
  };

  return (
    <header className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl">
      <nav 
        dir={dir}
        className="flex items-center justify-between px-4 sm:px-6 py-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300"
      >
        {/* Brand Logo & Platform Badge */}
        <Link 
          href={is3DPlatform ? '/3d' : '/'} 
          className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer min-h-[44px] px-1"
        >
          <div className="w-5 h-5 flex items-center justify-center text-white text-xs font-mono group-hover:rotate-45 transition-transform duration-300">
            ✦
          </div>
          <span className="font-extrabold tracking-[0.2em] text-xs sm:text-sm text-white uppercase font-heading">
            TERKINA
          </span>
          {is3DPlatform && (
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-mono font-bold uppercase tracking-wider">
              3D
            </span>
          )}
        </Link>

        {/* Dedicated Navigation Links (Zero Cross-Platform Links) */}
        <div className="hidden md:flex items-center gap-8 text-xs tracking-wider uppercase font-medium">
          {is3DPlatform ? (
            /* ================= 3D PLATFORM ONLY ================= */
            <>
              <a
                href="#marketplace"
                onClick={(e) => handleSmoothScroll(e, 'marketplace')}
                className="text-white/70 hover:text-purple-300 transition-colors duration-200 cursor-pointer"
              >
                {lang === 'ar' ? 'المتجر والمنتجات' : lang === 'fr' ? 'Collection 3D' : '3D Collection'}
              </a>

              <a
                href="#custom-print"
                onClick={(e) => handleSmoothScroll(e, 'custom-print')}
                className="text-white/70 hover:text-purple-300 transition-colors duration-200 cursor-pointer"
              >
                {lang === 'ar' ? 'طلب طباعة خاصة' : lang === 'fr' ? 'Impression Sur Mesure' : 'Custom Print'}
              </a>
            </>
          ) : (
            /* ================= PHOTOGRAPHY PLATFORM ONLY ================= */
            <>
              <Link
                href="/weddings"
                className="text-white/70 hover:text-amber-300 transition-colors duration-200"
              >
                {lang === 'ar' ? 'أعراس (Med Art)' : lang === 'fr' ? 'Mariages (Med Art)' : 'Med Art (Weddings)'}
              </Link>

              <Link
                href="/production"
                className="text-white/70 hover:text-cyan-300 transition-colors duration-200"
              >
                {lang === 'ar' ? 'إنتاج (Terkina)' : lang === 'fr' ? 'Production (Terkina)' : 'Terkina (Commercial)'}
              </Link>

              <a
                href="/#about"
                onClick={(e) => handleSmoothScroll(e, 'about')}
                className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {lang === 'ar' ? 'من نحن' : lang === 'fr' ? 'À Propos' : 'About Us'}
              </a>

              <a
                href="/#contact"
                onClick={(e) => handleSmoothScroll(e, 'contact')}
                className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {lang === 'ar' ? 'تواصل معنا' : lang === 'fr' ? 'Contact' : 'Contact'}
              </a>
            </>
          )}
        </div>

        {/* Right Action: Language Switcher & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-1.5 py-1 text-[11px] font-mono">
            <span className="text-white/40 text-xs mr-0.5">🌐</span>
            {(['en', 'fr', 'ar'] as const).map((locale: Language) => (
              <button
                key={locale}
                onClick={() => setLang(locale)}
                className={`px-2 py-1 rounded-full uppercase transition-all duration-200 min-h-[32px] cursor-pointer ${
                  lang === locale
                    ? is3DPlatform
                      ? 'bg-purple-600 text-white font-bold shadow-md'
                      : 'bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {locale}
              </button>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Dynamic Mobile Drawer (Standalone Zero Cross-Links) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            dir={dir}
            className="md:hidden mt-3 p-6 rounded-3xl bg-black/95 backdrop-blur-2xl border border-white/10 flex flex-col gap-3 text-center text-sm font-medium text-white/80 shadow-2xl"
          >
            {is3DPlatform ? (
              <>
                <a
                  href="#marketplace"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleSmoothScroll(e, 'marketplace');
                  }}
                  className="py-3 px-4 rounded-xl hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
                >
                  {lang === 'ar' ? 'المتجر والمنتجات' : lang === 'fr' ? 'Collection 3D' : '3D Collection'}
                </a>

                <a
                  href="#custom-print"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleSmoothScroll(e, 'custom-print');
                  }}
                  className="py-3 px-4 rounded-xl hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
                >
                  {lang === 'ar' ? 'طلب طباعة خاصة' : lang === 'fr' ? 'Impression Sur Mesure' : 'Custom Print'}
                </a>
              </>
            ) : (
              <>
                <Link
                  href="/weddings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 rounded-xl hover:bg-amber-500/10 hover:text-amber-300 transition-colors"
                >
                  {lang === 'ar' ? 'أعراس (Med Art)' : lang === 'fr' ? 'Mariages (Med Art)' : 'Med Art (Weddings)'}
                </Link>

                <Link
                  href="/production"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
                >
                  {lang === 'ar' ? 'إنتاج (Terkina)' : lang === 'fr' ? 'Production (Terkina)' : 'Terkina (Commercial)'}
                </Link>

                <a
                  href="/#about"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleSmoothScroll(e, 'about');
                  }}
                  className="py-3 px-4 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
                >
                  {lang === 'ar' ? 'من نحن' : lang === 'fr' ? 'À Propos' : 'About Us'}
                </a>

                <a
                  href="/#contact"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleSmoothScroll(e, 'contact');
                  }}
                  className="py-3 px-4 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
                >
                  {lang === 'ar' ? 'تواصل معنا' : lang === 'fr' ? 'Contact' : 'Contact'}
                </a>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
