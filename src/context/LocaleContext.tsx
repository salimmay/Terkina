'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { DEFAULT_LOCALE, localeFromPathname, type Locale } from '@/lib/locale';

// Re-exported so client components can keep importing locale helpers from one
// place; the definitions live in @/lib/locale so server code can use them too.
export { LOCALES, DEFAULT_LOCALE, withLocale, localizedPath, localeFromPathname } from '@/lib/locale';
export type { Locale } from '@/lib/locale';

interface LocaleValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
}

const LocaleContext = createContext<LocaleValue>({ locale: DEFAULT_LOCALE, dir: 'ltr' });

/**
 * Locale is derived from the URL rather than held in module state.
 *
 * The previous Zustand store was a module-level global, which on the server is
 * shared across concurrent requests — one visitor's language could bleed into
 * another visitor's HTML. Reading the pathname keeps it per-request correct on
 * the server and reactive to client-side navigation.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const value = useMemo<LocaleValue>(() => {
    const locale = localeFromPathname(pathname || '/');
    return { locale, dir: locale === 'ar' ? 'rtl' : 'ltr' };
  }, [pathname]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);
