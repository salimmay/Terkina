import type { Metadata } from 'next';
import PhotoProjectTable from '@/components/admin/PhotoProjectTable';

export const metadata: Metadata = {
  title: 'Terkina Commercial Admin | TERKINA CRM',
};

export default function AdminCommercialPage() {
  return (
    <PhotoProjectTable
      platform="TERKINA_PROD"
      title="Terkina Commercial & Event Production"
      subtitle="Manage advertising campaigns, luxury product shoot reels, and corporate coverage sets."
      createHref="/admin/weddings/new" // Opens creator with platform toggle
      accentColor="cyan"
    />
  );
}
