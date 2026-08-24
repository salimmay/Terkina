'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Fetches live PUBLISHED photo albums for a given platform division.
 *
 * NOTE: The current `photo_project` schema has no dedicated `platform`
 * column — the platform division is embedded at creation time as a
 * `[Platform: MED_ART | TERKINA_PROD]` tag at the start of the description
 * (see src/app/admin/weddings/new/page.tsx). We parse that tag client-side.
 */

export interface LivePhotoProject {
  id: string;
  title: string;
  description: string;
  category: string;
  coverImage: string;
  gallery: string[];
}

function parsePlatformTag(description: string | null): string | null {
  const match = (description || '').match(/^\[Platform:\s*([A-Z_]+)\s*\|/);
  return match ? match[1] : null;
}

function stripTagPrefix(description: string | null): string {
  return (description || '').replace(/^\[[^\]]+\]\s*/, '');
}

export function usePhotoProjects(
  platform: 'MED_ART' | 'TERKINA_PROD',
  fallback: LivePhotoProject[]
) {
  const [projects, setProjects] = useState<LivePhotoProject[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchAlbums() {
      setLoading(true);
      const supabase = createClient();
      const { data: rawData, error } = await supabase
        .from('photo_project')
        .select(
          `
          id,
          title,
          description,
          status,
          deleted_at,
          photo_gallery (
            id,
            image_url,
            sort_order
          )
        `
        )
        .eq('status', 'PUBLISHED')
        .is('deleted_at', null)
        .order('sort_order', { ascending: true });

      if (cancelled) return;

      type Row = {
        id: string;
        title: string;
        description: string | null;
        cover_image_url: string | null;
        photo_gallery: Array<{ id: string; image_url: string; sort_order: number }> | null;
      };
      const data = (rawData || []) as unknown as Row[];

      if (!error && data.length > 0) {
        const mapped = data
          .filter((item) => parsePlatformTag(item.description) === platform)
          .map((item) => {
            const frames = (item.photo_gallery || [])
              .slice()
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((g) => g.image_url);

            return {
              id: item.id,
              title: item.title,
              description: stripTagPrefix(item.description),
              category:
                item.description?.match(/\[Platform:[^\]]*Category:\s*([^\]]+)\]/)?.[1]?.trim() ||
                'Portfolio',
              coverImage: frames[0] || item.cover_image_url || '',
              gallery:
                frames.length > 0
                  ? frames
                  : [item.cover_image_url].filter((u): u is string => !!u),
            };
          });

        // Show live data when available; otherwise keep the static fallback
        if (mapped.length > 0) {
          setProjects(mapped);
          setIsLive(true);
        } else {
          setProjects(fallback);
          setIsLive(false);
        }
      } else {
        if (error) console.error('Live album fetch failed, using fallback:', error.message);
        setProjects(fallback);
        setIsLive(false);
      }
      setLoading(false);
    }

    fetchAlbums();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

  return { projects, loading, isLive };
}
