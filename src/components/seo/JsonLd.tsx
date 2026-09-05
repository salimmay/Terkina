import React from 'react';

type SchemaType = 'studio' | 'product' | 'gallery';

interface ProductData {
  title?: string;
  imageUrl?: string;
  description?: string;
  price?: string;
  is_in_stock?: boolean;
}

interface GalleryData {
  title?: string;
  description?: string;
}

interface JsonLdProps {
  type: SchemaType;
  data?: ProductData | GalleryData | Record<string, unknown>;
}

export default function JsonLd({ type, data }: JsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://terkina.com';

  let schema: object = {};

  if (type === 'studio') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'TERKINA Studio & 3D Lab',
      image: `${baseUrl}/logo.png`,
      url: baseUrl,
      // Set NEXT_PUBLIC_CONTACT_PHONE in .env. A stale number in structured
      // data is worse than none, since Google may surface it directly.
      ...(process.env.NEXT_PUBLIC_CONTACT_PHONE
        ? { telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE }
        : {}),
      priceRange: '$$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tunis',
        addressCountry: 'TN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 36.8065,
        longitude: 10.1815,
      },
      // Tells Google this business serves customers in all three languages.
      availableLanguage: [
        { '@type': 'Language', name: 'French', alternateName: 'fr' },
        { '@type': 'Language', name: 'Arabic', alternateName: 'ar' },
        { '@type': 'Language', name: 'English', alternateName: 'en' },
      ],
      areaServed: { '@type': 'Country', name: 'Tunisia' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'TERKINA Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Wedding Photography & Cinematography',
              serviceType: 'Wedding videography',
              url: `${baseUrl}/weddings`,
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Commercial & Advertising Production',
              serviceType: 'Commercial video production',
              url: `${baseUrl}/production`,
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: '3D Printing & Rapid Prototyping',
              serviceType: 'Additive manufacturing',
              url: `${baseUrl}/3d`,
            },
          },
        ],
      },
      sameAs: [
        'https://instagram.com/terkina',
        'https://linkedin.com/company/terkina',
      ],
      department: [
        {
          '@type': 'LocalBusiness',
          name: 'MED ART — Luxury Wedding Cinema',
          description: 'High-end bridal photography and cinematic wedding storytelling.',
        },
        {
          '@type': 'LocalBusiness',
          name: 'TERKINA — Commercial Production',
          description: 'Commercial advertising, luxury product photography, and corporate video.',
        },
        {
          '@type': 'LocalBusiness',
          name: 'TERKINA 3D Lab',
          description: 'Additive manufacturing, rapid prototyping, and custom physical fabrication.',
        },
      ],
    };
  }

  if (type === 'product' && data) {
    const prod = data as ProductData;
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: prod.title,
      image: prod.imageUrl,
      description: prod.description,
      brand: {
        '@type': 'Brand',
        name: 'TERKINA 3D Lab',
      },
      offers: {
        '@type': 'Offer',
        price: prod.price?.replace(/[^0-9.]/g, '') || '0',
        priceCurrency: 'TND',
        availability: prod.is_in_stock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
        url: `${baseUrl}/3d`,
      },
    };
  }

  if (type === 'gallery' && data) {
    const gallery = data as GalleryData;
    schema = {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: gallery.title,
      description: gallery.description,
      author: {
        '@type': 'Organization',
        name: 'TERKINA Studio',
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
