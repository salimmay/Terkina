// src/lib/useSiteSettings.ts
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Bundled assets used until an admin uploads their own to Cloudinary.
export const FALLBACK_HERO_MED_ART = '/videos/med-art-hero.webm';
export const FALLBACK_HERO_TERKINA = '/videos/terkina-hero.webm';
export const FALLBACK_LOGO = '/logo.png';

export interface SiteSettings {
  whatsappNumber: string;
  agencyEmail: string;
  heroVideoMedArt: string;
  heroVideoTerkina: string;
  logoUrl: string;
  loading: boolean;
}

export function useSiteSettings(): SiteSettings {
  const [whatsappNumber, setWhatsappNumber] = useState<string>('216127004058');
  const [agencyEmail, setAgencyEmail] = useState<string>('contact@terkina.com');
  const [heroVideoMedArt, setHeroVideoMedArt] = useState<string>(FALLBACK_HERO_MED_ART);
  const [heroVideoTerkina, setHeroVideoTerkina] = useState<string>(FALLBACK_HERO_TERKINA);
  const [logoUrl, setLogoUrl] = useState<string>(FALLBACK_LOGO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('key, content')
          .in('key', ['contact_settings', 'branding']);

        if (!error && data) {
          for (const row of data as Array<{ key: string; content: Record<string, unknown> }>) {
            if (row.key === 'contact_settings') {
              const content = row.content as { whatsapp_number?: string; contact_email?: string };
              if (content.whatsapp_number) {
                // Clean the number (remove any '+', spaces, or dashes)
                const cleanNumber = content.whatsapp_number.replace(/[^0-9]/g, '');
                if (cleanNumber) setWhatsappNumber(cleanNumber);
              }
              if (content.contact_email) setAgencyEmail(content.contact_email);
            }

            if (row.key === 'branding') {
              const content = row.content as {
                hero_video_medart?: string;
                hero_video_terkina?: string;
                logo_url?: string;
              };
              if (content.hero_video_medart) setHeroVideoMedArt(content.hero_video_medart);
              if (content.hero_video_terkina) setHeroVideoTerkina(content.hero_video_terkina);
              if (content.logo_url) setLogoUrl(content.logo_url);
            }
          }
        }
      } catch (err) {
        console.warn('Using fallback site settings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  return { whatsappNumber, agencyEmail, heroVideoMedArt, heroVideoTerkina, logoUrl, loading };
}
