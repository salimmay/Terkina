-- ============================================================================
-- TERKINA Ecosystem: Live Production Seed Data
-- Run this script in the Supabase SQL Editor.
-- Compatible with schema.sql (snake_case PostgreSQL tables).
-- ============================================================================

-- Clean previous test data
TRUNCATE TABLE photo_gallery, photo_project, three_d_project, message CASCADE;

-- ============================================================================
-- 1. SEED MED ART (WEDDING ALBUMS)
-- ============================================================================
INSERT INTO photo_project (id, title, description, status, sort_order, cover_image_url)
VALUES 
(
  'a1111111-1111-1111-1111-111111111111',
  'Aura of the Carthage Bride',
  '[Platform: MED_ART | Category: Bridal Cinema]
A bespoke haute-couture bridal session blending heritage gold, high-fashion studio lighting, and delicate silk veils.',
  'PUBLISHED',
  1,
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'
),
(
  'a2222222-2222-2222-2222-222222222222',
  'Sidi Bou Said Seaside Nuptials',
  '[Platform: MED_ART | Category: Coastal Romance]
Mediterranean coastal vows framed by white limestone architecture, cobalt blue doorways, and warm sunset reflections.',
  'PUBLISHED',
  2,
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop'
),
(
  'a3333333-3333-3333-3333-333333333333',
  'Whispering Pines Villa Elopement',
  '[Platform: MED_ART | Category: Elopements]
Intimate candlelit vows surrounded by ancient olive groves, raw linen drapery, and golden-hour romantic cinema.',
  'PUBLISHED',
  3,
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop'
);

-- ============================================================================
-- 2. SEED ORBITAL GALLERY FRAMES (For the 360° Rotating Modal)
-- ============================================================================
INSERT INTO photo_gallery (project_id, image_url, sort_order)
VALUES
-- Album 1 Frames (Aura of the Carthage Bride)
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop', 0),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop', 1),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop', 2),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop', 3),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop', 4),

-- Album 2 Frames (Sidi Bou Said Nuptials)
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop', 0),
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop', 1),
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop', 2),

-- Album 3 Frames (Whispering Pines)
('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop', 0),
('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop', 1),
('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop', 2);

-- ============================================================================
-- 3. SEED TERKINA (COMMERCIAL CAMPAIGNS)
-- ============================================================================
INSERT INTO photo_project (id, title, description, status, sort_order, cover_image_url)
VALUES 
(
  'b1111111-1111-1111-1111-111111111111',
  'Aura Liquid Perfume Commercial',
  '[Platform: TERKINA_PROD | Category: Product Cinema]
Macro commercial shoot capturing high-speed liquid splashes, crystal caustics, and luxury amber bottle reflections.',
  'PUBLISHED',
  1,
  'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop'
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Monolith Architectural Campaign',
  '[Platform: TERKINA_PROD | Category: Architecture & Spaces]
High-contrast commercial architectural photography and drone cinema for modern corporate headquarters.',
  'PUBLISHED',
  2,
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
);

INSERT INTO photo_gallery (project_id, image_url, sort_order)
VALUES
('b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop', 0),
('b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop', 1),
('b2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop', 0);

-- ============================================================================
-- 4. SEED 3D MARKETPLACE PRODUCTS (With Real .GLB 3D Models)
-- ============================================================================
INSERT INTO three_d_project (
  title, description, show_price, is_in_stock, 
  available_colors, cover_image_url, model_file_url, status, sort_order, print_specs
)
VALUES 
(
  'Aetheric Geometric Table Lamp',
  'Ambient parametric desk lamp featuring internal organic shadow casting, diffusive polymer core, and built-in touch switch.',
  true,
  true,
  ARRAY['Matte White', 'Obsidian Black', 'Amber Gold'],
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb',
  'PUBLISHED',
  1,
  '{"category": "lighting", "price": "180 TND", "show_price": true, "is_in_stock": true, "material": "Matte Bio-PLA & Warm LED", "dimensions": "18 x 18 x 24 cm", "layerHeight": "0.12 mm", "printTime": "22 Hours", "weight": "520g"}'
),
(
  'Monolithic Headphone & Watch Stand',
  'Weighted minimalist desk organizer engineered for audiophile over-ear headphones with integrated magnetic cable routing.',
  true,
  true,
  ARRAY['Carbon Black', 'Steel Grey'],
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
  'PUBLISHED',
  2,
  '{"category": "accessories", "price": "95 TND", "show_price": true, "is_in_stock": true, "material": "High-Density Composite PLA", "dimensions": "12 x 15 x 28 cm", "layerHeight": "0.16 mm", "printTime": "14 Hours", "weight": "680g Solid"}'
),
(
  'Voronoi Architectural Sculpture',
  'Generative mathematical centerpiece with internal light refraction, ultra-smooth 25-micron SLA finish, and obsidian base.',
  true,
  false, -- Set to false to test "Made to Order" / Backorder status
  ARRAY['Translucent Resin', 'Smoked Quartz'],
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb',
  'PUBLISHED',
  3,
  '{"category": "art", "price": "140 TND", "show_price": true, "is_in_stock": false, "material": "Translucent SLA Optical Resin", "dimensions": "14 x 14 x 20 cm", "layerHeight": "0.025 mm Micron", "printTime": "18 Hours", "weight": "340g"}'
);
