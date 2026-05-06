"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Clock, RefreshCw, Heart,
  FileCheck, Shield, CreditCard, Scale, Globe, HardHat,
  Package, UserCircle, RotateCcw, MessageCircle, AlertCircle,
  HelpCircle, Gavel, FileText, Mail, Phone, MapPin
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

const TermsOfUsePage = () => {
  const router = useRouter();

  const effectiveDate = "03.02.2026";
  const lastUpdatedDate = "03.02.2026";
  const legalEntity = "ARMISHQ DESIGN PRIVATE LIMITED";
  const websiteUrl = "www.houspire.ai";

  const handleBack = () => {
    router.back();
  };

  const Section = ({ title, children, id }) => (
    <section id={id} className="mb-20 scroll-mt-24">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight flex items-center gap-2">
        <div className="w-1 h-6 bg-primary rounded-full" />
        {title}
      </h2>
      <div className="text-gray-600 dark:text-gray-400 space-y-6 leading-relaxed text-sm md:text-base pl-3 border-l border-gray-50 dark:border-white/5 ml-0.5">
        {children}
      </div>
    </section>
  );

  const Subtitle = ({ children }) => (
    <p className="font-bold text-gray-900 dark:text-white mt-8 mb-4 uppercase text-xs tracking-widest">{children}</p>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Navigation */}
        <button
          onClick={handleBack}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group mb-16"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        {/* Header */}
        <header className="mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold mb-6 tracking-wider uppercase">
            <FileCheck className="w-3 h-3" /> Mandatory Terms
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed">
            PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE USING OUR SERVICES
          </p>
          <div className="flex flex-wrap gap-6 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Effective: {effectiveDate}</span>
            <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Updated: {lastUpdatedDate}</span>
          </div>
        </header>

        {/* Content */}
        <div className="space-y-4">

          <Section title="1. ACCEPTANCE OF TERMS">
            <p><strong>1.1 Agreement to Terms:</strong> By accessing or using the Houspire website <strong>({websiteUrl})</strong>, mobile application, or services (collectively, the "Platform"), you agree to be bound by these Terms and Conditions ("Terms").</p>
            <p><strong>1.2 Legal Entity:</strong> These Terms constitute a legally binding agreement between you and <strong>{legalEntity}</strong>, a company incorporated under the laws of India, having its registered office at Plot no 67, Road no. 4, Prashasan Nagar, Jubilee Hills, Shaikpet, Hyderabad- 500033, Telangana (hereinafter referred to as "Houspire", "we", "us", or "our").</p>
            <p><strong>1.3 Age Requirement:</strong> You must be at least 18 years of age to use our Platform or purchase our services. By using the Platform, you represent and warrant that you are at least 18 years old.</p>
            <p><strong>1.4 Modification of Terms:</strong> We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on the Platform. Your continued use of the Platform after changes constitutes acceptance of the modified Terms.</p>
            <p><strong>1.5 Additional Terms:</strong> Certain services may be subject to additional terms and conditions, which will be presented to you at the time of purchase or use.</p>
          </Section>

          <Section title="2. DEFINITIONS">
            <Subtitle>2.1 Key Terms</Subtitle>
            <ul className="space-y-4">
              <li><strong>2.1.1 "Services"</strong> means the interior design services provided by Houspire, including AI-generated design renders, budget planning, shopping lists, vendor recommendations, and related services.</li>
              <li><strong>2.1.2 "User" or "you"</strong> means any person who accesses or uses the Platform.</li>
              <li><strong>2.1.3 "Customer"</strong> means a User who purchases our Services.</li>
              <li><strong>2.1.4 "Designer"</strong> means interior design professionals engaged by Houspire to fulfill service orders.</li>
              <li><strong>2.1.5 "Order"</strong> means a purchase of Services through the Platform.</li>
              <li><strong>2.1.6 "Deliverables"</strong> means the design outputs provided as part of the Services, including renders, documents, and specifications.</li>
              <li><strong>2.1.7 "Package"</strong> means a predefined bundle of Services at a fixed price.</li>
              <li><strong>2.1.8 "Add-on"</strong> means additional services that can be purchased in addition to a Package.</li>
            </ul>
          </Section>
         <br /><br />
          <Section title="3. DESCRIPTION OF SERVICES">
            <p><strong>3.1 Services Offered:</strong> Houspire provides AI-powered interior design services for Indian homes, including:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                { t: "3.1.1 Design Consultation", d: "Discovery call to understand requirements, style matching, and recommendations." },
                { t: "3.1.2 AI Design Renders", d: "High-resolution 4K room renders with multiple design options based on selected style." },
                { t: "3.1.3 Budget Planning", d: "Itemized budget breakdown with Good/Better/Best options for materials and furnishings." },
                { t: "3.1.4 Shopping Lists", d: "Detailed list of required materials, furniture, and accessories with brand recommendations." },
                { t: "3.1.5 Vendor Recommendations", d: "Verified vendor contacts and procurement guidance." },
                { t: "3.1.6 Revisions", d: "Modifications to initial designs based on selected Package." },
                { t: "3.1.7 Post-Delivery Support", d: "Support period for clarifications and minor adjustments." }
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                  <p className="font-bold text-gray-900 dark:text-white text-[10px] uppercase tracking-widest mb-2 text-primary">{item.t}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.d}</p>
                </div>
              ))}
            </div>

            <Subtitle>3.2 Service Limitations</Subtitle>
            <p>Our Services are limited to digital design outputs, documentation, consultation, and recommendations.</p>

            <Subtitle>3.3 Exclusions</Subtitle>
            <div className="p-6 bg-red-50/50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/10 text-xs md:text-sm">
              <p className="text-red-700 dark:text-red-400 font-bold mb-3 flex items-center gap-2 uppercase tracking-tight">
                <HardHat className="w-4 h-4" /> Outside Scope
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-red-600/70">
                <li>• Physical construction or execution</li>
                <li>• Project management or on-site supervision</li>
                <li>• Material procurement or supply</li>
                <li>• Contractor services</li>
                <li>• Post-construction maintenance</li>
                <li>• Warranty on execution quality</li>
              </ul>
            </div>

            <Subtitle>3.4 Service Packages</Subtitle>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { p: "Single Room Trial", c: "₹499" },
                { p: "Double Room Trial", c: "₹899" },
                { p: "Essential Home", c: "₹2,999" },
                { p: "Smart Home", c: "₹4,999" },
                { p: "Premium Home", c: "₹9,999" },
                { p: "Luxury Home", c: "₹14,999" }
              ].map((pkg, i) => (
                <div key={i} className="p-4 text-center rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50/30 dark:bg-white/5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{pkg.p}</p>
                  <p className="font-bold text-gray-900 dark:text-white">{pkg.c}</p>
                </div>
              ))}
            </div>

            <Subtitle>3.5 Add-on Services</Subtitle>
            <p className="text-sm">Additional services like modular kitchen plans, wardrobe designs, technical drawings (electrical, plumbing, false ceiling), and Vastu consultations are available for purchase.</p>
          </Section>
