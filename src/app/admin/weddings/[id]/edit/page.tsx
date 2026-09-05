'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/admin/ui';
import AlbumForm, { AlbumFormValues, DEFAULT_ALBUM_FORM } from '@/components/admin/AlbumForm';

export default function EditAlbumPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState<AlbumFormValues | null>(null);

  useEffect(() => {
    async function loadAlbum() {
      const supabase = createClient();
      const [projectRes, galleryRes] = await Promise.all([
        supabase.from('photo_project').select('*').eq('id', id).single(),
        supabase.from('photo_gallery').select('*').eq('project_id', id).order('sort_order', { ascending: true }),
      ]);

      if (projectRes.error || !projectRes.data) {
        toast.error('Album not found.');
        router.push('/admin');
        return;
      }

      const description: string = projectRes.data.description || '';
      const tagMatch = description.match(/^\[Platform:\s*([A-Z_]+)\s*\|\s*Category:\s*([^\]]+)\]\n?/);
      const platform = (tagMatch?.[1] as AlbumFormValues['platform']) || 'MED_ART';
      const category = tagMatch?.[2]?.trim() || DEFAULT_ALBUM_FORM.category;
      const cleanDescription = description.replace(/^\[[^\]]+\]\n?/, '');

      const galleryRows = (galleryRes.data || []) as Array<{ id: string; image_url: string }>;

      setInitial({
        id: projectRes.data.id,
        title: projectRes.data.title || '',
        category,
        platform,
        status: projectRes.data.status || 'PUBLISHED',
        description: cleanDescription,
        coverUrl: projectRes.data.cover_image_url || '',
        gallery: galleryRows.map((row, idx) => ({
          id: row.id,
          url: row.image_url,
          title: `Frame ${idx + 1}`,
        })),
      });
      setLoading(false);
    }
    loadAlbum();
  }, [id, router]);

  return (
    <div>
      <PageHeader title="Edit album" description="Fix a typo, swap photos, or reorder the gallery." />
      {loading || !initial ? (
        <div className="text-xs text-zinc-500 py-10 text-center">Loading album...</div>
      ) : (
        <AlbumForm mode="edit" initial={initial} />
      )}
    </div>
  );
}
