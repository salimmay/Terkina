Project Requirements Document (PRD) — Version 1.0
TERKINA Ecosystem: Dual Creative Studios & Master CRM
1. Project Overview

TERKINA is a full-stack, dynamic multimedia agency platform powered by a unified Next.js (App Router) + Supabase + Cloudinary architecture. The ecosystem powers two distinct digital platforms managed through a single master visual CRM dashboard:

    Platform 1 (Visual Media Studio — terkina.com):

        MED ART: Luxury Wedding & Bridal Cinema, emotional candid rituals, and destination archives.

        TERKINA: High-Impact Commercial Production, luxury product shoots, corporate campaigns, and festival/event coverage.

    Platform 2 (3D Lab & Physical Marketplace — 3d.terkina.com / /3d):

        Physical 3D Collection: Curated design catalog (lighting, desk accessories, generative art sculptures, and home decor) with direct 1-click WhatsApp checkout.

        Bespoke 3D Fabrication: Custom order pipeline for client CAD files (.stl, .step, .obj) and dimensional prototyping.

    Master CRM Dashboard (/admin or admin.terkina.com):

        Centralized, authenticated administration for album management, drag-and-drop gallery sorting, 3D product cataloging, live multi-language copy/statistics editing, and lead tracking.

2. Tech Stack

    Front-End Framework: Next.js (React) App Router with SSR/SSG and dynamic OpenGraph metadata.

    Styling & Design System: Tailwind CSS with custom CSS variables, responsive fluid typography, and glassmorphism styling.

    Animation & Physics Engine: Framer Motion (custom cubic-bezier curves, layout transitions, useSpring, useMotionValue, and AnimatePresence).

    Interactive 3D Engine: React Three Fiber (@react-three/fiber) & @react-three/drei with <Center>, <Bounds>, and interactive cursor rim lighting.

    Database & Authentication: Supabase (PostgreSQL with Row Level Security, Auth, Triggers).

    Media Storage & Global CDN: Cloudinary CDN (for high-res photography, 4K looping background .webm/.mp4 reels, and raw .glb/.gltf 3D model files with on-the-fly f_auto,q_auto compression).

    Lead Generation & Messaging: Direct WhatsApp Click-to-Chat protocol (wa.me) backed by silent Supabase lead persistence.

    CRM Utilities: @dnd-kit/core / @hello-pangea/dnd (drag-and-drop sorting), react-easy-crop (focal-point crop coordinates).

3. UI/UX & Visual Direction (The "Bespoke Agency" Aesthetic)

    Dual Living Video Backgrounds: Real, cinematic, looping background videos (60–120fps slow motion) darkened via multi-layer gradient overlays:

        Med Art: Warm amber, honey, and gold tone overlays.

        Terkina Production: Cool cobalt, cyan, and deep obsidian overlays.

    Golden Light Trail Cursor: A 60fps HTML5 Canvas trail featuring a glowing champagne-to-amber ribbon (tapering from

            
    1.5px
    1.5px

          

    to

            
    9.5px
    9.5px

          

    ) with velocity-driven drifting golden stardust particles. Automatically disabled on touch screens.

    Kinetic Liquid-Glass Navbar:

        Floating minimal pill at top-of-page, collapsing into a frosted liquid-glass capsule on scroll (

                
        >40px
        >40px

              

        ).

        Kinetic sliding spotlight (layoutId="nav-hover-pill") gliding seamlessly behind hovered links.

        Real-time studio status badge (TUNIS • AVAILABLE FOR SHOOTS).

        Dedicated route-aware navigation with zero cross-linking clutter.

        Full-screen cinematic mobile menu drawer with staggered typography reveals.

    Bespoke Typography:

        Headings: Ultra-bold, geometric display sans-serif (e.g., Clash Display / PP Neue Montreal / Syne) with fluid sizing.

        Body & Micro-Labels: Clean geometric sans paired with technical monospaced labels.

        Arabic: Tajawal / Cairo matching the geometric weight and vertical alignment.

4. Front-End Specifications
4.1. Home Page: Living Video Split Hero (Magnetic Canvas Portal)

    Layout: Full-viewport split (

            
    50/50
    50/50

          

    default, responsive

            
    50/50
    50/50

          

    vertical stack on mobile).

    Zero-Button Architecture: Both halves act as full clickable canvas links (/weddings and /production).

    Hover Interaction: Smooth width expansion to

            
    65%/35%
    65%/35%

          

    with spring physics (duration: 0.8s, ease: [0.76, 0, 0.24, 1]), accompanied by subtle video scale-up (

            
    1.05×
    1.05×

          

    ) and brightness bloom.

    Floating Magnetic Lens: A circular glass badge tracking cursor coordinates on desktop, displaying ENTER MED ART ↗ (amber) or ENTER TERKINA ↗ (cyan).

