import { HeroSection } from '@/components/home/HeroSection';
import { DarkTrustBar } from '@/components/home/DarkTrustBar';
import { DarkFeaturesSection } from '@/components/home/DarkFeaturesSection';
import { GalleryPreviewSection } from '@/components/home/GalleryPreviewSection';
import { DarkTransformationSection } from '@/components/home/DarkTransformationSection';
import { TestimonialsSectionHome } from '@/components/home/TestimonialsSectionHome';
import { DarkHowItWorksSection } from '@/components/home/DarkHowItWorksSection';
import { UrgencyPreviewSection } from '@/components/home/UrgencyPreviewSection';
import { HeadacheReliefSection } from '@/components/home/HeadacheReliefSection';
import { DarkPricingSection } from '@/components/home/DarkPricingSection';
import { FAQSection } from '@/components/home/FAQSection';
import { DarkFinalCTA } from '@/components/home/DarkFinalCTA';
import { SEOHead } from '@/components/SEOHead';
import { organizationSchema, serviceSchema, faqSchema } from '@/lib/seo';

const homeFaqSchema = faqSchema([
  { question: 'What exactly do I receive?', answer: 'You get photorealistic 3D renders of your rooms, a detailed budget breakdown, and direct shopping links for every item. Delivered as a complete, ready-to-execute digital home plan within 72 hours.' },
  { question: 'How is this different from hiring a traditional interior designer?', answer: 'Traditional designers charge high upfront fees and often have hidden commissions on materials. Houspire delivers the same professional outputs with full budget transparency and designer curation, at a fraction of the cost.' },
]);

const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Houspire',
  description: 'Professional interior design intelligence service. Design your home in 3 days, not 3 months. Photorealistic room designs and itemized budgets delivered in 72 hours.',
  url: 'https://houspire.ai',
  priceRange: '₹4,999 - ₹49,999',
  areaServed: [
    { '@type': 'City', name: 'Hyderabad' },
    { '@type': 'City', name: 'Bangalore' },
    { '@type': 'City', name: 'Mumbai' },
    { '@type': 'City', name: 'Delhi' },
    { '@type': 'City', name: 'Pune' },
    { '@type': 'City', name: 'Chennai' },
  ],
  sameAs: ['https://instagram.com/houspire.ai'],
};

export default function HomePage() {
  return (
    <>
      <SEOHead
        title="Houspire — Design your home in 3 days, not 3 months"
        description="Get photorealistic room designs, itemized budgets, and clear shopping lists — all delivered in 72 hours. See your exact home and know where every rupee goes before you commit to execution."
        url="https://houspire.com"
        schema={[organizationSchema, serviceSchema, homeFaqSchema, professionalServiceSchema]}
      />
      
      <HeroSection />
      <DarkTrustBar />
      <DarkFeaturesSection />
      <GalleryPreviewSection />
      <DarkTransformationSection />
      <TestimonialsSectionHome />
      <DarkHowItWorksSection />
      <UrgencyPreviewSection />
      <HeadacheReliefSection />
      <DarkPricingSection />
      <FAQSection />
      <DarkFinalCTA />
    </>
  );
}
