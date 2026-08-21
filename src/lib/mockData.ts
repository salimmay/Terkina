export interface PhotoProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  gallery: string[];
  client: string;
  date: string;
  location: string;
  tags: string[];
}

export interface ThreeDProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  modelUrl?: string;
  geometryType?: 'torusKnot' | 'sphere' | 'octahedron' | 'cube' | 'dodecahedron';
  color: string;
  specs: {
    material: string;
    dimensions: string;
    layerHeight: string;
    infill: string;
    printTime: string;
    weight: string;
  };
}

export interface Product3D {
  id: string;
  title: string;
  category: 'lighting' | 'decor' | 'accessories' | 'art';
  price: string;
  material: string;
  dimensions: string;
  imageUrl: string;
  modelUrl?: string;
  description: string;
  inStock?: boolean;
}

/* =========================================================================
   3D MARKETPLACE PHYSICAL PRODUCTS
   ========================================================================= */
export const MOCK_PRODUCTS_DATA: Product3D[] = [
  {
    id: 'prod-1',
    title: 'Aetheric Geometric Table Lamp',
    category: 'lighting',
    price: '180 TND',
    material: 'Matte Bio-PLA & Warm LED Core',
    dimensions: '18 × 18 × 24 cm',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    description: 'Ambient parametric desk lamp featuring internal organic shadow casting, diffusive polymer core, and built-in brass touch switch.',
    inStock: true,
  },
  {
    id: 'prod-2',
    title: 'Monolithic Headphone & Watch Stand',
    category: 'accessories',
    price: '95 TND',
    material: 'High-Density Composite Carbon PLA',
    dimensions: '12 × 15 × 28 cm',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    description: 'Weighted minimalist desk organizer engineered for audiophile over-ear headphones with integrated magnetic cable routing.',
    inStock: true,
  },
  {
    id: 'prod-3',
    title: 'Voronoi Architectural Sculpture',
    category: 'art',
    price: '140 TND',
    material: 'Translucent SLA Optical Resin',
    dimensions: '14 × 14 × 20 cm',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    description: 'Generative mathematical centerpiece with internal light refraction, ultra-smooth 25-micron SLA finish, and obsidian base.',
    inStock: true,
  },
  {
    id: 'prod-4',
    title: 'Custom Low-Poly Planter Vessel',
    category: 'decor',
    price: '45 TND',
    material: 'Bio-Polymer Matte Black',
    dimensions: '10 × 10 × 12 cm',
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    description: 'Self-draining geometric pot designed for succulents and office desks with hidden drip tray.',
    inStock: true,
  },
  {
    id: 'prod-5',
    title: 'Aura Spiral Pendant Light Shade',
    category: 'lighting',
    price: '160 TND',
    material: 'Diffusive Translucent PETG',
    dimensions: '24 × 24 × 30 cm',
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    description: 'Parametric spiral lamp shade designed for warm ambient light diffusion and standard E27 fixtures.',
    inStock: true,
  },
  {
    id: 'prod-6',
    title: 'Kinetic Gyroscope Desktop Artifact',
    category: 'art',
    price: '120 TND',
    material: 'Silk Bronze & Obsidian PLA',
    dimensions: '15 × 15 × 15 cm',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    description: 'Triple-axis free-spinning gimbal sculpture calibrated with high-precision steel ball bearings.',
    inStock: true,
  },
];

/* =========================================================================
   WEDDINGS & BRIDAL (MED ART)
   ========================================================================= */
export const CATEGORIES_WEDDINGS = ['All', 'Luxury Weddings', 'Bridal Shoots', 'Intimate Ceremonies', 'Editorial Nuptials'];

export const MOCK_WEDDING_PROJECTS: PhotoProjectItem[] = [
  {
    id: 'w1',
    title: 'Elysian Sunset Ceremony',
    category: 'Luxury Weddings',
    description: 'An intimate coastal wedding capturing golden hour reflections, warm emotional vows, and architectural elegance along the Mediterranean coastline.',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Alexander & Sophia',
    date: 'June 2026',
    location: 'Côte d\'Azur, France',
    tags: ['Luxury Wedding', 'Golden Hour', 'Cinematic Film', 'Mediterranean'],
  },
  {
    id: 'w2',
    title: 'Velvet Horizon Nuptials',
    category: 'Editorial Nuptials',
    description: 'A classic Italian villa estate celebration filled with ambient candlelight, tailored ivory couture, and timeless editorial romance.',
    coverImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Julian & Camille',
    date: 'August 2026',
    location: 'Tuscany Villa, Italy',
    tags: ['Editorial', 'Villa Estate', 'Candlelight', 'Couture'],
  },
  {
    id: 'w3',
    title: 'Aura of the Carthage Bride',
    category: 'Bridal Shoots',
    description: 'A bespoke haute-couture bridal session blending heritage gold embroidery with contemporary high-fashion lighting and delicate silk veils.',
    coverImage: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Nour & Yassine',
    date: 'May 2026',
    location: 'Sidi Bou Said & Carthage, Tunisia',
    tags: ['Bridal Art', 'Haute Couture', 'Heritage Gold', 'Fine Art'],
  },
  {
    id: 'w4',
    title: 'Whispering Pines Elopement',
    category: 'Intimate Ceremonies',
    description: 'An intimate mountain ceremony tucked away in alpine mist, focusing on unfiltered vows, authentic tears, and panoramic valley views.',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Liam & Elena',
    date: 'September 2026',
    location: 'Lake Como, Italy',
    tags: ['Elopement', 'Alpine Mist', 'Intimate', 'Storytelling'],
  },
  {
    id: 'w5',
    title: 'Palais des Roses Royal Soirée',
    category: 'Luxury Weddings',
    description: 'A grand luxury palace celebration highlighted by dramatic chandelier illumination, traditional orchestra, and cinematic slow-motion films.',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Karim & Myriam',
    date: 'July 2026',
    location: 'Gammarth, Tunisia',
    tags: ['Palace Wedding', 'Grand Gala', '4K Cinema', 'Luxury Decor'],
  },
  {
    id: 'w6',
    title: 'Golden Hour Bridal Radiance',
    category: 'Bridal Shoots',
    description: 'Sunset editorial portraits celebrating natural grace, hand-crafted jewelry, and ethereal backlight.',
    coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Inès M.',
    date: 'October 2026',
    location: 'Paris, France',
    tags: ['Bridal Portrait', 'Parisian Glow', 'Warm Amber', 'Fine Art'],
  },
];

