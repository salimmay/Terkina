'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguageStore, Language } from '@/store/useLanguageStore';

export default function Navbar() {
  const { language: lang, setLanguage: setLang, dir } = useLanguageStore();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl">
      <nav
        dir={dir}
        className="flex items-center justify-between px-4 sm:px-6 py-3 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300"
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer min-h-[44px] px-1">
          <div className="w-5 h-5 flex items-center justify-center text-white text-xs font-mono group-hover:rotate-45 transition-transform duration-300">
            ✦
          </div>
          <span className="font-extrabold tracking-[0.2em] text-xs sm:text-sm text-white uppercase font-heading">
            TERKINA
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs tracking-wider uppercase font-medium text-white/70">
          <Link
            href="/photography"
            className="hover:text-white transition-colors duration-200"
          >
            {lang === 'ar' ? 'التصوير' : lang === 'fr' ? 'Photographie' : 'Photography'}
          </Link>
          <Link
            href="/3d"
            className="hover:text-white transition-colors duration-200"
          >
            {lang === 'ar' ? 'الطباعة ثلاثية الأبعاد' : lang === 'fr' ? 'Impression 3D' : '3D Printing'}
          </Link>

          {/* Scroll to section links */}
          <a
            href="/#about"
            onClick={(e) => handleSmoothScroll(e, 'about')}
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            {lang === 'ar' ? 'من نحن' : lang === 'fr' ? 'À Propos' : 'About Us'}
          </a>
          <a
            href="/#contact"
            onClick={(e) => handleSmoothScroll(e, 'contact')}
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            {lang === 'ar' ? 'تواصل معنا' : lang === 'fr' ? 'Contact' : 'Contact'}
          </a>
        </div>

        {/* Right Action Controls: Language Switcher & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-1.5 py-1 text-[11px] font-mono">
            <span className="text-white/40 text-xs mr-0.5">🌐</span>
            {(['en', 'fr', 'ar'] as const).map((locale: Language) => (
              <button
                key={locale}
                onClick={() => setLang(locale)}
                className={`px-2 py-1 rounded-full uppercase transition-all duration-200 min-h-[32px] ${
                  lang === locale
                    ? 'bg-blue-600 text-white font-bold shadow-md'
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
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            dir={dir}
            className="md:hidden mt-3 p-6 rounded-3xl bg-black/90 backdrop-blur-2xl border border-white/10 flex flex-col gap-3 text-center text-sm font-medium text-white/80 shadow-2xl"
          >
            <Link
              href="/photography"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-4 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
            >
              {lang === 'ar' ? 'التصوير' : lang === 'fr' ? 'Photographie' : 'Photography'}
            </Link>
            <Link
              href="/3d"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-4 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
            >
              {lang === 'ar' ? 'الطباعة ثلاثية الأبعاد' : lang === 'fr' ? 'Impression 3D' : '3D Printing'}
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
                handleSmoothScroll(e, 'about');
              }}
              className="py-3 px-4 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
            >
              {lang === 'ar' ? 'تواصل معنا' : lang === 'fr' ? 'Contact' : 'Contact'}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