<br /><br />
          <Section title="4. USER ACCOUNT AND REGISTRATION">
            <p><strong>4.1 Account Creation:</strong> To purchase Services, you must create an account providing your full name, email, phone number, and password. You are responsible for account confidentiality.</p>
            <p><strong>4.2 Account Security:</strong> You agree to provide accurate information, not share credentials, and notify us of unauthorized access.</p>
            <p><strong>4.3 Account Termination:</strong> We reserve the right to suspend or terminate accounts for Terms violations, fraud, or providing false information.</p>
          </Section>
<br /><br />
          <Section title="5. ORDERING AND PAYMENT">
            <p><strong>5.1 Placing an Order:</strong> Orders are placed by selecting a Package, providing project details, uploading plans/images, and completing payment.</p>
            <p><strong>5.2 Payment Terms:</strong> Prices are in INR and include GST. Payments are processed via <strong>Razorpay (PCI-DSS compliant)</strong>. Full payment is required at the time of Order.</p>
            <p><strong>5.3 Invoicing:</strong> GST invoices are generated for all Orders, sent via email, and maintained for 7 years for tax compliance.</p>
          </Section>
<br /><br />
          <Section title="6. SERVICE DELIVERY">
            <Subtitle>6.1 Delivery Timeline</Subtitle>
            <div className="space-y-2 text-sm">
              <p>• <strong>Single Room Trial:</strong> 24 hours</p>
              <p>• <strong>Double Room Trial:</strong> 48 hours</p>
              <p>• <strong>Essential/Smart Home:</strong> 72 hours</p>
              <p>• <strong>Premium Home:</strong> 96 hours</p>
              <p>• <strong>Luxury Home:</strong> 5-7 business days</p>
            </div>
            <p className="mt-4"><strong>6.2 Commencement:</strong> Timelines begin after Discovery call completion and receipt of all required information and materials.</p>
            <p><strong>6.3 Delivery Method:</strong> Deliverables are shared via the Customer Dashboard (primary) and Email (notification + backup).</p>
          </Section>
