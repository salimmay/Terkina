'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Trash2, RotateCcw, Images, Box, Heart, Clapperboard, Archive, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { restoreTrashItem, purgeTrashItem, TrashItem, TrashItemType } from '@/lib/trash';
import { PageHeader, Card, Badge, Button, EmptyState, ConfirmDialog, Select } from '@/components/admin/ui';

const TYPE_LABELS: Record<TrashItemType, string> = {
  album: 'Album',
  product: '3D Product',
  image: 'Image',
  model: '3D Model',
};

const TYPE_ICONS: Record<TrashItemType, typeof Images> = {
  album: Heart,
  product: Clapperboard,
  image: Images,
  model: Box,
};

type SortKey = 'deleted_desc' | 'deleted_asc' | 'title_asc';

function daysRemaining(expiresAt: string): number {
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default function TrashPage() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TrashItemType | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('deleted_desc');
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [pendingPurge, setPendingPurge] = useState<TrashItem | null>(null);
  const [purging, setPurging] = useState(false);
  const [emptyingExpired, setEmptyingExpired] = useState(false);

  const fetchTrash = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('trash_items')
      .select('*')
      .order('deleted_at', { ascending: false });

    if (error) {
      // A missing table is a setup state, not an empty trash — saying "empty"
      // here would imply deletes are recoverable when nothing is being recorded.
      setNeedsSetup(error.code === 'PGRST205');
      if (error.code !== 'PGRST205') console.error('Failed to load trash:', error.message);
      setItems([]);
    } else {
      setNeedsSetup(false);
      setItems((data || []) as TrashItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const visibleItems = useMemo(() => {
    let list = typeFilter === 'all' ? items : items.filter((i) => i.item_type === typeFilter);
    list = [...list].sort((a, b) => {
      if (sortKey === 'title_asc') return a.title.localeCompare(b.title);
      const diff = new Date(a.deleted_at).getTime() - new Date(b.deleted_at).getTime();
      return sortKey === 'deleted_asc' ? diff : -diff;
    });
    return list;
  }, [items, typeFilter, sortKey]);

  const expiredCount = items.filter((i) => daysRemaining(i.expires_at) <= 0).length;

  const handleRestore = async (item: TrashItem) => {
    setRestoringId(item.id);
    try {
      await restoreTrashItem(item);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success(`"${item.title}" restored.`);
    } catch (err) {
      const e = err as { message?: string };
      toast.error(`Failed to restore: ${e.message || 'Unknown error'}`);
    } finally {
      setRestoringId(null);
    }
  };

  const handlePurgeOne = async () => {
    if (!pendingPurge) return;
    setPurging(true);
    try {
      await purgeTrashItem(pendingPurge);
      setItems((prev) => prev.filter((i) => i.id !== pendingPurge.id));
      toast.success(`"${pendingPurge.title}" permanently deleted.`);
    } catch (err) {
      const e = err as { message?: string };
      toast.error(`Failed to delete permanently: ${e.message || 'Unknown error'}`);
    } finally {
      setPurging(false);
      setPendingPurge(null);
    }
  };

  const handleEmptyExpired = async () => {
    const expired = items.filter((i) => daysRemaining(i.expires_at) <= 0);
    if (expired.length === 0) return;
    setEmptyingExpired(true);
    let failures = 0;
    for (const item of expired) {
      try {
        await purgeTrashItem(item);
      } catch {
        failures += 1;
      }
    }
    setEmptyingExpired(false);
    await fetchTrash();
    if (failures > 0) {
      toast.error(`Purged ${expired.length - failures} item(s); ${failures} failed.`);
    } else {
      toast.success(`Permanently deleted ${expired.length} expired item(s).`);
    }
  };

  return (
    <div>
      <PageHeader
        title="Trash"
        description="Deleted albums, products, photos, and 3D models — restorable for 30 days."
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={handleEmptyExpired}
            disabled={expiredCount === 0 || emptyingExpired}
            loading={emptyingExpired}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Empty expired ({expiredCount})
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TrashItemType | 'all')}
          className="w-auto"
        >
          <option value="all">All types</option>
          <option value="album">Albums</option>
          <option value="product">3D Products</option>
          <option value="image">Images</option>
          <option value="model">3D Models</option>
        </Select>

        <Select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="w-auto">
          <option value="deleted_desc">Newest deleted first</option>
          <option value="deleted_asc">Oldest deleted first</option>
          <option value="title_asc">Title (A–Z)</option>
        </Select>
      </div>

      {needsSetup && (
        <div className="mb-5 p-4 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-px" />
          <div className="leading-relaxed">
            <strong>Trash isn&apos;t set up yet.</strong> The{' '}
            <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200">trash_items</code> table
            doesn&apos;t exist in Supabase, so deletions are <strong>not being recorded and cannot be
            restored</strong>. Run{' '}
            <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200">supabase/trash_items.sql</code>{' '}
            in your Supabase SQL Editor to enable recovery.
          </div>
        </div>
      )}

      <Card padded={false}>
        {loading ? (
          <div className="py-16 text-center text-xs text-zinc-500">Loading trash...</div>
        ) : needsSetup ? (
          <EmptyState
            icon={AlertTriangle}
            title="Recovery not enabled"
            description="Run the trash_items.sql migration to start recording deletions here."
          />
        ) : visibleItems.length === 0 ? (
          <EmptyState
            icon={Archive}
            title="Trash is empty"
            description="Deleted albums, products, photos, and models will show up here."
          />
        ) : (
          <div className="divide-y divide-zinc-800">
            {visibleItems.map((item) => {
              const Icon = TYPE_ICONS[item.item_type];
              const remaining = daysRemaining(item.expires_at);
              const isExpired = remaining <= 0;

              return (
                <div key={item.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-11 h-11 rounded-md overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0 flex items-center justify-center">
                    {item.item_type === 'model' || !item.preview_url ? (
                      <Icon className="w-4.5 h-4.5 text-zinc-500" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.preview_url} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white text-sm truncate">{item.title}</span>
                      <Badge tone="neutral">{TYPE_LABELS[item.item_type]}</Badge>
                      {item.platform && (
                        <Badge tone={item.platform === 'MED_ART' ? 'amber' : 'cyan'}>
                          {item.platform === 'MED_ART' ? 'Med Art' : 'Terkina'}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      Deleted {new Date(item.deleted_at).toLocaleDateString()} ·{' '}
                      {isExpired ? (
                        <span className="text-rose-400">Expired, ready to purge</span>
                      ) : (
                        <span>{remaining} day{remaining === 1 ? '' : 's'} left</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRestore(item)}
                      loading={restoringId === item.id}
                      icon={<RotateCcw className="w-3.5 h-3.5" />}
                    >
                      Restore
                    </Button>
                    <button
                      type="button"
                      onClick={() => setPendingPurge(item)}
                      className="p-2 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!pendingPurge}
        title={`Permanently delete "${pendingPurge?.title}"?`}
        description="This removes it from the database and Cloudinary for good — it can no longer be restored."
        confirmLabel="Delete permanently"
        loading={purging}
        onConfirm={handlePurgeOne}
        onCancel={() => setPendingPurge(null)}
      />
    </div>
  );
}
