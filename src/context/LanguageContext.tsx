'use client';

import { useLocale, type Locale } from './LocaleContext';

/**
 * Locale now comes from the URL (see LocaleContext) rather than client state,
 * so server-rendered HTML is in the right language and each locale has its own
 * crawlable URL. Switching languages is a navigation, not a setState — see the
 * language switcher in Navbar.
 */
export function useLanguage() {
  const { locale, dir } = useLocale();
  return {
    lang: locale,
    language: locale,
    dir,
  };
}

export type { Locale as Language };
