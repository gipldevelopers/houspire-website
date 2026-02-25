import { SEOHead } from '@/components/SEOHead';
import { generateOrganizationSchema } from '@/lib/seo';
import { Container } from '@/components/layout/Container';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactSidebar } from '@/components/contact/ContactSidebar';

// Schema for local business
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Houspire',
  description: 'Professional interior design services with transparent pricing and 72-hour delivery.',
  url: 'https://houspire.ai',
  telephone: '+91-98765-43210',
  email: 'support@houspire.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hitech City',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500081',
    addressCountry: 'IN',
  },
  openingHours: 'Mo-Sa 10:00-19:00',
  priceRange: '₹999 - ₹29,999',
};

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
      name: 'Contact',
      item: 'https://houspire.ai/contact',
    },
  ],
};

export default function Contact() {
  return (
    <>
      <SEOHead
        title="Contact Us"
        description="Get in touch with Houspire. We respond within 24 hours. Email, phone, or WhatsApp — reach out for project support, questions, or partnerships."
        keywords={['contact houspire', 'interior design support', 'design help', 'customer service', 'houspire support']}
        schema={[generateOrganizationSchema(), localBusinessSchema, breadcrumbSchema]}
      />
      
      <div className="min-h-screen bg-background pt-16">
        <ContactHero />
        
        <section className="py-16 md:py-20">
          <Container>
            <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
              {/* Form - 3 columns */}
              <div className="lg:col-span-3">
                <ContactForm />
              </div>
              
              {/* Sidebar - 2 columns */}
              <div className="lg:col-span-2">
                <ContactSidebar />
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
