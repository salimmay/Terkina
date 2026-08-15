import { create } from 'zustand';

export type Language = 'en' | 'fr' | 'ar';

interface LanguageState {
  language: Language;
  dir: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  dir: 'ltr',
  setLanguage: (lang: Language) =>
    set({
      language: lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
    }),
}));
