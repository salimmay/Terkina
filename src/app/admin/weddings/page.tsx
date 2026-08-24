import type { Metadata } from 'next';
import PhotoProjectTable from '@/components/admin/PhotoProjectTable';

export const metadata: Metadata = {
  title: 'Med Art Weddings Admin | TERKINA CRM',
};

export default function AdminWeddingsPage() {
  return (
    <PhotoProjectTable
      platform="MED_ART"
      title="Med Art Weddings & Bridal Cinema"
      subtitle="Manage luxury wedding collections, Cloudinary album sets, and 360° orbital presentation order."
      createHref="/admin/weddings/new"
      accentColor="amber"
    />
  );
}