4.2. Photography Album Showcase: 360° Orbital Constellation Modal

    Trigger: Clicking any album card on /weddings or /production.

    Orbital Stage (30–40% Screen Footprint):

        Image cards orbit continuously in an isometric 3D ellipse (

                
        Rx≈160px
        Rx​≈160px

              

        ,

                
        Ry≈85px
        Ry​≈85px

              

        ) around a central brand emblem.

        Cards feature depth-based scaling (

                
        0.75×
        0.75×

              

        back to

                
        1.05×
        1.05×

              

        front) and depth opacity (

                
        0.45
        0.45

              

        back to

                
        1.0
        1.0

              

        front).

        Surrounding screen is darkened with deep backdrop blur (backdrop-blur-3xl) and radial vignette.

    Hover State: Pauses rotation loop, boosts z-index to top, and zooms card by

            
    40%
    40%

          

    with spring physics.

    Expanded Focus View: Clicking any card smoothly expands it into an

            
    85%
    85%

          

    viewport lightbox (w-[85vw] h-[85vh]) with full metadata.

    Navigation: Back to Orbit button returns to rotation; Close Album (or Escape key) returns to project grid.

4.3. 3D Lab Platform (/3d)

    Interactive 3D Hero: Live, auto-rotating 3D WebGL mesh with customizable materials, floating stardust particles, and dynamic cursor rim lighting.

    Physical Product Marketplace: Filterable grid (Lighting, Desk & Tech, Art & Sculptures, Home Decor) with tactile product photography, materials, dimensions, and instant "Order on WhatsApp" buttons.

    Custom Print on Demand: Direct quotation workflow for clients with .stl/.step files or bespoke fabrication requirements.

    Auto-Centered 3D Viewer: Wrapped in <Bounds fit clip> and <Center> with constrained OrbitControls (touch-action: pan-y) so 3D canvases never trap mobile page scrolling.

4.4. About & WhatsApp Contact Sections (Below-Hero Flow)

    Single-Page Smooth Scroll: Navbar links #about and #contact smoothly scroll down on the homepage without route changes.

    Live Animated Metrics: Numbers (500+ Photo Sets, 0.05mm 3D Tolerance, 100% Bespoke Craft) count up dynamically via Framer Motion when scrolled into view.

    Dual-Action Lead Dispatch:

        Silently logs inquiry data to the Supabase Message table in the background.

        Opens pre-formatted WhatsApp chat (https://wa.me/...) with client name, service chip, and project scope.

5. Mobile & Viewport Optimization Rules

    Fluid Breakpoint Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 with min-w-0 on grid children to prevent CSS blowout.

    Horizontal Touch-Scroll Filter Bars: Filter bars use overflow-x-auto, flex-nowrap, and flex-shrink-0 with hidden scrollbars for single-finger swiping on mobile.

    Touch-Safe Typography: Text clamps (line-clamp-2 sm:line-clamp-none) and fluid clamp font sizing to eliminate horizontal page scrolling on viewports from

            
    320px
    320px

          

    up to 4K displays.

    iOS Safari Auto-Zoom Prevention: Form inputs maintain a minimum base font size of

            
    16px
    16px

          

    (text-base md:text-sm).

    Touch Gesture Isolation: Custom cursor is strictly disabled on (pointer: coarse) devices.

6. Master CRM Architecture & Visual Controls

The CRM operates at /admin (or admin.terkina.com) protected by Supabase Authentication and Next.js Middleware.
6.1. Management Modules

    Med Art Weddings Manager: Create/edit wedding albums, upload high-res sets to Cloudinary, assign dates, and toggle PUBLISHED/DRAFT/ARCHIVED.

    Terkina Commercial Manager: Manage commercial campaigns, brand video links, and corporate event photo sets.

    3D Marketplace Manager: Manage physical product listings, pricing (TND/EUR), dimensions, material badges, preview images, and optional .glb files.

    Leads & WhatsApp Inbox: Real-time log of all inquiries dispatched via WhatsApp with unread/contacted status toggles.

    Site Content & Copy Editor: Live visual editor for homepage hero copy, About manifesto, live statistics counters, and primary WhatsApp dispatch phone number across EN, FR, and AR.

6.2. Visual Tooling

    Gallery Reordering: Drag-and-drop grid (@dnd-kit/core) for defining front-end orbital carousel order.

    Focal Point Selector: react-easy-crop modal defining { x, y, zoom } coordinates saved as CSS object-position properties.

    Cloudinary Direct Uploader: Drag-and-drop media uploader supporting images, videos, and raw 3D models with progress indicators.

7. Complete PostgreSQL Database Schema (Supabase)
code SQL

-- ENUMS
CREATE TYPE project_status AS ENUM ('PUBLISHED', 'DRAFT', 'ARCHIVED');
CREATE TYPE platform_type AS ENUM ('MED_ART', 'TERKINA_PROD');
CREATE TYPE message_status AS ENUM ('UNREAD', 'READ', 'CONTACTED', 'ARCHIVED');

-- CATEGORIES
CREATE TABLE "Category" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "platform" platform_type NOT NULL DEFAULT 'MED_ART',
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- PHOTO & VIDEO PROJECTS
CREATE TABLE "PhotoProject" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category_id" UUID REFERENCES "Category"("id") ON DELETE SET NULL,
  "platform" platform_type NOT NULL DEFAULT 'MED_ART',
  "status" project_status NOT NULL DEFAULT 'PUBLISHED',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "cover_image_url" TEXT NOT NULL, -- Stored as Cloudinary CDN URL
  "cover_crop_data" JSONB DEFAULT '{"x": 50, "y": 50, "zoom": 1}',
  "client_name" TEXT,
  "shoot_date" DATE,
  "created_at" TIMESTAMPTZ DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now(),
  "deleted_at" TIMESTAMPTZ DEFAULT NULL
);

