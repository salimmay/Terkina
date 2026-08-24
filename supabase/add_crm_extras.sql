-- ============================================================================
-- CRM Extras Migration
-- 1. Extends message workflow: CONTACTED / ARCHIVED statuses + CAD file links
-- 2. Creates the `site_content` key/value store for live site settings
--    (WhatsApp number, homepage metrics, etc.)
-- Run in the Supabase SQL Editor.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1a. Extend the message_status enum
--     NOTE: ALTER TYPE ... ADD VALUE cannot run inside a transaction block;
--     run these statements individually if your SQL editor wraps them.
-- ---------------------------------------------------------------------------
ALTER TYPE message_status ADD VALUE IF NOT EXISTS 'CONTACTED';
ALTER TYPE message_status ADD VALUE IF NOT EXISTS 'ARCHIVED';

-- 1b. Optional attachment link on messages (CAD / Drive / WeTransfer)
ALTER TABLE message ADD COLUMN IF NOT EXISTS file_url TEXT;

-- ---------------------------------------------------------------------------
-- 2. Site content store (key → JSONB content)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_content (
    key        TEXT PRIMARY KEY,
    section    TEXT NOT NULL DEFAULT 'general',
    content    JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read site settings (public front-end needs WhatsApp number/metrics)
CREATE POLICY "site_content_select_public"
    ON site_content FOR SELECT
    USING (true);

-- Only admins can write settings
CREATE POLICY "site_content_insert_admin"
    ON site_content FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "site_content_update_admin"
    ON site_content FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- Seed defaults so the public site has values before first save
INSERT INTO site_content (key, section, content) VALUES
    ('contact_settings', 'general', '{"whatsapp_number": "21612345678", "contact_email": "contact@terkina.com"}'),
    ('stats', 'metrics', '{"photoSets": 500, "photoSuffix": "+", "tolerance": 0.05, "toleranceSuffix": "mm", "bespokeCraft": 100, "craftSuffix": "%"}')
ON CONFLICT (key) DO NOTHING;
