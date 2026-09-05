'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { useLocale } from '@/context/LocaleContext';
import { CursorProvider } from '@/components/ui/CustomCursor';
import { TranslationsProvider } from '@/lib/translations/TranslationsProvider';
import BrandLoader from '@/components/ui/BrandLoader';
import Navbar from '@/components/navigation/Navbar';

interface ClientShellProps {
  children: ReactNode;
}

export default function ClientShell({ children }: ClientShellProps) {
  const pathname = usePathname();
  const { locale: language, dir } = useLocale();

  // Hide global main navbar when inside CRM admin dashboard
  const isCrmRoute = pathname.startsWith('/crm') || pathname.startsWith('/admin');

  // Sync <html> element attributes dynamically without reloading page
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  return (
    <TranslationsProvider>
      <CursorProvider>
        {/* Brand splash on page load — skipped inside the CRM so admins aren't
            gated behind an animation on every refresh while editing. */}
        {!isCrmRoute && <BrandLoader />}

        {/* Global Noise Grain Overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Global toast notifications (admin updates, form submissions) */}
        <Toaster
          position="top-center"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              background: '#0d0c12',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontFamily: 'var(--font-body)',
            },
          }}
        />

        {/* Top Floating Transparent Navbar - Persistent across all public routes & sections */}
        {!isCrmRoute && <Navbar />}

        {/* Page & Language Transition Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${pathname}-${language}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="min-h-screen flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </CursorProvider>
    </TranslationsProvider>
  );
}
