'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Heart,
  Clapperboard,
  Box,
  Inbox,
  Settings,
  Package,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_LINKS: NavLink[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/weddings', label: 'Med Art Weddings', icon: Heart },
  { href: '/admin/commercial', label: 'Terkina Commercial', icon: Clapperboard },
  { href: '/admin/packs', label: 'Med Art Packs', icon: Package },
  { href: '/admin/products', label: '3D Marketplace', icon: Box },
  { href: '/admin/inbox', label: 'Leads & Inbox', icon: Inbox },
  { href: '/admin/content', label: 'Site Settings', icon: Settings },
  { href: '/admin/trash', label: 'Trash', icon: Trash2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [dbStatus, setDbStatus] = useState<'checking' | 'ready' | 'needs_migration'>('checking');
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;
    async function checkDb() {
      try {
        const supabase = createClient();
        const { error } = await supabase.from('photo_project').select('id').limit(1);
        if (error && error.code === 'PGRST205') {
          setDbStatus('needs_migration');
        } else {
          setDbStatus('ready');
        }
      } catch {
        setDbStatus('ready');
      }
    }
    checkDb();
  }, [isLoginPage]);

  // The login screen owns its own full-viewport layout — skip the CRM shell.
  if (isLoginPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row antialiased selection:bg-zinc-700 selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-60 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between shrink-0 md:h-screen md:sticky md:top-0">
        <div>
          {/* Brand Header */}
          <Link href="/admin" className="flex items-center gap-2.5 px-5 h-16 border-b border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="TERKINA" className="w-7 h-7 object-contain shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-sm text-white block leading-tight">TERKINA</span>
              <span className="text-[11px] text-zinc-500 leading-tight">Studio CRM</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="p-3 space-y-0.5">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white font-medium'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/*  Live Portals */}
        <div className="p-3 border-t border-zinc-800 space-y-3">
          <div className="flex flex-col gap-0.5">
            <Link
              href="/"
              target="_blank"
              className="px-2.5 py-1.5 rounded-md text-xs text-zinc-500 hover:text-white hover:bg-zinc-800/60 flex items-center justify-between transition-colors"
            >
              <span>View main site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/3d"
              target="_blank"
              className="px-2.5 py-1.5 rounded-md text-xs text-zinc-500 hover:text-white hover:bg-zinc-800/60 flex items-center justify-between transition-colors"
            >
              <span>View 3D lab</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 min-w-0 overflow-y-auto md:h-screen">
        {dbStatus === 'needs_migration' && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 text-xs text-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                <strong>PostgreSQL tables not initialized in Supabase.</strong> Run{' '}
                <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200">
                  supabase/complete_setup.sql
                </code>{' '}
                in your Supabase SQL Editor.
              </span>
            </div>
            <a
              href="https://supabase.com/dashboard/project/sexjfzbncrreazaijvzg/sql/new"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 rounded-md bg-amber-400 text-black font-semibold text-[11px] shrink-0 hover:bg-amber-300 transition-colors"
            >
              Open SQL Editor
            </a>
          </div>
        )}
        <div className="p-6 md:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
