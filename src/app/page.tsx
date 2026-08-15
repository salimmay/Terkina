import SplitHero from '@/components/home/SplitHero';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <SplitHero />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
