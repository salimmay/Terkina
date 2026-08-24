'use client';

import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  age: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export default function GoldenCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only run on desktop/pointer devices
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Trail and particle state
    const trail: Point[] = [];
    const particles: Particle[] = [];
    const maxTrailPoints = 36; // Extended trail length

    let mouseX = -100;
    let mouseY = -100;
    let lastX = -100;
    let lastY = -100;

    const goldPalette = ['#FFFBEB', '#FDE047', '#F59E0B', '#D97706', '#B45309'];

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      trail.push({ x: mouseX, y: mouseY, age: 0 });
      if (trail.length > maxTrailPoints) {
        trail.shift();
      }

      // Calculate speed
      const dist = Math.hypot(mouseX - lastX, mouseY - lastY);
      if (dist > 3) {
        // Emit golden micro-sparkles
        const count = Math.min(Math.floor(dist / 5), 4);
        for (let i = 0; i < count; i++) {
          particles.push({
            x: mouseX + (Math.random() - 0.5) * 14,
            y: mouseY + (Math.random() - 0.5) * 14,
            vx: (Math.random() - 0.5) * 1.6,
            vy: (Math.random() - 0.5) * 1.6 - 0.2, // Subtle upward drift
            size: Math.random() * 2.4 + 1.0,
            alpha: 1,
            decay: Math.random() * 0.03 + 0.02,
            color: goldPalette[Math.floor(Math.random() * goldPalette.length)],
          });
        }
      }

      lastX = mouseX;
      lastY = mouseY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // ================= 1. DRAW WIDER GOLDEN RIBBON =================
      if (trail.length > 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 18; // Richer bloom

        for (let i = 1; i < trail.length; i++) {
          const xc = (trail[i].x + trail[i - 1].x) / 2;
          const yc = (trail[i].y + trail[i - 1].y) / 2;

          const progress = i / trail.length; // 0 at tail, 1 at cursor head

          // WIDER STROKE: Tapers from 1.5px at the tail up to 9.5px at the head
          const strokeWidth = progress * 8.0 + 1.5;

          // Outer Amber Glow Stroke
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.quadraticCurveTo(trail[i - 1].x, trail[i - 1].y, xc, yc);
          ctx.strokeStyle = `rgba(245, 158, 11, ${progress * 0.85})`;
          ctx.lineWidth = strokeWidth;
          ctx.stroke();

          // Inner Bright Champagne Core
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.quadraticCurveTo(trail[i - 1].x, trail[i - 1].y, xc, yc);
          ctx.strokeStyle = `rgba(254, 240, 138, ${progress * 0.95})`;
          ctx.lineWidth = strokeWidth * 0.45;
          ctx.stroke();
        }

        // Age trail points when mouse stops moving
        for (let i = trail.length - 1; i >= 0; i--) {
          trail[i].age += 1;
          if (trail[i].age > 18) {
            trail.splice(i, 1);
          }
        }
        ctx.restore();
      }

      // ================= 2. DRAW GOLDEN MICRO-SPARKLES =================
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#FDE047';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998] w-full h-full"
    />
  );
}
