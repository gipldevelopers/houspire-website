'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Instagram, MessageCircle } from 'lucide-react';
import CookiePreferencesDialog from '@/components/CookiePreferencesDialog';
import { HOUSPIRE_HOME_URL } from '@/lib/external-links';
import { PlanningWizardModal } from '@/components/wizard/PlanningWizardModal';

const LOGO_SRC = '/icons/logo%20(1).webp';

function DesktopLinksSection({ title, links }) {
  return (
    <div className="hidden md:block md:col-span-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.path} className="text-sm text-foreground hover:text-primary transition-colors">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileLinksSection({ title, links }) {
  return (
    <details className="group md:hidden rounded-2xl border border-border/60 bg-background/40 px-4 py-3">
      <summary className="flex items-center justify-between gap-3 cursor-pointer select-none">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <ul className="mt-3 space-y-3 pb-1">
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.path} className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function Footer() {
  const [showCookiePreferences, setShowCookiePreferences] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productLinks = [
    { name: 'How it works', path: '/how-it-works' },
    { name: 'Pricing', path: '/select-package' },
    { name: 'Gallery', path: '/discover' },
    { name: 'Style Quiz', path: HOUSPIRE_HOME_URL },
    { name: 'Styles', path: '/styles' },
    { name: 'Tools', path: '/tools' },
  ];

  const companyLinks = [
    { name: 'About', path: '/about' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Blog', path: '/blog' },
    { name: 'Refer & Earn', path: '/referrals' },
    { name: 'Help Center', path: '/help' },
    { name: 'Contact', path: '/contact' },
  ];

  const legalLinks = [
    { name: 'Terms', path: '/terms' },
    { name: 'Privacy', path: '/privacy' },
    { name: 'Refund', path: '/refund-policy' },
    { name: 'Cookies', path: '/cookie-policy' },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/houspire.ai/', label: 'Instagram' },
    { icon: MessageCircle, href: 'https://api.whatsapp.com/send/?phone=917075827625&text=Hi%2C+I%27m+interested+in+Houspire%27s+interior+design+services.+Can+you+help+me+get+started%3F&type=phone_number&app_absent=0', label: 'WhatsApp' },
  ];

  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="container mx-auto px-6">
        <div className="py-12 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-4">
            <Link href="/" className="inline-block">
              <img src={LOGO_SRC} alt="Houspire" className="h-7 w-auto object-contain" />
            </Link>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-sm font-medium">
              Photorealistic designs, itemized budgets, and clear execution plans delivered in 72 hours.
            </p>

            <div className="flex gap-3 mt-5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <DesktopLinksSection title="Product" links={productLinks} />
          <DesktopLinksSection title="Company" links={companyLinks} />
          <DesktopLinksSection title="Legal" links={legalLinks} />

          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Get Started
            </h4>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-primary btn-sm"
            >
              Start my home plan
            </button>
            <p className="mt-4 text-xs text-muted-foreground">Expert curation · Transparency · Speed</p>
          </div>

          <div className="md:hidden space-y-3">
            <MobileLinksSection title="Product" links={productLinks} />
            <MobileLinksSection title="Company" links={companyLinks} />
            <MobileLinksSection title="Legal" links={legalLinks} />
          </div>
        </div>

        <div className="py-5 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} Houspire. All rights reserved.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Terms
              </Link>
              <button
                onClick={() => setShowCookiePreferences(true)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Cookie Preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      <CookiePreferencesDialog
        isOpen={showCookiePreferences}
        onClose={() => setShowCookiePreferences(false)}
        onSave={() => setShowCookiePreferences(false)}
      />
      <PlanningWizardModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </footer>
  );
}
