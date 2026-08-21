'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, UploadCloud, Layers, FileCode, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CustomPrintSection() {
  const { lang, dir } = useLanguage();
  const WHATSAPP_NUMBER = '21612345678';

  const [formData, setFormData] = useState({
    name: '',
    materialType: 'Standard PLA (Matte/Glossy)',
    details: '',
    fileUrl: '',
  });

  const handleCustomOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const text = `*Custom 3D Print Request* 🛠️⚙️\n\n` +
      `👤 *Client Name:* ${formData.name}\n` +
      `🧵 *Preferred Material:* ${formData.materialType}\n` +
      `💬 *Description & Dimensions:* ${formData.details}\n` +
      `🔗 *3D File / CAD Link:* ${formData.fileUrl || 'Will send directly in chat'}\n\n` +
      `_Sent from TERKINA 3D Studio_`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="custom-print" className="py-24 px-6 md:px-16 bg-[#040307] border-t border-white/10 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-950/20 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10" dir={dir}>
        
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300 uppercase tracking-widest mb-4"
          >
            <span>⚙</span> {lang === 'ar' ? 'خدمة الطباعة والتصنيع حسب الطلب' : lang === 'fr' ? 'Fabrication 3D sur Mesure' : 'Bespoke Fabrication Service'}
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight break-words">
            {lang === 'ar' ? 'لديك تصميم خاص أو ملف 3D؟' : lang === 'fr' ? 'Vous Avez un Modèle ou Fichier 3D ?' : 'Have a Custom 3D Model to Print?'}
          </h2>
          
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto mt-3 font-light">
            {lang === 'ar'
              ? 'أرسل لنا تفاصيل مشروعك أو رابط ملف التصميم (STL, OBJ, STEP) وسنقوم بتقدير التكلفة وتجهيز طلبك فوراً.'
              : lang === 'fr'
              ? 'Partagez votre fichier CAO, dimensions ou croquis. Nous prenons en charge le tranchage de précision et la fabrication.'
              : 'Share your CAD file, prototype dimensions, or rough idea. We handle precision slicing, material selection, and rapid turnaround.'}
          </p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleCustomOrder}
          className="p-6 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">
                {lang === 'ar' ? 'الاسم الكامل / الشركة' : lang === 'fr' ? 'Votre Nom / Entreprise' : 'Your Name / Company'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-base md:text-sm focus:outline-none focus:border-purple-400 transition-colors min-h-[48px]"
                placeholder={lang === 'ar' ? 'مثال: كريم بن علي' : 'e.g. Karim Ben Ali'}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">
                {lang === 'ar' ? 'المادة المفضلة (اختياري)' : lang === 'fr' ? 'Matériau Souhaité' : 'Preferred Material'}
              </label>
              <select
                value={formData.materialType}
                onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-[#09080e] border border-white/10 text-white text-base md:text-sm focus:outline-none focus:border-purple-400 transition-colors min-h-[48px] cursor-pointer"
              >
                <option value="Standard PLA (Matte/Glossy)">Standard PLA (Matte / Glossy)</option>
                <option value="Ultra-Detailed SLA Resin (Miniatures/Smooth)">Ultra-Detailed SLA Resin (Miniatures/Smooth)</option>
                <option value="PETG / ABS (Heat & Impact Resistant)">PETG / ABS (Durable & Functional)</option>
                <option value="Carbon Fiber Nylon (PA12 High Strength)">Carbon Fiber Nylon (PA12 High Strength)</option>
                <option value="Flexible TPU 95A (Rubber-Like)">Flexible TPU 95A (Rubber-Like)</option>
                <option value="Not Sure (Need Recommendation)">Not Sure (Need Recommendation)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-white/50 uppercase mb-2">
              {lang === 'ar' ? 'رابط الملف ثلاثي الأبعاد (Google Drive / WeTransfer / Dropbox)' : lang === 'fr' ? 'Lien du Fichier 3D (Drive / WeTransfer / .STL)' : '3D File Link (Optional .STL / .STEP / Drive)'}
            </label>
            <input
              type="url"
              value={formData.fileUrl}
              onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-base md:text-sm focus:outline-none focus:border-purple-400 transition-colors min-h-[48px]"
              placeholder="https://drive.google.com/... or wetransfer.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-white/50 uppercase mb-2">
              {lang === 'ar' ? 'تفاصيل الطلب (الأبعاد، الألوان، الاستخدام)' : lang === 'fr' ? 'Détails du Projet (Dimensions, Quantité, Usage)' : 'Project Notes & Dimensions'}
            </label>
            <textarea
              rows={4}
              required
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-base md:text-sm focus:outline-none focus:border-purple-400 transition-colors resize-none min-h-[110px]"
              placeholder={lang === 'ar' ? 'أخبرنا عن أبعاد المجسم (مثال: ارتفاع 15 سم)، الكمية المطلوبة، وأي متطلبات خاصة...' : 'Describe dimensions (e.g. 15cm height), quantity, mechanical requirements, or color preferences...'}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-xs tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إرسال طلب الطباعة عبر واتساب' : lang === 'fr' ? 'Envoyer la Demande sur WhatsApp' : 'Submit Custom Request to WhatsApp'}</span>
            <span>→</span>
          </motion.button>
        </motion.form>

      </div>
    </section>
  );
}
