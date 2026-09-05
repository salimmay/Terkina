-- ============================================================================
-- Trash / Recovery
-- Unified log of every soft-deleted or replaced asset — whole albums, whole
-- 3D products, individual gallery photos, and replaced covers/.glb models —
-- so an admin can browse, filter, and restore any of them within 30 days
-- before a manual purge permanently removes the database row (if any) and
-- the underlying Cloudinary file.
--
-- Run in the Supabase SQL Editor. Requires `is_admin()` from
-- supabase/complete_setup.sql (or schema.sql) to already exist.
-- ============================================================================

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
