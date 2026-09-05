'use client';

import React from 'react';
import { PageHeader } from '@/components/admin/ui';
import AlbumForm, { DEFAULT_ALBUM_FORM } from '@/components/admin/AlbumForm';

export default function NewWeddingAlbumPage() {
  return (
    <div>
      <PageHeader title="Create new album" description="Upload frames to Cloudinary and set the 360° gallery order." />
      <AlbumForm mode="create" initial={DEFAULT_ALBUM_FORM} />
    </div>
  );
}
