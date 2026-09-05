import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import ThreeDShell from '@/components/3d-platform/ThreeDShell';

export const metadata: Metadata = buildMetadata('threeD', 'ar');

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ThreeDShell>{children}</ThreeDShell>;
}
