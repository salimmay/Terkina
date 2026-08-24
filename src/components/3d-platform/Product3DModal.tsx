'use client';

import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Bounds, Float, Sparkles, ContactShadows } from '@react-three/drei';
import { Product3D } from './MarketplaceGrid';

interface Product3DModalProps {
  product: Product3D | null;
  isOpen: boolean;
  onClose: () => void;
}

function FallbackWireframeMesh() {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh castShadow receiveShadow>
        <dodecahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial
          color="#1e1035"
          emissive="#7c3aed"
          emissiveIntensity={0.35}
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
        />
      </mesh>
    </Float>
  );
}

export default function Product3DModal({ product, isOpen, onClose }: Product3DModalProps) {
  if (!isOpen || !product) return null;

  const WHATSAPP_NUMBER = '21612345678';

  const handleOrder = () => {
    const text =
      `*Order Inquiry for: ${product.title}* 📦\n\n` +
      `💰 *Price:* ${product.price}\n` +
      `🧵 *Material:* ${product.material}\n` +
      `📐 *Dimensions:* ${product.dimensions}\n\n` +
      `Hello! I would like to place an order for this physical 3D creation.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto lg:overflow-hidden rounded-3xl bg-[#090710] border border-white/15 shadow-2xl z-10 flex flex-col lg:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            ✕
          </button>

          {/* LEFT: Centered 3D WebGL Canvas */}
          <div className="w-full lg:w-[55%] h-[340px] lg:h-auto min-h-[340px] relative bg-radial from-[#150f24] via-[#090710] to-black flex items-center justify-center">
            <Canvas
              style={{ touchAction: 'pan-y' }}
              camera={{ position: [0, 0, 4.5], fov: 45 }}
              className="w-full h-full"
            >
              <ambientLight intensity={0.7} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} color="#c084fc" />
              <directionalLight position={[-10, -10, -5]} intensity={0.6} color="#3b82f6" />

              <Suspense fallback={null}>
                <Bounds fit clip observe margin={1.2}>
                  <Center>
                    <FallbackWireframeMesh />
                  </Center>
                </Bounds>
                <Sparkles count={30} scale={4} size={1.8} speed={0.4} color="#c084fc" />
                <ContactShadows position={[0, -1.6, 0]} opacity={0.6} scale={8} blur={2} />
              </Suspense>

              <OrbitControls makeDefault enablePan={false} minDistance={2.5} maxDistance={8} />
            </Canvas>

            <div className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-purple-300 pointer-events-none">
            Drag 360° to Inspect Model
            </div>
          </div>

          {/* RIGHT: Product Specs & Direct WhatsApp Order */}
          <div className="w-full lg:w-[45%] p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0d0a17]">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase font-bold">
                  {product.category}
                </span>
                <span className="text-sm font-mono font-bold text-emerald-400">{product.price}</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                  {product.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-[11px] font-mono uppercase text-white/40 block">
                  Technical Specifications
                </span>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Material</span>
                    <span className="font-semibold text-white mt-0.5 block">{product.material}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Dimensions</span>
                    <span className="font-semibold text-white mt-0.5 block">
                      {product.dimensions}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Layer Height</span>
                    <span className="font-semibold text-purple-300 mt-0.5 block">
                      {product.specs.layerHeight}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Print Time</span>
                    <span className="font-semibold text-white mt-0.5 block">
                      {product.specs.printTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-6">
              <button
                onClick={handleOrder}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-xs tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>💬</span>
                <span>Order via WhatsApp ({product.price})</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
