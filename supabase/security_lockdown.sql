-- ============================================================================
-- Supabase RLS Security Lockdown Audit
-- Adapted to the actual snake_case schema in this repo.
-- Run in the Supabase SQL Editor. Idempotent where possible.
-- ============================================================================

-- 1. Ensure RLS is active on every table
ALTER TABLE category        ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_project   ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_gallery   ENABLE ROW LEVEL SECURITY;
ALTER TABLE three_d_project ENABLE ROW LEVEL SECURITY;
ALTER TABLE message         ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content    ENABLE ROW LEVEL SECURITY;

-- 2. Drop any legacy insecure policies
DROP POLICY IF EXISTS "Public full access" ON photo_project;
DROP POLICY IF EXISTS "Public full access" ON three_d_project;
DROP POLICY IF EXISTS "Allow all"          ON message;

-- 3. Anonymous Public: READ-ONLY on published, non-deleted records
--    (equivalent policies already exist from schema.sql; re-assert here)
DROP POLICY IF EXISTS "Public read published photos" ON photo_project;
CREATE POLICY "Public read published photos"
    ON photo_project FOR SELECT
    USING (status = 'PUBLISHED' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Public read published 3d" ON three_d_project;
CREATE POLICY "Public read published 3d"
    ON three_d_project FOR SELECT
    USING (status = 'PUBLISHED' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "site_content_select_public" ON site_content;
CREATE POLICY "site_content_select_public"
    ON site_content FOR SELECT
    USING (true);

-- 4. Anonymous Public: INSERT-ONLY for inquiries (no select/update/delete)
DROP POLICY IF EXISTS "messages_insert_public" ON message;
CREATE POLICY "messages_insert_public"
    ON message FOR INSERT
    WITH CHECK (true);

-- 5. Authenticated Admin: Full CRUD via is_admin() app_metadata claim
--    ({ "user_role": "admin" } must be set in the user's app_metadata)

-- photo_project
DROP POLICY IF EXISTS "Admin full photo projects" ON photo_project;
CREATE POLICY "Admin full photo projects"
    ON photo_project FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- photo_gallery
DROP POLICY IF EXISTS "Admin full photo gallery" ON photo_gallery;
CREATE POLICY "Admin full photo gallery"
    ON photo_gallery FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- three_d_project
DROP POLICY IF EXISTS "Admin full 3d projects" ON three_d_project;
CREATE POLICY "Admin full 3d projects"
    ON three_d_project FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- site_content
DROP POLICY IF EXISTS "site_content_insert_admin" ON site_content;
DROP POLICY IF EXISTS "site_content_update_admin" ON site_content;
CREATE POLICY "site_content_write_admin"
    ON site_content FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- message (admin read/update/archive workflow)
DROP POLICY IF EXISTS "messages_select_admin" ON message;
DROP POLICY IF EXISTS "messages_update_admin" ON message;
CREATE POLICY "Admin full messages"
    ON message FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- category
DROP POLICY IF EXISTS "categories_select_public" ON category;
CREATE POLICY "categories_select_public"
    ON category FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin full categories" ON category;
CREATE POLICY "Admin full categories"
    ON category FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
