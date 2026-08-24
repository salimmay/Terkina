'use client';

import React, { useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { useRouter } from 'next/navigation';
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

interface GalleryItem {
  id: string;
  url: string;
  title: string;
}

function SortablePhotoCard({
  item,
  onRemove,
}: {
  item: GalleryItem;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black border border-white/10 group select-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />

      {/* Drag Handle Overlay */}
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <span className="px-3 py-1.5 rounded-full bg-black/70 border border-white/20 text-[10px] font-mono text-white">
          ⋮⋮ Drag to Reorder
        </span>
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}

export default function NewWeddingAlbumPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Bridal Shoots');
  const [platform, setPlatform] = useState<'MED_ART' | 'TERKINA_PROD'>('MED_ART');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setGallery((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddGalleryImage = (urls: string[]) => {
    setGallery((prev) => [
      ...prev,
      ...urls.map(
        (url, idx) =>
          ({
            id: `frame-${Date.now()}-${Math.random()}-${idx}`,
            url,
            title: `Frame ${prev.length + idx + 1}`,
          }) as GalleryItem
      ),
    ]);
  };

  const handleRemoveGalleryImage = (id: string) => {
    setGallery((prev) => prev.filter((i) => i.id !== id));
  };

  const handlePublishAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverUrl) {
      setErrorNotice('Please upload a cover image first.');
      return;
    }

    setSaving(true);
    setErrorNotice(null);
    try {
      const supabase = createClient();

      // 1. Insert PhotoProject (schema: photo_project)
      // Platform division is embedded in the description header for front-end filtering
      const taggedDescription = `[Platform: ${platform} | Category: ${category}]\n${description}`;

      const { data: project, error: projError } = await supabase
        .from('photo_project')
        .insert({
          title,
          description: taggedDescription,
          cover_image_url: coverUrl,
          status: 'PUBLISHED',
        })
        .select()
        .single();

      if (projError) throw projError;

      // 2. Insert Gallery frames with sort_order (schema: photo_gallery)
      if (gallery.length > 0 && project) {
        const galleryRows = gallery.map((item, index) => ({
          project_id: project.id,
          image_url: item.url,
          sort_order: index,
        }));

        const { error: galError } = await supabase.from('photo_gallery').insert(galleryRows);
        if (galError) throw galError;
      }

      router.push('/admin');
    } catch (err) {
      const e = err as { message?: string };
      console.error(err);
      setErrorNotice(`Failed to create project: ${e.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 text-white">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider">Create New Media Album</h1>
          <p className="text-xs font-mono text-white/50 mt-1">
            Upload high-res frames to Cloudinary and organize the orbital 360° front-end carousel.
          </p>
        </div>
      </div>

      {errorNotice && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
          {errorNotice}
        </div>
      )}

      <form onSubmit={handlePublishAlbum} className="space-y-8">
        {/* Basic Info */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
          <h2 className="text-xs font-mono uppercase text-amber-400 tracking-wider">
            1. Album Specifications & Platform
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">
                Platform Division
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as 'MED_ART' | 'TERKINA_PROD')}
                className="w-full p-3 rounded-xl bg-black border border-white/15 text-sm"
              >
                <option value="MED_ART">💍 MED ART (Weddings & Bridal Cinema)</option>
                <option value="TERKINA_PROD">🎬 TERKINA (Commercial, Ads & Events)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl bg-black border border-white/15 text-sm"
              >
                <option value="Bridal Shoots">Bridal Shoots</option>
                <option value="Luxury Weddings">Luxury Weddings</option>
                <option value="Intimate Ceremonies">Intimate Ceremonies</option>
                <option value="Commercial Campaign">Commercial Campaign</option>
                <option value="Product Macro">Product Macro</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">
                Album Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Aura of the Carthage Bride"
                className="w-full p-3.5 rounded-xl bg-black border border-white/15 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">
                Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Bespoke storytelling description for modal previews..."
                className="w-full p-3.5 rounded-xl bg-black border border-white/15 text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Cover Photo */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <h2 className="text-xs font-mono uppercase text-amber-400 tracking-wider">
            2. Primary Showcase Cover
          </h2>
          <MediaUploader
            label="Upload Main Album Cover (High-Res)"
            folder="terkina/covers"
            currentValue={coverUrl}
            accept="image/*"
            multiple={false}
            onUploadSuccess={(result) => setCoverUrl(result.secure_url)}
            onClear={() => setCoverUrl('')}
          />
        </div>

        {/* Gallery Frames & Drag and Drop Reordering */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase text-amber-400 tracking-wider">
              3. Orbital Gallery Frames ({gallery.length} Photos Added)
            </h2>
            <span className="text-[11px] font-mono text-white/40">
              Drag cards to set carousel rotation order
            </span>
          </div>

          <MediaUploader
            label="+ Add Frame to Album Gallery"
            folder="terkina/weddings"
            accept="image/*,video/*"
            multiple={true}
            onUploadComplete={handleAddGalleryImage}
          />

          {gallery.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={gallery.map((i) => i.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                  {gallery.map((item) => (
                    <SortablePhotoCard key={item.id} item={item} onRemove={handleRemoveGalleryImage} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold uppercase text-xs tracking-widest transition-all shadow-xl disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Publishing Album...' : '✓ Publish Album to Live Website'}
        </button>
      </form>
    </div>
  );
}
