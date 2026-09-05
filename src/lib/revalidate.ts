/**
 * Client-side helper to trigger on-demand Next.js ISR cache purging.
 * Invoked silently whenever admin updates products or albums in CRM.
 */
export async function triggerRevalidate(path: string) {
  try {
    const secret =
      process.env.NEXT_PUBLIC_REVALIDATION_SECRET || 'terkina-revalidate-secret-key';

    await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ path }),
    });
  } catch (e) {
    console.warn('Silent cache revalidation notice:', e);
  }
}
