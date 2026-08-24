import LivingVideoSplitHero from '@/components/LivingVideoSplitHero';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <LivingVideoSplitHero />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
