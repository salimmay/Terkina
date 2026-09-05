'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui';
import ProductForm, { ProductFormValues, DEFAULT_PRODUCT_FORM } from '@/components/admin/ProductForm';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState<ProductFormValues | null>(null);

  useEffect(() => {
    async function loadProduct() {
      const supabase = createClient();
      const { data, error } = await supabase.from('three_d_project').select('*').eq('id', id).single();

      if (error || !data) {
        toast.error('Product not found.');
        router.push('/admin/products');
        return;
      }

      const specs = (data.print_specs || {}) as Record<string, unknown>;
      setInitial({
        ...DEFAULT_PRODUCT_FORM,
        id: data.id,
        title: data.title || '',
        category: (specs.category as ProductFormValues['category']) || 'lighting',
        status: data.status || 'PUBLISHED',
        price: (specs.price as string) || DEFAULT_PRODUCT_FORM.price,
        showPrice: data.show_price ?? true,
        inStock: data.is_in_stock ?? true,
        colorsInput: ((data.available_colors as string[]) || []).join(', ') || DEFAULT_PRODUCT_FORM.colorsInput,
        material: (specs.material as string) || DEFAULT_PRODUCT_FORM.material,
        dimensions: (specs.dimensions as string) || DEFAULT_PRODUCT_FORM.dimensions,
        layerHeight: (specs.layerHeight as string) || DEFAULT_PRODUCT_FORM.layerHeight,
        printTime: (specs.printTime as string) || DEFAULT_PRODUCT_FORM.printTime,
        weight: (specs.weight as string) || DEFAULT_PRODUCT_FORM.weight,
        description: data.description || '',
        coverUrl: data.cover_image_url || '',
        modelUrl: data.model_file_url || '',
      });
      setLoading(false);
    }
    loadProduct();
  }, [id, router]);

  return (
    <div>
      <PageHeader title="Edit 3D item" description="Fix a typo, swap the .glb model, or update pricing and specs." />
      {loading || !initial ? (
        <div className="text-xs text-zinc-500 py-10 text-center">Loading product...</div>
      ) : (
        <ProductForm mode="edit" initial={initial} />
      )}
    </div>
  );
}
