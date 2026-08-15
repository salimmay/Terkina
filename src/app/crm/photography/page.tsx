'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, ArrowLeft, Move, Save, CheckCircle2 } from 'lucide-react';
import { MOCK_PHOTO_PROJECTS, CATEGORIES_PHOTO, PhotoProjectItem } from '@/lib/mockData';
import GalleryDndEditor, { GalleryItem } from '@/components/crm/GalleryDndEditor';
import CoverCropModal, { CropData } from '@/components/crm/CoverCropModal';

export default function CrmPhotographyPage() {
  // Selected project for editing
  const [selectedProject, setSelectedProject] = useState<PhotoProjectItem>(MOCK_PHOTO_PROJECTS[0]);

  // Form State
  const [title, setTitle] = useState(selectedProject.title);
  const [description, setDescription] = useState(selectedProject.description);
  const [category, setCategory] = useState(selectedProject.category);
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('PUBLISHED');
  
  // Gallery items for DnD
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
    selectedProject.gallery.map((url, idx) => ({
      id: `img-${idx}`,
      url,
      isCover: idx === 0,
    }))
  );

  // Cover Crop State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropData, setCropData] = useState<CropData>({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const coverUrl = galleryItems.find((i) => i.isCover)?.url || selectedProject.coverImage;

  const handleSelectProject = (project: PhotoProjectItem) => {
    setSelectedProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setCategory(project.category);
    setGalleryItems(
      project.gallery.map((url, idx) => ({
        id: `img-${idx}`,
        url,
        isCover: idx === 0,
      }))
    );
  };

  const handleSaveProject = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            <h1 className="font-heading font-black text-3xl text-white tracking-tight">
              Photography Studio Editor
            </h1>
          </div>
          <p className="text-zinc-400 text-sm">
            Drag-and-drop gallery reordering & focal point crop settings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/crm"
            className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold hover:text-white flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <button
            onClick={handleSaveProject}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Project & cover crop focal point saved successfully!
        </div>
      )}

      {/* Project Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {MOCK_PHOTO_PROJECTS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectProject(p)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedProject.id === p.id
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Main Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metadata & Cover Focal Point Preview */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          {/* Metadata Form */}
          <div className="p-6 rounded-3xl bg-[#121218] border border-zinc-800 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-base text-white">Project Details</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-blue-500 outline-none"
              >
                {CATEGORIES_PHOTO.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED')}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-blue-500 outline-none"
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs text-white focus:border-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Cover Image Focal Point Box */}
          <div className="p-6 rounded-3xl bg-[#121218] border border-zinc-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white">Cover Focal Point</h3>
              <button
                onClick={() => setCropModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-600/30 transition-colors"
              >
                <Move className="w-3.5 h-3.5" /> Adjust Cover
              </button>
            </div>

            <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-black border border-zinc-800">
              <Image
                src={coverUrl}
                alt="Cover Preview"
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: `${cropData.x + 50}% ${cropData.y + 50}%`,
                  transform: `scale(${cropData.zoom})`,
                }}
                className="transition-all duration-300"
              />
              <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10">
                JSON: {JSON.stringify({ x: Math.round(cropData.x), y: Math.round(cropData.y), zoom: cropData.zoom })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Drag-and-Drop Gallery Editor */}
        <div className="lg:col-span-2">
          <GalleryDndEditor
            images={galleryItems}
            onChange={(items) => setGalleryItems(items)}
          />
        </div>
      </div>

      {/* Cover Crop Modal */}
      {cropModalOpen && (
        <CoverCropModal
          imageUrl={coverUrl}
          initialCropData={cropData}
          onSave={(data) => setCropData(data)}
          onClose={() => setCropModalOpen(false)}
        />
      )}
    </div>
  );
}
