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
      telephone: '+21612345678',
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
