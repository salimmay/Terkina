'use client';

import { useLanguageStore, Language } from '@/store/useLanguageStore';

export function useLanguage() {
  const { language, dir, setLanguage } = useLanguageStore();
  return {
    lang: language,
    language,
    dir,
    setLanguage,
    setLang: setLanguage,
  };
}

export type { Language };