-- PHOTO GALLERY (Individual frames per album)
CREATE TABLE "PhotoGallery" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_id" UUID NOT NULL REFERENCES "PhotoProject"("id") ON DELETE CASCADE,
  "image_url" TEXT NOT NULL, -- Stored as Cloudinary CDN URL
  "title" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- 3D MARKETPLACE PRODUCTS
CREATE TABLE "ThreeDProject" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL DEFAULT 'decor',
  "price" TEXT NOT NULL DEFAULT 'Custom Quote',
  "status" project_status NOT NULL DEFAULT 'PUBLISHED',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "cover_image_url" TEXT NOT NULL, -- Cloudinary CDN preview image
  "model_file_url" TEXT,          -- Cloudinary CDN raw .glb model
  "print_specs" JSONB NOT NULL DEFAULT '{
    "material": "Matte PLA",
    "dimensions": "15 x 15 x 20 cm",
    "layerHeight": "0.05 mm Micron",
    "printTime": "18 Hours",
    "weight": "450g"
  }',
  "created_at" TIMESTAMPTZ DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now(),
  "deleted_at" TIMESTAMPTZ DEFAULT NULL
);

-- DYNAMIC SITE CONTENT & SETTINGS
CREATE TABLE "SiteContent" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "section" TEXT NOT NULL,
  "key" TEXT NOT NULL UNIQUE,
  "content" JSONB NOT NULL,
  "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- MESSAGES & WHATSAPP LEADS INBOX
CREATE TABLE "Message" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sender_name" TEXT NOT NULL,
  "service" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "file_url" TEXT,
  "status" message_status NOT NULL DEFAULT 'UNREAD',
  "created_at" TIMESTAMPTZ DEFAULT now()
);

8. Media Storage & Cloudinary Pipeline

    Cloudinary Cloud Structure:

        terkina/weddings/: High-resolution bridal shoots and album frames.

        terkina/commercial/: Commercial campaigns, brand assets, and video loops.

        terkina/3d_models/: Raw .glb/.gltf 3D files and product renders.

        terkina/covers/: Cropped showcase thumbnail previews.

    On-the-Fly Optimization Parameters:

        Images: q_auto:best,f_auto,w_1920

        Background Video: q_auto,f_auto,vc_h265,vc_vp9 for high-performance streaming.

9. Pre-Launch Production Checklist

    Environment Variables: Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.

    DNS Subdomains: Route terkina.com (Main Studio), 3d.terkina.com (3D Lab), and admin.terkina.com (CRM Dashboard).

    WhatsApp Number: Verify international prefix in CRM settings (e.g., 21612345678 with no + or spaces).

    Cloudinary Resource Types: Verify that 3D .glb assets are uploaded with resource_type: "auto" or "raw".

    RLS Verification: Ensure public anonymous users have SELECT on published tables and INSERT on Message, while all write/update operations require auth.role() = 'authenticated'.