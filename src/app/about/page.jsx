import { SEOHead } from '@/components/SEOHead';
import { generateOrganizationSchema } from '@/lib/seo';
import { AboutHero } from '@/components/about/AboutHero';
import { StatsSection } from '@/components/about/StatsSection';
import { MissionSection } from '@/components/about/MissionSection';
import { TeamSection } from '@/components/about/TeamSection';
import { ValuesSection } from '@/components/about/ValuesSection';
import { AboutCTA } from '@/components/about/AboutCTA';

// Breadcrumb schema for SEO
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
        description="Houspire is a design intelligence service making professional interior design accessible to every Indian homeowner. Photorealistic designs, itemized budgets, and verified contractors — delivered in 72 hours."
        keywords={['about houspire', 'interior design service', 'affordable design', 'design intelligence', 'indian interior design']}
        schema={[generateOrganizationSchema(), breadcrumbSchema]}
      />
      
      <div className="min-h-screen bg-background pt-16">
        <AboutHero />
        <StatsSection />
        <MissionSection />
        <TeamSection />
        <ValuesSection />
        <AboutCTA />
      </div>
    </>
  );
}
