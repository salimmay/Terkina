'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { ChevronDown, Search, MessageCircle, BarChart3, Globe, Clapperboard, KeyRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { TRANSLATION_REGISTRY, TRANSLATION_GROUPS, TranslationField } from '@/lib/translations/registry';
import { useTranslationsAdmin } from '@/lib/translations/TranslationsProvider';
import MediaUploader from '@/components/admin/MediaUploader';
import AccountSecurity from '@/components/admin/AccountSecurity';
import { FALLBACK_HERO_MED_ART, FALLBACK_HERO_TERKINA, FALLBACK_LOGO } from '@/lib/useSiteSettings';
import { PageHeader, Card, CardHeader, Button, Label, Input, Textarea } from '@/components/admin/ui';

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

const TABS = [
  { id: 'general' as const, label: 'WhatsApp & Channels', icon: MessageCircle },
  { id: 'hero' as const, label: 'Branding & Media', icon: Clapperboard },
  { id: 'metrics' as const, label: 'Animated Metrics', icon: BarChart3 },
  { id: 'text' as const, label: 'Website Text', icon: Globe },
  { id: 'account' as const, label: 'Account', icon: KeyRound },
];

type TabId = 'general' | 'hero' | 'metrics' | 'text' | 'account';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const [whatsappNumber, setWhatsappNumber] = useState('21612345678');
  const [agencyEmail, setAgencyEmail] = useState('contact@terkina.com');
  const [heroMedArt, setHeroMedArt] = useState('');
  const [heroTerkina, setHeroTerkina] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

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
          if (row.key === 'branding') {
            if (row.content?.hero_video_medart) setHeroMedArt(row.content.hero_video_medart as string);
            if (row.content?.hero_video_terkina) setHeroTerkina(row.content.hero_video_terkina as string);
            if (row.content?.logo_url) setLogoUrl(row.content.logo_url as string);
          }
        });
      }
    }
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (key: string, section: string, content: Record<string, unknown>) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ key, section, content, updated_at: new Date().toISOString() }, { onConflict: 'key' });

      if (error) throw error;
      toast.success('Site settings updated live.');
    } catch (err) {
      const e = err as { message?: string };
      toast.error(`Save failed: ${e.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Site Settings"
        description="WhatsApp routing, homepage counters, and every editable string on the public site."
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800 mb-6 -mt-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-sm border-b-2 -mb-px transition-colors cursor-pointer ${
                isActive
                  ? 'border-white text-white font-medium'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: WHATSAPP SETTINGS ================= */}
      {activeTab === 'general' && (
        <Card className="max-w-lg">
          <CardHeader
            title="Primary WhatsApp dispatch channel"
            description="All booking triggers and marketplace orders route to this number."
          />
          <div className="space-y-4">
            <div>
              <Label>Phone number (country code, no '+' or spaces)</Label>
              <Input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="21612345678"
              />
              <span className="text-[11px] text-zinc-600 block mt-1.5">
                Example: 216XXXXXXXX (Tunisia), 33XXXXXXXXX (France)
              </span>
            </div>

            <div>
              <Label>Agency contact email</Label>
              <Input
                type="email"
                value={agencyEmail}
                onChange={(e) => setAgencyEmail(e.target.value)}
              />
            </div>

            <Button
              variant="primary"
              size="sm"
              loading={saving}
              onClick={() =>
                handleSave('contact_settings', 'general', {
                  whatsapp_number: whatsappNumber,
                  contact_email: agencyEmail,
                })
              }
            >
              Save configuration
            </Button>
          </div>
        </Card>
      )}

      {/* ================= TAB: HERO VIDEOS ================= */}
      {activeTab === 'hero' && (
        <Card className="max-w-2xl">
          <CardHeader
            title="Branding & media"
            description="Logo and the two looping hero reels. Uploaded to Cloudinary, swappable anytime — no redeploy."
          />

          <div className="space-y-6">
            <div>
              <MediaUploader
                label="Site logo (navbar + CRM)"
                folder="terkina/branding"
                accept="image/*"
                multiple={false}
                currentValue={logoUrl}
                onUploadSuccess={(result) => setLogoUrl(result.secure_url)}
                onClear={() => setLogoUrl('')}
              />
              <p className="text-[11px] text-zinc-600 mt-1.5">
                {logoUrl ? (
                  'Shown in the public navbar and the CRM sidebar.'
                ) : (
                  <>
                    Currently using the bundled default:{' '}
                    <code className="text-zinc-500">{FALLBACK_LOGO}</code>. Upload a{' '}
                    <strong>transparent PNG or SVG</strong> — a JPEG will show a solid box on dark
                    backgrounds. The browser tab icon stays the bundled one until it&apos;s replaced in code.
                  </>
                )}
              </p>
            </div>

            <div>
              <MediaUploader
                label="Med Art reel (left / weddings)"
                folder="terkina/hero"
                accept="video/*"
                multiple={false}
                resourceType="video"
                currentValue={heroMedArt}
                onUploadSuccess={(result) => setHeroMedArt(result.secure_url)}
                onClear={() => setHeroMedArt('')}
              />
              {!heroMedArt && (
                <p className="text-[11px] text-zinc-600 mt-1.5">
                  Currently using the bundled fallback:{' '}
                  <code className="text-zinc-500">{FALLBACK_HERO_MED_ART}</code>
                </p>
              )}
            </div>

            <div>
              <MediaUploader
                label="Terkina reel (right / commercial)"
                folder="terkina/hero"
                accept="video/*"
                multiple={false}
                resourceType="video"
                currentValue={heroTerkina}
                onUploadSuccess={(result) => setHeroTerkina(result.secure_url)}
                onClear={() => setHeroTerkina('')}
              />
              {!heroTerkina && (
                <p className="text-[11px] text-zinc-600 mt-1.5">
                  Currently using the bundled fallback:{' '}
                  <code className="text-zinc-500">{FALLBACK_HERO_TERKINA}</code>
                </p>
              )}
            </div>

            <p className="text-[11px] text-zinc-600 leading-relaxed">
              Use short, silent, seamlessly looping clips. Uploads are capped at 35&nbsp;MB — export
              a compressed 1080p version rather than the full 4K master, since this autoplays for
              every visitor on arrival.
            </p>

            <Button
              variant="primary"
              size="sm"
              loading={saving}
              onClick={() =>
                handleSave('branding', 'branding', {
                  logo_url: logoUrl,
                  hero_video_medart: heroMedArt,
                  hero_video_terkina: heroTerkina,
                })
              }
            >
              Save branding & media
            </Button>
          </div>
        </Card>
      )}

      {/* ================= TAB 2: LIVE METRICS ================= */}
      {activeTab === 'metrics' && (
        <Card>
          <CardHeader
            title="Homepage animated counters"
            description="Controls the live statistics displayed in the About section on the homepage."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-md bg-zinc-950 border border-zinc-800 space-y-2">
              <Label>Photo sets (Med Art)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={stats.photoSets}
                  onChange={(e) => setStats({ ...stats, photoSets: Number(e.target.value) })}
                  className="w-2/3"
                />
                <Input
                  type="text"
                  value={stats.photoSuffix}
                  onChange={(e) => setStats({ ...stats, photoSuffix: e.target.value })}
                  className="w-1/3 text-center"
                />
              </div>
            </div>

            <div className="p-4 rounded-md bg-zinc-950 border border-zinc-800 space-y-2">
              <Label>3D precision (tolerance)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  value={stats.tolerance}
                  onChange={(e) => setStats({ ...stats, tolerance: Number(e.target.value) })}
                  className="w-2/3"
                />
                <Input
                  type="text"
                  value={stats.toleranceSuffix}
                  onChange={(e) => setStats({ ...stats, toleranceSuffix: e.target.value })}
                  className="w-1/3 text-center"
                />
              </div>
            </div>

            <div className="p-4 rounded-md bg-zinc-950 border border-zinc-800 space-y-2">
              <Label>Bespoke craft ratio</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={stats.bespokeCraft}
                  onChange={(e) => setStats({ ...stats, bespokeCraft: Number(e.target.value) })}
                  className="w-2/3"
                />
                <Input
                  type="text"
                  value={stats.craftSuffix}
                  onChange={(e) => setStats({ ...stats, craftSuffix: e.target.value })}
                  className="w-1/3 text-center"
                />
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            loading={saving}
            className="mt-5"
            onClick={() => handleSave('stats', 'metrics', stats as unknown as Record<string, unknown>)}
          >
            Save metrics
          </Button>
        </Card>
      )}

      {/* ================= TAB 3: WEBSITE TEXT (EN/FR/AR) ================= */}
      {activeTab === 'text' && <WebsiteTextEditor />}

      {/* ================= TAB: ACCOUNT SECURITY ================= */}
      {activeTab === 'account' && <AccountSecurity />}
    </div>
  );
}

// ============================================================================
// Website Text Editor — every visitor-facing string on the public site,
// grouped by section, editable in English, French, and Arabic.
// ============================================================================
type DraftValue = { en: string; fr: string; ar: string };

function WebsiteTextEditor() {
  const supabase = createClient();
  const { overrides, loading, refresh } = useTranslationsAdmin();
  const [drafts, setDrafts] = useState<Record<string, DraftValue>>({});
  const [search, setSearch] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [savingGroup, setSavingGroup] = useState<string | null>(null);

  // Seed the editable draft state: DB override wins, else the registry default.
  useEffect(() => {
    if (loading) return;
    const initial: Record<string, DraftValue> = {};
    for (const field of TRANSLATION_REGISTRY) {
      const override = overrides[field.key];
      initial[field.key] = {
        en: override?.en || field.en,
        fr: override?.fr || field.fr,
        ar: override?.ar || field.ar,
      };
    }
    setDrafts(initial);
  }, [loading, overrides]);

  const filteredFields = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TRANSLATION_REGISTRY;
    return TRANSLATION_REGISTRY.filter(
      (f) =>
        f.key.toLowerCase().includes(q) ||
        f.label.toLowerCase().includes(q) ||
        f.en.toLowerCase().includes(q) ||
        f.fr.toLowerCase().includes(q) ||
        f.ar.includes(q)
    );
  }, [search]);

  const fieldsByGroup = useMemo(() => {
    const map: Record<string, TranslationField[]> = {};
    for (const field of filteredFields) {
      (map[field.group] ||= []).push(field);
    }
    return map;
  }, [filteredFields]);

  const updateDraft = (key: string, lang: 'en' | 'fr' | 'ar', value: string) => {
    setDrafts((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: value } }));
  };

  const isGroupDirty = (group: string) =>
    (fieldsByGroup[group] || []).some((f) => {
      const d = drafts[f.key];
      if (!d) return false;
      const saved = overrides[f.key];
      const savedEn = saved?.en || f.en;
      const savedFr = saved?.fr || f.fr;
      const savedAr = saved?.ar || f.ar;
      return d.en !== savedEn || d.fr !== savedFr || d.ar !== savedAr;
    });

  const handleSaveGroup = async (group: string) => {
    const fields = fieldsByGroup[group] || [];
    setSavingGroup(group);
    try {
      const rows = fields.map((f) => ({
        key: f.key,
        group_name: f.group,
        en: drafts[f.key]?.en ?? f.en,
        fr: drafts[f.key]?.fr ?? f.fr,
        ar: drafts[f.key]?.ar ?? f.ar,
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from('site_translations').upsert(rows);
      if (error) throw error;
      await refresh();
      toast.success(`"${group}" text updated live on the site.`);
    } catch (err) {
      const e = err as { message?: string; code?: string };
      toast.error(
        e.code === 'PGRST205'
          ? 'Website text isn\'t set up yet — run supabase/site_translations.sql in your Supabase SQL Editor.'
          : `Failed to save "${group}": ${e.message || 'Unknown error'}`
      );
    } finally {
      setSavingGroup(null);
    }
  };

  const toggleGroup = (group: string) =>
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));

  if (loading) {
    return (
      <Card>
        <div className="text-center text-xs text-zinc-500 py-6">Loading current website text...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Edit English, French, and Arabic side by side. Leaving a field blank keeps the current
          live text. Fields containing <code className="text-zinc-300 bg-zinc-800 px-1 rounded">{'{{placeholders}}'}</code>{' '}
          are message templates — keep the placeholder tokens intact.
        </p>
      </Card>

      <div className="relative">
        <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by section, label, or current text..."
          className="pl-9"
        />
      </div>

      <div className="space-y-2.5">
        {TRANSLATION_GROUPS.filter((g) => fieldsByGroup[g]?.length).map((group) => {
          const isOpen = openGroups[group] ?? !!search;
          const dirty = isGroupDirty(group);
          const isSaving = savingGroup === group;

          return (
            <Card key={group} padded={false}>
              <button
                type="button"
                onClick={() => toggleGroup(group)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">{group}</span>
                  <span className="text-[11px] text-zinc-600">{fieldsByGroup[group].length} fields</span>
                  {dirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-5 border-t border-zinc-800 pt-4">
                  {fieldsByGroup[group].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-medium text-zinc-300">{field.label}</span>
                        <span className="text-[10px] text-zinc-600 font-mono">{field.key}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {(['en', 'fr', 'ar'] as const).map((langCode) => (
                          <div key={langCode} className="space-y-1">
                            <span className="text-[10px] uppercase text-zinc-600 font-medium">
                              {langCode === 'en' ? 'English' : langCode === 'fr' ? 'Français' : 'العربية'}
                            </span>
                            <Textarea
                              rows={field.en.length > 120 ? 4 : 2}
                              dir={langCode === 'ar' ? 'rtl' : 'ltr'}
                              value={drafts[field.key]?.[langCode] ?? ''}
                              onChange={(e) => updateDraft(field.key, langCode, e.target.value)}
                              className="text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <Button
                    variant={dirty ? 'primary' : 'secondary'}
                    size="sm"
                    disabled={!dirty}
                    loading={isSaving}
                    onClick={() => handleSaveGroup(group)}
                  >
                    {dirty ? `Save "${group}"` : 'Saved'}
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
