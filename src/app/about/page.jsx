import { SEOHead } from '@/components/SEOHead';
import { generateOrganizationSchema } from '@/lib/seo';
import { AboutHero } from '@/components/about/AboutHero';
import { StatsSection } from '@/components/about/StatsSection';
import { MissionSection } from '@/components/about/MissionSection';
import { TeamSection } from '@/components/about/TeamSection';
import { ValuesSection } from '@/components/about/ValuesSection';
import { AboutCTA } from '@/components/about/AboutCTA';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://houspire.ai',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'About Us',
      item: 'https://houspire.ai/about',
    },
  ],
};

export default function About() {
  return (
    <>
      <SEOHead
        title="About Us"
        description="Houspire is India's first planning-first interior design platform. Photorealistic 3D renders of your actual home, 20 design styles, 72-hour delivery — flat ₹4,999. No hidden costs, no contractor commissions."
        keywords={[
          'about houspire',
          'interior design india',
          'affordable interior design',
          'photorealistic 3d render',
          'flat fee interior design',
        ]}
        schema={[generateOrganizationSchema(), breadcrumbSchema]}
      />

      <div className="min-h-screen bg-background pt-16">
        {/* Dark hero — our story */}
        <AboutHero />

        {/* Problems we solve — numbered cards on ivory */}
        <StatsSection />

        {/* How we work — dark section with feature chips */}
        <MissionSection />

        {/* Founders + team — ivory */}
        <TeamSection />

        {/* Money-back guarantee */}
        <ValuesSection />

        {/* CTA — terracotta */}
        <AboutCTA />
      </div>
    </>
  );
}
