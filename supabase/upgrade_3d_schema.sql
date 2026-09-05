-- ============================================================================
-- 3D Marketplace Schema Upgrade
-- Promotes show_price, is_in_stock to dedicated indexed columns
-- and adds available_colors array column.
-- Run in Supabase SQL Editor.
-- ============================================================================

-- 1. Add dedicated columns
ALTER TABLE "three_d_project"
ADD COLUMN IF NOT EXISTS "show_price" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "is_in_stock" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "available_colors" TEXT[] DEFAULT ARRAY['Default / Natural'];

-- 2. Create B-Tree indexes for fast sorting and filtering
CREATE INDEX IF NOT EXISTS "idx_three_d_show_price" ON "three_d_project"("show_price");
CREATE INDEX IF NOT EXISTS "idx_three_d_is_in_stock" ON "three_d_project"("is_in_stock");
CREATE INDEX IF NOT EXISTS "idx_three_d_status_sort" ON "three_d_project"("status", "sort_order");

-- 3. Backfill data from print_specs JSONB into the new columns
UPDATE "three_d_project"
SET 
  "show_price" = COALESCE((print_specs->>'show_price')::boolean, true),
  "is_in_stock" = COALESCE((print_specs->>'is_in_stock')::boolean, true)
WHERE "show_price" IS NULL OR "is_in_stock" IS NULL;
