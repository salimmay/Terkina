'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, UploadCloud, Layers, FileCode, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { useT } from '@/lib/translations/TranslationsProvider';
import { renderTemplate } from '@/lib/translations/registry';

export default function CustomPrintSection() {
  const { lang, dir } = useLanguage();
  const { whatsappNumber } = useSiteSettings();
  const t = useT();

  const [formData, setFormData] = useState({
    name: '',
    materialType: 'Standard PLA (Matte/Glossy)',
    details: '',
    fileUrl: '',
  });

  const handleCustomOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Silently backup lead to Supabase (via CRM inbox pipeline)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: formData.name,
          service: '3D Custom Print',
          content: `Material: ${formData.materialType} | Details: ${formData.details}`,
          file_url: formData.fileUrl || null,
        }),
      });
      if (!res.ok) throw new Error('Failed to save lead');
    } catch (err) {
      // Never block the WhatsApp dispatch on lead-backup failure
      console.error('Lead silent backup failed', err);
      toast.error(
        lang === 'ar'
          ? 'تعذر حفظ الطلب في السجلات، لكن سيتم فتح واتساب على أي حال.'
          : lang === 'fr'
            ? "Impossible d'enregistrer la demande, mais WhatsApp va tout de même s'ouvrir."
            : "Couldn't save this request to our records, but WhatsApp will still open."
      );
    }

    // 2. Open WhatsApp dispatch
    const text = renderTemplate(
      t(
        'whatsapp.customPrint.template',
        '*Custom 3D Print Request* 🛠️⚙️\n\n👤 *Client Name:* {{name}}\n🧵 *Preferred Material:* {{material}}\n💬 *Description & Dimensions:* {{details}}\n🔗 *3D File / CAD Link:* {{fileUrl}}\n\n_Sent from TERKINA 3D Studio_'
      ),
      {
        name: formData.name,
        material: formData.materialType,
        details: formData.details,
        fileUrl: formData.fileUrl || 'Will send directly in chat',
      }
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
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
           {t('customPrint.badge', 'Bespoke Fabrication Service')}
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight break-words">
            {t('customPrint.heading', 'Have a Custom 3D Model to Print?')}
          </h2>

          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto mt-3 font-light">
            {t('customPrint.subheading', 'Share your CAD file, prototype dimensions, or rough idea. We handle precision slicing, material selection, and rapid turnaround.')}
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
                {t('customPrint.nameLabel', 'Your Name / Company')}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-base md:text-sm focus:outline-none focus:border-purple-400 transition-colors min-h-[48px]"
                placeholder={t('customPrint.namePlaceholder', 'e.g. Karim Ben Ali')}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">
                {t('customPrint.materialLabel', 'Preferred Material')}
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
              {t('customPrint.fileLabel', '3D File Link (Optional .STL / .STEP / Drive)')}
            </label>
            <input
              type="url"
              value={formData.fileUrl}
              onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-base md:text-sm focus:outline-none focus:border-purple-400 transition-colors min-h-[48px]"
              placeholder={t('customPrint.filePlaceholder', 'https://drive.google.com/... or wetransfer.com/...')}
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-white/50 uppercase mb-2">
              {t('customPrint.detailsLabel', 'Project Notes & Dimensions')}
            </label>
            <textarea
              rows={4}
              required
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-base md:text-sm focus:outline-none focus:border-purple-400 transition-colors resize-none min-h-[110px]"
              placeholder={t('customPrint.detailsPlaceholder', 'Describe dimensions (e.g. 15cm height), quantity, mechanical requirements, or color preferences...')}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-xs tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('customPrint.buttonText', 'Submit Custom Request to WhatsApp')}</span>
            <span>→</span>
          </motion.button>
        </motion.form>

      </div>
    </section>
  );
}
