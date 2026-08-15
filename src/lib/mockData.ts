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
  modelUrl?: string; // Optional .glb model path
  geometryType?: 'torusKnot' | 'sphere' | 'octahedron' | 'cube' | 'dodecahedron'; // Procedural 3D fallbacks
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

export const CATEGORIES_PHOTO = ['All', 'Weddings', 'Events', 'Shootings', 'Graduation'];

export const MOCK_PHOTO_PROJECTS: PhotoProjectItem[] = [
  {
    id: 'p1',
    title: 'Elysian Sunset Ceremony',
    category: 'Weddings',
    description: 'An intimate coastal wedding capturing golden hour reflections, emotion, and architectural elegance along the Mediterranean coastline.',
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
    tags: ['Wedding', 'Golden Hour', 'Cinematic', 'Portrait'],
  },
  {
    id: 'p2',
    title: 'Monolith Architecture & Light',
    category: 'Shootings',
    description: 'High-contrast editorial shooting exploring brutalist concrete structures, sharp shadow lines, and modern minimalist fashion.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Vanguard Design Studio',
    date: 'April 2026',
    location: 'Zurich, Switzerland',
    tags: ['Architecture', 'Minimalism', 'Editorial', 'B&W'],
  },
  {
    id: 'p3',
    title: 'Neon Nights & Urban Pulse',
    category: 'Events',
    description: 'Dynamic event coverage capturing electric atmosphere, strobe lighting reflections, and live stage performances.',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Aetheria Music Festival',
    date: 'July 2026',
    location: 'Berlin, Germany',
    tags: ['Event', 'Nightlife', 'Concert', 'Vibrant'],
  },
  {
    id: 'p4',
    title: 'The Academic Gala & Honors',
    category: 'Graduation',
    description: 'Celebratory portrait series showcasing academic excellence, emotional candid moments, and traditional ceremonial dignity.',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Grand University Class of 2026',
    date: 'May 2026',
    location: 'Oxford, UK',
    tags: ['Graduation', 'Portrait', 'Celebration', 'Formal'],
  },
  {
    id: 'p5',
    title: 'Botanical Harmony & Flora',
    category: 'Shootings',
    description: 'Macro studio photography exploring organic textures, water droplets, and vibrant floral symmetry.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Verdant Organic Magazine',
    date: 'March 2026',
    location: 'Kyoto, Japan',
    tags: ['Nature', 'Macro', 'Studio', 'Texture'],
  },
  {
    id: 'p6',
    title: 'Velvet Horizon Nuptials',
    category: 'Weddings',
    description: 'Luxury estate wedding filled with ambient candlelight, classical strings, and timeless editorial romance.',
    coverImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Julian & Camille',
    date: 'August 2026',
    location: 'Tuscany, Italy',
    tags: ['Luxury', 'Estate', 'Romance', 'Editorial'],
  },
];

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
  {
    id: '3d-3',
    title: 'Vortex Kinetic Sculpture',
    category: 'Kinetic Art',
    description: 'Dual-axis twisting geometric column designed for precision motor integration and continuous fluid motion.',
    coverImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    geometryType: 'octahedron',
    color: '#ec4899',
    specs: {
      material: 'Anodized Silk PLA',
      dimensions: '140 x 140 x 310 mm',
      layerHeight: '0.16 mm Standard',
      infill: '20% Tri-Hexagon',
      printTime: '19 Hours',
      weight: '310g',
    },
  },
  {
    id: '3d-4',
    title: 'Chrono-Core Mechanical Vane',
    category: 'Industrial Design',
    description: 'Heavy-duty industrial impeller prototype featuring computational fluid dynamics optimized blade curvature.',
    coverImage: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
    geometryType: 'dodecahedron',
    color: '#10b981',
    specs: {
      material: 'Nylon PA12 SLS',
      dimensions: '195 x 195 x 120 mm',
      layerHeight: '0.10 mm Sintered',
      infill: '100% Solid Structural',
      printTime: '42 Hours',
      weight: '550g',
    },
  },
];
