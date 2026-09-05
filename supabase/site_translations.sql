-- ============================================================================
-- Site Content Translations
-- Creates the `site_translations` key/value store powering the Admin ->
-- "Website Text" editor: every visitor-facing string on the public site,
-- editable live in English, French, and Arabic.
--
-- Each row is one editable string. `key` is a dot-namespaced identifier
-- matching the call site (e.g. "nav.weddings", "contact.heading",
-- "whatsapp.customPrint.template"). Empty en/fr/ar means "use the
-- hardcoded fallback still shipped in the component" — rows only need to
-- be populated once an admin actually edits that string.
--
-- Run in the Supabase SQL Editor. Requires `update_updated_at_column()`
-- from supabase/schema.sql (or complete_setup.sql) to already exist.
-- ============================================================================

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
