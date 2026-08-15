'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/store/useLanguageStore';
import { CursorProvider } from '@/components/ui/CustomCursor';
import Navbar from '@/components/navigation/Navbar';

interface ClientShellProps {
  children: ReactNode;
}

export default function ClientShell({ children }: ClientShellProps) {
  const pathname = usePathname();
  const { language, dir } = useLanguageStore();

  // Hide global main navbar when inside CRM admin dashboard
  const isCrmRoute = pathname.startsWith('/crm') || pathname.startsWith('/admin');

  // Sync <html> element attributes dynamically without reloading page
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  return (
    <CursorProvider>
      {/* Global Noise Grain Overlay */}
      <div className="noise-overlay" aria-hidden="true" />

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
  );
}
