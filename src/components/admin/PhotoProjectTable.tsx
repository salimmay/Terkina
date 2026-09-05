'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Trash2, Pencil, Plus, Images } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import StatusDropdown, { ProjectStatus } from './StatusDropdown';
import { triggerRevalidate } from '@/lib/revalidate';
import { logTrashItem } from '@/lib/trash';
import { PageHeader, Card, Badge, Button, EmptyState, ConfirmDialog } from '@/components/admin/ui';

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
  const [pendingDelete, setPendingDelete] = useState<PhotoProjectItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const supabase = createClient();

  const badgeTone = accentColor === 'amber' ? 'amber' : 'cyan';
  const targetRoute = platform === 'MED_ART' ? '/weddings' : '/production';

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
              item.description?.match(/\[Platform:[^\]]*Category:\s*([^\]]+)\]/)?.[1]?.trim() ||
              (platform === 'MED_ART' ? 'Bridal & Weddings' : 'Commercial & Ads'),
            status: item.status,
            sort_order: item.sort_order,
            cover_image_url: item.cover_image_url || '/placeholder.jpg',
            description: (item.description || '').replace(/^\[[^\]]+\]\s*/, ''),
            frames_count: item.photo_gallery?.length || 0,
            created_at: item.created_at,
          }))
      );
    } else if (error) {
      if (error.code === 'PGRST205') {
        console.warn('Supabase table `photo_project` not yet created. Run `supabase/complete_setup.sql`.');
      } else {
        console.error('Failed to load albums:', error.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);

    // Capture every Cloudinary asset this album owns before soft-deleting it,
    // so the Trash entry knows exactly what to purge if it's ever emptied.
    const { data: galleryRows } = await supabase
      .from('photo_gallery')
      .select('image_url')
      .eq('project_id', pendingDelete.id);
    const cloudinaryUrls = [
      pendingDelete.cover_image_url,
      ...((galleryRows || []) as Array<{ image_url: string }>).map((g) => g.image_url),
    ];

    // Soft-delete per schema (30-day recovery window)
    const { error } = await supabase
      .from('photo_project')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', pendingDelete.id);
    setDeleting(false);

    if (error) {
      toast.error('Failed to delete album');
      return;
    }

    const logged = await logTrashItem({
      item_type: 'album',
      title: pendingDelete.title,
      preview_url: pendingDelete.cover_image_url,
      platform,
      source_id: pendingDelete.id,
      restore_payload: { mode: 'soft_delete_undo', table: 'photo_project' },
      cloudinary_urls: cloudinaryUrls,
    });

    setProjects((prev) => prev.filter((p) => p.id !== pendingDelete.id));
    triggerRevalidate(targetRoute);
    if (logged) {
      toast.success(`"${pendingDelete.title}" moved to trash.`);
    } else {
      toast.warning(
        `"${pendingDelete.title}" was hidden from the site, but could not be added to Trash — run supabase/trash_items.sql to enable recovery.`
      );
    }
    setPendingDelete(null);
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={subtitle}
        action={
          <Link href={createHref}>
            <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              Create album
            </Button>
          </Link>
        }
      />

      <Card padded={false}>
        <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>Active album records</span>
          <span>{projects.length} albums</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-zinc-500">Loading album inventory...</div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={Images}
            title="No albums yet"
            description="Create your first album to publish it to the live gallery."
            action={
              <Link href={createHref}>
                <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                  Create album
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-500 text-xs uppercase tracking-wide border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-5 font-medium">Album</th>
                  <th className="py-2.5 px-5 font-medium">Frames</th>
                  <th className="py-2.5 px-5 font-medium">Status</th>
                  <th className="py-2.5 px-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-13 rounded-md overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.cover_image_url || '/placeholder.jpg'}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-white truncate">{project.title}</div>
                          <Badge tone={badgeTone} className="mt-1">{project.category}</Badge>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-5 text-zinc-400">{project.frames_count} frames</td>

                    <td className="py-3 px-5">
                      <StatusDropdown
                        projectId={project.id}
                        initialStatus={project.status}
                        tableName="photo_project"
                        onUpdate={(newStatus) => {
                          setProjects((prev) =>
                            prev.map((p) => (p.id === project.id ? { ...p, status: newStatus } : p))
                          );
                          triggerRevalidate(targetRoute);
                        }}
                      />
                    </td>

                    <td className="py-3 px-5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/admin/weddings/${project.id}/edit`}
                          className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors inline-flex"
                          title="Edit album"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(project)}
                          className="p-1.5 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete album"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete "${pendingDelete?.title}"?`}
        description="The album will be moved to trash and recoverable for 30 days, then permanently removed."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
