'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Star, Plus } from 'lucide-react';

export interface GalleryItem {
  id: string;
  url: string;
  isCover?: boolean;
}

interface GalleryDndEditorProps {
  images: GalleryItem[];
  onChange: (images: GalleryItem[]) => void;
}

export default function GalleryDndEditor({ images, onChange }: GalleryDndEditorProps) {
  const [newUrlInput, setNewUrlInput] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((item) => item.id === active.id);
      const newIndex = images.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(images, oldIndex, newIndex);
      onChange(reordered);
    }
  };

  const handleSetCover = (id: string) => {
    const updated = images.map((item) => ({
      ...item,
      isCover: item.id === id,
    }));
    onChange(updated);
  };

  const handleDelete = (id: string) => {
    const updated = images.filter((item) => item.id !== id);
    onChange(updated);
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrlInput.trim()) return;
    const newItem: GalleryItem = {
      id: `img-${Date.now()}`,
      url: newUrlInput.trim(),
      isCover: images.length === 0,
    };
    onChange([...images, newItem]);
    setNewUrlInput('');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header & Quick Add */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#121218] border border-zinc-800">
        <div>
          <h4 className="font-heading font-bold text-sm text-white">Gallery Ordering Engine</h4>
          <p className="text-xs text-zinc-400">Drag items to change project gallery order</p>
        </div>

        <form onSubmit={handleAddImage} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="url"
            value={newUrlInput}
            onChange={(e) => setNewUrlInput(e.target.value)}
            placeholder="Paste image URL..."
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-blue-500 outline-none w-full sm:w-64"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add Image
          </button>
        </form>
      </div>

      {/* DND Context & Sortable Grid */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((item) => item.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((item, index) => (
              <SortableItem
                key={item.id}
                item={item}
                index={index}
                onSetCover={() => handleSetCover(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {images.length === 0 && (
        <div className="p-8 rounded-2xl border border-dashed border-zinc-800 text-center text-xs text-zinc-500">
          No gallery images uploaded yet. Use the input above to add project images.
        </div>
      )}
    </div>
  );
}

// Individual Sortable Tile Item
function SortableItem({
  item,
  index,
  onSetCover,
  onDelete,
}: {
  item: GalleryItem;
  index: number;
  onSetCover: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative h-44 rounded-2xl bg-zinc-900 border overflow-hidden transition-all shadow-lg ${
        isDragging ? 'opacity-50 border-blue-500 scale-105' : 'border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <Image
        src={item.url}
        alt="Gallery item"
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        className="object-cover"
      />

      {/* Drag handle overlay */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 border border-white/10 text-white cursor-grab active:cursor-grabbing hover:bg-black/80 transition-colors z-10"
        title="Drag to reorder"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      {/* Order Badge */}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 border border-white/10 text-[10px] font-mono text-zinc-300 z-10">
        #{index + 1}
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
        <button
          onClick={onSetCover}
          className={`p-1.5 rounded-lg border transition-colors ${
            item.isCover
              ? 'bg-amber-500/80 border-amber-400 text-white'
              : 'bg-black/60 border-white/10 text-zinc-400 hover:text-amber-400'
          }`}
          title={item.isCover ? 'Cover Image' : 'Set as Cover'}
        >
          <Star className="w-3.5 h-3.5" fill={item.isCover ? 'currentColor' : 'none'} />
        </button>

        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-zinc-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
          title="Remove image"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {item.isCover && (
        <div className="absolute inset-x-0 bottom-0 bg-amber-500/90 text-[#09090b] font-bold text-[10px] uppercase text-center py-0.5 tracking-widest z-10">
          PROJECT COVER
        </div>
      )}
    </div>
  );
}
