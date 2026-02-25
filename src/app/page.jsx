import { HeroSection } from '@/components/home/HeroSection';
import { DarkTrustBar } from '@/components/home/DarkTrustBar';
import { DarkFeaturesSection } from '@/components/home/DarkFeaturesSection';
import { GalleryPreviewSection } from '@/components/home/GalleryPreviewSection';
import { DarkTransformationSection } from '@/components/home/DarkTransformationSection';
import { TestimonialsSectionHome } from '@/components/home/TestimonialsSectionHome';
import { DarkHowItWorksSection } from '@/components/home/DarkHowItWorksSection';
import { HeadacheReliefSection } from '@/components/home/HeadacheReliefSection';
import { DarkPricingSection } from '@/components/home/DarkPricingSection';
import { VerifiedContractorsSection } from '@/components/home/VerifiedContractorsSection';
import { BudgetEstimatorSection } from '@/components/home/BudgetEstimatorSection';
import { FAQSection } from '@/components/home/FAQSection';
import { DarkFinalCTA } from '@/components/home/DarkFinalCTA';
import { SEOHead } from '@/components/SEOHead';
import { organizationSchema, serviceSchema, faqSchema } from '@/lib/seo';

const homeFaqSchema = faqSchema([
  { question: 'What exactly do I receive?', answer: 'You get photorealistic 3D renders of your rooms, a detailed budget breakdown, direct shopping links, and a verified contractor shortlist. Delivered as a PDF within 72 hours.' },
  { question: 'How is this different from hiring a traditional interior designer?', answer: 'Traditional designers charge ₹50,000-₹2,00,000+ and earn hidden 15-20% commissions on materials. Houspire delivers the same outputs at a flat fee starting at ₹999 with full transparency.' },
]);

const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Houspire',
  description: 'Professional interior design intelligence service for Indian homeowners. Photorealistic room designs, itemized budgets, and verified contractors delivered in 72 hours.',
  url: 'https://houspire.ai',
  priceRange: '₹999 - ₹29,999',
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
        title="Houspire — Interior Design Intelligence | Starting at ₹999"
        description="We use advanced design technology and expert curation to give you everything you need to execute your dream home — photorealistic room designs, itemized budgets, shopping lists, and verified contractor connections — all delivered in 72 hours at a fraction of what traditional designers charge."
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
      <HeadacheReliefSection />
      <DarkPricingSection />
      <VerifiedContractorsSection />
      <BudgetEstimatorSection />
      <FAQSection />
      <DarkFinalCTA />
    </>
  );
}
