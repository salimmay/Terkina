'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALES, localizedPath, withLocale } from '@/context/LocaleContext';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { useSound } from '@/context/SoundContext';
import { useT } from '@/lib/translations/TranslationsProvider';

export default function Navbar() {
  const { lang, dir } = useLanguage();
  const { whatsappNumber, logoUrl } = useSiteSettings();
  const t = useT();
  const { enabled: soundOn, toggle: toggleSound } = useSound();
  const pathname = usePathname();
  const router = useRouter();
  const is3D = pathname.includes('3d');

  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setScrolled(latest > 40);
    });
  }, [scrollY]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const isCurrentPage =
      (is3D && (targetId === 'marketplace' || targetId === 'custom-print')) ||
      (pathname === '/' && (targetId === 'about' || targetId === 'contact'));

    setMobileMenuOpen(false);

    if (isCurrentPage) {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      e.preventDefault();
      if (targetId === 'about' || targetId === 'contact') {
        router.push(`${withLocale('/', lang)}#${targetId}`);
      } else if (targetId === 'marketplace' || targetId === 'custom-print') {
        router.push(`${withLocale('/3d', lang)}#${targetId}`);
      }
    }
  };

  const navLinks = is3D
    ? [
        { id: 'marketplace', textKey: 'nav.marketplace', fallback: '3D Collection', isAnchor: true },
        { id: 'custom-print', textKey: 'nav.customPrint', fallback: 'Custom Print', isAnchor: true },
      ]
    : [
        { id: withLocale('/weddings', lang), textKey: 'nav.weddings', fallback: 'Med Art (Weddings)', isAnchor: false, color: 'text-amber-300' },
        { id: withLocale('/production', lang), textKey: 'nav.production', fallback: 'Terkina (Commercial)', isAnchor: false, color: 'text-cyan-300' },
        { id: 'about', textKey: 'nav.about', fallback: 'About Us', isAnchor: true },
        { id: 'contact', textKey: 'nav.contact', fallback: 'Contact', isAnchor: true },
      ];

  return (
    <>
      {/* ================= FLOATING DESKTOP & HEADER BAR ================= */}
      <motion.header
        animate={{
          y: scrolled ? 0 : 6,
          scale: scrolled ? 0.98 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <nav
          dir={dir}
          className={`pointer-events-auto flex items-center justify-between w-full max-w-6xl px-5 py-3 rounded-full transition-all duration-500 border ${
            scrolled
              ? 'bg-black/80 backdrop-blur-2xl border-white/15 shadow-2xl shadow-black/80 py-2.5'
              : 'bg-white/[0.03] backdrop-blur-xl border-white/10 shadow-lg'
          }`}
        >
          {/* Brand Logo */}
          <Link
            href={withLocale(is3D ? '/3d' : '/', lang)}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="TERKINA"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-[0.24em] text-sm text-white uppercase leading-none font-heading">
                TERKINA
              </span>
              <span className="text-[7px] font-mono tracking-widest text-white/40 uppercase mt-0.5">
                {is3D ? '3D LAB & FABRICATION' : 'CINEMATIC STUDIO'}
              </span>
            </div>
          </Link>

          {/* ================= DESKTOP NAVIGATION LINKS ================= */}
          <div
            onMouseLeave={() => setHoveredLink(null)}
            className="hidden md:flex items-center gap-1 relative bg-white/[0.02] p-1 rounded-full border border-white/5"
          >
            {navLinks.map((link) => {
              const label = t(link.textKey, link.fallback);
              const isHovered = hoveredLink === link.id;

              return (
                <div key={link.id} className="relative">
                  {link.isAnchor ? (
                    <a
                      href={is3D ? `${withLocale('/3d', lang)}#${link.id}` : `${withLocale('/', lang)}#${link.id}`}
                      onClick={(e) => handleSmoothScroll(e, link.id)}
                      onMouseEnter={() => setHoveredLink(link.id)}
                      className="relative z-10 block px-4 py-2 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={link.id}
                      onMouseEnter={() => setHoveredLink(link.id)}
                      className={`relative z-10 block px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors duration-200 ${
                        link.color || 'text-white/70 hover:text-white'
                      }`}
                    >
                      {label}
                    </Link>
                  )}

                  {/* Kinetic Sliding Spotlight Capsule */}
                  {isHovered && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                      className="absolute inset-0 z-0 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ================= RIGHT ACTION ZONE ================= */}
          <div className="flex items-center gap-3">
            {/* Shutter sound toggle — off by default, choice remembered */}
            <button
              type="button"
              onClick={toggleSound}
              data-no-shutter
              aria-pressed={soundOn}
              title={soundOn ? 'Turn shutter sound off' : 'Turn shutter sound on'}
              aria-label={soundOn ? 'Turn shutter sound off' : 'Turn shutter sound on'}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                soundOn
                  ? 'bg-white/10 border-white/25 text-white'
                  : 'bg-white/[0.03] border-white/10 text-white/40 hover:text-white/70'
              }`}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 text-[11px] font-mono">
              {LOCALES.map((locale) => (
                // A real link, not a state toggle — each language is its own
                // crawlable URL, and hreflang points search engines at it.
                <Link
                  key={locale}
                  href={localizedPath(pathname || '/', locale)}
                  hrefLang={locale}
                  className={`px-2 py-0.5 rounded-full uppercase transition-all duration-200 min-h-[28px] flex items-center cursor-pointer ${
                    lang === locale
                      ? is3D
                        ? 'bg-purple-600 text-white font-bold shadow-md'
                        : 'bg-white text-black font-bold shadow-md'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {locale}
                </Link>
              ))}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-white/10 border border-white/15 flex flex-col items-center justify-center gap-1 text-white focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              <motion.span
                animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 5 : 0 }}
                className="w-4 h-0.5 bg-white rounded-full block transition-transform"
              />
              <motion.span
                animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                className="w-4 h-0.5 bg-white rounded-full block transition-opacity"
              />
              <motion.span
                animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -5 : 0 }}
                className="w-4 h-0.5 bg-white rounded-full block transition-transform"
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ================= CINEMATIC FULLSCREEN MOBILE DRAWER ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-black/95 flex flex-col justify-between p-8 pt-28 md:hidden"
            dir={dir}
          >
            {/* Background Ambient Aura */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-600/10 blur-[130px] pointer-events-none" />

            {/* Staggered Navigation Links */}
            <div className="flex flex-col gap-6 relative z-10">
              <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                {t('nav.mobileMenuTitle', 'Menu Navigation')}
              </span>

              {navLinks.map((link, idx) => {
                const label = t(link.textKey, link.fallback);

                return (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (idx + 1), duration: 0.5 }}
                  >
                    {link.isAnchor ? (
                      <a
                        href={is3D ? `${withLocale('/3d', lang)}#${link.id}` : `${withLocale('/', lang)}#${link.id}`}
                        onClick={(e) => handleSmoothScroll(e, link.id)}
                        className="text-2xl font-black uppercase tracking-tight text-white hover:text-amber-300 transition-colors flex items-center justify-between"
                      >
                        <span>{label}</span>
                        <span className="text-sm font-mono text-white/30">0{idx + 1}</span>
                      </a>
                    ) : (
                      <Link
                        href={link.id}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-2xl font-black uppercase tracking-tight transition-colors flex items-center justify-between ${
                          link.color || 'text-white hover:text-white/70'
                        }`}
                      >
                        <span>{label}</span>
                        <span className="text-sm font-mono text-white/30">0{idx + 1}</span>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Footer & Direct WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative z-10 pt-6 border-t border-white/10 flex flex-col gap-4"
            >


              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-widest text-center shadow-xl cursor-pointer"
              >
                {t('nav.mobileWhatsappCta', '💬 Instant WhatsApp Booking →')}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

