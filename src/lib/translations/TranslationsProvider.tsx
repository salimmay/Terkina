'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguageStore } from '@/store/useLanguageStore';
import { TRANSLATION_REGISTRY } from '@/lib/translations/registry';

type Overrides = Record<string, { en: string; fr: string; ar: string }>;

// Per-language defaults for every known key, straight from the registry —
// this is what non-English visitors see until an admin edits a field, so a
// missing DB row must never silently fall back to English-only text.
const REGISTRY_BY_KEY: Overrides = Object.fromEntries(
  TRANSLATION_REGISTRY.map((f) => [f.key, { en: f.en, fr: f.fr, ar: f.ar }])
);

interface TranslationsContextValue {
  overrides: Overrides;
  loading: boolean;
  refresh: () => Promise<void>;
}

const TranslationsContext = createContext<TranslationsContextValue>({
  overrides: {},
  loading: true,
  refresh: async () => {},
});

export function TranslationsProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('site_translations').select('key, en, fr, ar');
      if (!error && data) {
        const map: Overrides = {};
        for (const row of data as Array<{ key: string; en: string; fr: string; ar: string }>) {
          map[row.key] = { en: row.en, fr: row.fr, ar: row.ar };
        }
        setOverrides(map);
      }
    } catch (err) {
      console.warn('Falling back to default site text (site_translations unavailable):', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <TranslationsContext.Provider value={{ overrides, loading, refresh }}>
      {children}
    </TranslationsContext.Provider>
  );
}

// Flat-key translator: t('nav.weddings', 'Med Art (Weddings)').
// Resolution order: (1) admin-edited DB override for the current language,
// (2) the registry's own per-language default for that key, (3) the
// hardcoded English fallback passed at the call site (only reached for a
// key that was never added to the registry).
export function useT() {
  const { overrides } = useContext(TranslationsContext);
  const { language } = useLanguageStore();

  return useCallback(
    (key: string, fallback: string): string => {
      const override = overrides[key]?.[language];
      if (override && override.trim().length > 0) return override;

      const registryDefault = REGISTRY_BY_KEY[key]?.[language];
      if (registryDefault && registryDefault.trim().length > 0) return registryDefault;

      return fallback;
    },
    [overrides, language]
  );
}

// Used by the admin editor to know which keys already have a saved override.
export function useTranslationsAdmin() {
  const ctx = useContext(TranslationsContext);
  return ctx;
}
