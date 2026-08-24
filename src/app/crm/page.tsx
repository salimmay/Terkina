'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Box, ShoppingBag, Plus, CheckCircle, Clock, Archive, Sparkles, Filter, Layers, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_WEDDING_PROJECTS, MOCK_PRODUCTION_PROJECTS, MOCK_3D_PROJECTS, MOCK_PRODUCTS_DATA } from '@/lib/mockData';
import StatusDropdown from '@/components/admin/StatusDropdown';

type PlatformTab = 'ALL' | 'VISUAL_MEDIA' | 'THREE_D' | 'PRODUCTS';

interface UnifiedTableItem {
  id: string;
  title: string;
  platform: 'Visual Media' | '3D Engineering' | '3D Marketplace';
  division: 'MED ART (Weddings)' | 'TERKINA (Commercial)' | '3D Engineering Lab' | 'Marketplace Store';
  category: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  coverImage: string;
  meta: string;
  sortOrder: number;
  editHref: string;
  /** Supabase table backing this record — null = mock-only (no live status updates) */
  dbTable: 'photo_project' | 'three_d_project' | null;
}

export default function CrmDashboardPage() {
  const [activeTab, setActiveTab] = useState<PlatformTab>('ALL');

  // Build unified dataset from mock projects
  const visualMediaItems: UnifiedTableItem[] = [
    ...MOCK_WEDDING_PROJECTS.map((p, idx) => ({
      id: p.id,
      title: p.title,
      platform: 'Visual Media' as const,
      division: 'MED ART (Weddings)' as const,
      category: p.category,
      status: (idx % 3 === 0 ? 'PUBLISHED' : idx % 3 === 1 ? 'DRAFT' : 'ARCHIVED') as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
      coverImage: p.coverImage,
      meta: `${p.client} • ${p.location}`,
      sortOrder: idx + 1,
      editHref: '/crm/photography',
      dbTable: 'photo_project' as const,
    })),
    ...MOCK_PRODUCTION_PROJECTS.map((p, idx) => ({
      id: p.id,
      title: p.title,
      platform: 'Visual Media' as const,
      division: 'TERKINA (Commercial)' as const,
      category: p.category,
      status: (idx % 2 === 0 ? 'PUBLISHED' : 'PUBLISHED') as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
      coverImage: p.coverImage,
      meta: `${p.client} • ${p.location}`,
      sortOrder: MOCK_WEDDING_PROJECTS.length + idx + 1,
      editHref: '/crm/photography',
      dbTable: 'photo_project' as const,
    })),
  ];

  const threeDItems: UnifiedTableItem[] = MOCK_3D_PROJECTS.map((p, idx) => ({
    id: p.id,
    title: p.title,
    platform: '3D Engineering' as const,
    division: '3D Engineering Lab' as const,
    category: p.category,
    status: (idx % 2 === 0 ? 'PUBLISHED' : 'DRAFT') as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
    coverImage: p.coverImage,
    meta: `${p.specs.material} • ${p.specs.layerHeight}`,
    sortOrder: idx + 1,
    editHref: '/crm/3d',
    dbTable: 'three_d_project',
  }));

  const productItems: UnifiedTableItem[] = MOCK_PRODUCTS_DATA.map((p, idx) => ({
    id: p.id,
    title: p.title,
    platform: '3D Marketplace' as const,
    division: 'Marketplace Store' as const,
    category: `${p.category.toUpperCase()} • ${p.price}`,
    status: 'PUBLISHED' as const,
    coverImage: p.imageUrl,
    meta: `${p.material} • ${p.dimensions}`,
    sortOrder: idx + 1,
    editHref: '/crm/products',
    dbTable: null, // Marketplace items are still served from local mock data
  }));

  const allItems = [...visualMediaItems, ...threeDItems, ...productItems];

  const filteredItems = activeTab === 'ALL'
    ? allItems
    : activeTab === 'VISUAL_MEDIA'
    ? visualMediaItems
    : activeTab === 'THREE_D'
    ? threeDItems
    : productItems;

  return (
    <div className="flex flex-col gap-8 max-w-7xl pb-16">
      
      {/* Top Header & Fast Action CTAs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            Master Studio Control
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Unified management for Visual Media, 3D Studio, and Physical Marketplace Products
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/crm/photography"
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs flex items-center gap-2 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>New Visual Media Project</span>
          </Link>
          <Link
            href="/crm/products"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>New 3D Product</span>
          </Link>
        </div>
      </div>

      {/* Platform Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'ALL' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {activeTab === 'ALL' && (
            <motion.div
              layoutId="activeCrmTabPill"
              className="absolute inset-0 bg-white/10 border border-white/20 rounded-xl z-0"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          )}
          <span className="relative z-10">✦ All Platforms</span>
          <span className="relative z-10 px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] font-mono">
            {allItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('VISUAL_MEDIA')}
          className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'VISUAL_MEDIA' ? 'text-amber-300' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {activeTab === 'VISUAL_MEDIA' && (
            <motion.div
              layoutId="activeCrmTabPill"
              className="absolute inset-0 bg-amber-500/20 border border-amber-400/40 rounded-xl z-0"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>📸 Visual Media (Med Art + Terkina)</span>
          </span>
          <span className="relative z-10 px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
            {visualMediaItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('PRODUCTS')}
          className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'PRODUCTS' ? 'text-emerald-300' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {activeTab === 'PRODUCTS' && (
            <motion.div
              layoutId="activeCrmTabPill"
              className="absolute inset-0 bg-emerald-500/20 border border-emerald-400/40 rounded-xl z-0"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>🛍️ Marketplace Products</span>
          </span>
          <span className="relative z-10 px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
            {productItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('THREE_D')}
          className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'THREE_D' ? 'text-purple-300' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {activeTab === 'THREE_D' && (
            <motion.div
              layoutId="activeCrmTabPill"
              className="absolute inset-0 bg-purple-600/30 border border-purple-400/40 rounded-xl z-0"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5" />
            <span>🧊 3D Engineering Lab</span>
          </span>
          <span className="relative z-10 px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
            {threeDItems.length}
          </span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#121218] border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase">
              {activeTab === 'ALL' ? 'Total Active Records' : activeTab === 'VISUAL_MEDIA' ? 'Visual Media Sets' : activeTab === 'PRODUCTS' ? 'Marketplace Catalog' : '3D CAD Models'}
            </span>
            <h3 className="font-heading font-black text-3xl text-white mt-1">{filteredItems.length}</h3>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            {activeTab === 'PRODUCTS' ? <ShoppingBag className="w-5 h-5" /> : activeTab === 'THREE_D' ? <Box className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121218] border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase">Live Published</span>
            <h3 className="font-heading font-black text-3xl text-white mt-1">
              {filteredItems.filter((p) => p.status === 'PUBLISHED').length}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121218] border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase">Drafts & In-Progress</span>
            <h3 className="font-heading font-black text-3xl text-white mt-1">
              {filteredItems.filter((p) => p.status !== 'PUBLISHED').length}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Table Section with Live Filter Sync */}
      <div className="rounded-2xl border border-zinc-800 bg-[#121218] overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-lg text-white">
              {activeTab === 'ALL' ? 'All Active Studio Records' : activeTab === 'VISUAL_MEDIA' ? 'Visual Media Portfolio Projects' : activeTab === 'PRODUCTS' ? '3D Physical Marketplace Catalog' : '3D Additive Engineering Artifacts'}
            </h3>
            <span className="text-xs font-mono text-zinc-500">({filteredItems.length})</span>
          </div>
          <span className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Supabase PostgreSQL Linked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/90 text-xs uppercase font-semibold text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-6">Project / Product</th>
                <th className="py-3.5 px-4">Division</th>
                <th className="py-3.5 px-4">Category / Price / Specs</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Sort</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredItems.map((project) => (
                <tr key={project.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">{project.title}</span>
                        <span className="text-xs text-zinc-400 font-light truncate max-w-xs">{project.meta}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold ${
                      project.division.includes('Weddings')
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : project.division.includes('Commercial')
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                        : project.division.includes('Marketplace')
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                    }`}>
                      {project.division.includes('Marketplace') ? (
                        <ShoppingBag className="w-3 h-3" />
                      ) : project.division.includes('3D') ? (
                        <Box className="w-3 h-3" />
                      ) : (
                        <Camera className="w-3 h-3" />
                      )}
                      {project.division}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-zinc-300">
                    {project.category}
                  </td>
                  <td className="py-4 px-4">
                    {project.dbTable ? (
                      <StatusDropdown
                        projectId={project.id}
                        initialStatus={project.status}
                        tableName={project.dbTable}
                      />
                    ) : (
                      <StatusBadge status={project.status} />
                    )}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-zinc-400">#{project.sortOrder}</td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={project.editHref}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' }) {
  switch (status) {
    case 'PUBLISHED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle className="w-3 h-3" />
          PUBLISHED
        </span>
      );
    case 'DRAFT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <Clock className="w-3 h-3" />
          DRAFT
        </span>
      );
    case 'ARCHIVED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-500/15 text-zinc-400 border border-zinc-500/30">
          <Archive className="w-3 h-3" />
          ARCHIVED
        </span>
      );
  }
}
