'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaUploader from '@/components/admin/MediaUploader';
import { createClient } from '@/lib/supabase/client';

export default function New3DProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'lighting' | 'accessories' | 'art' | 'decor'>('lighting');
  const [price, setPrice] = useState('180 TND');
  const [material, setMaterial] = useState('Matte Bio-PLA');
  const [dimensions, setDimensions] = useState('18 × 18 × 24 cm');
  const [layerHeight, setLayerHeight] = useState('0.12 mm Micron');
  const [printTime, setPrintTime] = useState('22 Hours');
  const [weight, setWeight] = useState('520g');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [modelUrl, setModelUrl] = useState('');

  const handlePublishProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverUrl) {
      setErrorNotice('Please upload a product photo preview.');
      return;
    }

    setSaving(true);
    setErrorNotice(null);
    try {
      const supabase = createClient();

      // Schema: three_d_project — price/category are embedded in print_specs JSONB
      // since the table has no dedicated columns for marketplace pricing.
      const { error } = await supabase.from('three_d_project').insert({
        title,
        description,
        cover_image_url: coverUrl,
        model_file_url: modelUrl || null,
        status: 'PUBLISHED',
        print_specs: {
          category,
          price,
          material,
          dimensions,
          layerHeight,
          printTime,
          weight,
        },
      });

      if (error) throw error;
      router.push('/admin');
    } catch (err) {
      const e = err as { message?: string };
      console.error(err);
      setErrorNotice(`Failed to save 3D product: ${e.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 text-white">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-purple-300">
            List New 3D Physical Item
          </h1>
          <p className="text-xs font-mono text-white/50 mt-1">
            Add ready-made creations with print specs and 1-click WhatsApp checkout to the 3D
            Marketplace.
          </p>
        </div>
      </div>

      {errorNotice && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
          {errorNotice}
        </div>
      )}

      <form onSubmit={handlePublishProduct} className="space-y-6">
        {/* Product Identity */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-purple-500/20 space-y-4">
          <h2 className="text-xs font-mono uppercase text-purple-400 tracking-wider">
            1. Product Overview & Pricing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">Category</label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as 'lighting' | 'accessories' | 'art' | 'decor')
                }
                className="w-full p-3 rounded-xl bg-black border border-white/15 text-sm"
              >
                <option value="lighting">Ambient Lighting Fixture</option>
                <option value="accessories">Desk & Tech Accessory</option>
                <option value="art">Generative Art & Sculpture</option>
                <option value="decor">Home & Architectural Decor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">
                Display Price
              </label>
              <input
                type="text"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 180 TND"
                className="w-full p-3.5 rounded-xl bg-black border border-white/15 text-sm font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">
                Product Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Aetheric Geometric Table Lamp"
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
                placeholder="Design details, built-in features, and use case..."
                className="w-full p-3.5 rounded-xl bg-black border border-white/15 text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Technical Print Specs */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <h2 className="text-xs font-mono uppercase text-purple-400 tracking-wider">
            2. Technical Fabrication Specs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-1">Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full p-3 rounded-xl bg-black border border-white/15 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-1">
                Dimensions
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full p-3 rounded-xl bg-black border border-white/15 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-1">
                Layer Height
              </label>
              <input
                type="text"
                value={layerHeight}
                onChange={(e) => setLayerHeight(e.target.value)}
                className="w-full p-3 rounded-xl bg-black border border-white/15 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-1">
                Print Duration
              </label>
              <input
                type="text"
                value={printTime}
                onChange={(e) => setPrintTime(e.target.value)}
                className="w-full p-3 rounded-xl bg-black border border-white/15 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-1">
                Weight / Density
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-3 rounded-xl bg-black border border-white/15 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Media Uploads */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
          <h2 className="text-xs font-mono uppercase text-purple-400 tracking-wider">
            3. Product Visuals & 3D Assets
          </h2>

          <MediaUploader
            label="Product Photo Preview (Required)"
            folder="terkina/products"
            accept="image/*"
            multiple={false}
            currentValue={coverUrl}
            onUploadSuccess={(result) => setCoverUrl(result.secure_url)}
            onClear={() => setCoverUrl('')}
          />

          <MediaUploader
            label="Optional 3D Model File (.GLB / .GLTF for WebGL Modal)"
            folder="terkina/3d-models"
            accept=".glb,.gltf"
            multiple={false}
            currentValue={modelUrl}
            onUploadSuccess={(result) => setModelUrl(result.secure_url)}
            onClear={() => setModelUrl('')}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase text-xs tracking-widest transition-all shadow-xl disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Publishing 3D Product...' : '✓ Publish Item to 3D Marketplace'}
        </button>
      </form>
    </div>
  );
}
