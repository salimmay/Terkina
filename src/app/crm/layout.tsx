'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Camera, Box, FolderTree, Inbox, LogOut, Sparkles, LayoutDashboard, FileEdit, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CrmLayoutProps {
  children: ReactNode;
}

export default function CrmLayout({ children }: CrmLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on login page, render without sidebar shell
  if (pathname === '/crm/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    document.cookie = 'terkina-admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/crm/login');
  };

  const navItems = [
    { label: 'Overview', href: '/crm', icon: LayoutDashboard },
    { label: 'Photography', href: '/crm/photography', icon: Camera },
    { label: '3D Projects', href: '/crm/3d', icon: Box },
    { label: 'Categories', href: '/crm/categories', icon: FolderTree },
    { label: 'Site Content', href: '/crm/content', icon: FileEdit },
    { label: 'Inbox', href: '/crm/inbox', icon: Inbox, badge: '3' },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#09090b] text-white flex flex-col md:flex-row overflow-x-hidden">
      
      {/* Mobile Sticky Header Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0c0c10]/95 backdrop-blur-md border-b border-zinc-800/80 px-5 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading font-extrabold text-lg tracking-wider text-white">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <span>TERKINA <span className="text-xs font-mono text-blue-400 font-normal">CRM</span></span>
        </Link>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          aria-label="Toggle CRM navigation"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Sidebar & Mobile Collapsible Menu */}
      <aside
        className={`w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-[#0c0c10] p-6 md:flex flex-col justify-between gap-6 shrink-0 ${
          mobileNavOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="flex flex-col gap-6 md:gap-8">
          
          {/* Brand Logo (Desktop only) */}
          <Link href="/" className="hidden md:flex items-center gap-2 font-heading font-extrabold text-xl tracking-wider text-white">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span>TERKINA <span className="text-xs font-mono text-blue-400 font-normal">CRM</span></span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4.5 h-4.5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between mt-4 md:mt-0">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">Agency Admin</span>
            <span className="text-[10px] text-zinc-500">admin@terkina.com</span>
          </div>
          <button
            onClick={handleLogout}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto max-w-full">
        {children}
      </main>
    </div>
  );
}
