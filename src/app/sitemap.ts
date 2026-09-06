import { MetadataRoute } from 'next';
import { LOCALES, withLocale } from '@/lib/locale';
import { SITE_URL } from '@/lib/seo';

const PAGES: Array<{ path: string; priority: number }> = [
  { path: '/', priority: 1.0 },
  { path: '/weddings', priority: 0.9 },
  { path: '/weddings/packs', priority: 0.9 },
  { path: '/production', priority: 0.9 },
  { path: '/3d', priority: 0.9 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Every page is listed once per locale, each entry carrying the full set of
  // hreflang alternates so Google can tie the three versions together.
  return PAGES.flatMap(({ path, priority }) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}${withLocale(path, locale)}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority,
      alternates: {
        languages: {
          'en-US': `${SITE_URL}${withLocale(path, 'en')}`,
          'fr-FR': `${SITE_URL}${withLocale(path, 'fr')}`,
          'ar-TN': `${SITE_URL}${withLocale(path, 'ar')}`,
        },
      },
    }))
  );
}
