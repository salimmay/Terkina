'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollIndicator({ targetId = 'about' }: { targetId?: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.a
      href={`#${targetId}`}
      onClick={handleClick}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer group"
    >
      <span className="text-[10px] font-mono tracking-[0.25em] uppercase group-hover:tracking-[0.35em] transition-all">
        Scroll Down
      </span>

      {/* Mouse Icon with sliding wheel */}
      <div className="w-5 h-8 rounded-full border border-white/25 flex items-start justify-center p-1 group-hover:border-white/60 transition-colors">
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [1, 0.2, 1],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-1 h-1.5 rounded-full bg-white"
        />
      </div>
    </motion.a>
  );
}
