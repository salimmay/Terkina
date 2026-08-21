'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function PrintQuoteCalculator() {
  const { lang, dir } = useLanguage();
  const WHATSAPP_NUMBER = '21612345678'; // Target WhatsApp number

  const [material, setMaterial] = useState('Translucent SLA Resin');
  const [infill, setInfill] = useState(20);
  const [dimensions, setDimensions] = useState('10 x 10 x 10 cm');
  const [useCase, setUseCase] = useState('Functional Mechanical Prototype');
  const [notes, setNotes] = useState('');

  const materials = [
    { id: 'Translucent SLA Resin', name: 'Translucent SLA Resin', spec: '0.025mm Ultra-Detail', ar: 'راتنج SLA شفاف فائق الدقة' },
    { id: 'Tough Engineering PLA+', name: 'Tough Engineering PLA+', spec: 'High Impact Strength', ar: 'PLA+ هندسي عالي التحمل' },
    { id: 'Carbon Fiber Nylon', name: 'Carbon Fiber Nylon (PA12)', spec: 'Structural & Aerospace Grade', ar: 'نايلون مقوى بألياف الكربون' },
    { id: 'High-Temp Polycarbonate', name: 'Polycarbonate (PC)', spec: 'Heat Resistant 110°C', ar: 'بولي كربونات مقاوم للحرارة' },
    { id: 'Flexible TPU 95A', name: 'Flexible TPU 95A', spec: 'Elastic & Shore Hardness', ar: 'مطاط مرن TPU' },
  ];

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();

    const text = `*New 3D Print Quote Request* 🧊⚙️\n\n` +
      `📦 *Material:* ${material}\n` +
      `⚡ *Infill Density:* ${infill}%\n` +
      `📐 *Dimensions:* ${dimensions}\n` +
      `🎯 *Use Case:* ${useCase}\n` +
      `💬 *Custom Notes / CAD Link:* ${notes || 'None'}\n\n` +
      `_Submitted via TERKINA 3D Engineering Lab_`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="calculator" className="py-28 px-6 md:px-16 bg-[#040307] border-t border-white/10 relative overflow-hidden">
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
            <span>⚙</span> {lang === 'ar' ? 'حاسبة المواصفات والتسعير' : lang === 'fr' ? 'Calculateur de Devis 3D' : 'Custom Print Calculator'}
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight break-words">
            {lang === 'ar' ? 'حدد مواصفات مجسمك 3D' : lang === 'fr' ? 'Configurez Vos Paramètres d\'Impression 3D' : 'Configure Your 3D Print Specs'}
          </h2>
          
          <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto mt-3 font-light">
            {lang === 'ar'
              ? 'اختر نوع المادة، كثافة الحشو، والأبعاد للحصول على تقدير فوري وتصدير الطلب مباشرة إلى واتساب.'
              : lang === 'fr'
              ? 'Sélectionnez vos matériaux, taux de remplissage et dimensions pour une estimation instantanée envoyée directement sur WhatsApp.'
              : 'Select material grade, structural infill, and bounding dimensions to configure a precision quote dispatched straight to WhatsApp.'}
          </p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSendQuote} 
          className="p-6 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-6 shadow-2xl"
        >
          {/* Material Selection */}
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase mb-3">
              {lang === 'ar' ? 'نوع المادة الصناعية' : lang === 'fr' ? 'Sélection du Matériau' : 'Select Material Grade'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {materials.map((mat) => (
                <button
                  type="button"
                  key={mat.id}
                  onClick={() => setMaterial(mat.name)}
                  className={`p-3.5 rounded-2xl text-xs font-semibold border transition-all text-left flex flex-col justify-between gap-1 cursor-pointer min-h-[58px] ${
                    material === mat.name
                      ? 'bg-purple-500/20 border-purple-400 text-white shadow-lg shadow-purple-500/10'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="font-bold text-white">{lang === 'ar' ? mat.ar : mat.name}</span>
                  <span className="text-[10px] font-mono text-purple-300/80">{mat.spec}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Infill Density Slider */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex justify-between items-center text-xs font-mono text-white/70 uppercase mb-3">
              <span className="flex items-center gap-1.5">
                <span>⚡</span> {lang === 'ar' ? 'كثافة الحشو الداخلي (Infill Density)' : lang === 'fr' ? 'Densité de Remplissage (Infill)' : 'Infill Density (Structural Strength)'}
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold font-mono">
                {infill}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={infill}
              onChange={(e) => setInfill(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-2 bg-white/10 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/40 mt-2">
              <span>10% (Lightweight Draft)</span>
              <span>40% (Semi-Structural)</span>
              <span>100% (Solid Solid Shell)</span>
            </div>
          </div>

          {/* Dimensions & Use Case Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">
                {lang === 'ar' ? 'الأبعاد التقريبية (طول x عرض x ارتفاع)' : lang === 'fr' ? 'Dimensions Estimées (L x l x H)' : 'Approx Dimensions (L x W x H)'}
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-base md:text-sm focus:outline-none focus:border-purple-400 transition-colors min-h-[48px]"
                placeholder="e.g. 15 x 12 x 8 cm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">
                {lang === 'ar' ? 'طبيعة الاستخدام' : lang === 'fr' ? 'Usage Principal' : 'Primary Use Case'}
              </label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#09080e] border border-white/10 text-white text-base md:text-sm focus:outline-none focus:border-purple-400 transition-colors min-h-[48px] cursor-pointer"
              >
                <option value="Functional Mechanical Prototype">Functional Mechanical Prototype</option>
                <option value="Architectural Scale Model">Architectural Scale Model</option>
                <option value="Art & Ambient Lighting Fixture">Art & Ambient Lighting Fixture</option>
                <option value="Cosplay / Collectible Prop">Cosplay / Collectible Prop</option>
                <option value="Industrial End-Use Part">Industrial End-Use Part</option>
              </select>
            </div>
          </div>

          {/* Additional Notes or CAD link */}
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase mb-2">
              {lang === 'ar' ? 'ملاحظات أو رابط ملف STL/GLB / Google Drive' : lang === 'fr' ? 'Notes ou Lien vers Fichier 3D (.STL / .GLB)' : 'Project Notes or Link to 3D CAD File (.STL / .GLB)'}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-base md:text-sm focus:outline-none focus:border-purple-400 transition-colors resize-none min-h-[100px]"
              placeholder={lang === 'ar' ? 'أضف رابط Google Drive / WeTransfer لملف الـ 3D CAD، أو حدد دقة التسامح المطلوبة...' : 'Provide Google Drive / WeTransfer link to your 3D CAD model, or detail specific tolerances...'}
            />
          </div>

          {/* Submit via WhatsApp */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold uppercase text-xs tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            <span>💬</span>
            <span>{lang === 'ar' ? 'إرسال طلب التسعير عبر واتساب' : lang === 'fr' ? 'Envoyer la Demande sur WhatsApp' : 'Dispatch Print Order to WhatsApp'}</span>
            <span>→</span>
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
