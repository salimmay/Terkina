'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { useT } from '@/lib/translations/TranslationsProvider';
import { renderTemplate } from '@/lib/translations/registry';
import Product3DModal from './Product3DModal';

export interface Product3D {
  id: string;
  title: string;
  category: string;
  price: string;
  show_price: boolean;
  is_in_stock: boolean;
  available_colors?: string[];
  material: string;
  dimensions: string;
  imageUrl: string;
  modelUrl?: string;
  description: string;
  specs: {
    layerHeight: string;
    printTime: string;
    weight: string;
  };
}

interface MarketplaceGridProps {
  onSelectProduct?: (product: Product3D) => void;
}

export default function MarketplaceGrid({ onSelectProduct }: MarketplaceGridProps) {
  const { dir } = useLanguage();
  const { whatsappNumber } = useSiteSettings();
  const t = useT();
  const [products, setProducts] = useState<Product3D[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [internalModalProduct, setInternalModalProduct] = useState<Product3D | null>(null);

  useEffect(() => {
    async function fetchLiveProducts() {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('three_d_project')
        .select('*')
        .eq('status', 'PUBLISHED')
        .is('deleted_at', null)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setProducts(
          data.map((item: Record<string, unknown>) => {
            const specs = (item.print_specs || {}) as Record<string, unknown>;
            return {
              id: item.id as string,
              title: item.title as string,
              category: (specs.category as string) || 'decor',
              price: (specs.price as string) || 'Custom Quote',
              show_price: (item.show_price as boolean) ?? (specs.show_price as boolean) ?? true,
              is_in_stock: (item.is_in_stock as boolean) ?? (specs.is_in_stock as boolean) ?? true,
              available_colors:
                (item.available_colors as string[]) ??
                (specs.available_colors as string[]) ??
                ['Default / Natural'],
              material: (specs.material as string) || 'Matte Bio-PLA',
              dimensions: (specs.dimensions as string) || '18 × 18 × 24 cm',
              imageUrl: (item.cover_image_url as string) || '/placeholder.jpg',
              modelUrl: (item.model_file_url as string) || undefined,
              description: (item.description as string) || '',
              specs: {
                layerHeight: (specs.layerHeight as string) || '0.05 mm Micron',
                printTime: (specs.printTime as string) || '18 Hours',
                weight: (specs.weight as string) || '450g',
              },
            };
          })
        );
      } else {
        if (error) {
          console.error('Live inventory fetch error:', error.message);
        }
        setProducts([]);
      }
      setLoading(false);
    }

    fetchLiveProducts();
  }, []);

  const handleSelect = (product: Product3D) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      // Fallback for pages that don't host their own <Product3DModal />
      setInternalModalProduct(product);
    }
  };

  const filtered =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleWhatsAppAction = (e: React.MouseEvent, p: Product3D) => {
    e.stopPropagation();

    const priceText = p.show_price ? p.price : t('marketplace.priceOnRequestBadge', 'Price on Request');
    const intent = p.is_in_stock
      ? t('whatsapp.marketplaceOrder.intentInStock', 'Order Inquiry')
      : t('whatsapp.marketplaceOrder.intentBackorder', 'Custom Backorder Inquiry (Out of Stock)');
    const availability = p.is_in_stock
      ? t('whatsapp.marketplaceOrder.availabilityInStock', 'In Stock')
      : t('whatsapp.marketplaceOrder.availabilityBackorder', 'Made to Order / Backorder');

    const text = renderTemplate(
      t(
        'whatsapp.marketplaceOrder.template',
        '*{{intent}}: {{title}}* 📦\n\n💰 *Price:* {{price}}\n🧵 *Material:* {{material}}\n📐 *Dimensions:* {{dimensions}}\n⚡ *Availability:* {{availability}}\n\nHello! I would like to inquire about this 3D product.'
      ),
      {
        intent,
        title: p.title,
        price: priceText,
        material: p.material,
        dimensions: p.dimensions,
        availability,
      }
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="marketplace" className="py-24 px-4 sm:px-8 md:px-16 bg-[#050409]">
      <div className="max-w-7xl mx-auto" dir={dir}>
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest block mb-2">
              ✦ {t('marketplace.badge', 'Physical Collection & Artifacts')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              {t('marketplace.heading', 'Ready-Made 3D Objects')}
            </h2>
          </div>

          {/* Touch-Scrollable Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [scrollbar-width:none]">
            {[
              { id: 'all', textKey: 'marketplace.filterAll', fallback: 'All Items' },
              { id: 'lighting', textKey: 'marketplace.filterLighting', fallback: 'Lighting' },
              { id: 'accessories', textKey: 'marketplace.filterAccessories', fallback: 'Desk & Tech' },
              { id: 'art', textKey: 'marketplace.filterArt', fallback: 'Art & Sculptures' },
              { id: 'decor', textKey: 'marketplace.filterDecor', fallback: 'Home Decor' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {t(cat.textKey, cat.fallback)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 text-center text-xs font-mono text-white/40 animate-pulse">
            {t('marketplace.loadingText', 'Loading live 3D inventory...')}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-white/5 bg-white/[0.01]">
            <span className="text-2xl block mb-2">🧊</span>
            <span className="text-xs font-mono text-white/40">
              {t('marketplace.emptyText', 'No products available in this category.')}
            </span>
          </div>
        ) : (
          /* Responsive Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                onClick={() => handleSelect(product)}
                className="group flex flex-col justify-between rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/20 cursor-pointer min-w-0"
              >
                {/* Product Image Preview */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-950 border border-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                      product.is_in_stock
                        ? 'brightness-95 group-hover:brightness-100'
                        : 'brightness-60 grayscale-[40%]'
                    }`}
                    loading="lazy"
                  />

                  {/* Stock Status Badge (Top-Left) */}
                  {!product.is_in_stock && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-[9px] font-mono font-bold text-rose-300 uppercase tracking-wider">
                      {t('marketplace.madeToOrderBadge', 'Made to Order')}
                    </div>
                  )}

                  {/* Dynamic Price Badge (Top-Right) */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono font-bold">
                    {product.show_price ? (
                      <span className="text-emerald-400">{product.price}</span>
                    ) : (
                      <span className="text-white/60 text-[10px] tracking-wider uppercase">
                        {t('marketplace.priceOnRequestBadge', 'Price on Request')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="mt-4 flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider">
                    {product.material}
                  </span>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {product.title}
                  </h3>

                  <p className="text-xs text-white/50 font-light line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Dynamic WhatsApp CTA Button */}
                <button
                  onClick={(e) => handleWhatsAppAction(e, product)}
                  className={`mt-4 w-full py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    product.is_in_stock
                      ? 'bg-white/5 hover:bg-emerald-500 hover:text-black border-white/10 hover:border-emerald-400 text-white'
                      : 'bg-rose-500/10 hover:bg-rose-500 hover:text-white border-rose-500/30 text-rose-300'
                  }`}
                >
                  <span>💬</span>
                  <span>
                    {product.is_in_stock
                      ? t('marketplace.orderButton', 'Order on WhatsApp')
                      : t('marketplace.backorderButton', 'Request Backorder ↗')}
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Built-in modal fallback when no external handler is provided */}
      {!onSelectProduct && (
        <Product3DModal
          product={internalModalProduct}
          isOpen={!!internalModalProduct}
          onClose={() => setInternalModalProduct(null)}
        />
      )}
    </section>
  );
}
