// Pure locale constants and path helpers — deliberately NOT a client module,
// so server code (sitemap, metadata) can import them too. The React context
// that exposes the active locale lives in @/context/LocaleContext.

export type Locale = 'en' | 'fr' | 'ar';

export const LOCALES: Locale[] = ['en', 'fr', 'ar'];
export const DEFAULT_LOCALE: Locale = 'en';

export function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split('/')[1];
  return segment === 'fr' || segment === 'ar' ? segment : DEFAULT_LOCALE;
}

/** Prefixes a canonical (English) path for the given locale: /weddings -> /fr/weddings */
export function withLocale(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/** Rewrites a path to the same page in another locale: /fr/weddings -> /weddings */
export function localizedPath(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'fr' || segments[0] === 'ar') segments.shift();
  const rest = segments.join('/');

  if (locale === DEFAULT_LOCALE) return `/${rest}`;
  return rest ? `/${locale}/${rest}` : `/${locale}`;
}
