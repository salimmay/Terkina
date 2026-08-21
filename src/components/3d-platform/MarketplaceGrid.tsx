'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Eye, X, MessageCircle, Sparkles, Tag, Layers, Check } from 'lucide-react';
import { Product3D, MOCK_PRODUCTS_DATA } from '@/lib/mockData';
import { useLanguage } from '@/context/LanguageContext';

export default function MarketplaceGrid() {
  const { lang, dir } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProduct, setActiveProduct] = useState<Product3D | null>(null);

  const WHATSAPP_NUMBER = '21612345678'; // Studio Target WhatsApp Number

  const filteredProducts = selectedCategory === 'all'
    ? MOCK_PRODUCTS_DATA
    : MOCK_PRODUCTS_DATA.filter((p) => p.category === selectedCategory);

  const handleOrderWhatsApp = (product: Product3D) => {
    const text = `*Order Inquiry: ${product.title}* 📦\n\n` +
      `💰 *Price:* ${product.price}\n` +
      `🧵 *Material:* ${product.material}\n` +
      `📐 *Dimensions:* ${product.dimensions}\n\n` +
      `Hello TERKINA Studio! I would like to purchase this 3D product or check delivery availability.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="marketplace" className="py-24 px-6 md:px-16 bg-[#06050a] border-t border-white/10 relative overflow-hidden">
      {/* Background ambient spotlight */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[350px] bg-purple-900/10 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10" dir={dir}>
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300 uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'المتجر والمصنوعات الفيزيائية' : lang === 'fr' ? 'Collection & Objets Physiques' : 'Physical Collection & Artifacts'}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              {lang === 'ar' ? 'منتجات جاهزة للطلب الفوري' : lang === 'fr' ? 'Objets 3D Prêts à Commander' : 'Ready-Made 3D Objects'}
            </h2>
            <p className="text-white/60 text-sm sm:text-base max-w-xl mt-2 font-light">
              {lang === 'ar'
                ? 'مصنوعات وتحف ثلاثية الأبعاد مطبوعة بدقة عالية ومجهزة للطلب والشحن المباشر عبر واتساب.'
                : lang === 'fr'
                ? 'Objets de design et artefacts imprimés en 3D avec finitions soignées, expédiés directement via WhatsApp.'
                : 'Curated parametric lamps, weighted desk organizers, and tactile sculptures crafted with industrial 3D additive precision.'}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Items', ar: 'الكل', fr: 'Tous' },
              { id: 'lighting', label: 'Lighting', ar: 'إضاءة', fr: 'Éclairage' },
              { id: 'accessories', label: 'Desk & Tech', ar: 'إكسسوارات ومكتب', fr: 'Accessoires Bureau' },
              { id: 'art', label: 'Art & Sculptures', ar: 'تحف وفنون', fr: 'Art & Sculptures' },
              { id: 'decor', label: 'Home Decor', ar: 'ديكور منزلي', fr: 'Décoration' },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer min-h-[40px] ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-white/5 text-white/60 hover:text-white border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {lang === 'ar' ? cat.ar : lang === 'fr' ? cat.fr : cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex flex-col justify-between rounded-3xl bg-[#0c0a14] border border-white/10 hover:border-purple-500/40 p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/20"
              >
                {/* Product Thumbnail */}
                <div 
                  onClick={() => setActiveProduct(product)}
                  className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-950 cursor-pointer border border-white/5"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />

                  {/* Gradient Shadow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                  {/* Hover Quick View Pill */}
                  <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <span className="text-xs font-mono font-bold text-white bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-1.5 shadow-xl">
                      <Eye className="w-3.5 h-3.5 text-purple-400" />
                      {lang === 'ar' ? 'معاينة سريعة' : 'Quick View'}
                    </span>
                  </div>

                  {/* Price Tag Badge */}
                  <div className="absolute bottom-3 right-3 z-20 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                    {product.price}
                  </div>
                </div>

                {/* Product Details */}
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider font-semibold">
                      {product.material}
                    </span>
                    <span className="text-[11px] font-mono text-white/40">
                      {product.dimensions}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {product.title}
                  </h3>

                  <p className="text-xs text-white/60 font-light line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Order via WhatsApp Button */}
                <button
                  onClick={() => handleOrderWhatsApp(product)}
                  className="mt-5 w-full py-3 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 hover:border-emerald-400 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'اطلب عبر واتساب فوراً' : 'Order on WhatsApp'}</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Quick View Product Modal */}
        <AnimatePresence>
          {activeProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-8">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveProduct(null)}
                className="absolute inset-0 bg-black/85 backdrop-blur-xl"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-4xl bg-[#0e0c16] border border-purple-500/20 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90dvh] flex flex-col md:flex-row"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveProduct(null)}
                  className="absolute top-4 right-4 z-30 min-w-[44px] min-h-[44px] rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-black/90 transition-all shadow-lg cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left Side: Photo */}
                <div className="relative md:w-1/2 h-64 sm:h-80 md:h-auto min-h-[280px] bg-black">
                  <Image
                    src={activeProduct.imageUrl}
                    alt={activeProduct.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-purple-500/30 text-purple-300 text-xs font-mono">
                    PHYSICAL OBJECT
                  </div>
                </div>

                {/* Right Side: Details & Action */}
                <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between gap-6 overflow-y-auto bg-[#0e0c16] border-t md:border-t-0 md:border-l border-white/10">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-purple-400 uppercase tracking-widest">
                        {activeProduct.category}
                      </span>
                      <span className="text-lg font-mono font-bold text-emerald-400">
                        {activeProduct.price}
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
                      {activeProduct.title}
                    </h2>

                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">
                      {activeProduct.description}
                    </p>

                    {/* Specs List */}
                    <div className="grid grid-cols-1 gap-2.5 pt-3 border-t border-white/10 text-xs text-white/70">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-white/40">Material:</span>
                        <span className="font-mono text-white font-medium">{activeProduct.material}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-white/40">Dimensions:</span>
                        <span className="font-mono text-white font-medium">{activeProduct.dimensions}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-white/40">Availability:</span>
                        <span className="font-mono text-emerald-400 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> In Stock / Made to Order
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Button */}
                  <button
                    onClick={() => handleOrderWhatsApp(activeProduct)}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-xs tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'اطلب الآن عبر واتساب' : 'Dispatch Order via WhatsApp'}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
