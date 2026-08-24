import type { Metadata } from 'next';
import Navbar from '@/components/navigation/Navbar';
import GoldenCursorTrail from '@/components/GoldenCursorTrail';

export const metadata: Metadata = {
  title: 'TERKINA 3D | Additive Fabrication & Design Marketplace',
  description:
    'Precision 3D additive manufacturing, generative design collection, and rapid prototyping studio.',
};

export default function ThreeDLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#050409] text-white selection:bg-purple-600 selection:text-white overflow-x-hidden antialiased">
      <GoldenCursorTrail />
      <Navbar />
      {children}
    </div>
  );
}
