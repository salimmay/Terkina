'use client';

import React, { useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { GripVertical, X } from 'lucide-react';
import MediaUploader from '@/components/admin/MediaUploader';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createClient } from '@/lib/supabase/client';
import { triggerRevalidate } from '@/lib/revalidate';
import { logTrashItem } from '@/lib/trash';
import { Card, CardHeader, Button, Label, Input, Textarea, Select } from '@/components/admin/ui';

interface GalleryItem {
  id: string;
  url: string;
  title: string;
}

export interface AlbumFormValues {
  id?: string;
  title: string;
  category: string;
  platform: 'MED_ART' | 'TERKINA_PROD';
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  description: string;
  coverUrl: string;
  gallery: GalleryItem[];
}

export const DEFAULT_ALBUM_FORM: AlbumFormValues = {
  title: '',
  category: 'Bridal Shoots',
  platform: 'MED_ART',
  status: 'PUBLISHED',
  description: '',
  coverUrl: '',
  gallery: [],
};

function SortablePhotoCard({ item, onRemove }: { item: GalleryItem; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative aspect-[3/4] rounded-md overflow-hidden bg-zinc-950 border border-zinc-800 group select-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />

      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <span className="px-2.5 py-1 rounded-full bg-black/70 border border-white/20 text-[10px] text-white flex items-center gap-1">
          <GripVertical className="w-3 h-3" /> Drag to reorder
        </span>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="absolute top-1.5 right-1.5 z-20 w-6 h-6 rounded-full bg-rose-500/90 hover:bg-rose-500 text-white flex items-center justify-center transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

interface AlbumFormProps {
  mode: 'create' | 'edit';
  initial: AlbumFormValues;
}

export default function AlbumForm({ mode, initial }: AlbumFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<AlbumFormValues>(initial);

  const set = <K extends keyof AlbumFormValues>(key: K, value: AlbumFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setValues((prev) => {
        const oldIndex = prev.gallery.findIndex((i) => i.id === active.id);
        const newIndex = prev.gallery.findIndex((i) => i.id === over.id);
        return { ...prev, gallery: arrayMove(prev.gallery, oldIndex, newIndex) };
      });
    }
  };

  const handleAddGalleryImage = (urls: string[]) => {
    setValues((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        ...urls.map(
          (url, idx) =>
            ({
              id: `frame-${Date.now()}-${Math.random()}-${idx}`,
              url,
              title: `Frame ${prev.gallery.length + idx + 1}`,
            }) as GalleryItem
        ),
      ],
    }));
  };

  const handleRemoveGalleryImage = (id: string) => {
    setValues((prev) => ({ ...prev, gallery: prev.gallery.filter((i) => i.id !== id) }));
  };

  const targetRoute = values.platform === 'MED_ART' ? '/weddings' : '/production';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.coverUrl) {
      toast.error('Please upload a cover image first.');
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const taggedDescription = `[Platform: ${values.platform} | Category: ${values.category}]\n${values.description}`;

      let projectId = values.id;

      if (mode === 'edit' && projectId) {
        const { error: updateError } = await supabase
          .from('photo_project')
          .update({
            title: values.title,
            description: taggedDescription,
            cover_image_url: values.coverUrl,
            status: values.status,
          })
          .eq('id', projectId);
        if (updateError) throw updateError;

        // A replaced cover, or any gallery frame no longer present, goes to
        // Trash instead of just vanishing — restorable for 30 days.
        if (initial.coverUrl && initial.coverUrl !== values.coverUrl) {
          await logTrashItem({
            item_type: 'image',
            title: `${values.title} — cover photo`,
            preview_url: initial.coverUrl,
            platform: values.platform,
            source_id: projectId,
            restore_payload: { mode: 'column_restore', table: 'photo_project', field: 'cover_image_url' },
            cloudinary_urls: [initial.coverUrl],
          });
        }

        const keptUrls = new Set(values.gallery.map((g) => g.url));
        const removedFrames = initial.gallery.filter((g) => !keptUrls.has(g.url));
        for (const [index, frame] of removedFrames.entries()) {
          await logTrashItem({
            item_type: 'image',
            title: `${values.title} — ${frame.title}`,
            preview_url: frame.url,
            platform: values.platform,
            source_id: projectId,
            restore_payload: { mode: 'gallery_reinsert', sort_order: values.gallery.length + index },
            cloudinary_urls: [frame.url],
          });
        }

        // Reconcile gallery frames: simplest reliable approach is replace-in-full.
        const { error: deleteError } = await supabase.from('photo_gallery').delete().eq('project_id', projectId);
        if (deleteError) throw deleteError;
      } else {
        const { data: project, error: insertError } = await supabase
          .from('photo_project')
          .insert({
            title: values.title,
            description: taggedDescription,
            cover_image_url: values.coverUrl,
            status: values.status,
          })
          .select()
          .single();
        if (insertError) throw insertError;
        projectId = project.id;
      }

      if (values.gallery.length > 0 && projectId) {
        const galleryRows = values.gallery.map((item, index) => ({
          project_id: projectId,
          image_url: item.url,
          sort_order: index,
        }));
        const { error: galError } = await supabase.from('photo_gallery').insert(galleryRows);
        if (galError) throw galError;
      }

      triggerRevalidate(targetRoute);
      toast.success(mode === 'edit' ? 'Album updated live.' : 'Album published to the live website.');
      router.push('/admin');
    } catch (err) {
      const e = err as { message?: string };
      console.error(err);
      toast.error(`Failed to save album: ${e.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <Card>
        <CardHeader title="Specifications & platform" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Platform division</Label>
            <Select value={values.platform} onChange={(e) => set('platform', e.target.value as AlbumFormValues['platform'])}>
              <option value="MED_ART">Med Art (Weddings & Bridal Cinema)</option>
              <option value="TERKINA_PROD">Terkina (Commercial, Ads & Events)</option>
            </Select>
          </div>

          <div>
            <Label>Category</Label>
            <Select value={values.category} onChange={(e) => set('category', e.target.value)}>
              <option value="Bridal Shoots">Bridal Shoots</option>
              <option value="Luxury Weddings">Luxury Weddings</option>
              <option value="Intimate Ceremonies">Intimate Ceremonies</option>
              <option value="Commercial Campaign">Commercial Campaign</option>
              <option value="Product Macro">Product Macro</option>
            </Select>
          </div>

          {mode === 'edit' && (
            <div className="sm:col-span-2">
              <Label>Status</Label>
              <Select
                value={values.status}
                onChange={(e) => set('status', e.target.value as AlbumFormValues['status'])}
                className="max-w-xs"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </Select>
            </div>
          )}

          <div className="sm:col-span-2">
            <Label>Album title</Label>
            <Input
              type="text"
              required
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Aura of the Carthage Bride"
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              required
              value={values.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Bespoke storytelling description for modal previews..."
            />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Cover image" />
        <MediaUploader
          label="Main album cover (high-res)"
          folder="terkina/covers"
          currentValue={values.coverUrl}
          accept="image/*"
          multiple={false}
          onUploadSuccess={(result) => set('coverUrl', result.secure_url)}
          onClear={() => set('coverUrl', '')}
        />
      </Card>

      <Card>
        <CardHeader
          title="Gallery frames"
          description={`${values.gallery.length} photos — drag to set carousel order.`}
        />
        <div className="space-y-4">
          <MediaUploader
            label="Add frame to album gallery"
            folder="terkina/weddings"
            accept="image/*,video/*"
            multiple={true}
            onUploadComplete={handleAddGalleryImage}
          />

          {values.gallery.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={values.gallery.map((i) => i.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-4 border-t border-zinc-800">
                  {values.gallery.map((item) => (
                    <SortablePhotoCard key={item.id} item={item} onRemove={handleRemoveGalleryImage} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </Card>

      <Button type="submit" variant="primary" loading={saving} className="w-full">
        {saving ? 'Saving...' : mode === 'edit' ? 'Save changes' : 'Publish album to live website'}
      </Button>
    </form>
  );
}
