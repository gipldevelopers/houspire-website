'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Clock, CheckCircle2, XCircle, Info, Mail } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import Link from 'next/link';

export default function RefundPolicy() {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'eligibility', title: '2. Refund Eligibility' },
    { id: 'non-refundable', title: '3. Non-Refundable Situations' },
    { id: 'cancellation-process', title: '4. Cancellation Process' },
    { id: 'refund-processing', title: '5. Refund Processing' },
    { id: 'partial-refunds', title: '6. Partial Refunds' },
    { id: 'upgrade-credits', title: '7. Upgrade Credits' },
    { id: 'disputes', title: '8. Dispute Resolution' },
    { id: 'force-majeure', title: '9. Force Majeure' },
    { id: 'special', title: '10. Special Circumstances' },
    { id: 'abuse', title: '11. Refund Abuse Prevention' },
    { id: 'updates', title: '12. Policy Updates' },
    { id: 'contact', title: '13. Contact Information' },
  ];

  function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  }

  return (
    <>
      <SEOHead 
        title="Refund & Cancellation Policy"
        description="Houspire's refund and cancellation policy by ARMISHQ DESIGN PRIVATE LIMITED. Clear guidelines on cancellation timelines, refund eligibility, and processing for interior design services."
        noIndex={false}
      />
      <div className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="py-16 bg-secondary/30">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <Badge className="mb-4 bg-accent/10 text-accent border-0">Legal</Badge>
              <div className="flex items-center justify-center gap-3 mb-4">
                <DollarSign className="h-8 w-8 text-accent" />
                <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
                  Refund & Cancellation Policy
                </h1>
              </div>
              <p className="text-muted-foreground">Effective Date: February 2026</p>
              <p className="text-sm text-muted-foreground mt-1">Last Updated: February 2026</p>
            </motion.div>
          </Container>
        </section>

        {/* Content */}
        <section className="py-16">
          <Container>
            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
              {/* TOC */}
              <aside className="lg:w-64 flex-shrink-0">
                <Card className="sticky top-24 p-4">
                  <h3 className="font-semibold text-foreground mb-3">Table of Contents</h3>
                  <nav className="space-y-1 max-h-[70vh] overflow-y-auto">
                    {sections.map(section => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left text-xs py-1 px-2 rounded transition-colors ${
                          activeSection === section.id
                            ? 'bg-accent/10 text-accent font-semibold'
                            : 'text-muted-foreground hover:bg-secondary'
                        }`}
                      >
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </Card>
              </aside>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 prose prose-neutral max-w-none"
              >
                <Alert className="mb-8 border-accent/20 bg-accent/5">
                  <Info className="h-4 w-4 text-accent" />
                  <AlertDescription className="text-foreground">
                    <strong>Our Commitment:</strong> At Houspire, we strive to provide high-quality AI-powered interior design services. This Policy outlines the terms under which refunds and cancellations are processed. This is in addition to, and does not limit, your statutory rights under Indian consumer protection laws.
                  </AlertDescription>
                </Alert>

                {/* Section 1 */}
                <section id="introduction" className="scroll-mt-24 mb-12">
                  <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
                  <p className="text-muted-foreground">
                    This Policy applies to all services purchased through the Houspire website (www.houspire.ai), Houspire mobile application, and any other authorized sales channel.
                  </p>
                </section>

                <Separator className="my-8" />

                {/* Section 2 */}
                <section id="eligibility" className="scroll-mt-24 mb-12">
                  <h2 className="text-2xl font-semibold text-foreground">2. Refund Eligibility Criteria</h2>

                  <h3 className="text-lg font-medium text-foreground mt-6">2.1 Starter Package — 100% Money-Back Guarantee</h3>
                  <Card className="p-4 mt-4 border-green-200 bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-200">Full Refund (100%) — No Questions Asked</p>
                        <div className="text-green-700 dark:text-green-300 text-sm mt-2 space-y-1">
                          <p>• Starter Package (₹999)</p>
                          <p>• Request within 7 days of design delivery</p>
                          <p>• One-time money-back guarantee per customer</p>
                          <p>• Refunded to original payment method, no deductions</p>
                          <p>• Processing time: 5-7 business days</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Additional sections would continue here... */}
                  {/* Full content available in original file */}
                </section>

                {/* Section 13 - Contact */}
                <section id="contact" className="scroll-mt-24 mb-12">
                  <h2 className="text-2xl font-semibold text-foreground">13. Contact Information</h2>

                  <Card className="p-6 mt-4">
                    <h4 className="font-semibold text-foreground mb-4">ARMISHQ DESIGN PRIVATE LIMITED</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Refund Requests</p>
                          <a href="mailto:refund@houspire.ai" className="text-accent hover:underline text-sm">refund@houspire.ai</a>
                          <p className="text-muted-foreground text-xs mt-1">Subject: Refund Request - Order #[NUMBER]</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Status Inquiries</p>
                          <a href="mailto:support@houspire.ai" className="text-accent hover:underline text-sm">support@houspire.ai</a>
                        </div>
                      </div>
                    </div>
                  </Card>
                </section>

                {/* Acknowledgment */}
                <Card className="p-6 bg-secondary/30 mt-8">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Acknowledgment</h3>
                  <p className="text-muted-foreground text-sm">
                    By placing an order, you acknowledge that you have read and understood this Refund and Cancellation Policy, agree to the terms outlined herein, understand refund eligibility criteria, and will follow the prescribed process for refund requests.
                  </p>
                  <p className="text-muted-foreground text-sm mt-3">
                    © 2026. ARMISHQ DESIGN PRIVATE LIMITED. All rights reserved.
                  </p>
                  <div className="mt-4">
                    <Link href="/terms" className="text-accent hover:underline text-sm">
                      Read our full Terms and Conditions →
                    </Link>
                  </div>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
