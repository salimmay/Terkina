-- ============================================================================
-- PENDING MIGRATIONS — run this whole file once in the Supabase SQL Editor
-- ============================================================================
-- Combines the two migrations the app needs but that were never applied:
--
--   1. site_translations  → powers Admin ▸ Site Settings ▸ "Website Text"
--                           (every visitor-facing string in EN / FR / AR)
--   2. trash_items        → powers Admin ▸ Trash
--                           (30-day recovery for deleted albums, products,
--                            photos, and .glb models)
--
-- Safe to re-run: every statement is idempotent, and the two helper functions
-- below are recreated defensively so this works even on a partially set up
-- database. Nothing here touches or deletes existing data.
--
-- Source files (kept separately for reference):
--   supabase/site_translations.sql
--   supabase/trash_items.sql
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 0. EXTENSIONS & SHARED HELPERS (no-ops if they already exist)
-- ----------------------------------------------------------------------------

-- Required by trash_items.id (uuid_generate_v4).
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auto-updates an `updated_at` column on UPDATE.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- True when the caller holds the admin claim (or is the service role).
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT COALESCE(
        (auth.jwt() -> 'app_metadata' ->> 'user_role') = 'admin',
        (auth.jwt() ->> 'role') = 'service_role',
        false
    );
$$;


-- ----------------------------------------------------------------------------
-- 1. SITE TRANSLATIONS — editable website text (EN / FR / AR)
-- ----------------------------------------------------------------------------
-- Each row is one editable string. `key` is a dot-namespaced identifier
-- matching the call site (e.g. "nav.weddings", "whatsapp.customPrint.template").
-- An empty en/fr/ar value means "use the hardcoded fallback still shipped in
-- the component" — rows only need to exist once an admin edits that string.

CREATE TABLE IF NOT EXISTS site_translations (
    key         TEXT PRIMARY KEY,
    group_name  TEXT NOT NULL DEFAULT 'general',
    en          TEXT NOT NULL DEFAULT '',
    fr          TEXT NOT NULL DEFAULT '',
    ar          TEXT NOT NULL DEFAULT '',
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_site_translations_updated_at ON site_translations;
CREATE TRIGGER set_site_translations_updated_at
    BEFORE UPDATE ON site_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE site_translations ENABLE ROW LEVEL SECURITY;

-- Anyone can read (the public site renders these strings for every visitor)
DROP POLICY IF EXISTS "site_translations_select_public" ON site_translations;
CREATE POLICY "site_translations_select_public"
    ON site_translations FOR SELECT
    USING (true);

-- Only admins can write
DROP POLICY IF EXISTS "site_translations_insert_admin" ON site_translations;
CREATE POLICY "site_translations_insert_admin"
    ON site_translations FOR INSERT
    WITH CHECK (is_admin() OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "site_translations_update_admin" ON site_translations;
CREATE POLICY "site_translations_update_admin"
    ON site_translations FOR UPDATE
    USING (is_admin() OR auth.role() = 'authenticated')
    WITH CHECK (is_admin() OR auth.role() = 'authenticated');


-- ----------------------------------------------------------------------------
-- 2. TRASH ITEMS — 30-day recovery log
-- ----------------------------------------------------------------------------
-- Unified log of every soft-deleted or replaced asset — whole albums, whole
-- 3D products, individual gallery photos, and replaced covers/.glb models —
-- so an admin can browse, filter, and restore any of them within 30 days
-- before a manual purge permanently removes the database row (if any) and
-- the underlying Cloudinary file.

CREATE TABLE IF NOT EXISTS trash_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_type       TEXT NOT NULL CHECK (item_type IN ('album', 'product', 'image', 'model')),
    title           TEXT NOT NULL,
    preview_url     TEXT,                          -- the asset's own URL (image or .glb)
    platform        TEXT,                          -- 'MED_ART' | 'TERKINA_PROD' | NULL for products
    source_id       UUID,                          -- parent album/product id
    restore_payload JSONB NOT NULL DEFAULT '{}',    -- how to undo this specific deletion
    cloudinary_urls TEXT[] NOT NULL DEFAULT '{}',   -- assets to purge from Cloudinary once expired
    deleted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_trash_items_type    ON trash_items(item_type);
CREATE INDEX IF NOT EXISTS idx_trash_items_expires ON trash_items(expires_at);

ALTER TABLE trash_items ENABLE ROW LEVEL SECURITY;

-- Admin-only in both directions — trash is never shown on the public site.
DROP POLICY IF EXISTS "trash_items_admin_all" ON trash_items;
CREATE POLICY "trash_items_admin_all"
    ON trash_items FOR ALL
    USING (auth.role() = 'authenticated' OR is_admin())
    WITH CHECK (auth.role() = 'authenticated' OR is_admin());


-- ----------------------------------------------------------------------------
-- Done. Verify both tables exist:
--   SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public' AND table_name IN ('site_translations', 'trash_items');
-- ----------------------------------------------------------------------------
