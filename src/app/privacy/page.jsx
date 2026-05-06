"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ShieldCheck, Clock, RefreshCw, Heart,
  Lock, Eye, Database, Globe, Scale, Cookie,
  UserCheck, FileText, Mail, MapPin, AlertTriangle, Shield
} from 'lucide-react';

const PrivacyPolicyPage = () => {
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
            <ShieldCheck className="w-3 h-3" /> DPDP Compliant
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed">
            Protecting your personal data is our primary commitment. This policy explains how we collect, use, and safe-guard your information in compliance with the Digital Personal Data Protection Act, 2023.
          </p>
          <div className="flex flex-wrap gap-6 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Effective: {effectiveDate}</span>
            <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Updated: {lastUpdatedDate}</span>
          </div>
        </header>

        {/* Content */}
        <div className="space-y-4">

          <Section title="1. INTRODUCTION">
            <p>Houspire (brand of {legalEntity}) explains how we collect, use, store, and protect your personal data in compliance with the <strong>Digital Personal Data Protection Act, 2023 ("DPDP Act")</strong> and other applicable laws of India.</p>
            <p>Consent is obtained through explicit affirmative action while using our website ({websiteUrl}), mobile application, or services.</p>
          </Section>

          <Section title="2. DATA FIDUCIARY INFORMATION">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
              <div className="space-y-4">
                <Subtitle>Legal Entity</Subtitle>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{legalEntity}</p>
                <p className="text-xs text-muted-foreground">Plot no 67, Road no. 4, Prashasan Nagar, Jubilee Hills, Hyderabad - 500033</p>
                <p className="text-xs text-muted-foreground">CIN: U74100TS2025PTC204928</p>
              </div>
              <div className="space-y-4">
                <Subtitle>Grievance Officer</Subtitle>
                <p className="text-sm font-bold text-primary">grievance@houspire.ai</p>
                <p className="text-xs text-muted-foreground">Response Time: Within 72 hours</p>
              </div>
            </div>
          </Section>
<br></br> <br />
          <Section title="3. PERSONAL DATA WE COLLECT">
            <Subtitle>3.1 Information You Provide Directly</Subtitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { t: "Account Registration", d: "Name, email, phone number, and encrypted password." },
                { t: "Project Details", d: "Property address, type, room details, and design preferences." },
                { t: "Files Uploaded", d: "Floor plans (PDF/IMG), reference images, and property photos." },
                { t: "Payment Data", d: "Transaction IDs and method used. We do NOT store card details." }
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-gray-50/30 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                  <p className="font-bold text-gray-900 dark:text-white text-[10px] uppercase tracking-widest mb-2 text-primary">{item.t}</p>
                  <p className="text-sm">{item.d}</p>
                </div>
              ))}
            </div>

            <Subtitle>3.2 Information Collected Automatically</Subtitle>
            <p className="text-sm">We collect device identifiers, IP addresses, browser versions, and usage patterns to optimize Platform performance and security.</p>

            <Subtitle>3.3 Children's Data</Subtitle>
            <div className="p-6 bg-red-50/50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/10">
              <p className="text-red-700 dark:text-red-400 font-bold mb-3 flex items-center gap-2 uppercase tracking-tight text-xs">
                <AlertTriangle className="w-4 h-4" /> WE DO NOT KNOWINGLY COLLECT DATA FROM PERSONS UNDER 18
              </p>
              <p className="text-xs text-red-600/70">If we become aware that data of a minor has been collected without verifiable parental consent, we will take immediate steps to secure and delete such information.</p>
            </div>
          </Section>
<br></br> <br />
          <Section title="4. HOW WE USE YOUR PERSONAL DATA">
            <div className="space-y-4">
              <p><strong>4.1 Service Delivery:</strong> Match you with designers, send confirmations, and deliver final design renders and budget documents.</p>
              <p><strong>4.2 Payment Processing:</strong> Generate invoices via Razorpay and handle refunds as per our policy.</p>
              <p><strong>4.3 Marketing:</strong> Send newsletters and promotional offers <strong>only</strong> with your explicit consent.</p>
            </div>
          </Section>
