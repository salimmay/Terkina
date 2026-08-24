'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Plus, Edit2, Trash2, CheckCircle2, ArrowLeft, X, Save, Tag, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product3D, MOCK_PRODUCTS_DATA } from '@/lib/mockData';
import MediaUploader from '@/components/admin/MediaUploader';

export default function CrmProductsPage() {
  const [products, setProducts] = useState<Product3D[]>(MOCK_PRODUCTS_DATA);
  const [editingProduct, setEditingProduct] = useState<Product3D | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Form State for Adding / Editing
  const [formData, setFormData] = useState<Partial<Product3D>>({
    title: '',
    category: 'lighting',
    price: '120 TND',
    material: 'Matte PLA',
    dimensions: '15 × 15 × 20 cm',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    description: '',
    inStock: true,
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      category: 'lighting',
      price: '120 TND',
      material: 'Matte PLA',
      dimensions: '15 × 15 × 20 cm',
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      description: '',
      inStock: true,
    });
    setIsNewModalOpen(true);
  };

  const handleOpenEdit = (prod: Product3D) => {
    setEditingProduct(prod);
    setFormData({ ...prod });
    setIsNewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this marketplace item?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      // Update existing
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? ({ ...p, ...formData } as Product3D)
            : p
        )
      );
    } else {
      // Create new
      const newProd: Product3D = {
        id: `prod-${Date.now()}`,
        title: formData.title || 'Untitled 3D Product',
        category: formData.category || 'decor',
        price: formData.price || '90 TND',
        material: formData.material || 'Standard PLA',
        dimensions: formData.dimensions || '10 × 10 × 10 cm',
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        description: formData.description || 'Custom 3D printed physical object.',
        inStock: formData.inStock ?? true,
      };
      setProducts((prev) => [newProd, ...prev]);
    }

    setIsNewModalOpen(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/crm"
              className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to CRM Overview</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <ShoppingBag className="w-6 h-6 text-purple-400" />
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
              3D Marketplace Products
            </h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Manage ready-made 3D physical inventory, prices, materials, dimensions, and WhatsApp catalogs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/3d#marketplace"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center gap-2 border border-white/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Live Marketplace</span>
          </Link>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Save Toast Notification */}
      <AnimatePresence>
        {savedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2 shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Marketplace product inventory updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table Card */}
      <div className="rounded-2xl border border-zinc-800 bg-[#121218] overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-white">Active Product Inventory</h3>
          <span className="text-xs font-mono text-zinc-400">Total Items: {products.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/90 text-xs uppercase font-semibold text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Material & Dimensions</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                        <Image
                          src={prod.imageUrl}
                          alt={prod.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">{prod.title}</span>
                        <span className="text-xs text-zinc-400 font-light truncate max-w-xs">{prod.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/25 uppercase font-mono text-[10px] font-bold">
                      {prod.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-mono font-bold text-emerald-400">
                    {prod.price}
                  </td>
                  <td className="py-4 px-4 text-xs">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{prod.material}</span>
                      <span className="text-[11px] font-mono text-zinc-400">{prod.dimensions}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      IN STOCK
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#14121e] border border-purple-500/30 rounded-3xl p-6 sm:p-8 overflow-y-auto max-h-[90dvh] shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-purple-400" />
                  <h3 className="font-heading font-bold text-xl text-white">
                    {editingProduct ? 'Edit Marketplace Product' : 'Add New Marketplace Product'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsNewModalOpen(false)}
                  className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Product Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400"
                      placeholder="e.g. Aetheric Geometric Lamp"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400"
                    >
                      <option value="lighting">Lighting</option>
                      <option value="accessories">Desk & Tech Accessories</option>
                      <option value="art">Art & Sculptures</option>
                      <option value="decor">Home Decor</option>
                    </select>
                  </div>
                </div>

                {/* Price & Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Price (TND / EUR)</label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400"
                      placeholder="e.g. 180 TND"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Dimensions (L × W × H)</label>
                    <input
                      type="text"
                      required
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400"
                      placeholder="e.g. 18 × 18 × 24 cm"
                    />
                  </div>
                </div>

                {/* Material & Image URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Material Specification</label>
                    <input
                      type="text"
                      required
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400"
                      placeholder="e.g. Matte Bio-PLA & Warm LED Core"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <MediaUploader
                      currentValue={formData.imageUrl}
                      onUploadSuccess={(result) => setFormData((prev) => ({ ...prev, imageUrl: result.secure_url }))}
                      accept="image/*"
                      folder="terkina/products"
                      label="Product Image (Cloudinary)"
                      helperText="Drop high-res PNG/JPG product photo"
                      compact={true}
                      onClear={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Description & Features</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400 resize-none"
                    placeholder="Short product overview for the marketplace card and WhatsApp inquiry..."
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
