'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Camera, Box, ShoppingBag, FolderTree, Inbox, LogOut, Sparkles, LayoutDashboard, FileEdit, Menu, X } from 'lucide-react';
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
    { label: 'Master Overview', href: '/crm', icon: LayoutDashboard },
    { label: 'Visual Media (Med Art / Terkina)', href: '/crm/photography', icon: Camera },
    { label: '3D Engineering Studio', href: '/crm/3d', icon: Box },
    { label: '3D Marketplace Products', href: '/crm/products', icon: ShoppingBag },
    { label: 'Categories Manager', href: '/crm/categories', icon: FolderTree },
    { label: 'Site Content & Copy', href: '/crm/content', icon: FileEdit },
    { label: 'Inquiry Inbox', href: '/crm/inbox', icon: Inbox, badge: '3' },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#09090b] text-white flex flex-col md:flex-row overflow-x-hidden">
      
      {/* Mobile Sticky Header Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0c0c10]/95 backdrop-blur-md border-b border-zinc-800/80 px-5 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading font-extrabold text-lg tracking-wider text-white">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span>TERKINA <span className="text-xs font-mono text-purple-400 font-normal">UNIFIED CRM</span></span>
        </Link>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
          aria-label="Toggle CRM navigation"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Sidebar & Mobile Collapsible Menu */}
      <aside
        className={`w-full md:w-72 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-[#0c0c10] p-6 md:flex flex-col justify-between gap-6 shrink-0 ${
          mobileNavOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="flex flex-col gap-6 md:gap-8">
          
          {/* Brand Logo */}
          <Link href="/" className="hidden md:flex items-center gap-2.5 font-heading font-extrabold text-lg tracking-wider text-white">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 via-blue-600 to-amber-400 flex items-center justify-center text-white text-xs font-mono">
              ✦
            </div>
            <div className="flex flex-col">
              <span className="leading-none font-black text-sm tracking-widest">TERKINA</span>
              <span className="text-[10px] font-mono text-zinc-400 font-normal">UNIFIED MASTER CRM</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-3 mb-1">Platforms</span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-purple-600/15 border border-purple-500/30 text-white font-bold shadow-lg shadow-purple-600/10'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-zinc-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User / Session Section */}
        <div className="pt-4 border-t border-zinc-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Studio Admin</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live PostgreSQL Sync
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 md:p-10 overflow-y-auto max-w-full">
        {children}
      </main>
    </div>
  );
}
