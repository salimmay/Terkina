import React from 'react';
import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';

export default function StatCard({
  href,
  icon: Icon,
  label,
  value,
  hint,
  loading,
  accent = 'zinc',
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint: string;
  loading?: boolean;
  accent?: 'zinc' | 'amber' | 'cyan' | 'purple' | 'emerald';
}) {
  const accentText: Record<string, string> = {
    zinc: 'text-zinc-400',
    amber: 'text-amber-400',
    cyan: 'text-cyan-400',
    purple: 'text-violet-400',
    emerald: 'text-emerald-400',
  };
  const accentIconBg: Record<string, string> = {
    zinc: 'bg-zinc-800 text-zinc-300',
    amber: 'bg-amber-500/10 text-amber-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
    purple: 'bg-violet-500/10 text-violet-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
  };

  return (
    <Link
      href={href}
      className="group p-5 rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/60 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-9 h-9 rounded-md flex items-center justify-center ${accentIconBg[accent]}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
      </div>
      <div className="text-2xl font-semibold text-white tabular-nums">
        {loading ? <span className="text-zinc-600">—</span> : value}
      </div>
      <div className={`text-xs font-medium mt-1 ${accentText[accent]}`}>{label}</div>
      <div className="text-[11px] text-zinc-500 mt-0.5">{hint}</div>
    </Link>
  );
}
