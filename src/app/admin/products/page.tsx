'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, Trash2, Pencil, Plus, Box } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { triggerRevalidate } from '@/lib/revalidate';
import { logTrashItem } from '@/lib/trash';
import { PageHeader, Card, Badge, Button, EmptyState, ConfirmDialog } from '@/components/admin/ui';

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  price: string;
  show_price: boolean;
  is_in_stock: boolean;
  cover_image_url: string | null;
  model_file_url: string | null;
  print_specs: {
    material?: string;
    dimensions?: string;
    [key: string]: unknown;
  };
}

export default function AdminProductsTablePage() {
  const supabase = createClient();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ProductItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 1. Fetch Products (schema: three_d_project)
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('three_d_project')
      .select('*')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setProducts(
        data.map((item: Record<string, unknown>) => {
          const specs = (item.print_specs || {}) as ProductItem['print_specs'];
          return {
            id: item.id as string,
            title: item.title as string,
            category: (specs.category as string) || 'decor',
            price: (specs.price as string) || '180 TND',
            show_price: (item.show_price as boolean) ?? (specs.show_price as boolean) ?? true,
            is_in_stock: (item.is_in_stock as boolean) ?? (specs.is_in_stock as boolean) ?? true,
            cover_image_url: (item.cover_image_url as string) || null,
            model_file_url: (item.model_file_url as string) || null,
            print_specs: specs,
          };
        })
      );
    } else if (error) {
      if (error.code === 'PGRST205') {
        console.warn('Supabase table `three_d_project` not yet created. Run `supabase/complete_setup.sql`.');
      } else {
        console.error('Failed to load products:', error.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: persist a partial update to dedicated columns and print_specs JSONB
  const updateSpecs = async (
    id: string,
    patch: Partial<Pick<ProductItem, 'show_price' | 'is_in_stock'>>,
    rollback: () => void
  ) => {
    setUpdatingId(id);
    try {
      const current = products.find((p) => p.id === id);
      if (!current) return;

      const nextSpecs = { ...current.print_specs, ...patch };
      const { error } = await supabase
        .from('three_d_project')
        .update({
          ...patch,
          print_specs: nextSpecs,
        })
        .eq('id', id);

      if (error) throw error;
      triggerRevalidate('/3d');
      toast.success('Product updated live.');
    } catch (err) {
      console.error(err);
      rollback();
      toast.error('Failed to update product — check that you are authenticated as an admin.');
    } finally {
      setUpdatingId(null);
    }
  };

  // 2. Quick Action: Toggle Single Price Visibility
  const toggleSinglePrice = (id: string, currentShow: boolean) => {
    const nextVal = !currentShow;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, show_price: nextVal } : p)));
    updateSpecs(id, { show_price: nextVal }, () =>
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, show_price: currentShow } : p)))
    );
  };

  // 3. Quick Action: Bulk Show/Hide All Prices
  const toggleAllPrices = async (showAll: boolean) => {
    setBulkLoading(true);
    const previousState = [...products];
    setProducts((prev) => prev.map((p) => ({ ...p, show_price: showAll })));

    try {
      const updates = previousState.map((p) =>
        supabase
          .from('three_d_project')
          .update({
            show_price: showAll,
            print_specs: { ...p.print_specs, show_price: showAll },
          })
          .eq('id', p.id)
      );
      const results = await Promise.all(updates);
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
      triggerRevalidate('/3d');
      toast.success(showAll ? 'All prices are now visible.' : 'All prices are now hidden.');
    } catch (err) {
      console.error(err);
      setProducts(previousState);
      toast.error('Failed to update all prices');
    } finally {
      setBulkLoading(false);
    }
  };

  // 4. Quick Action: Toggle Stock Status (In Stock vs Out of Stock)
  const toggleStockStatus = (id: string, currentInStock: boolean) => {
    const nextStock = !currentInStock;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_in_stock: nextStock } : p)));
    updateSpecs(id, { is_in_stock: nextStock }, () =>
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_in_stock: currentInStock } : p)))
    );
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);

    // Soft-delete (30-day recovery window via Trash) rather than an
    // immediate, unrecoverable delete + Cloudinary purge.
    const { error } = await supabase
      .from('three_d_project')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', pendingDelete.id);
    setDeleting(false);

    if (error) {
      toast.error(`Failed to delete product: ${error.message}`);
      return;
    }

    const logged = await logTrashItem({
      item_type: 'product',
      title: pendingDelete.title,
      preview_url: pendingDelete.cover_image_url,
      source_id: pendingDelete.id,
      restore_payload: { mode: 'soft_delete_undo', table: 'three_d_project' },
      cloudinary_urls: [pendingDelete.cover_image_url, pendingDelete.model_file_url],
    });

    setPendingDelete(null);
    fetchProducts();
    triggerRevalidate('/3d');
    if (logged) {
      toast.success('Product moved to trash.');
    } else {
      toast.warning(
        'Product was hidden from the site, but could not be added to Trash — run supabase/trash_items.sql to enable recovery.'
      );
    }
  };

  const areAllPricesHidden = products.length > 0 && products.every((p) => !p.show_price);

  return (
    <div>
      <PageHeader
        title="3D Marketplace Products"
        description="Manage inventory, pricing visibility, and stock availability."
        action={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toggleAllPrices(areAllPricesHidden)}
              disabled={bulkLoading || products.length === 0}
              icon={areAllPricesHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            >
              {areAllPricesHidden ? 'Show all prices' : 'Hide all prices'}
            </Button>
            <Link href="/admin/products/new">
              <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                Add item
              </Button>
            </Link>
          </>
        }
      />

      <Card padded={false}>
        <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>Catalog inventory</span>
          <span>{products.length} items</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-zinc-500">Loading 3D catalog records...</div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={Box}
            title="No products listed yet"
            description="Add your first 3D print to the marketplace catalog."
            action={
              <Link href="/admin/products/new">
                <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                  Add item
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-500 text-xs uppercase tracking-wide border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-5 font-medium">Category</th>
                  <th className="py-2.5 px-5 font-medium">Price</th>
                  <th className="py-2.5 px-5 font-medium">Material & dimensions</th>
                  <th className="py-2.5 px-5 font-medium">Stock</th>
                  <th className="py-2.5 px-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {products.map((p) => {
                  const isUpdating = updatingId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-5">
                        <Badge tone="purple">{p.category}</Badge>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <span className={p.show_price ? 'text-emerald-400 font-medium' : 'text-zinc-600 line-through'}>
                            {p.price}
                          </span>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => toggleSinglePrice(p.id, p.show_price)}
                            title={p.show_price ? 'Hide price on website' : 'Show price on website'}
                            className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {p.show_price ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="text-zinc-200">{p.print_specs.material}</div>
                        <div className="text-zinc-500 text-xs">{p.print_specs.dimensions}</div>
                      </td>

                      <td className="py-3.5 px-5">
                        <button
                          type="button"
                          onClick={() => toggleStockStatus(p.id, p.is_in_stock)}
                          disabled={isUpdating}
                          className="cursor-pointer disabled:opacity-50"
                        >
                          <Badge tone={p.is_in_stock ? 'success' : 'danger'} dot>
                            {p.is_in_stock ? 'In stock' : 'Out of stock'}
                          </Badge>
                        </button>
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors inline-flex"
                            title="Edit product"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(p)}
                            className="p-1.5 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete "${pendingDelete?.title}"?`}
        description="The product will be moved to trash and recoverable for 30 days, then permanently removed."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
