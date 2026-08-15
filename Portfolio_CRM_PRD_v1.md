# Comprehensive Project Requirements Document (PRD)
# Dynamic Portfolio & Custom CRM
## 1. Project Overview
A full-stack, dynamic portfolio website with a custom built-in CRM for a multimedia creative agency. The platform serves two distinct creative mediums: Photography/Videography and 3D Printing/Modeling. The website must be highly visual, performant, seamlessly support multi-language (AR, EN, FR) without reloading, and be easily updatable via an advanced visual Admin Dashboard.
## 2. Proposed Tech Stack
*   **Front-End:** Next.js (React) App Router for SSR/SSG performance and SEO.
*   **Styling:** Tailwind CSS combined with custom CSS for noise/textures.
*   **Animations:** Framer Motion for complex physics-based animations, layout transitions, and page routing.
*   **3D Rendering:** `@google/model-viewer` or `React Three Fiber` (Three.js) for handling 360° `.glb`/`.gltf` models natively in the browser.
*   **Back-End / Database / Storage:** Supabase (PostgreSQL, Auth, Storage Buckets) with Prisma ORM or Supabase Client.
*   **CRM Utilities:** `@hello-pangea/dnd` or `@dnd-kit/core` (drag-and-drop), `react-easy-crop` (image cropping).
## 3. UI/UX & Visual Direction (The "Bespoke" Dark Mode)
To avoid the generic "SaaS dark mode" template look, the UI must feel like a living, breathing digital experience with high-end agency polish.
*   **Texture & Depth:** Implement a subtle, animated CSS/SVG noise grain overlay (`mix-blend-mode: overlay; opacity: 0.4; pointer-events: none;`) across the entire website for a tactile, cinematic quality.
*   **Ambient Video Backgrounds:** Instead of flat black backgrounds, the 3D portfolio and Hero section will utilize highly compressed, looping `.webm` background videos (e.g., slow-moving abstract smoke, liquid gradients) darkened via a CSS overlay.
*   **Bespoke Typography Pairs:** 
    *   *English/French:* Striking, highly-crafted typefaces (e.g., Clash Display or PP Neue Montreal) for headings, combined with a geometric sans for body text.
    *   *Arabic:* Premium, modern Arabic typeface (e.g., Tajawal or Cairo) matching the geometric weight.
## 4. Front-End Specifications (Client Facing)
### 4.1. Home Page (Split Hero)
*   **Layout:** A full-viewport split screen (50/50).
    *   *Left Side:* Photography Portfolio gateway.
    *   *Right Side:* 3D Printing Portfolio gateway.
*   **Interaction:** Hovering over one side smoothly expands it (e.g., to 65-70% width) while shrinking the other, revealing a "View Portfolio" CTA.
### 4.2. Photography Portfolio Route
*   **Filter Bar:** Dynamic categories fetched from the CRM (e.g., Weddings, Events, Shootings, Graduation).
*   **Grid Layout:** Responsive masonry or CSS grid for thumbnails. Clean, minimalist layout allowing the photography colors to pop.
*   **Hover Interaction:** Subtle parallax effect on the image inside its container. The thumbnail smoothly transitions into a muted, looping slideshow (cross-fading 3-4 project images).
*   **Click Interaction (Centered Modal):** Uses Framer Motion's `layoutId` to seamlessly animate the thumbnail to the screen center. Background blurs deeply (glassmorphism), revealing client details, tags, and the full gallery.
### 4.3. 3D Portfolio Route
*   **Grid Layout:** Sleek, dark-mode environment. High-quality PNGs of the 3D prints resting on subtle, unified shadow planes, looking like a cohesive digital shelf.
*   **Click Interaction (Detailed View):** The PNG expands to fill the view, then seamlessly morphs/crossfades into the interactive `Three.js` WebGL canvas with a dynamic lighting sweep.
*   **Specs Panel:** Displays product description, print material, dimensions, and use-case details.
### 4.4. About & Contact Sections
*   **About Us:** Company manifesto, team introduction, and core services.
*   **Contact Section:** Dynamic form (Name, Email, Subject, Message) submitting directly to the CRM.
## 5. Advanced Animation & i18n Architecture
### 5.1. Fluid Animations
*   **Easing Curves:** Custom cubic-bezier curves (e.g., `transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }`) for a snappy but buttery smooth feel.
*   **Custom Cursor:** Inverts colors (`mix-blend-mode: difference`) over text, expands into a "View" or "Drag" icon over media.
*   **Text Reveals:** Use Framer Motion's `staggerChildren` to reveal text sliding up from a hidden overflow mask.
*   **Magnetic Buttons:** Links and CTAs subtly pull toward the cursor before clicking.
### 5.2. Seamless Multi-Language (AR, EN, FR)
*   **No Reloads:** State-driven cinematic transition across the DOM using Context/Zustand.
*   **Transition Logic:** Wrapped in `<AnimatePresence mode="wait">`.
    *   *Exit:* Current text slides down and fades out.
    *   *Shift:* Layout direction switches `dir="ltr"` to `dir="rtl"`. Framer Motion ensures flexbox items slide smoothly to their reversed positions.
    *   *Enter:* New language text slides up and fades in.
