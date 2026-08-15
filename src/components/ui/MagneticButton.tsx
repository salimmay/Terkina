'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from './CustomCursor';

export default function MagneticButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const { setCursorVariant } = useCursor();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 180, damping: 15 });
  const springY = useSpring(y, { stiffness: 180, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.35);
    y.set((e.clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setCursorVariant('default');
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursorVariant('button')}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      className={`relative inline-flex items-center justify-center transition-transform ${className}`}
    >
      {children}
    </motion.button>
  );
}
