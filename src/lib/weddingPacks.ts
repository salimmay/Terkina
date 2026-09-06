import type { Locale } from '@/lib/locale';

export type PackCategory = 'extras' | 'standard' | 'cine' | 'wedding';

/**
 * Categories are structural, so they live in code. Their visible labels and
 * notes are translation keys, editable under Site Settings ▸ Website Text —
 * only the priced packs themselves come from Supabase.
 */
export interface CategoryConfig {
  key: PackCategory;
  /** À-la-carte services stack; the three pack tiers are one-of. */
  multi: boolean;
  labelKey: string;
  labelFallback: string;
  tagKey: string;
  tagFallback: string;
  noteKey?: string;
  noteFallback?: string;
}

export const PACK_CATEGORIES: CategoryConfig[] = [
  {
    key: 'extras',
    multi: true,
    labelKey: 'packs.extras.label',
    labelFallback: 'Services à la carte',
    tagKey: 'packs.extras.tag',
    tagFallback: 'Add as many as you like',
  },
  {
    key: 'standard',
    multi: false,
    labelKey: 'packs.standard.label',
    labelFallback: 'Pack Standard',
    tagKey: 'packs.pickOne',
    tagFallback: 'Choose one',
  },
  {
    key: 'cine',
    multi: false,
    labelKey: 'packs.cine.label',
    labelFallback: 'Pack Standard Cinématique',
    tagKey: 'packs.pickOne',
    tagFallback: 'Choose one',
    noteKey: 'packs.cine.note',
    noteFallback:
      'Same formula as the Standard Pack, filmed with two cameras (C1: wide / C2: tight).',
  },
  {
    key: 'wedding',
    multi: false,
    labelKey: 'packs.wedding.label',
    labelFallback: 'Wedding Package',
    tagKey: 'packs.pickOne',
    tagFallback: 'Choose one',
  },
];

export interface WeddingPackRow {
  id: string;
  category: PackCategory;
  name_fr: string;
  name_en: string;
  name_ar: string;
  features_fr: string[];
  features_en: string[];
  features_ar: string[];
  price: number;
  sort_order: number;
  is_active: boolean;
}

export interface WeddingPack {
  id: string;
  category: PackCategory;
  name: string;
  features: string[];
  price: number;
}

/** Falls back to French, which is the client's authoritative copy. */
export function localizePack(row: WeddingPackRow, locale: Locale): WeddingPack {
  const name = (locale === 'en' ? row.name_en : locale === 'ar' ? row.name_ar : row.name_fr) || row.name_fr;
  const features =
    (locale === 'en' ? row.features_en : locale === 'ar' ? row.features_ar : row.features_fr) || [];

  return {
    id: row.id,
    category: row.category,
    name,
    features: features.length > 0 ? features : row.features_fr,
    price: Number(row.price) || 0,
  };
}

export function formatPrice(amount: number, locale: Locale): string {
  const localeTag = locale === 'ar' ? 'ar-TN' : locale === 'en' ? 'en-US' : 'fr-FR';
  return `${new Intl.NumberFormat(localeTag).format(amount)} DT`;
}