<br></br> <br />
          <Section title="5. DATA SHARING AND DISCLOSURE">
            <Subtitle>5.1 With Service Providers</Subtitle>
            <ul className="space-y-3 text-sm">
              <li>• <strong>Razorpay:</strong> Encrypted payment processing (India)</li>
              <li>• <strong>Supabase:</strong> Secure cloud database storage (Mumbai Region)</li>
              <li>• <strong>AWS/Cloudflare:</strong> Secure file delivery and CDN protection</li>
            </ul>
            <Subtitle>5.2 Our Stance on Privacy</Subtitle>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="px-3 py-1 rounded-full bg-primary/5">No Selling of Data</span>
              <span className="px-3 py-1 rounded-full bg-primary/5">No Data Brokers</span>
              <span className="px-3 py-1 rounded-full bg-primary/5">Strict NDA for Designers</span>
            </div>
          </Section>
<br></br> <br />
          <Section title="6. DATA RETENTION">
            <div className="space-y-4 text-sm">
              <p className="flex justify-between border-b border-gray-50 dark:border-white/5 py-2">
                <span>Account Information</span>
                <span className="font-bold text-gray-900 dark:text-white">Until account deletion</span>
              </p>
              <p className="flex justify-between border-b border-gray-50 dark:border-white/5 py-2">
                <span>Order Records</span>
                <span className="font-bold text-gray-900 dark:text-white">7 years (Tax compliance)</span>
              </p>
              <p className="flex justify-between border-b border-gray-50 dark:border-white/5 py-2">
                <span>Design Deliverables</span>
                <span className="font-bold text-gray-900 dark:text-white">1 year after delivery</span>
              </p>
            </div>
          </Section>
<br></br> <br />
          <Section title="7. DATA SECURITY">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { i: Lock, t: "Encryption", d: "SSL/TLS transit and AES-256 resting bit encryption." },
                { i: Shield, t: "Infrastructure", d: "Secured via Supabase cloud with regular patches." },
                { i: UserCheck, t: "Access Control", d: "Role-based access with multi-factor authentication." }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <item.i className="w-5 h-5 text-primary" />
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{item.t}</p>
                  <p className="text-xs text-muted-foreground">{item.d}</p>
                </div>
              ))}
            </div>
          </Section>
<br></br> <br />
          <Section title="8. YOUR RIGHTS">
            <div className="space-y-6">
              <div className="flex gap-4 p-5 rounded-2xl border border-primary/10 bg-primary/5">
                <Database className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm mb-1 uppercase tracking-tight">Self-Service Portability</p>
                  <p className="text-sm">Login to your dashboard to <strong>Access, Export, or Correct</strong> your data immediately.</p>
                </div>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm list-disc pl-5">
                <li>Right to Access & Export data</li>
                <li>Right to Correction & Updates</li>
                <li>Right to Erasure (Acc. Deletion)</li>
                <li>Right to Nominate (post-incapacity)</li>
                <li>Right to Withdraw Consent</li>
                <li>Right to data portability</li>
              </ul>
            </div>
          </Section>
<br></br> <br />
          <Section title="9. CONTACT INFORMATION">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                  <Mail className="w-4 h-4 text-primary" /> privacy@houspire.ai
                </p>
                <p className="flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                  <Mail className="w-4 h-4 text-primary" /> contact@houspire.ai
                </p>
              </div>
              <div className="space-y-4">
                <p className="flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                  <MapPin className="w-4 h-4 text-primary" /> Plot no 67, Road no. 4, Prashasan Nagar, Jubilee Hills, Hyderabad- 500033
                </p>
              </div>
            </div>
          </Section>
<br></br> <br />
          <Section title="10. CONSENT">
            <p className="text-sm">By using our platform, you acknowledge that you have read this Privacy Policy and explicitly consent to the collection, usage, and sharing as described. You may withdraw consent at any time via your dashboard settings.</p>
          </Section>

          <div className="mt-40 text-center pb-20">
            <Heart className="w-6 h-6 text-primary/20 mx-auto mb-8 animate-pulse" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-1">
              © 2026 {legalEntity}
            </p>
            <p className="text-[9px] text-gray-400 font-medium tracking-widest">
              HYDERABAD, INDIA • VERSION 1.0
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
