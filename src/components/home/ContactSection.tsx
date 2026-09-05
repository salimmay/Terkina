'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { useT } from '@/lib/translations/TranslationsProvider';
import { renderTemplate } from '@/lib/translations/registry';

export default function ContactSection() {
  const { language: lang, dir } = useLanguageStore();
  const { whatsappNumber } = useSiteSettings();
  const t = useT();

  const [formData, setFormData] = useState({
    name: '',
    service: 'Med Art (Weddings)',
    message: '',
  });

  const serviceOptions = [
    { id: 'Med Art (Weddings)', textKey: 'home.contact.serviceWeddings', fallback: '💍 Weddings (Med Art)' },
    { id: 'Terkina Production (Commercial & Ads)', textKey: 'home.contact.serviceProduction', fallback: '🎬 Commercial & Ads (Terkina)' },
    { id: '3D Printing & Engineering', textKey: 'home.contact.service3d', fallback: '🧊 3D Print Lab & Prototyping' },
  ];

  const handleWhatsAppSend = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Silently log to Supabase / CRM so you have a record in your admin dashboard
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: formData.name,
          service: formData.service,
          content: formData.message,
        }),
      });
      if (!res.ok) throw new Error('Failed to save lead');
    } catch (err) {
      console.error('Lead backup log failed, proceeding to WhatsApp', err);
      toast.error(
        lang === 'ar'
          ? 'تعذر حفظ الطلب في السجلات، لكن سيتم فتح واتساب على أي حال.'
          : lang === 'fr'
            ? "Impossible d'enregistrer la demande, mais WhatsApp va tout de même s'ouvrir."
            : "Couldn't save this inquiry to our records, but WhatsApp will still open."
      );
    }

    // 2. Open WhatsApp immediately
    const text = renderTemplate(
      t(
        'whatsapp.contactInquiry.template',
        '*New Inquiry via TERKINA & MED ART* ✨\n\n👤 *Name / Client:* {{name}}\n🎯 *Service:* {{service}}\n💬 *Details:* {{message}}'
      ),
      { name: formData.name, service: formData.service, message: formData.message }
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 px-5 sm:px-8 md:px-16 border-t border-white/10 bg-[#040407] overflow-hidden">
      {/* Dynamic green ambient glow for WhatsApp aura */}
      <div className="absolute bottom-0 right-1/4 w-[320px] sm:w-[450px] h-[250px] bg-emerald-950/20 blur-[120px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10" dir={dir}>
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase break-words">
            {t('home.contact.heading', "Let's Create Cinematic History")}
          </h3>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleWhatsAppSend} 
          className="flex flex-col gap-5 sm:gap-6 p-5 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase mb-3">
              {t('home.contact.serviceLabel', 'Select Service Type')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {serviceOptions.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setFormData({ ...formData, service: s.id })}
                  className={`py-3 px-3 rounded-xl text-xs font-semibold transition-all border min-h-[48px] flex items-center justify-center cursor-pointer ${
                    formData.service === s.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {t(s.textKey, s.fallback)}
                </button>
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase mb-2">
              {t('home.contact.nameLabel', 'Your Name / Couple / Brand')}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-base md:text-sm placeholder-white/20 focus:outline-none focus:border-emerald-400/50 transition-colors min-h-[48px]"
              placeholder={t('home.contact.namePlaceholder', 'e.g. Alexander & Sophia / Brand Name')}
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase mb-2">
              {t('home.contact.messageLabel', 'Project Scope & Dates')}
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-base md:text-sm placeholder-white/20 focus:outline-none focus:border-emerald-400/50 transition-colors resize-none min-h-[120px]"
              placeholder={t('home.contact.messagePlaceholder', 'Tell us about your wedding date, venue, or commercial campaign scope...')}
            />
          </div>

          {/* WhatsApp CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-xs tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2 min-h-[48px]"
          >
            <span>💬</span>
            <span>{t('home.contact.buttonText', 'Start WhatsApp Chat')}</span>
            <span>→</span>
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
