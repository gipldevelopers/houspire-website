import { SEOHead } from '@/components/SEOHead';
import { generateOrganizationSchema } from '@/lib/seo';
import { Container } from '@/components/layout/Container';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactSidebar, ContactSidebarSecondary } from '@/components/contact/ContactSidebar';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';

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
        
        <section className="py-8 md:py-12">
          <Container>
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
              {/* Form - 3 columns */}
              <div className="lg:col-span-3 space-y-5">
                <ContactForm />
                <Card className="p-6 border-border/60 bg-gradient-to-br from-amber-50/60 via-background to-orange-50/40">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Why Customers Reach Out</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="flex items-start gap-2.5">
                      <Clock3 className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Fast Response</p>
                        <p className="text-xs text-muted-foreground">Replies within 24 business hours.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Trusted Support</p>
                        <p className="text-xs text-muted-foreground">Clear answers from design experts.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Actionable Help</p>
                        <p className="text-xs text-muted-foreground">Guidance you can use immediately.</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Sidebar - 2 columns */}
              <div className="lg:col-span-2 space-y-5">
                <ContactSidebar includeSecondary={false} />
              </div>
            </div>

            <div className="mt-6">
              <ContactSidebarSecondary />
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