<br /><br />
          <Section title="7. REVISIONS AND MODIFICATIONS">
            <p><strong>7.1 Revision Policy:</strong> Trial (0-1 minor), Essential (2 full), Smart (4 full), Premium/Luxury (Unlimited + live co-design).</p>
            <p><strong>7.2 Scope:</strong> Revisions include changes to colors, furniture, layout, materials, and budget adjustments. They do <strong>not</strong> include complete redesigns or project scope changes.</p>
            <p><strong>7.3 Additional Revisions:</strong> Extra revision packs are available for purchase beyond the Package limits.</p>
          </Section>
<br /><br />
          <Section title="8. INTELLECTUAL PROPERTY RIGHTS">
            <p><strong>8.1 Ownership of Deliverables:</strong> Upon full payment, you own the design renders, budget documents, and shopping lists for your property.</p>
            <p><strong>8.2 Houspire’s Intellectual Property:</strong> Houspire retains all rights to its brand, AI algorithms, technology, templates, and methodologies.</p>
            <p><strong>8.3 Restrictions:</strong> You shall not resell, commercially exploit, or attempt to reverse-engineer Houspire’s technology.</p>
          </Section>
<br /><br />
          <Section title="9. USER OBLIGATIONS AND PROHIBITED CONDUCT">
            <p><strong>9.1 Responsibilities:</strong> You must provide accurate information, respond promptly, and comply with the Information Technology Act, 2000.</p>
            <p><strong>9.2 Prohibited Activities:</strong> You shall not violate laws, infringe IP, upload harmful content, or interfere with Platform security or functioning.</p>
          </Section>
<br /><br />
          <Section title="10. DESIGNER ASSIGNMENT AND COMMUNICATION">
            <p><strong>10.1 Designer Matching:</strong> Houspire assigns designers based on style expertise and availability, typically within 24-48 hours of Order confirmation.</p>
            <p><strong>10.2 Communication:</strong> All primary communication occurs through the Platform dashboard, with calls scheduled as per Package limits.</p>
          </Section>
<br /><br />
          <Section title="11. CUSTOMER SUPPORT">
            <p><strong>11.1 Channels:</strong> Email (hello@houspire.ai), Dashboard tickets, and WhatsApp for urgent matters.</p>
            <p><strong>11.2 Support Hours:</strong> Mon-Sat, 10:00 AM - 6:00 PM IST (excluding Sun/Public Holidays).</p>
            <p><strong>11.3 Post-Delivery Support:</strong> Trial (None), Essential (30 days), Smart (60 days), Premium (90 days), Luxury (6 months).</p>
          </Section>
<br /><br />
          <Section title="12. REFUND AND CANCELLATION POLICY">
            <p><strong>12.1 Trial Package:</strong> 100% refund if requested within 7 days based on dissatisfaction.</p>
            <p><strong>12.2 Home Packages:</strong> Full refund if cancelled within 24h before work starts (minus ₹500 fee). 50% refund if cancelled within 48h of work commencement. No refund after drafted/final delivery.</p>
            <p><strong>12.3 Process:</strong> Email <strong>refund@houspire.ai</strong>. Approved refunds take 3-7 business days to reflect.</p>
          </Section>
