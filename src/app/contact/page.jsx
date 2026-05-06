import { SEOHead } from '@/components/SEOHead';
import { generateOrganizationSchema } from '@/lib/seo';
import { Container } from '@/components/layout/Container';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactSidebar, WhatsAppCard, PromiseCard } from '@/components/contact/ContactSidebar';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Clock3, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Schema for local business
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Houspire',
  description: 'Professional interior design services with transparent pricing and 72-hour delivery.',
  url: 'https://houspire.ai',
  telephone: '+91-70758-27625',
  email: 'hello@houspire.ai',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hitech City',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500081',
    addressCountry: 'IN',
  },
  openingHours: 'Mo-Sa 10:00-19:00',
  priceRange: '₹499 - ₹29,999',
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
      
      <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ backgroundColor: 'var(--color-primary)' }} />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full blur-3xl opacity-10" style={{ backgroundColor: 'var(--color-accent)' }} />
        
        <Container className="relative z-10 h-full max-w-[1280px] px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start h-full">
            
            {/* Left Column: Hero Text + Quick Contact */}
            <div className="flex flex-col h-full space-y-8 lg:pr-8 lg:sticky lg:top-28">
              <div className="max-w-xl">
                <Badge className="mb-6 px-4 py-1.5 border-[var(--color-border)] inline-flex" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', color: 'var(--color-primary)' }}>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  We respond within 24 hours
                </Badge>
                
                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.1]" style={{ color: 'var(--color-heading-main)' }}>
                  Let's Start a
                  <span className="block" style={{ color: 'var(--color-heading-main-highlight)' }}>
                    Conversation
                  </span>
                </h1>
                
                <p className="text-lg leading-relaxed opacity-60" style={{ color: 'var(--color-description)' }}>
                  Have questions about your project? Need support? We're here to help you create the space of your dreams.
                </p>
              </div>
              
              <div className="hidden lg:block space-y-6">
                <ContactSidebar includeSecondary={false} />
                <WhatsAppCard />
              </div>
            </div>
            
            {/* Right Column: Form + Features */}
            <div className="space-y-6">
              <ContactForm />
              <div className="block lg:hidden space-y-6">
                <ContactSidebar includeSecondary={false} />
                <WhatsAppCard />
              </div>
              <PromiseCard />
              
              {/* 
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
              */}
            </div>
            
          </div>
        </Container>
      </div>
    </>
  );
}
