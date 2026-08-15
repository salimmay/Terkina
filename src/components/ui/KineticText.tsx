'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

export default function KineticText({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    hidden: { y: '120%', opacity: 0, rotateZ: 4 },
    visible: {
      y: '0%',
      opacity: 1,
      rotateZ: 0,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className={`inline-flex flex-wrap overflow-hidden gap-x-[0.25em] ${className}`}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden py-1">
          <motion.span variants={child} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
