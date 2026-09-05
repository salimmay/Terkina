import { createClient } from '@/lib/supabase/client';
import { deleteCloudinaryAssets } from '@/lib/cloudinaryDelete';

export type TrashItemType = 'album' | 'product' | 'image' | 'model';

export type RestorePayload =
  | { mode: 'soft_delete_undo'; table: 'photo_project' | 'three_d_project' }
  | { mode: 'gallery_reinsert'; sort_order: number }
  | { mode: 'column_restore'; table: 'photo_project' | 'three_d_project'; field: 'cover_image_url' | 'model_file_url' };

export interface TrashItem {
  id: string;
  item_type: TrashItemType;
  title: string;
  preview_url: string | null;
  platform: 'MED_ART' | 'TERKINA_PROD' | null;
  source_id: string | null;
  restore_payload: RestorePayload;
  cloudinary_urls: string[];
  deleted_at: string;
  expires_at: string;
}

export async function logTrashItem(entry: {
  item_type: TrashItemType;
  title: string;
  preview_url?: string | null;
  platform?: 'MED_ART' | 'TERKINA_PROD' | null;
  source_id?: string | null;
  restore_payload: RestorePayload;
  cloudinary_urls?: (string | null | undefined)[];
}): Promise<boolean> {
  // Returns whether the entry was actually recorded. Callers must not promise
  // the user a recovery window when this comes back false — supabase-js
  // resolves rather than throwing on query errors, so a missing table or an
  // RLS denial here is otherwise completely silent.
  try {
    const supabase = createClient();
    const { error } = await supabase.from('trash_items').insert({
      item_type: entry.item_type,
      title: entry.title,
      preview_url: entry.preview_url || null,
      platform: entry.platform || null,
      source_id: entry.source_id || null,
      restore_payload: entry.restore_payload,
      cloudinary_urls: (entry.cloudinary_urls || []).filter((u): u is string => !!u),
    });

    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('Trash not recorded: `trash_items` table missing. Run supabase/trash_items.sql.');
      } else {
        console.error('Failed to log trash item (non-blocking):', error.message);
      }
      return false;
    }
    return true;
  } catch (err) {
    // Never let trash logging block the actual delete/replace the user asked for.
    console.error('Failed to log trash item (non-blocking):', err);
    return false;
  }
}

export async function restoreTrashItem(item: TrashItem): Promise<void> {
  const supabase = createClient();
  const payload = item.restore_payload;

  if (payload.mode === 'soft_delete_undo') {
    const { error } = await supabase.from(payload.table).update({ deleted_at: null }).eq('id', item.source_id);
    if (error) throw error;
  } else if (payload.mode === 'gallery_reinsert') {
    const { error } = await supabase.from('photo_gallery').insert({
      project_id: item.source_id,
      image_url: item.preview_url,
      sort_order: payload.sort_order,
    });
    if (error) throw error;
  } else if (payload.mode === 'column_restore') {
    const { error } = await supabase
      .from(payload.table)
      .update({ [payload.field]: item.preview_url })
      .eq('id', item.source_id);
    if (error) throw error;
  }

  const { error: deleteError } = await supabase.from('trash_items').delete().eq('id', item.id);
  if (deleteError) throw deleteError;
}

// Permanently removes a trash entry: hard-deletes the source database row
// (only relevant for whole album/product entries — a removed single image or
// replaced model/cover has no row of its own left to delete) and purges the
// underlying Cloudinary asset(s).
export async function purgeTrashItem(item: TrashItem): Promise<void> {
  const supabase = createClient();

  if (item.restore_payload.mode === 'soft_delete_undo' && item.source_id) {
    await supabase.from(item.restore_payload.table).delete().eq('id', item.source_id);
  }

  await deleteCloudinaryAssets(item.cloudinary_urls);

  const { error } = await supabase.from('trash_items').delete().eq('id', item.id);
  if (error) throw error;
}

export async function purgeExpiredTrashItems(items: TrashItem[]): Promise<number> {
  const now = Date.now();
  const expired = items.filter((i) => new Date(i.expires_at).getTime() <= now);
  for (const item of expired) {
    await purgeTrashItem(item);
  }
  return expired.length;
}
