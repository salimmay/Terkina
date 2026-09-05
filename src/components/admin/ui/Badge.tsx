import React from 'react';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'amber' | 'cyan' | 'purple';

const TONE_CLASSES: Record<Tone, string> = {
  neutral: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  danger: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
  purple: 'bg-violet-500/10 text-violet-400 border-violet-500/25',
};

export default function Badge({
  tone = 'neutral',
  dot = false,
  children,
  className = '',
}: {
  tone?: Tone;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium ${TONE_CLASSES[tone]} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
