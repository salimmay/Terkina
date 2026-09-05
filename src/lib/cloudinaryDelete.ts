// Best-effort Cloudinary cleanup — call after a hard delete so the asset
// doesn't keep sitting (and counting against storage) in Cloudinary forever.
// Never throws: a failed cleanup shouldn't undo or block the record deletion
// that already succeeded.
export async function deleteCloudinaryAssets(urls: (string | null | undefined)[]): Promise<void> {
  const valid = urls.filter((u): u is string => !!u && u.includes('res.cloudinary.com'));
  if (valid.length === 0) return;

  try {
    await fetch('/api/delete-asset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: valid }),
    });
  } catch (err) {
    console.error('Cloudinary cleanup failed (non-blocking):', err);
  }
}
