'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import StatusDropdown, { ProjectStatus } from './StatusDropdown';

interface PhotoProjectItem {
  id: string;
  title: string;
  category: string;
  status: ProjectStatus;
  sort_order: number;
  cover_image_url: string;
  description: string;
  frames_count?: number;
  created_at: string;
}

interface PhotoProjectTableProps {
  platform: 'MED_ART' | 'TERKINA_PROD';
  title: string;
  subtitle: string;
  createHref: string;
  accentColor?: 'amber' | 'cyan';
}

/**
 * Unified photography album management table.
 * Serves both /admin/weddings (MED_ART) and /admin/commercial (TERKINA_PROD).
 *
 * NOTE: the `photo_project` schema has no dedicated platform column —
 * the division is embedded as a `[Platform: X | Category: Y]` tag at the
 * start of the description, which we parse and filter on client-side.
 */
export default function PhotoProjectTable({
  platform,
  title,
  subtitle,
  createHref,
  accentColor = 'amber',
}: PhotoProjectTableProps) {
  const [projects, setProjects] = useState<PhotoProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const isAmber = accentColor === 'amber';

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('photo_project')
      .select(
        `
        id,
        title,
        description,
        status,
        sort_order,
        cover_image_url,
        created_at,
        photo_gallery ( id )
      `
      )
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });

    if (!error && data) {
      const rows = data as unknown as Array<{
        id: string;
        title: string;
        description: string | null;
        status: ProjectStatus;
        sort_order: number;
        cover_image_url: string | null;
        created_at: string;
        photo_gallery: Array<{ id: string }> | null;
      }>;

      setProjects(
        rows
          .filter((item) => {
            const match = (item.description || '').match(/^\[Platform:\s*([A-Z_]+)\s*\|/);
            return (match ? match[1] : null) === platform;
          })
          .map((item) => ({
            id: item.id,
            title: item.title,
            category:
              platform === 'MED_ART'
                ? item.description?.match(/\[Platform:[^\]]*Category:\s*([^\]]+)\]/)?.[1]?.trim() ||
                  'Bridal & Weddings'
                : item.description?.match(/\[Platform:[^\]]*Category:\s*([^\]]+)\]/)?.[1]?.trim() ||
                  'Commercial & Ads',
            platform,
            status: item.status,
            sort_order: item.sort_order,
            cover_image_url: item.cover_image_url || '/placeholder.jpg',
            description: (item.description || '').replace(/^\[[^\]]+\]\s*/, ''),
            frames_count: item.photo_gallery?.length || 0,
            created_at: item.created_at,
          }))
      );
    } else if (error) {
      console.error('Failed to load albums:', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete album "${name}"?`)) {
      // Soft-delete per schema (30-day recovery window)
      const { error } = await supabase
        .from('photo_project')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (!error) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete album');
      }
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1
            className={`text-2xl font-black uppercase tracking-wider ${
              isAmber ? 'text-amber-300' : 'text-cyan-300'
            }`}
          >
            {title}
          </h1>
          <p className="text-xs font-mono text-white/50 mt-1">{subtitle}</p>
        </div>

        <Link
          href={createHref}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg text-black ${
            isAmber ? 'bg-amber-400 hover:bg-amber-300' : 'bg-cyan-400 hover:bg-cyan-300'
          }`}
        >
          + Create New Album
        </Link>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-white/10 bg-[#08070d]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between text-xs font-mono text-white/40">
          <span>Active Album Records</span>
          <span>Total Albums: {projects.length}</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-white/40 animate-pulse">
            Loading album inventory...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center text-xs font-mono text-white/40">
            No albums found. Click "+ Create New Album" to upload your first project.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.02] border-b border-white/10 text-white/40 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Cover & Album Title</th>
                  <th className="py-3.5 px-6">Frames Count</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/[0.01] transition-colors">
                    {/* Cover + Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-14 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.cover_image_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-sm">{project.title}</span>
                          <span className="text-white/40 text-[11px] line-clamp-1 max-w-sm">
                            {project.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Frames Count */}
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px]">
                        📸 {project.frames_count} Frames
                      </span>
                    </td>

                    {/* Interactive Status Dropdown */}
                    <td className="py-4 px-6">
                      <StatusDropdown
                        projectId={project.id}
                        initialStatus={project.status}
                        tableName="photo_project"
                        onUpdate={(newStatus) => {
                          setProjects((prev) =>
                            prev.map((p) => (p.id === project.id ? { ...p, status: newStatus } : p))
                          );
                        }}
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
