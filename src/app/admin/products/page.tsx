'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  price: string;
  show_price: boolean;
  is_in_stock: boolean;
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

  // 1. Fetch Products (schema: three_d_project)
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('three_d_project')
      .select('*')
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
            show_price: (specs.show_price as boolean) ?? true,
            is_in_stock: (specs.is_in_stock as boolean) ?? true,
            print_specs: specs,
          };
        })
      );
    } else if (error) {
      console.error('Failed to load products:', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: persist a partial update to print_specs JSONB
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
        .update({ print_specs: nextSpecs })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error(err);
      rollback();
      alert('Failed to update product — check that you are authenticated as an admin.');
    } finally {
      setUpdatingId(null);
    }
  };

  // 2. Quick Action: Toggle Single Price Visibility
  const toggleSinglePrice = (id: string, currentShow: boolean) => {
    const nextVal = !currentShow;

    // Optimistic UI update
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, show_price: nextVal } : p)));

    updateSpecs(id, { show_price: nextVal }, () =>
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, show_price: currentShow } : p)))
    );
  };

  // 3. Quick Action: Bulk Show/Hide All Prices
  const toggleAllPrices = async (showAll: boolean) => {
    setBulkLoading(true);
    const previousState = [...products];

    // Optimistic UI update
    setProducts((prev) => prev.map((p) => ({ ...p, show_price: showAll })));

    try {
      // Persist per-row since print_specs is JSONB
      const updates = previousState.map((p) =>
        supabase
          .from('three_d_project')
          .update({ print_specs: { ...p.print_specs, show_price: showAll } })
          .eq('id', p.id)
      );
      const results = await Promise.all(updates);
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
    } catch (err) {
      console.error(err);
      setProducts(previousState);
      alert('Failed to update all prices');
    } finally {
      setBulkLoading(false);
    }
  };

  // 4. Quick Action: Toggle Stock Status (In Stock vs Out of Stock)
  const toggleStockStatus = (id: string, currentInStock: boolean) => {
    const nextStock = !currentInStock;

    // Optimistic UI update
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_in_stock: nextStock } : p)));

    updateSpecs(id, { is_in_stock: nextStock }, () =>
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_in_stock: currentInStock } : p)))
    );
  };

  const areAllPricesHidden = products.length > 0 && products.every((p) => !p.show_price);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 text-white">
      {/* Top Header & Global Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-purple-300">
            3D Marketplace Products
          </h1>
          <p className="text-xs font-mono text-white/50 mt-1">
            Manage physical collection inventory, quick pricing visibility, and stock availability.
          </p>
        </div>

        {/* Global Bulk Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleAllPrices(areAllPricesHidden)}
            disabled={bulkLoading || products.length === 0}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{areAllPricesHidden ? '👁' : '👁‍🗨'}</span>
            <span>{areAllPricesHidden ? 'Show All Prices' : 'Hide All Prices'}</span>
          </button>

          <Link
            href="/admin/products/new"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            + Add New Item
          </Link>
        </div>
      </div>

      {/* Table Card Container */}
      <div className="rounded-2xl border border-white/10 bg-[#08070d]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Table Header Info */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between text-xs font-mono text-white/40">
          <span>Catalog Inventory</span>
          <span>Total Items: {products.length}</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-white/40 animate-pulse">
            Loading 3D catalog records...
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-xs font-mono text-white/40">
            No products listed yet. Click "+ Add New Item" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              {/* Table Column Titles */}
              <thead className="bg-white/[0.02] border-b border-white/10 text-white/40 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Price & Visibility</th>
                  <th className="py-3.5 px-6">Material & Dimensions</th>
                  <th className="py-3.5 px-6">Stock Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>

              {/* Table Rows */}
              <tbody className="divide-y divide-white/5">
                {products.map((p) => {
                  const isUpdating = updatingId === p.id;

                  return (
                    <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                      {/* 1. Category */}
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-800/40 uppercase font-bold text-[10px]">
                          {p.category}
                        </span>
                      </td>

                      {/* 2. Price + Quick Eye Toggle */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          {/* Price Tag */}
                          <span
                            className={`font-bold transition-colors ${
                              p.show_price ? 'text-emerald-400' : 'text-white/30 line-through'
                            }`}
                          >
                            {p.price}
                          </span>

                          {/* Quick Show/Hide Toggle Button */}
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => toggleSinglePrice(p.id, p.show_price)}
                            title={p.show_price ? 'Hide price on website' : 'Show price on website'}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer text-xs disabled:opacity-50 ${
                              p.show_price
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-white/5 text-white/40 border-white/10 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {p.show_price ? '👁' : '👁‍🗨'}
                          </button>
                        </div>
                      </td>

                      {/* 3. Material & Dimensions */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white/90">{p.print_specs.material}</span>
                          <span className="text-white/40 text-[11px] mt-0.5">
                            {p.print_specs.dimensions}
                          </span>
                        </div>
                      </td>

                      {/* 4. Interactive Stock Status Pill */}
                      <td className="py-4 px-6">
                        <button
                          type="button"
                          onClick={() => toggleStockStatus(p.id, p.is_in_stock)}
                          disabled={isUpdating}
                          className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 ${
                            p.is_in_stock
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.is_in_stock ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                            }`}
                          />
                          <span>{p.is_in_stock ? 'IN STOCK' : 'OUT OF STOCK'}</span>
                        </button>
                      </td>

                      {/* 5. Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
                          >
                            ✏️
                          </Link>
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm('Delete this 3D product?')) {
                                await supabase.from('three_d_project').delete().eq('id', p.id);
                                fetchProducts();
                              }
                            }}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors cursor-pointer"
                          >
                            🗑️
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
      </div>
    </div>
  );
}