*   **Video Persistence:** Background videos and WebGL canvases remain outside the `<AnimatePresence>` tree to play continuously without stuttering during swaps.
## 6. Advanced CRM Architecture & Visual Controls
The CRM functions as a lightweight multimedia design interface directly in the browser.
### 6.1. CRM Tooling & Lifecycle
*   **Drag-and-Drop Engine:** Global sorting and gallery ordering via `@dnd-kit/core` or `@hello-pangea/dnd`.
*   **Image Manipulation:** Interactive modal via `react-easy-crop` to drag, zoom, and reorient cover images.
*   **Optimistic UI:** State updates instantly on drop/crop, sending background `PATCH` requests to Supabase.
*   **Status Management:** Toggles for `PUBLISHED`, `DRAFT`, and `ARCHIVED`.
*   **Soft Deletes:** 30-day trash recovery mechanism using `deleted_at` timestamps.
### 6.2. Photography Project Editor
*   **Gallery Ordering:** Grid view of uploaded images. Drag and drop to set the front-end modal gallery order.
*   **Cover Selection & Crop:** Select `is_cover` image. Define focal point (`x`, `y`, `zoom`) saved as CSS `object-position` data so the original high-res file remains unaltered.
### 6.3. 3D Project Editor
*   **Thumbnail Manipulation:** Crop and position 2D PNG thumbnails representing the 3D files.
*   **Asset Pairing:** Visually links the `.glb`/`.gltf` file with its specific PNG cover for seamless 2D-to-3D transitions.
### 6.4. Global Ordering
*   **Master Grid View:** Drag entire project cards to change global `sort_order`. The first CRM item equals the first front-end item.
## 7. Complete Database Schema (Supabase / PostgreSQL)
**`Category` Table**
*   `id` (UUID, PK)
*   `name` (String)
*   `slug` (String, unique)
**`PhotoProject` Table**
*   `id` (UUID, PK)
*   `title` (String)
*   `description` (Text)
*   `category_id` (UUID, FK)
*   `status` (Enum: 'PUBLISHED', 'DRAFT', 'ARCHIVED')
*   `sort_order` (Integer)
*   `cover_image_url` (String)
*   `cover_crop_data` (JSONB - e.g., `{ x: 50, y: 20, zoom: 1.5 }`)
*   `created_at` (Timestamp)
*   `deleted_at` (Timestamp)
**`PhotoGallery` Table (For individual image control)**
*   `id` (UUID, PK)
*   `project_id` (UUID, FK)
*   `image_url` (String)
*   `sort_order` (Integer)
**`ThreeDProject` Table**
*   `id` (UUID, PK)
*   `title` (String)
*   `description` (Text)
*   `status` (Enum: 'PUBLISHED', 'DRAFT', 'ARCHIVED')
*   `sort_order` (Integer)
*   `cover_image_url` (String)
*   `cover_crop_data` (JSONB)
*   `model_file_url` (String)
*   `print_specs` (JSONB - e.g., `{ material: "PLA", dimensions: "10x10x5" }`)
*   `created_at` (Timestamp)
*   `deleted_at` (Timestamp)
**`Message` Table (Contact Form)**
*   `id` (UUID, PK)
*   `sender_name` (String)
*   `sender_email` (String)
*   `content` (Text)
*   `status` (Enum: 'UNREAD', 'READ')
*   `created_at` (Timestamp)
## 8. Storage Buckets (Supabase Storage)
*   `photography-assets`: For optimized web images and gallery carousels.
*   `3d-assets`: Dedicated to `.glb`/`.gltf` model files and corresponding PNG preview thumbnails.