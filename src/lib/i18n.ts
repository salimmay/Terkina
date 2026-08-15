import { Language } from '@/store/useLanguageStore';

export const dictionary = {
  en: {
    nav: {
      brand: 'TERKINA',
      photography: 'Photography',
      threeD: '3D Printing',
      about: 'About Us',
      contact: 'Contact',
      crm: 'CRM Admin',
    },
    hero: {
      photo: {
        badge: 'STUDIO & GALLERY',
        title: 'PHOTOGRAPHY',
        subtitle: 'Capturing light, emotion, and architectural mastery through cinematic lenses.',
        cta: 'Explore Portfolio',
      },
      threeD: {
        badge: 'INTERACTIVE CANVAS',
        title: '3D PRINTING',
        subtitle: 'Precision 3D modeling, prototyping, and generative digital artifacts.',
        cta: 'Launch 3D World',
      },
    },
    footer: {
      rights: 'All rights reserved.',
    },
  },
  fr: {
    nav: {
      brand: 'TERKINA',
      photography: 'Photographie',
      threeD: 'Impression 3D',
      about: 'À propos',
      contact: 'Contact',
      crm: 'CRM Admin',
    },
    hero: {
      photo: {
        badge: 'STUDIO & GALERIE',
        title: 'PHOTOGRAPHIE',
        subtitle: 'Capturer la lumière, l\'émotion et la maîtrise architecturale à travers des objectifs cinématographiques.',
        cta: 'Explorer le Portfolio',
      },
      threeD: {
        badge: 'TOILE INTERACTIVE',
        title: 'IMPRESSION 3D',
        subtitle: 'Modélisation 3D de précision, prototypage et artefacts numériques génératifs.',
        cta: 'Lancer l\'Univers 3D',
      },
    },
    footer: {
      rights: 'Tous droits réservés.',
    },
  },
  ar: {
    nav: {
      brand: 'تركينة',
      photography: 'التصوير الفوتوغرافي',
      threeD: 'الطباعة ثلاثية الأبعاد',
      about: 'من نحن',
      contact: 'تواصل معنا',
      crm: 'لوحة التحكم',
    },
    hero: {
      photo: {
        badge: 'استوديو ومعرض',
        title: 'التصوير',
        subtitle: 'تخليد الضوء والأحاسيس والدقة المعمارية عبر عدسات سينمائية احترافية.',
        cta: 'تصفح الأعمال',
      },
      threeD: {
        badge: 'عالم تفاعلي',
        title: 'الطباعة ٣D',
        subtitle: 'نمذجة ثلاثية الأبعاد فائقة الدقة، ابتكارات رقمية ومجسمات ملموسة.',
        cta: 'استكشف عالم ٣D',
      },
    },
    footer: {
      rights: 'جميع الحقوق محفوظة.',
    },
  },
};

export function getTranslation(lang: Language) {
  return dictionary[lang] || dictionary.en;
}
