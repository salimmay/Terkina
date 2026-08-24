'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Live site settings editor.
 * Requires supabase/add_crm_extras.sql (creates the `site_content` table).
 */
interface StatsContent {
  photoSets: number;
  photoSuffix: string;
  tolerance: number;
  toleranceSuffix: string;
  bespokeCraft: number;
  craftSuffix: string;
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'metrics'>('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  // Settings State
  const [whatsappNumber, setWhatsappNumber] = useState('21612345678');
  const [agencyEmail, setAgencyEmail] = useState('contact@terkina.com');

  const [stats, setStats] = useState<StatsContent>({
    photoSets: 500,
    photoSuffix: '+',
    tolerance: 0.05,
    toleranceSuffix: 'mm',
    bespokeCraft: 100,
    craftSuffix: '%',
  });

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('site_content').select('*');
      if (data) {
        data.forEach((row: { key: string; content: Record<string, unknown> }) => {
          if (row.key === 'contact_settings') {
            if (row.content?.whatsapp_number) setWhatsappNumber(row.content.whatsapp_number as string);
            if (row.content?.contact_email) setAgencyEmail(row.content.contact_email as string);
          }
          if (row.key === 'stats') {
            setStats(row.content as unknown as StatsContent);
          }
        });
      }
    }
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (key: string, section: string, content: Record<string, unknown>) => {
    setSaving(true);
    setSaved(false);

    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ key, section, content, updated_at: new Date().toISOString() });

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const e = err as { message?: string };
      alert(`Save failed: ${e.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider">
            Site Settings & Dynamic Content
          </h1>
          <p className="text-xs font-mono text-white/50 mt-1">
            Update your primary WhatsApp number, live counter metrics, and site configuration.
          </p>
        </div>

        {saved && (
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
            ✓ Updated Live
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white/5 p-1 rounded-xl w-fit border border-white/10 text-xs font-mono">
        {[
          { id: 'general', label: '⚡ WhatsApp & Channels' },
          { id: 'metrics', label: '📊 Animated Metrics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'general' | 'metrics')}
            className={`px-4 py-2 rounded-lg font-bold uppercase transition-all cursor-pointer ${
              activeTab === tab.id ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TAB 1: WHATSAPP SETTINGS ================= */}
      {activeTab === 'general' && (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
          <div>
            <h2 className="text-sm font-mono uppercase text-emerald-400 tracking-wider">
              Primary WhatsApp Dispatch Channel
            </h2>
            <p className="text-xs text-white/50 mt-1">
              All 1-click booking triggers and 3D marketplace orders will route directly to this
              phone number.
            </p>
          </div>

          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">
                WhatsApp Phone Number (Country code without '+' or spaces)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="21612345678"
                className="w-full p-3.5 rounded-xl bg-black border border-white/15 text-sm font-mono text-emerald-400 font-bold focus:border-emerald-400 focus:outline-none"
              />
              <span className="text-[10px] font-mono text-white/30 block mt-1">
                Example: 216XXXXXXXX (Tunisia), 33XXXXXXXXX (France)
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase mb-2">
                Agency Contact Email
              </label>
              <input
                type="email"
                value={agencyEmail}
                onChange={(e) => setAgencyEmail(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-black border border-white/15 text-sm font-mono"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleSave('contact_settings', 'general', {
                whatsapp_number: whatsappNumber,
                contact_email: agencyEmail,
              })
            }
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-xs tracking-wider transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Updating...' : 'Save WhatsApp Configuration'}
          </button>
        </div>
      )}

      {/* ================= TAB 2: LIVE METRICS ================= */}
      {activeTab === 'metrics' && (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
          <div>
            <h2 className="text-sm font-mono uppercase text-purple-400 tracking-wider">
              Homepage Animated Counters
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Controls the live statistics displayed in the About section on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1 */}
            <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
              <span className="text-xs font-mono text-white/40">Photo Sets (Med Art)</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={stats.photoSets}
                  onChange={(e) => setStats({ ...stats, photoSets: Number(e.target.value) })}
                  className="w-2/3 p-2 rounded bg-white/5 border border-white/10 text-sm font-mono font-bold"
                />
                <input
                  type="text"
                  value={stats.photoSuffix}
                  onChange={(e) => setStats({ ...stats, photoSuffix: e.target.value })}
                  className="w-1/3 p-2 rounded bg-white/5 border border-white/10 text-sm font-mono text-center"
                />
              </div>
            </div>

            {/* Stat 2 */}
            <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
              <span className="text-xs font-mono text-white/40">3D Precision (Tolerance)</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={stats.tolerance}
                  onChange={(e) => setStats({ ...stats, tolerance: Number(e.target.value) })}
                  className="w-2/3 p-2 rounded bg-white/5 border border-white/10 text-sm font-mono font-bold"
                />
                <input
                  type="text"
                  value={stats.toleranceSuffix}
                  onChange={(e) => setStats({ ...stats, toleranceSuffix: e.target.value })}
                  className="w-1/3 p-2 rounded bg-white/5 border border-white/10 text-sm font-mono text-center"
                />
              </div>
            </div>

            {/* Stat 3 */}
            <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
              <span className="text-xs font-mono text-white/40">Bespoke Craft Ratio</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={stats.bespokeCraft}
                  onChange={(e) => setStats({ ...stats, bespokeCraft: Number(e.target.value) })}
                  className="w-2/3 p-2 rounded bg-white/5 border border-white/10 text-sm font-mono font-bold"
                />
                <input
                  type="text"
                  value={stats.craftSuffix}
                  onChange={(e) => setStats({ ...stats, craftSuffix: e.target.value })}
                  className="w-1/3 p-2 rounded bg-white/5 border border-white/10 text-sm font-mono text-center"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSave('stats', 'metrics', stats as unknown as Record<string, unknown>)}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase text-xs tracking-wider transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Updating...' : 'Save Animated Metrics'}
          </button>
        </div>
      )}
    </div>
  );
}
