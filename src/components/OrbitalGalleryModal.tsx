'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocusTrap } from '@/lib/useFocusTrap';
import { useT } from '@/lib/translations/TranslationsProvider';

export interface GalleryImage {
  id: string;
  url: string;
  title?: string;
}

export interface AlbumData {
  id: string;
  title: string;
  category?: string;
  images: GalleryImage[];
}

interface OrbitalGalleryModalProps {
  album: AlbumData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrbitalGalleryModal({ album, isOpen, onClose }: OrbitalGalleryModalProps) {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [angle, setAngle] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const requestRef = useRef<number>(0);
  const focusTrapRef = useFocusTrap(isOpen && !!album);
  const t = useT();

  const images = album?.images || [];
  const total = images.length;

  // Handle responsive window width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset states when album changes or closes
  useEffect(() => {
    if (!isOpen) {
      setActiveImage(null);
      setIsPaused(false);
      setAngle(0);
    }
  }, [isOpen, album]);

  // 1. Continuous Orbital Rotation Loop
  useEffect(() => {
    if (!isOpen || total === 0) return;

    const animate = () => {
      if (!isPaused && !activeImage) {
        // Rotation speed (lower = slower, more cinematic)
        setAngle((prev) => (prev + 0.003) % (2 * Math.PI));
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isOpen, isPaused, activeImage, total]);

  // 2. Keyboard Escape Handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeImage) {
          setActiveImage(null); // Back to orbit
        } else {
          onClose(); // Close album
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeImage, onClose]);

  if (!isOpen || !album) return null;

  // Dynamic radii (responsive: tighter on mobile, wider on desktop)
  const rx = isMobile ? 160 : 260; // horizontal radius — fills ~50-60% center
  const ry = isMobile ? 90 : 140;  // vertical radius (isometric tilt)

  return (
    <AnimatePresence>
      <motion.div
        ref={focusTrapRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="orbital-gallery-title"
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/90 backdrop-blur-3xl"
      >
        {/* ================= TOP CONTROLS & ALBUM INFO ================= */}
        <div className="absolute top-8 left-8 z-30 flex flex-col gap-1 select-none pointer-events-none">
          <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
            {album.category || t('orbitalGallery.defaultCategory', 'Portfolio Album')}
          </span>
          <h2 id="orbital-gallery-title" className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
            {album.title}
          </h2>
          <span className="text-xs font-mono text-white/40">
            {total} {t('orbitalGallery.framesHintSuffix', 'Frames • Hover to pause, click to expand')}
          </span>
        </div>

        {/* Top-Right Close Button (Closes Album) */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-30 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono uppercase tracking-widest transition-all hover:scale-105 flex items-center gap-2 cursor-pointer shadow-lg"
          aria-label="Close Album"
        >
          <span>✕</span>
          <span>{t('orbitalGallery.closeButton', 'Close Album')}</span>
        </button>

        {/* Heavy radial vignette – darkens everything outside the central cluster */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            background:
              'radial-gradient(ellipse 56% 62% at 50% 50%, transparent 0%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.92) 100%)',
          }}
        />

        {/* Center Aesthetic Emblem */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center gap-2 opacity-30 select-none">
          <span className="text-3xl text-white">✦</span>
          <span className="text-[9px] font-mono tracking-[0.4em] text-white uppercase">TERKINA</span>
        </div>

        {/* ================= 360° ORBITAL ROAMING RING ================= */}
        <div className="relative w-full h-full flex items-center justify-center">
          {images.map((img, index) => {
            // Calculate orbital position
            const itemAngle = angle + (index * (2 * Math.PI)) / total;

            const x = Math.cos(itemAngle) * rx;
            const y = Math.sin(itemAngle) * ry;

            // Depth effect based on vertical position in the circle
            const depthT = (y + ry) / (2 * ry); // 0 (back) → 1 (front)
            const depthScale = 0.7 + depthT * 0.35; // 0.70 → 1.05
            const depthOpacity = 0.4 + depthT * 0.6; // 0.40 → 1.00
            const zIndex = Math.round(depthT * 20);

            return (
              <motion.div
                key={img.id || index}
                style={{
                  position: 'absolute',
                  x,
                  y,
                  zIndex,
                  transformOrigin: 'center center',
                }}
                animate={{
                  scale: depthScale,
                  opacity: depthOpacity,
                }}
                whileHover={{
                  scale: depthScale * 1.6, // 40% scale-up on hover
                  zIndex: 40,
                  opacity: 1,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onClick={() => setActiveImage(img)}
                className="cursor-pointer group select-none"
              >
                {/* Photo Card */}
                <div className="relative w-20 sm:w-24 md:w-28 aspect-[3/4] rounded-lg overflow-hidden bg-neutral-900 border border-white/15 group-hover:border-white/60 transition-colors duration-300 shadow-2xl group-hover:shadow-white/10">
                  {img.url ? (
                    <img
                      src={img.url}
                      alt={img.title || 'Gallery image'}
                      className="w-full h-full object-cover pointer-events-none group-hover:brightness-110 transition-all duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white/30 text-[8px]">N/A</div>
                  )}
                  {/* Subtle glass reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                    <span className="text-[10px] font-mono text-white/90 truncate">
                      {img.title || `Frame 0${index + 1}`}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ================= 80–85% EXPANDED LIGHTBOX VIEW ================= */}
        <AnimatePresence>
          {activeImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-3xl"
            >
              {/* Back to Orbital View Button */}
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveImage(null)}
                className="absolute top-6 right-6 z-50 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase font-mono tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-2xl hover:scale-105 cursor-pointer"
                aria-label="Back to Orbit"
              >
                <span>✕</span>
                <span>{t('orbitalGallery.backButton', 'Back to Orbit')}</span>
              </motion.button>

              {/* 80-85% Scale Image Frame */}
              <motion.div
                initial={{ scale: 0.75, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.75, opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                className="relative w-[92vw] md:w-[85vw] max-w-6xl h-[85vh] rounded-3xl overflow-hidden border border-white/20 bg-[#08080a] shadow-2xl flex flex-col md:flex-row items-center justify-center p-4"
              >
                {/* Full-Scale Image */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
                  <img
                    src={activeImage.url}
                    alt={activeImage.title || 'Expanded Frame'}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl select-none"
                  />
                </div>

                {/* Bottom Caption Pill */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-mono text-white/80 uppercase tracking-widest flex items-center gap-4 pointer-events-none select-none max-w-[90%] truncate">
                  <span className="truncate">{activeImage.title || t('orbitalGallery.defaultFrameTitle', 'Untitled Shoot Frame')}</span>
                  <span className="text-white/30">•</span>
                  <span className="text-amber-300 shrink-0">Med Art & Terkina Studio</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