/* =========================================================================
   COMMERCIAL & PRODUCTION (TERKINA)
   ========================================================================= */
export const CATEGORIES_PRODUCTION = ['All', 'Commercial & Ads', 'Events & Festivals', 'Brand Campaigns', 'Video Production'];

export const MOCK_PRODUCTION_PROJECTS: PhotoProjectItem[] = [
  {
    id: 'pr1',
    title: 'Monolith Architectural Campaign',
    category: 'Brand Campaigns',
    description: 'High-contrast commercial architectural shoot exploring brutalist concrete structures, sharp shadow lines, and luxury designer furnishings.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Vanguard Architecture & Interiors',
    date: 'April 2026',
    location: 'Zurich, Switzerland',
    tags: ['Commercial', 'Architecture', 'Minimalism', 'Brand Campaign'],
  },
  {
    id: 'pr2',
    title: 'Neon Nights & Sonic Pulse',
    category: 'Events & Festivals',
    description: 'Dynamic multi-cam event coverage capturing electric stage lighting, festival crowd energy, and high-tempo live performances.',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Aetheria Electronic Music Festival',
    date: 'July 2026',
    location: 'Berlin, Germany',
    tags: ['Festival', 'Live Event', 'Nightlife', 'Concert Production'],
  },
  {
    id: 'pr3',
    title: 'Apex Kinetic Automotive Commercial',
    category: 'Commercial & Ads',
    description: 'High-speed pursuit vehicle filming and studio lighting production for next-gen electric hypercar launch campaign.',
    coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Volt Automotive Global',
    date: 'May 2026',
    location: 'Dubai & Desert Dunes, UAE',
    tags: ['Automotive', 'TV Commercial', 'High-Speed Cine', '8K Raw'],
  },
  {
    id: 'pr4',
    title: 'Global Tech Summit Keynote Broadcast',
    category: 'Events & Festivals',
    description: 'Comprehensive live multi-camera broadcast, speaker portrait studio, and social media rapid-turnaround video assets for 3,000+ attendees.',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Innovate Summit 2026',
    date: 'March 2026',
    location: 'London ExCeL, UK',
    tags: ['Corporate Event', 'Keynote Broadcast', 'Multi-Cam', 'Live Stream'],
  },
  {
    id: 'pr5',
    title: 'Nordic Essence Fashion Lookbook',
    category: 'Video Production',
    description: 'Cinematic fashion brand film and lookbook series shot on 16mm analog and ARRI cinema digital across volcanic landscapes.',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Kallio Outerwear',
    date: 'January 2026',
    location: 'Reykjavik, Iceland',
    tags: ['Fashion Film', 'ARRI Alexa', 'Commercial Video', 'Lookbook'],
  },
  {
    id: 'pr6',
    title: 'Verdant Organic Botanical Campaign',
    category: 'Commercial & Ads',
    description: 'Macro studio commercial photography and product promo video exploring liquid dynamics, organic cosmetics, and high-speed motion control.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Verdant Cosmetics Co.',
    date: 'February 2026',
    location: 'Tokyo, Japan',
    tags: ['Product Shoot', 'Motion Control', 'Macro', 'Commercial Video'],
  },
];

/* =========================================================================
   BACKWARD COMPATIBILITY
   ========================================================================= */
export const CATEGORIES_PHOTO = CATEGORIES_WEDDINGS;
export const MOCK_PHOTO_PROJECTS: PhotoProjectItem[] = [...MOCK_WEDDING_PROJECTS, ...MOCK_PRODUCTION_PROJECTS];

export const MOCK_3D_PROJECTS: ThreeDProjectItem[] = [
  {
    id: '3d-1',
    title: 'Hyperion Quantum Artifact',
    category: 'Parametric Design',
    description: 'Generative mathematical lattice structure engineered for light scattering and aero-acoustic dampening.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    geometryType: 'torusKnot',
    color: '#3b82f6',
    specs: {
      material: 'PETG Carbon Fiber',
      dimensions: '180 x 180 x 240 mm',
      layerHeight: '0.12 mm Ultra-Detail',
      infill: '15% Gyroid Lattice',
      printTime: '28 Hours',
      weight: '420g',
    },
  },
  {
    id: '3d-2',
    title: 'Aetheric Sphere Matrix',
    category: 'Lighting Fixtures',
    description: 'Self-interlocking concentric sphere system designed for ambient shadow diffusion in high-end architectural spaces.',
    coverImage: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1200&q=80',
    geometryType: 'sphere',
    color: '#8b5cf6',
    specs: {
      material: 'Translucent SLA Resin',
      dimensions: '220 x 220 x 220 mm',
      layerHeight: '0.05 mm Micron',
      infill: 'Solid Shell',
      printTime: '36 Hours',
      weight: '680g',
    },
  },
];
