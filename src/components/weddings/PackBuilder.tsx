'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLocale } from '@/context/LocaleContext';
import { useT } from '@/lib/translations/TranslationsProvider';
import { renderTemplate } from '@/lib/translations/registry';
import { useSiteSettings } from '@/lib/useSiteSettings';
import {
  PACK_CATEGORIES,
  formatPrice,
  localizePack,
  type PackCategory,
  type WeddingPack,
  type WeddingPackRow,
} from '@/lib/weddingPacks';

type Selection = Record<PackCategory, string[]>;

const EMPTY_SELECTION: Selection = { extras: [], standard: [], cine: [], wedding: [] };

export default function PackBuilder() {
  const { locale, dir } = useLocale();
  const t = useT();
  const { whatsappNumber } = useSiteSettings();

  const [rows, setRows] = useState<WeddingPackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState<Selection>(EMPTY_SELECTION);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPacks() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('wedding_pack')
        .select('*')
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('sort_order', { ascending: true });

      if (error) {
        if (error.code === 'PGRST205') {
          console.warn('`wedding_pack` table missing. Run supabase/wedding_packs.sql.');
        } else {
          console.error('Failed to load wedding packs:', error.message);
        }
        setRows([]);
      } else {
        setRows((data || []) as WeddingPackRow[]);
      }
      setLoading(false);
    }
    loadPacks();
  }, []);

  const packsByCategory = useMemo(() => {
    const map: Record<PackCategory, WeddingPack[]> = { extras: [], standard: [], cine: [], wedding: [] };
    for (const row of rows) {
      if (map[row.category]) map[row.category].push(localizePack(row, locale));
    }
    return map;
  }, [rows, locale]);

  const toggle = useCallback((category: PackCategory, id: string, multi: boolean) => {
    setSelection((prev) => {
      const current = prev[category];
      if (multi) {
        return {
          ...prev,
          [category]: current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
        };
      }
      // Tiers are one-of, and clicking the active card clears it.
      return { ...prev, [category]: current[0] === id ? [] : [id] };
    });
  }, []);

  const chosen = useMemo(() => {
    const out: Array<{ categoryLabel: string; pack: WeddingPack }> = [];
    for (const category of PACK_CATEGORIES) {
      const label = t(category.labelKey, category.labelFallback);
      for (const id of selection[category.key]) {
        const pack = packsByCategory[category.key].find((p) => p.id === id);
        if (pack) out.push({ categoryLabel: label, pack });
      }
    }
    return out;
  }, [selection, packsByCategory, t]);

  const total = useMemo(() => chosen.reduce((sum, c) => sum + c.pack.price, 0), [chosen]);

  const buildSummaryText = useCallback(() => {
    const lines = chosen.map((c) => `• ${c.categoryLabel} : ${c.pack.name}`).join('\n');

    return renderTemplate(
      t(
        'whatsapp.packSelection.template',
        '*My selection — Med Art* ✨\n\n{{lines}}\n\n*Total:* {{total}}'
      ),
      { lines, total: formatPrice(total, locale) }
    );
  }, [chosen, total, locale, t]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the WhatsApp button still works */
    }
  };

  const handleSend = async () => {
    const text = buildSummaryText();

    // Same pattern as the other forms: record the lead first, but never let a
    // failed save block the WhatsApp hand-off.
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: 'Pack builder',
          service: 'Med Art — Pack selection',
          content: text,
        }),
      });
    } catch (err) {
      console.error('Pack lead backup failed, proceeding to WhatsApp', err);
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const hasPacks = rows.length > 0;

  return (
    <div dir={dir} className="pb-32">
      {loading ? (
        <div className="py-24 text-center text-xs font-mono text-white/40 animate-pulse">
          {t('packs.loading', 'Loading packages...')}
        </div>
      ) : !hasPacks ? (
        <div className="py-24 text-center rounded-2xl border border-white/5 bg-white/[0.01]">
          <span className="text-3xl block mb-3">✦</span>
          <p className="text-xs font-mono text-white/50">
            {t('packs.emptyState', 'No packages published yet.')}
          </p>
        </div>
      ) : (
        PACK_CATEGORIES.map((category) => {
          const packs = packsByCategory[category.key];
          if (packs.length === 0) return null;
          const selected = selection[category.key];

          return (
            <section key={category.key} className="mb-14">
              <div className="flex items-baseline justify-between gap-4 pb-3 mb-2 border-b border-amber-500/15">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {t(category.labelKey, category.labelFallback)}
                </h2>
                <span className="shrink-0 text-[10px] font-mono uppercase tracking-widest text-amber-300/80 border border-amber-500/30 rounded-full px-3 py-1">
                  {t(category.tagKey, category.tagFallback)}
                </span>
              </div>

              {category.noteKey && (
                <p className="text-xs text-white/45 leading-relaxed mb-5 max-w-2xl">
                  {t(category.noteKey, category.noteFallback || '')}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {packs.map((pack) => {
                  const isSelected = selected.includes(pack.id);
                  return (
                    <button
                      key={pack.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggle(category.key, pack.id, category.multi)}
                      className={`group relative text-start rounded-2xl border p-5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400/70 bg-amber-500/[0.07] shadow-lg shadow-amber-950/20'
                          : 'border-white/10 bg-white/[0.02] hover:border-amber-400/30 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span
                        className={`absolute top-5 ${dir === 'rtl' ? 'left-5' : 'right-5'} w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-amber-400 border-amber-400' : 'border-white/25'
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 text-black transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                        />
                      </span>

                      {/* Unit prices are deliberately not shown — the client
                          quotes on the total only. They must also stay out of
                          the WhatsApp/copy summary the visitor can read. */}
                      <div className={dir === 'rtl' ? 'pl-8' : 'pr-8'}>
                        <h3 className="font-heading text-xl font-bold text-white">{pack.name}</h3>
                      </div>

                      <ul className="mt-4 space-y-2">
                        {pack.features.map((feature, i) => (
                          <li key={i} className="text-xs text-white/60 leading-relaxed flex gap-2">
                            <span className="text-amber-500/70 shrink-0">—</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelection((prev) => ({ ...prev, [category.key]: [] }))}
                  className="mt-4 text-xs text-white/40 hover:text-amber-300 underline underline-offset-4 transition-colors cursor-pointer"
                >
                  {t('packs.clear', 'Clear selection')}
                </button>
              )}
            </section>
          );
        })
      )}

      {/* Sticky running total */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b0906]/95 backdrop-blur-xl border-t border-amber-500/20"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4" dir={dir}>
          <div className="min-w-0">
            <div className="hidden sm:block text-[11px] text-white/40 truncate">
              {chosen.length > 0
                ? chosen.map((c) => c.pack.name).join('  ·  ')
                : t('packs.empty', 'No selection yet')}
            </div>
            <div className="font-heading text-xl text-white">
              {t('packs.total', 'Total')}{' '}
              <span className="text-amber-300 tabular-nums">{formatPrice(total, locale)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              disabled={chosen.length === 0}
              className="px-3.5 py-2.5 rounded-full border border-white/15 text-white/80 hover:text-white hover:bg-white/5 text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {copied ? t('packs.copied', 'Copied ✓') : t('packs.copy', 'Copy')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={chosen.length === 0}
              className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {t('packs.send', 'Send my selection')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