<br /><br />
          <Section title="13. WARRANTY AND DISCLAIMERS">
            <p><strong>13.1 Design Disclaimer:</strong> Renders are conceptual visualizations. Actual execution results may vary. Colours and textures may differ from physical materials.</p>
            <p><strong>13.2 Budget Estimates:</strong> Figures are approximate and based on market conditions at the time of preparation.</p>
            <p><strong>13.3 Vendor Recommendations:</strong> Provided for convenience; Houspire does not guarantee vendor performance or pricing.</p>
          </Section>
<br /><br />
          <Section title="14. LIMITATION OF LIABILITY">
            <p><strong>14.1 Liability Cap:</strong> Total aggregate liability shall not exceed the amount actually paid for the specific Order giving rise to the claim.</p>
            <p><strong>14.2 Exclusions:</strong> Houspire is not liable for indirect, incidental, or consequential damages related to construction or third-party acts.</p>
          </Section>
<br /><br />
          <Section title="15. INDEMNIFICATION">
            <p>You agree to indemnify Houspire against claims arising from your breach of Terms, violation of law, or misuse of Services.</p>
          </Section>
<br /><br />
          <Section title="16. FORCE MAJEURE">
            <p>Houspire is not liable for delays caused by natural disasters, war, governmental actions, or technical failures beyond reasonable control.</p>
          </Section>
<br /><br />
          <Section title="17. TERMINATION">
            <p>You may terminate your account at any time. Houspire may suspend/terminate accounts for Terms violations, fraud, or non-payment.</p>
          </Section>
<br /><br />
          <Section title="18. DISPUTE RESOLUTION">
            <p><strong>18.1 Informal Resolution:</strong> Contact <strong>legal@houspire.ai</strong> first. We aim to resolve disputes within 30 days.</p>
            <p><strong>18.2 Arbitration:</strong> Unresolved disputes will be settled by arbitration in <strong>Hyderabad, India</strong> under the Arbitration and Conciliation Act, 1996.</p>
          </Section>
<br /><br />
          <Section title="19. GOVERNING LAW AND JURISDICTION">
            <p>This Agreement shall be governed by the laws of <strong>India</strong>, with exclusive jurisdiction in the courts of <strong>Hyderabad</strong>.</p>
          </Section>
<br /><br />
          <Section title="20. GENERAL PROVISIONS">
            <p>These Terms, along with the Privacy and Refund Policies, constitute the entire agreement. If any provision is found invalid, the rest remain in effect. Failure to exercise rights doesn't constitute a waiver.</p>
          </Section>
<br /><br />
          <Section title="21. CONTACT INFORMATION">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                  <Mail className="w-4 h-4 text-primary" /> legal@houspire.ai
                </p>
                <p className="flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                  <Mail className="w-4 h-4 text-primary" /> hello@houspire.ai
                </p>
                <p className="flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                  <Mail className="w-4 h-4 text-primary" /> grievance@houspire.ai
                </p>
              </div>
              <div className="space-y-4">
                <p className="flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                  <MapPin className="w-4 h-4 text-primary" /> Plot no 67, Road no. 4, Prashasan Nagar, Jubilee Hills, Hyderabad- 500033
                </p>
              </div>
            </div>
          </Section>
<br /><br />
          <Section title="22. ACKNOWLEDGMENT">
            <p>By clicking "I Accept" or using our Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy and Refund Policies, and that you are at least 18 years of age.</p>
          </Section>

          <div className="mt-40 text-center pb-20">
            <Heart className="w-6 h-6 text-primary/20 mx-auto mb-8 animate-pulse" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-1">
              {legalEntity}
            </p>
            <p className="text-[9px] text-gray-400 font-medium">
              EST. 2024 • HYDERABAD, INDIA
            </p>
            <p className="text-[8px] text-gray-400/50 mt-4 uppercase">© 2026 All Rights Reserved</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
