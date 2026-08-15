'use client';

import React, { useState, useEffect } from 'react';

type LanguageMap = { en: string; fr: string; ar: string };

export default function AdminContentManager() {
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'contact' | 'general'>('hero');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 1. Hero Section State
  const [heroPhoto, setHeroPhoto] = useState<{
    badge: LanguageMap;
    title: LanguageMap;
    subtitle: LanguageMap;
    button_text: LanguageMap;
  }>({
    badge: { en: 'Studio & Gallery', fr: 'Studio & Galerie', ar: 'الاستوديو والمعرض' },
    title: { en: 'Photography', fr: 'Photographie', ar: 'التصوير' },
    subtitle: {
      en: 'Capturing light, emotion, and architectural mastery through cinematic lenses.',
      fr: 'Capturer la lumière, l\'émotion et la maîtrise architecturale.',
      ar: 'التقاط الضوء والعاطفة والإتقان المعماري من خلال عدسات سينمائية.',
    },
    button_text: { en: 'Explore Portfolio', fr: 'Explorer la Galerie', ar: 'استكشف المعرض' },
  });

  const [heroThreeD, setHeroThreeD] = useState<{
    badge: LanguageMap;
    title: LanguageMap;
    subtitle: LanguageMap;
    button_text: LanguageMap;
  }>({
    badge: { en: 'Interactive Canvas', fr: 'Espace Interactif', ar: 'مساحة ثلاثية الأبعاد' },
    title: { en: '3D Printing', fr: 'Impression 3D', ar: 'الطباعة 3D' },
    subtitle: {
      en: 'Precision 3D modeling, rapid prototyping, and generative physical artifacts.',
      fr: 'Modélisation 3D de précision, prototypage rapide et artefacts physiques.',
      ar: 'نمذجة ثلاثية الأبعاد دقيقة، نماذج أولية، وأعمال فنية رقمية مولّدة.',
    },
    button_text: { en: 'Launch 3D World', fr: 'Lancer le Monde 3D', ar: 'انطلق للعالم 3D' },
  });

  // 2. About Section State
  const [aboutSection, setAboutSection] = useState<{
    badge: LanguageMap;
    heading: LanguageMap;
    paragraph1: LanguageMap;
    paragraph2: LanguageMap;
  }>({
    badge: { en: 'Who We Are', fr: 'Qui Sommes-Nous', ar: 'من نحن' },
    heading: {
      en: 'Fusing Visual Artistry With Physical Precision.',
      fr: 'Fusionner l\'art visuel et la précision physique.',
      ar: 'ندمج بين الفن البصري والهندسة الدقيقة.',
    },
    paragraph1: {
      en: 'TERKINA is a hybrid multimedia studio operating at the intersection of cinematic photography, high-end videography, and industrial-grade 3D additive manufacturing.',
      fr: 'TERKINA est un studio multimédia hybride opérant à l\'intersection de la photographie cinématographique et de la fabrication additive 3D.',
      ar: 'تيركينا هو استوديو وسائط متقدم متخصص في إنتاج المحتوى البصري والحلول الفيزيائية ثلاثية الأبعاد.',
    },
    paragraph2: {
      en: 'From editorial architectural shoots to micron-precise custom prototypes, our dual-pipeline infrastructure allows creators to scale visions without medium boundaries.',
      fr: 'Des prises de vue architecturales éditoriales aux prototypes sur mesure de précision micronique.',
      ar: 'سواء كنت بحاجة إلى جلسة تصوير معمارية سينمائية أو نموذج أولي مطبوع بدقة ميكرونية، نضمن لك جودة استثنائية.',
    },
  });

  const [statsData, setStatsData] = useState({
    stat1: { val: 500, suffix: '+', label: { en: 'Photo Sets', fr: 'Projets Photo', ar: 'مشروع تصوير' } },
    stat2: { val: 0.05, suffix: 'mm', label: { en: '3D Tolerance', fr: 'Précision 3D', ar: 'دقة الطباعة' } },
    stat3: { val: 100, suffix: '%', label: { en: 'Bespoke Craft', fr: 'Sur Mesure', ar: 'حرفية مخصصة' } },
  });

  // 3. Contact Form State
  const [contactSection, setContactSection] = useState<{
    badge: LanguageMap;
    heading: LanguageMap;
    name_placeholder: LanguageMap;
    message_placeholder: LanguageMap;
    button_text: LanguageMap;
    chip_photo: LanguageMap;
    chip_3d: LanguageMap;
    chip_custom: LanguageMap;
  }>({
    badge: { en: 'Instant WhatsApp Dispatch', fr: 'Dispatch WhatsApp Instantané', ar: 'دردشة مباشرة عبر واتساب' },
    heading: { en: "Let's Build Something Iconic", fr: "Construisons Quelque Chose d'Iconique", ar: 'دعنا نصنع شيئاً استثنائياً' },
    name_placeholder: { en: 'e.g. Alex Morgan', fr: 'ex. Jean Dupont', ar: 'مثال: أحمد كريم' },
    message_placeholder: {
      en: 'Tell us about your timeline, dimensions, or shoot ideas...',
      fr: 'Parlez-nous de vos besoins, délais ou idées...',
      ar: 'أخبرنا عن فكرتك، الموعد النهائي، أو المواصفات...',
    },
    button_text: { en: 'Start WhatsApp Chat', fr: 'Lancer le Chat WhatsApp', ar: 'تواصل عبر واتساب فوراً' },
    chip_photo: { en: '📸 Photography', fr: '📸 Photographie', ar: '📸 تصوير' },
    chip_3d: { en: '🧊 3D Printing', fr: '🧊 Impression 3D', ar: '🧊 طباعة 3D' },
    chip_custom: { en: '⚡ Both / Custom', fr: '⚡ Sur Mesure', ar: '⚡ مشروع مشترك' },
  });

  // 4. General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    whatsapp_number: '21612345678',
    contact_email: 'contact@terkina.com',
  });

  // Load existing content on mount
  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((items) => {
        if (Array.isArray(items)) {
          items.forEach((item) => {
            if (item.key === 'photo_side' && item.content) setHeroPhoto(item.content);
            if (item.key === '3d_side' && item.content) setHeroThreeD(item.content);
            if (item.key === 'about_section' && item.content) setAboutSection(item.content);
            if (item.key === 'stats' && item.content) setStatsData(item.content);
            if (item.key === 'contact_section' && item.content) setContactSection(item.content);
            if (item.key === 'contact_settings' && item.content) setGeneralSettings(item.content);
          });
        }
      })
      .catch((e) => console.error('Failed to load content', e));
  }, []);

  const saveContent = async (key: string, content: unknown) => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, content }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const renderLangGroup = (
    label: string,
    stateObj: LanguageMap,
    onChange: (newMap: LanguageMap) => void,
    isTextArea: boolean = false
  ) => (
    <div className="space-y-2">
      <label className="block text-xs font-mono text-white/70 font-semibold uppercase">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <span className="text-[10px] font-mono text-white/40 block mb-1">ENGLISH (EN)</span>
          {isTextArea ? (
            <textarea
              rows={2}
              value={stateObj?.en || ''}
              onChange={(e) => onChange({ ...stateObj, en: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-black border border-white/15 text-xs text-white resize-none"
            />
          ) : (
            <input
              type="text"
              value={stateObj?.en || ''}
              onChange={(e) => onChange({ ...stateObj, en: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-black border border-white/15 text-xs text-white"
            />
          )}
        </div>
        <div>
          <span className="text-[10px] font-mono text-white/40 block mb-1">FRENCH (FR)</span>
          {isTextArea ? (
            <textarea
              rows={2}
              value={stateObj?.fr || ''}
              onChange={(e) => onChange({ ...stateObj, fr: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-black border border-white/15 text-xs text-white resize-none"
            />
          ) : (
            <input
              type="text"
              value={stateObj?.fr || ''}
              onChange={(e) => onChange({ ...stateObj, fr: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-black border border-white/15 text-xs text-white"
            />
          )}
        </div>
        <div>
          <span className="text-[10px] font-mono text-white/40 block mb-1">ARABIC (AR)</span>
          {isTextArea ? (
            <textarea
              rows={2}
              dir="rtl"
              value={stateObj?.ar || ''}
              onChange={(e) => onChange({ ...stateObj, ar: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-black border border-white/15 text-xs text-white resize-none"
            />
          ) : (
            <input
              type="text"
              dir="rtl"
              value={stateObj?.ar || ''}
              onChange={(e) => onChange({ ...stateObj, ar: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-black border border-white/15 text-xs text-white"
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto text-white pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider">Universal Site Content Manager</h1>
          <p className="text-xs text-white/50 font-mono mt-1">
            Modify 100% of public website copy, badges, titles, descriptions, buttons, placeholders, and metrics.
          </p>
        </div>
        {saved && (
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono w-fit">
            ✓ Changes Saved Live
          </span>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-xl w-fit border border-white/10 overflow-x-auto">
        {(['hero', 'about', 'contact', 'general'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            {tab === 'hero' ? 'Hero Split' : tab === 'about' ? 'About & Metrics' : tab === 'contact' ? 'Contact Form' : 'General & WhatsApp'}
          </button>
        ))}
      </div>

      {/* ---------------- TAB 1: HERO SECTION ---------------- */}
      {activeTab === 'hero' && (
        <div className="space-y-8 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          {/* Photography Side */}
          <div className="space-y-6">
            <h2 className="text-sm font-mono uppercase text-blue-400 font-bold border-b border-blue-500/20 pb-2">
              📷 Left Panel: Photography Copy
            </h2>
            {renderLangGroup('Badge Pill Text', heroPhoto.badge, (badge) => setHeroPhoto({ ...heroPhoto, badge }))}
            {renderLangGroup('Main Title', heroPhoto.title, (title) => setHeroPhoto({ ...heroPhoto, title }))}
            {renderLangGroup('Subtitle Description', heroPhoto.subtitle, (subtitle) => setHeroPhoto({ ...heroPhoto, subtitle }), true)}
            {renderLangGroup('CTA Button Text', heroPhoto.button_text, (button_text) => setHeroPhoto({ ...heroPhoto, button_text }))}
          </div>

          {/* 3D Printing Side */}
          <div className="space-y-6 pt-6 border-t border-white/10">
            <h2 className="text-sm font-mono uppercase text-purple-400 font-bold border-b border-purple-500/20 pb-2">
              ⬡ Right Panel: 3D Printing Copy
            </h2>
            {renderLangGroup('Badge Pill Text', heroThreeD.badge, (badge) => setHeroThreeD({ ...heroThreeD, badge }))}
            {renderLangGroup('Main Title', heroThreeD.title, (title) => setHeroThreeD({ ...heroThreeD, title }))}
            {renderLangGroup('Subtitle Description', heroThreeD.subtitle, (subtitle) => setHeroThreeD({ ...heroThreeD, subtitle }), true)}
            {renderLangGroup('CTA Button Text', heroThreeD.button_text, (button_text) => setHeroThreeD({ ...heroThreeD, button_text }))}
          </div>

          <button
            onClick={() => {
              saveContent('photo_side', heroPhoto);
              saveContent('3d_side', heroThreeD);
            }}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Hero Copy'}
          </button>
        </div>
      )}

      {/* ---------------- TAB 2: ABOUT & METRICS ---------------- */}
      {activeTab === 'about' && (
        <div className="space-y-8 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="space-y-6">
            <h2 className="text-sm font-mono uppercase text-purple-400 font-bold border-b border-purple-500/20 pb-2">
              Studio Manifesto & Descriptions
            </h2>
            {renderLangGroup('Badge Text', aboutSection.badge, (badge) => setAboutSection({ ...aboutSection, badge }))}
            {renderLangGroup('Main Headline', aboutSection.heading, (heading) => setAboutSection({ ...aboutSection, heading }))}
            {renderLangGroup('Primary Paragraph Description', aboutSection.paragraph1, (paragraph1) => setAboutSection({ ...aboutSection, paragraph1 }), true)}
            {renderLangGroup('Secondary Paragraph Description', aboutSection.paragraph2, (paragraph2) => setAboutSection({ ...aboutSection, paragraph2 }), true)}
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-sm font-mono uppercase text-purple-400 font-bold">Live Counters & Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stat 1 */}
              <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
                <span className="text-xs font-mono text-white/40">Stat 1 Value & Suffix</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={statsData.stat1.val}
                    onChange={(e) => setStatsData({ ...statsData, stat1: { ...statsData.stat1, val: Number(e.target.value) } })}
                    className="w-2/3 p-2 rounded bg-white/5 border border-white/10 text-sm font-mono font-bold"
                  />
                  <input
                    type="text"
                    value={statsData.stat1.suffix}
                    onChange={(e) => setStatsData({ ...statsData, stat1: { ...statsData.stat1, suffix: e.target.value } })}
                    className="w-1/3 p-2 rounded bg-white/5 border border-white/10 text-sm font-mono text-center"
                  />
                </div>
                {renderLangGroup('Stat 1 Label', statsData.stat1.label, (label) => setStatsData({ ...statsData, stat1: { ...statsData.stat1, label } }))}
              </div>

              {/* Stat 2 */}
              <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
                <span className="text-xs font-mono text-white/40">Stat 2 Value & Suffix</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={statsData.stat2.val}
                    onChange={(e) => setStatsData({ ...statsData, stat2: { ...statsData.stat2, val: Number(e.target.value) } })}
                    className="w-2/3 p-2 rounded bg-white/5 border border-white/10 text-sm font-mono font-bold"
                  />
                  <input
                    type="text"
                    value={statsData.stat2.suffix}
                    onChange={(e) => setStatsData({ ...statsData, stat2: { ...statsData.stat2, suffix: e.target.value } })}
                    className="w-1/3 p-2 rounded bg-white/5 border border-white/10 text-sm font-mono text-center"
                  />
                </div>
                {renderLangGroup('Stat 2 Label', statsData.stat2.label, (label) => setStatsData({ ...statsData, stat2: { ...statsData.stat2, label } }))}
              </div>

              {/* Stat 3 */}
              <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
                <span className="text-xs font-mono text-white/40">Stat 3 Value & Suffix</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={statsData.stat3.val}
                    onChange={(e) => setStatsData({ ...statsData, stat3: { ...statsData.stat3, val: Number(e.target.value) } })}
                    className="w-2/3 p-2 rounded bg-white/5 border border-white/10 text-sm font-mono font-bold"
                  />
                  <input
                    type="text"
                    value={statsData.stat3.suffix}
                    onChange={(e) => setStatsData({ ...statsData, stat3: { ...statsData.stat3, suffix: e.target.value } })}
                    className="w-1/3 p-2 rounded bg-white/5 border border-white/10 text-sm font-mono text-center"
                  />
                </div>
                {renderLangGroup('Stat 3 Label', statsData.stat3.label, (label) => setStatsData({ ...statsData, stat3: { ...statsData.stat3, label } }))}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              saveContent('about_section', aboutSection);
              saveContent('stats', statsData);
            }}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save About & Stats'}
          </button>
        </div>
      )}

      {/* ---------------- TAB 3: CONTACT FORM ---------------- */}
      {activeTab === 'contact' && (
        <div className="space-y-6 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-mono uppercase text-emerald-400 font-bold border-b border-emerald-500/20 pb-2">
            Contact Form Titles, Placeholders & Buttons
          </h2>
          {renderLangGroup('Badge Text', contactSection.badge, (badge) => setContactSection({ ...contactSection, badge }))}
          {renderLangGroup('Main Section Title', contactSection.heading, (heading) => setContactSection({ ...contactSection, heading }))}
          {renderLangGroup('Name Input Placeholder', contactSection.name_placeholder, (name_placeholder) => setContactSection({ ...contactSection, name_placeholder }))}
          {renderLangGroup('Message Input Placeholder', contactSection.message_placeholder, (message_placeholder) => setContactSection({ ...contactSection, message_placeholder }), true)}
          {renderLangGroup('Submit Button Text', contactSection.button_text, (button_text) => setContactSection({ ...contactSection, button_text }))}
          
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-mono uppercase text-emerald-300">Service Chip Selector Labels</h3>
            {renderLangGroup('Photo Chip Label', contactSection.chip_photo, (chip_photo) => setContactSection({ ...contactSection, chip_photo }))}
            {renderLangGroup('3D Chip Label', contactSection.chip_3d, (chip_3d) => setContactSection({ ...contactSection, chip_3d }))}
            {renderLangGroup('Custom Chip Label', contactSection.chip_custom, (chip_custom) => setContactSection({ ...contactSection, chip_custom }))}
          </div>

          <button
            onClick={() => saveContent('contact_section', contactSection)}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Contact Copy'}
          </button>
        </div>
      )}

      {/* ---------------- TAB 4: GENERAL / WHATSAPP ---------------- */}
      {activeTab === 'general' && (
        <div className="space-y-6 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-mono uppercase text-emerald-400 font-bold">WhatsApp & Direct Dispatch Settings</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1 font-mono">
                WhatsApp Phone Number (Country Code + Number, no + or spaces)
              </label>
              <input
                type="text"
                value={generalSettings.whatsapp_number}
                onChange={(e) => setGeneralSettings({ ...generalSettings, whatsapp_number: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-black border border-white/15 text-sm font-mono"
                placeholder="21612345678"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1 font-mono">Primary Agency Email</label>
              <input
                type="email"
                value={generalSettings.contact_email}
                onChange={(e) => setGeneralSettings({ ...generalSettings, contact_email: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-black border border-white/15 text-sm font-mono"
                placeholder="contact@terkina.com"
              />
            </div>
          </div>

          <button
            onClick={() => saveContent('contact_settings', generalSettings)}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            {saving ? 'Saving...' : 'Update WhatsApp Number'}
          </button>
        </div>
      )}
    </div>
  );
}
