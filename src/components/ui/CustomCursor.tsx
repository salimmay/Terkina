'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export type CursorVariant = 'default' | 'photo' | '3d' | 'button' | 'hidden';

interface CursorContextType {
  setCursorVariant: (variant: CursorVariant, text?: string) => void;
}

const CursorContext = createContext<CursorContextType>({
  setCursorVariant: () => {},
});

export const useCursor = () => useContext(CursorContext);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [customText, setCustomText] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Strictly enable custom cursor on mouse/pointer devices only
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      setIsVisible(true);
    }

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [mouseX, mouseY]);

  const setCursorVariant = (v: CursorVariant, text?: string) => {
    setVariant(v);
    if (text !== undefined) setCustomText(text);
  };

  if (!isVisible) return <CursorContext.Provider value={{ setCursorVariant }}>{children}</CursorContext.Provider>;

  return (
    <CursorContext.Provider value={{ setCursorVariant }}>
      {/* Follower Dot / Lens */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: variant === 'photo' ? 90 : variant === '3d' ? 100 : variant === 'button' ? 56 : 14,
          height: variant === 'photo' ? 90 : variant === '3d' ? 100 : variant === 'button' ? 56 : 14,
          opacity: variant === 'hidden' ? 0 : 1,
          scale: variant === 'hidden' ? 0 : 1,
          backgroundColor:
            variant === 'photo'
              ? 'rgba(255, 255, 255, 0.15)'
              : variant === '3d'
              ? 'rgba(168, 85, 247, 0.2)'
              : variant === 'button'
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: variant === 'photo' || variant === '3d' ? 'blur(8px)' : 'none',
          borderColor:
            variant === 'photo'
              ? 'rgba(255, 255, 255, 0.4)'
              : variant === '3d'
              ? 'rgba(192, 132, 252, 0.6)'
              : 'transparent',
          borderWidth: variant === 'photo' || variant === '3d' ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="custom-cursor-element fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center text-center overflow-hidden shadow-2xl mix-blend-difference"
      >
        {(variant === 'photo' || variant === '3d') && (
          <span className="text-[10px] font-mono tracking-widest font-bold text-white uppercase px-2">
            {customText || (variant === 'photo' ? 'EXPAND' : 'ORBIT 360°')}
          </span>
        )}
      </motion.div>
      {children}
    </CursorContext.Provider>
  );
}

export default function CustomCursor() {
  return null;
}
