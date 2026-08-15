'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, ArrowLeft, Save, CheckCircle2, Cpu, Maximize2, Layers, Clock, Weight } from 'lucide-react';
import { MOCK_3D_PROJECTS, ThreeDProjectItem } from '@/lib/mockData';
import ModelViewer3D from '@/components/portfolio/ModelViewer3D';

export default function CrmThreeDPage() {
  const [selectedProject, setSelectedProject] = useState<ThreeDProjectItem>(MOCK_3D_PROJECTS[0]);

  // Form states
  const [title, setTitle] = useState(selectedProject.title);
  const [description, setDescription] = useState(selectedProject.description);
  const [category, setCategory] = useState(selectedProject.category);
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('PUBLISHED');
  
  // Specs form states
  const [material, setMaterial] = useState(selectedProject.specs.material);
  const [dimensions, setDimensions] = useState(selectedProject.specs.dimensions);
  const [layerHeight, setLayerHeight] = useState(selectedProject.specs.layerHeight);
  const [infill, setInfill] = useState(selectedProject.specs.infill);
  const [printTime, setPrintTime] = useState(selectedProject.specs.printTime);
  const [weight, setWeight] = useState(selectedProject.specs.weight);

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSelectProject = (project: ThreeDProjectItem) => {
    setSelectedProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setCategory(project.category);
    setMaterial(project.specs.material);
    setDimensions(project.specs.dimensions);
    setLayerHeight(project.specs.layerHeight);
    setInfill(project.specs.infill);
    setPrintTime(project.specs.printTime);
    setWeight(project.specs.weight);
  };

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-purple-400" />
            <h1 className="font-heading font-black text-3xl text-white tracking-tight">
              3D Printing Project Editor
            </h1>
          </div>
          <p className="text-zinc-400 text-sm">
            Asset pairing (.glb models + PNG cover previews) & print specifications editor
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
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      {/* Toast Notice */}
      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> 3D Project model asset & specs updated successfully!
        </div>
      )}

      {/* Project Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {MOCK_3D_PROJECTS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectProject(p)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedProject.id === p.id
                ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Editor Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form & Technical Specs */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* General Metadata */}
          <div className="p-6 rounded-3xl bg-[#121218] border border-zinc-800 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-base text-white">General Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED')}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 outline-none"
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
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs text-white focus:border-purple-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Technical Print Specifications Form */}
          <div className="p-6 rounded-3xl bg-[#121218] border border-zinc-800 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-base text-white">Technical Print Specifications</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" /> Material
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-purple-400" /> Dimensions
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-purple-400" /> Layer Height
                </label>
                <input
                  type="text"
                  value={layerHeight}
                  onChange={(e) => setLayerHeight(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-400" /> Print Time
                </label>
                <input
                  type="text"
                  value={printTime}
                  onChange={(e) => setPrintTime(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                  <Weight className="w-3.5 h-3.5 text-purple-400" /> Weight
                </label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase">Infill Percentage</label>
                <input
                  type="text"
                  value={infill}
                  onChange={(e) => setInfill(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: WebGL Interactive Asset Preview */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#121218] border border-zinc-800 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-base text-white">Live 3D Viewport</h3>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-black border border-zinc-800">
              <ModelViewer3D project={selectedProject} />
            </div>
            <span className="text-[10px] text-zinc-500 text-center">
              Pairs .glb/.gltf assets with preview thumbnails dynamically
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-[#121218] border border-zinc-800 flex flex-col gap-3">
            <h4 className="font-bold text-xs text-white uppercase">Cover PNG Preview</h4>
            <div className="relative w-full h-40 rounded-xl overflow-hidden bg-zinc-900">
              <Image
                src={selectedProject.coverImage}
                alt="Cover Preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
