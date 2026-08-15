import Image from 'next/image';
import Link from 'next/link';
import { Camera, Box, Plus, CheckCircle, Clock, Archive } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { MOCK_PHOTO_PROJECTS, MOCK_3D_PROJECTS } from '@/lib/mockData';

interface TableProjectItem {
  id: string;
  title: string;
  type: 'Photography' | '3D Printing';
  category: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  coverImage: string;
  sortOrder: number;
}

export default async function CrmDashboardPage() {
  let photoData: TableProjectItem[] = [];
  let threeDData: TableProjectItem[] = [];

  try {
    const supabase = await createClient();
    
    // Attempt fetching from Supabase table
    const { data: dbPhotos } = await supabase
      .from('photo_project')
      .select('*')
      .order('sort_order', { ascending: true });

    if (dbPhotos && dbPhotos.length > 0) {
      photoData = dbPhotos.map((p) => ({
        id: p.id,
        title: p.title,
        type: 'Photography',
        category: p.category_id || 'Photography',
        status: p.status,
        coverImage: p.cover_image_url || MOCK_PHOTO_PROJECTS[0].coverImage,
        sortOrder: p.sort_order || 0,
      }));
    }

    const { data: db3d } = await supabase
      .from('three_d_project')
      .select('*')
      .order('sort_order', { ascending: true });

    if (db3d && db3d.length > 0) {
      threeDData = db3d.map((p) => ({
        id: p.id,
        title: p.title,
        type: '3D Printing',
        category: '3D Model',
        status: p.status,
        coverImage: p.cover_image_url || MOCK_3D_PROJECTS[0].coverImage,
        sortOrder: p.sort_order || 0,
      }));
    }
  } catch {
    // If Supabase table isn't connected yet, use mock data fallbacks
  }

  // Fallback to mock dataset if DB is empty
  if (photoData.length === 0) {
    photoData = MOCK_PHOTO_PROJECTS.map((p, idx) => ({
      id: p.id,
      title: p.title,
      type: 'Photography',
      category: p.category,
      status: idx % 3 === 0 ? 'PUBLISHED' : idx % 3 === 1 ? 'DRAFT' : 'ARCHIVED',
      coverImage: p.coverImage,
      sortOrder: idx + 1,
    }));
  }

  if (threeDData.length === 0) {
    threeDData = MOCK_3D_PROJECTS.map((p, idx) => ({
      id: p.id,
      title: p.title,
      type: '3D Printing',
      category: p.category,
      status: idx % 2 === 0 ? 'PUBLISHED' : 'DRAFT',
      coverImage: p.coverImage,
      sortOrder: idx + 1,
    }));
  }

  const allProjects = [...photoData, ...threeDData];

  return (
    <div className="flex flex-col gap-8 max-w-7xl">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-zinc-400 text-sm">
            Manage projects, publication status, and gallery ordering
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/crm/photography"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            New Photo Project
          </Link>
          <Link
            href="/crm/3d"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
          >
            <Plus className="w-4 h-4" />
            New 3D Project
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#121218] border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase">Total Projects</span>
            <h3 className="font-heading font-black text-3xl text-white mt-1">{allProjects.length}</h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Camera className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121218] border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase">Published</span>
            <h3 className="font-heading font-black text-3xl text-white mt-1">
              {allProjects.filter((p) => p.status === 'PUBLISHED').length}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121218] border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase">Drafts & Archived</span>
            <h3 className="font-heading font-black text-3xl text-white mt-1">
              {allProjects.filter((p) => p.status !== 'PUBLISHED').length}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-panel rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-white">All Portfolio Records</h3>
          <span className="text-xs text-zinc-400 font-mono">Live PostgreSQL Table Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/80 text-xs uppercase font-semibold text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-6">Project</th>
                <th className="py-3.5 px-4">Medium</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {allProjects.map((project) => (
                <tr key={project.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-white text-sm">{project.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-medium">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md ${
                      project.type === 'Photography'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                    }`}>
                      {project.type === 'Photography' ? <Camera className="w-3 h-3" /> : <Box className="w-3 h-3" />}
                      {project.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs text-zinc-400">{project.category}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-zinc-400">#{project.sortOrder}</td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={project.type === 'Photography' ? '/crm/photography' : '/crm/3d'}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
                    >
                      Edit
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
