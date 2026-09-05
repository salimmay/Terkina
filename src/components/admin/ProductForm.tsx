'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import MediaUploader from '@/components/admin/MediaUploader';
import { createClient } from '@/lib/supabase/client';
import { triggerRevalidate } from '@/lib/revalidate';
import { logTrashItem } from '@/lib/trash';
import { Card, CardHeader, Button, Label, Input, Textarea, Select } from '@/components/admin/ui';

export interface ProductFormValues {
  id?: string;
  title: string;
  category: 'lighting' | 'accessories' | 'art' | 'decor';
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  price: string;
  showPrice: boolean;
  inStock: boolean;
  colorsInput: string;
  material: string;
  dimensions: string;
  layerHeight: string;
  printTime: string;
  weight: string;
  description: string;
  coverUrl: string;
  modelUrl: string;
}

export const DEFAULT_PRODUCT_FORM: ProductFormValues = {
  title: '',
  category: 'lighting',
  status: 'PUBLISHED',
  price: '180 TND',
  showPrice: true,
  inStock: true,
  colorsInput: 'Matte Black, Translucent Amber, Silk Gold',
  material: 'Matte Bio-PLA',
  dimensions: '18 × 18 × 24 cm',
  layerHeight: '0.12 mm Micron',
  printTime: '22 Hours',
  weight: '520g',
  description: '',
  coverUrl: '',
  modelUrl: '',
};

interface ProductFormProps {
  mode: 'create' | 'edit';
  initial: ProductFormValues;
}

export default function ProductForm({ mode, initial }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<ProductFormValues>(initial);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.coverUrl) {
      toast.error('Please upload a product photo preview.');
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const colorsArray = values.colorsInput
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const payload = {
        title: values.title,
        description: values.description,
        cover_image_url: values.coverUrl,
        model_file_url: values.modelUrl || null,
        status: values.status,
        show_price: values.showPrice,
        is_in_stock: values.inStock,
        available_colors: colorsArray.length > 0 ? colorsArray : ['Default / Natural'],
        print_specs: {
          category: values.category,
          price: values.price,
          show_price: values.showPrice,
          is_in_stock: values.inStock,
          available_colors: colorsArray,
          material: values.material,
          dimensions: values.dimensions,
          layerHeight: values.layerHeight,
          printTime: values.printTime,
          weight: values.weight,
        },
      };

      const { error } =
        mode === 'edit' && values.id
          ? await supabase.from('three_d_project').update(payload).eq('id', values.id)
          : await supabase.from('three_d_project').insert(payload);

      if (error) throw error;

      // A replaced cover photo or .glb model goes to Trash instead of just
      // being silently orphaned in Cloudinary — restorable for 30 days.
      if (mode === 'edit' && values.id) {
        if (initial.coverUrl && initial.coverUrl !== values.coverUrl) {
          await logTrashItem({
            item_type: 'image',
            title: `${values.title} — cover photo`,
            preview_url: initial.coverUrl,
            source_id: values.id,
            restore_payload: { mode: 'column_restore', table: 'three_d_project', field: 'cover_image_url' },
            cloudinary_urls: [initial.coverUrl],
          });
        }
        if (initial.modelUrl && initial.modelUrl !== values.modelUrl) {
          await logTrashItem({
            item_type: 'model',
            title: `${values.title} — 3D model`,
            preview_url: initial.modelUrl,
            source_id: values.id,
            restore_payload: { mode: 'column_restore', table: 'three_d_project', field: 'model_file_url' },
            cloudinary_urls: [initial.modelUrl],
          });
        }
      }

      triggerRevalidate('/3d');
      toast.success(mode === 'edit' ? 'Product updated live.' : '3D product published to the marketplace.');
      router.push('/admin/products');
    } catch (err) {
      const e = err as { message?: string };
      console.error(err);
      toast.error(`Failed to save 3D product: ${e.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <Card>
        <CardHeader title="Overview & pricing" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <Select
              value={values.category}
              onChange={(e) => set('category', e.target.value as ProductFormValues['category'])}
            >
              <option value="lighting">Ambient Lighting Fixture</option>
              <option value="accessories">Desk & Tech Accessory</option>
              <option value="art">Generative Art & Sculpture</option>
              <option value="decor">Home & Architectural Decor</option>
            </Select>
          </div>

          <div>
            <Label>Display price</Label>
            <Input
              type="text"
              required
              value={values.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="e.g. 180 TND"
            />
          </div>

          {mode === 'edit' && (
            <div className="sm:col-span-2">
              <Label>Status</Label>
              <Select
                value={values.status}
                onChange={(e) => set('status', e.target.value as ProductFormValues['status'])}
                className="max-w-xs"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-6 p-3.5 rounded-md bg-zinc-950 border border-zinc-800 sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={values.showPrice}
                onChange={(e) => set('showPrice', e.target.checked)}
                className="w-4 h-4 rounded accent-white cursor-pointer"
              />
              Display price publicly
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={values.inStock}
                onChange={(e) => set('inStock', e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              In stock (ready to ship)
            </label>
          </div>

          <div className="sm:col-span-2">
            <Label>Available colors & finishes (comma-separated)</Label>
            <Input
              type="text"
              value={values.colorsInput}
              onChange={(e) => set('colorsInput', e.target.value)}
              placeholder="e.g. Matte Black, Translucent Amber, Silk Gold"
            />
            <p className="text-[11px] text-zinc-600 mt-1.5">
              Clients choose one of these in the 3D preview modal before placing their WhatsApp order.
            </p>
          </div>

          <div className="sm:col-span-2">
            <Label>Product title</Label>
            <Input
              type="text"
              required
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Aetheric Geometric Table Lamp"
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              required
              value={values.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Design details, built-in features, and use case..."
            />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Fabrication specs" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label>Material</Label>
            <Input type="text" value={values.material} onChange={(e) => set('material', e.target.value)} />
          </div>
          <div>
            <Label>Dimensions</Label>
            <Input type="text" value={values.dimensions} onChange={(e) => set('dimensions', e.target.value)} />
          </div>
          <div>
            <Label>Layer height</Label>
            <Input type="text" value={values.layerHeight} onChange={(e) => set('layerHeight', e.target.value)} />
          </div>
          <div>
            <Label>Print duration</Label>
            <Input type="text" value={values.printTime} onChange={(e) => set('printTime', e.target.value)} />
          </div>
          <div>
            <Label>Weight / density</Label>
            <Input type="text" value={values.weight} onChange={(e) => set('weight', e.target.value)} />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Visuals & 3D assets"
          description={mode === 'edit' ? 'Replace the cover photo or .glb model at any time.' : undefined}
        />
        <div className="space-y-5">
          <MediaUploader
            label="Product photo preview (required)"
            folder="terkina/products"
            accept="image/*"
            multiple={false}
            currentValue={values.coverUrl}
            onUploadSuccess={(result) => set('coverUrl', result.secure_url)}
            onClear={() => set('coverUrl', '')}
          />
          <MediaUploader
            label="Optional 3D model file (.glb / .gltf)"
            folder="terkina/3d-models"
            accept=".glb,.gltf"
            multiple={false}
            currentValue={values.modelUrl}
            onUploadSuccess={(result) => set('modelUrl', result.secure_url)}
            onClear={() => set('modelUrl', '')}
          />
        </div>
      </Card>

      <Button type="submit" variant="primary" loading={saving} className="w-full">
        {saving ? 'Saving...' : mode === 'edit' ? 'Save changes' : 'Publish to marketplace'}
      </Button>
    </form>
  );
}
