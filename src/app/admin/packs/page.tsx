'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Eye, EyeOff, PackageOpen, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { triggerRevalidate } from '@/lib/revalidate';
import { PACK_CATEGORIES, type PackCategory, type WeddingPackRow } from '@/lib/weddingPacks';
import {
  PageHeader,
  Card,
  Badge,
  Button,
  EmptyState,
  ConfirmDialog,
  Label,
  Input,
  Textarea,
} from '@/components/admin/ui';

type Draft = WeddingPackRow & { _dirty?: boolean };

/** Unsaved rows still need a unique id, otherwise editing one blank pack would
 *  edit every other blank pack in the list (they'd all match on ''). */
const DRAFT_PREFIX = 'draft-';
const isDraft = (id: string) => id.startsWith(DRAFT_PREFIX);
const newDraftId = () =>
  `${DRAFT_PREFIX}${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;

const BLANK = (category: PackCategory, sort_order: number): Draft => ({
  id: newDraftId(),
  category,
  name_fr: '',
  name_en: '',
  name_ar: '',
  features_fr: [],
  features_en: [],
  features_ar: [],
  price: 0,
  sort_order,
  is_active: true,
  _dirty: true,
});

export default function AdminPacksPage() {
  const supabase = createClient();
  const [packs, setPacks] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Draft | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPacks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wedding_pack')
      .select('*')
      .is('deleted_at', null)
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      setNeedsSetup(error.code === 'PGRST205');
      if (error.code !== 'PGRST205') console.error('Failed to load packs:', error.message);
      setPacks([]);
    } else {
      setNeedsSetup(false);
      setPacks((data || []) as Draft[]);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPacks();
  }, [fetchPacks]);

  const update = (id: string, patch: Partial<Draft>) =>
    setPacks((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch, _dirty: true } : p)));

  const handleSave = async (pack: Draft) => {
    if (!pack.name_fr.trim()) {
      toast.error('French name is required — it is the fallback for every language.');
      return;
    }
    setSavingId(pack.id);

    const payload = {
      category: pack.category,
      name_fr: pack.name_fr,
      name_en: pack.name_en,
      name_ar: pack.name_ar,
      features_fr: pack.features_fr,
      features_en: pack.features_en,
      features_ar: pack.features_ar,
      price: pack.price,
      sort_order: pack.sort_order,
      is_active: pack.is_active,
    };

    const { error } = isDraft(pack.id)
      ? await supabase.from('wedding_pack').insert(payload)
      : await supabase.from('wedding_pack').update(payload).eq('id', pack.id);

    setSavingId(null);
    if (error) {
      toast.error(`Failed to save: ${error.message}`);
      return;
    }
    triggerRevalidate('/weddings/packs');
    toast.success(`"${pack.name_fr}" saved.`);
    fetchPacks();
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const { error } = await supabase
      .from('wedding_pack')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', pendingDelete.id);
    setDeleting(false);

    if (error) {
      toast.error(`Failed to delete: ${error.message}`);
      return;
    }
    setPendingDelete(null);
    triggerRevalidate('/weddings/packs');
    toast.success('Pack deleted.');
    fetchPacks();
  };

  /** Drops an unsaved draft — nothing has been written to the database yet. */
  const discardDraft = (id: string) => setPacks((prev) => prev.filter((p) => p.id !== id));

  const addPack = (category: PackCategory) => {
    const inCategory = packs.filter((p) => p.category === category);
    const nextOrder = inCategory.length + 1;
    // Prepended so the empty form opens at the top of its category rather than
    // below a long list. On save the list re-fetches sorted by sort_order, so
    // the pack settles into its real position.
    setPacks((prev) => [BLANK(category, nextOrder), ...prev]);
  };

  return (
    <div>
      <PageHeader
        title="Med Art Packs"
        description="Wedding packages and pricing shown on the public pack builder."
      />

      {needsSetup && (
        <Card className="mb-5 border-amber-500/25 bg-amber-500/10">
          <p className="text-xs text-amber-300 leading-relaxed">
            <strong>Packs aren&apos;t set up yet.</strong> Run{' '}
            <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200">
              supabase/wedding_packs.sql
            </code>{' '}
            in your Supabase SQL Editor to create the table and load the current pricing.
          </p>
        </Card>
      )}

      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-500">Loading packs...</div>
      ) : (
        PACK_CATEGORIES.map((category) => {
          const inCategory = packs.filter((p) => p.category === category.key);

          return (
            <div key={category.key} className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-sm font-semibold text-white">{category.labelFallback}</h2>
                  <Badge tone="neutral">{inCategory.length}</Badge>
                  {category.multi && <Badge tone="info">multi-select</Badge>}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => addPack(category.key)}
                  disabled={needsSetup}
                >
                  Add pack
                </Button>
              </div>

              {inCategory.length === 0 ? (
                <Card>
                  <EmptyState
                    icon={PackageOpen}
                    title="No packs in this category"
                    description="Add one to show it on the public pack builder."
                  />
                </Card>
              ) : (
                <div className="space-y-3">
                  {inCategory.map((pack) => (
                    <Card key={pack.id}>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-medium text-white">
                            {pack.name_fr || 'New pack'}
                          </span>
                          <Badge tone={pack.is_active ? 'success' : 'neutral'}>
                            {pack.is_active ? 'Visible' : 'Hidden'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            title={pack.is_active ? 'Hide from site' : 'Show on site'}
                            onClick={() => update(pack.id, { is_active: !pack.is_active })}
                            className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                          >
                            {pack.is_active ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                          {!isDraft(pack.id) && (
                            <button
                              type="button"
                              title="Delete pack"
                              onClick={() => setPendingDelete(pack)}
                              className="p-1.5 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
                        <div className="sm:col-span-1">
                          <Label>Price (DT)</Label>
                          <Input
                            type="number"
                            value={pack.price}
                            onChange={(e) => update(pack.id, { price: Number(e.target.value) })}
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <Label>Order</Label>
                          <Input
                            type="number"
                            value={pack.sort_order}
                            onChange={(e) => update(pack.id, { sort_order: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {(['fr', 'en', 'ar'] as const).map((lang) => {
                          const nameKey = `name_${lang}` as const;
                          const featKey = `features_${lang}` as const;
                          return (
                            <div key={lang} className="space-y-2">
                              <span className="text-[10px] uppercase text-zinc-500 font-medium">
                                {lang === 'fr' ? 'Français' : lang === 'en' ? 'English' : 'العربية'}
                                {lang === 'fr' && <span className="text-amber-500/70"> · required</span>}
                              </span>
                              <Input
                                type="text"
                                placeholder="Pack name"
                                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                value={pack[nameKey]}
                                onChange={(e) => update(pack.id, { [nameKey]: e.target.value })}
                              />
                              <Textarea
                                rows={5}
                                placeholder="One feature per line"
                                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                className="text-xs"
                                value={pack[featKey].join('\n')}
                                onChange={(e) =>
                                  update(pack.id, {
                                    [featKey]: e.target.value.split('\n').filter((l) => l.trim()),
                                  })
                                }
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Save className="w-3.5 h-3.5" />}
                          loading={savingId === pack.id}
                          onClick={() => handleSave(pack)}
                        >
                          Save pack
                        </Button>

                        {isDraft(pack.id) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<X className="w-3.5 h-3.5" />}
                            onClick={() => discardDraft(pack.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete "${pendingDelete?.name_fr}"?`}
        description="It will be removed from the public pack builder immediately."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
