'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/useLanguageStore';

interface MultilingualField {
  en?: string;
  fr?: string;
  ar?: string;
}

export default function ContactSection() {
  const { language: lang, dir } = useLanguageStore();
  
  // Dynamic Contact Form Copy & Settings
  const [contactSection, setContactSection] = useState<{
    badge?: MultilingualField;
    heading?: MultilingualField;
    name_placeholder?: MultilingualField;
    message_placeholder?: MultilingualField;
    button_text?: MultilingualField;
  }>({
    badge: { en: 'Direct Inquiry & Booking', fr: 'Réservation & Contact Direct', ar: 'حجز واستفسار مباشر عبر واتساب' },
    heading: { en: "Let's Create Cinematic History", fr: "Créons Ensemble un Chef-d'Œuvre", ar: 'دعنا نصنع عملاً بصرياً لا يُنسى' },
    name_placeholder: { en: 'e.g. Alexander & Sophia / Brand Name', fr: 'ex. Alexandre & Sophie / Nom de Marque', ar: 'مثال: أحمد وسارة / اسم الشركة' },
    message_placeholder: {
      en: 'Tell us about your wedding date, venue, or commercial campaign scope...',
      fr: 'Parlez-nous de votre date de mariage, lieu, ou projet publicitaire...',
      ar: 'أخبرنا عن موعد الزفاف والمكان، أو تفاصيل الحملة الإعلانية والإنتاج...',
    },
    button_text: { en: 'Start WhatsApp Chat', fr: 'Lancer le Chat WhatsApp', ar: 'تواصل عبر واتساب فوراً' },
  });

  const [contactSettings, setContactSettings] = useState({
    whatsapp_number: '21612345678',
    contact_email: 'contact@terkina.com',
  });

  const [formData, setFormData] = useState({
    name: '',
    service: 'Med Art (Weddings)',
    message: '',
  });

  const serviceOptions = [
    { 
      id: 'Med Art (Weddings)', 
      label: '💍 Weddings (Med Art)', 
      ar: '💍 تصوير أعراس (Med Art)',
      fr: '💍 Mariages (Med Art)' 
    },
    { 
      id: 'Terkina (Commercial)', 
      label: '🎬 Commercial / Ads', 
      ar: '🎬 إعلانات وإنتاج تجاري',
      fr: '🎬 Commercial / Pub' 
    },
    { 
      id: 'Event Coverage', 
      label: '📸 Events & Festivals', 
      ar: '📸 تغطية فعاليات ومؤتمرات',
      fr: '📸 Événements & Festivals' 
    },
  ];

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((items) => {
        if (Array.isArray(items)) {
          items.forEach((item) => {
            if (item.key === 'contact_section' && item.content) setContactSection(item.content);
            if (item.key === 'contact_settings' && item.content) setContactSettings(item.content);
          });
        }
      })
      .catch(() => {});
  }, []);

  const getLangText = (field?: MultilingualField, fallback: string = '') => {
    if (!field) return fallback;
    const currentLang = lang as 'en' | 'fr' | 'ar';
    return field[currentLang] || field.en || fallback;
  };

  const handleWhatsAppSend = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Silently log to Supabase / CRM so you have a record in your admin dashboard
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: formData.name,
          service: formData.service,
          content: formData.message,
        }),
      });
    } catch (err) {
      console.error('Lead backup log failed, proceeding to WhatsApp', err);
    }

    // 2. Open WhatsApp immediately
    const text = `*New Inquiry via TERKINA & MED ART* ✨\n\n` +
      `👤 *Name / Client:* ${formData.name}\n` +
      `🎯 *Service:* ${formData.service}\n` +
      `💬 *Details:* ${formData.message}`;

    const num = contactSettings.whatsapp_number.replace(/[^\d]/g, '');
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 px-5 sm:px-8 md:px-16 border-t border-white/10 bg-[#040407] overflow-hidden">
      {/* Dynamic green ambient glow for WhatsApp aura */}
      <div className="absolute bottom-0 right-1/4 w-[320px] sm:w-[450px] h-[250px] bg-emerald-950/20 blur-[120px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10" dir={dir}>
        <div className="text-center mb-8 sm:mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {getLangText(contactSection.badge, lang === 'ar' ? 'حجز واستفسار مباشر عبر واتساب' : 'Direct Inquiry & Booking')}
          </motion.div>

          <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase break-words">
            {getLangText(contactSection.heading, "Let's Create Cinematic History")}
          </h3>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleWhatsAppSend} 
          className="flex flex-col gap-5 sm:gap-6 p-5 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          {/* Service Selector Chips - 1 col on mobile, 3 col on sm+ */}
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase mb-3">
              {lang === 'ar' ? 'الخدمة المطلوبة' : lang === 'fr' ? 'Type de Service' : 'Select Service Type'}
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
                  {lang === 'ar' ? s.ar : lang === 'fr' ? s.fr : s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase mb-2">
              {lang === 'ar' ? 'الاسم الكامل / العروسين / الشركة' : lang === 'fr' ? 'Votre Nom / Couple / Entreprise' : 'Your Name / Couple / Brand'}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-base md:text-sm placeholder-white/20 focus:outline-none focus:border-emerald-400/50 transition-colors min-h-[48px]"
              placeholder={getLangText(contactSection.name_placeholder, lang === 'ar' ? 'مثال: أحمد وسارة / اسم الشركة' : 'e.g. Alexander & Sophia / Brand Name')}
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase mb-2">
              {lang === 'ar' ? 'تفاصيل المشروع والموعد' : lang === 'fr' ? 'Détails du Projet & Date' : 'Project Scope & Dates'}
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-base md:text-sm placeholder-white/20 focus:outline-none focus:border-emerald-400/50 transition-colors resize-none min-h-[120px]"
              placeholder={getLangText(contactSection.message_placeholder, lang === 'ar' ? 'أخبرنا عن موعد الزفاف والمكان، أو تفاصيل الحملة الإعلانية والإنتاج...' : 'Tell us about your wedding date, venue, or commercial campaign scope...')}
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
            <span>{getLangText(contactSection.button_text, lang === 'ar' ? 'تواصل عبر واتساب فوراً' : 'Start WhatsApp Chat')}</span>
            <span>→</span>
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
