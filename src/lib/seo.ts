import type { Metadata } from 'next';
import type { Locale } from '@/lib/locale';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://terkina.com';

export type PageKey = 'home' | 'weddings' | 'production' | 'threeD';

/** Unprefixed (English) path for each page. */
const PAGE_PATHS: Record<PageKey, string> = {
  home: '',
  weddings: '/weddings',
  production: '/production',
  threeD: '/3d',
};

interface Copy {
  title: string;
  description: string;
}

/**
 * Search copy per locale. Targets the queries a Tunisian buyer actually types:
 * French is the dominant commercial search language locally, Arabic the widest
 * reach, English the smallest of the three.
 */
export const SEO_COPY: Record<Locale, Record<PageKey, Copy>> = {
  en: {
    home: {
      title: 'TERKINA | Wedding Films, Ad Production & 3D Printing Tunisia',
      description:
        'Tunisian creative studio: luxury wedding films by Med Art, high-impact commercial production, and micron-precise 3D printing. Get a quote on WhatsApp.',
    },
    weddings: {
      title: 'Luxury Wedding Photography & Films in Tunisia | Med Art',
      description:
        'Med Art films Tunisian weddings in cinematic detail — editorial bridal portraits, candid ceremony coverage and 4K wedding films. View albums and book on WhatsApp.',
    },
    production: {
      title: 'Commercial Video Production & Brand Campaigns | Tunisia',
      description:
        'High-impact advertising production in Tunisia: brand campaigns, luxury product shoots, corporate events and conference coverage with cinema-grade equipment.',
    },
    threeD: {
      title: '3D Printing Tunisia | SLA Resin & Custom Prototyping',
      description:
        'Precision 3D printing in Tunisia from 0.025mm layers. Ready-made designs, custom prototypes and industrial polymers. Send your model and order on WhatsApp.',
    },
  },
  fr: {
    home: {
      title: 'TERKINA | Films de Mariage, Production Pub & Impression 3D',
      description:
        'Studio créatif tunisien : films de mariage de luxe avec Med Art, production publicitaire à fort impact et impression 3D de précision. Devis rapide sur WhatsApp.',
    },
    weddings: {
      title: 'Photographe & Vidéaste Mariage Tunisie | Med Art',
      description:
        'Med Art filme votre mariage en Tunisie avec une approche cinématographique : portraits de mariée, cérémonie et film 4K. Découvrez nos albums et réservez sur WhatsApp.',
    },
    production: {
      title: 'Production Audiovisuelle & Publicitaire | Tunisie',
      description:
        'Production publicitaire en Tunisie : campagnes de marque, shootings produits haut de gamme, événements corporate et couverture de conférences en qualité cinéma.',
    },
    threeD: {
      title: 'Impression 3D Tunisie | Résine SLA & Prototypage',
      description:
        'Impression 3D de précision en Tunisie dès 0,025 mm. Objets prêts à commander, prototypes sur mesure et polymères industriels. Envoyez votre modèle sur WhatsApp.',
    },
  },
  ar: {
    home: {
      title: 'تيركينا | تصوير أعراس، إنتاج إعلاني وطباعة ثلاثية الأبعاد',
      description:
        'استوديو تونسي متكامل: تصوير أعراس فاخر مع ميد آرت، إنتاج إعلاني احترافي، وطباعة ثلاثية الأبعاد بدقة عالية. اطلب عرض سعر عبر واتساب.',
    },
    weddings: {
      title: 'تصوير أعراس في تونس | ميد آرت للتصوير السينمائي',
      description:
        'ميد آرت توثّق زفافك في تونس بلمسة سينمائية: جلسات تصوير العروس، تغطية الحفل، وأفلام زفاف بجودة 4K. تصفّح الألبومات واحجز عبر واتساب.',
    },
    production: {
      title: 'إنتاج إعلاني وتصوير تجاري في تونس | تيركينا',
      description:
        'إنتاج إعلاني في تونس: حملات العلامات التجارية، تصوير المنتجات الفاخرة، وتغطية الفعاليات والمؤتمرات بمعدات سينمائية احترافية.',
    },
    threeD: {
      title: 'طباعة ثلاثية الأبعاد في تونس | راتنج SLA ونماذج مخصصة',
      description:
        'طباعة ثلاثية الأبعاد بدقة تصل إلى 0.025 مم في تونس. منتجات جاهزة، نماذج أولية مخصصة، وبوليمرات صناعية. أرسل ملفك عبر واتساب.',
    },
  },
};

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  ar: 'ar_TN',
};

function urlFor(page: PageKey, locale: Locale): string {
  const path = PAGE_PATHS[page];
  if (locale === 'en') return path || '/';
  return `/${locale}${path}`;
}

/**
 * Builds page metadata plus honest hreflang. Every alternate below now serves
 * genuinely translated, server-rendered HTML — previously these pointed at
 * ?lang= URLs that returned identical English markup, so Google ignored them.
 */
export function buildMetadata(page: PageKey, locale: Locale): Metadata {
  const copy = SEO_COPY[locale][page];
  const canonical = urlFor(page, locale);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        'en-US': urlFor(page, 'en'),
        'fr-FR': urlFor(page, 'fr'),
        'ar-TN': urlFor(page, 'ar'),
        'x-default': urlFor(page, 'en'),
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'TERKINA',
      locale: OG_LOCALE[locale],
      url: canonical,
      title: copy.title,
      description: copy.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
    },
  };
}
