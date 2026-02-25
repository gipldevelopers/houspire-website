'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import CookiePreferencesDialog from '@/components/CookiePreferencesDialog';

const LOGO_SRC = '/icons/logo%20(1).webp';

export function Footer() {
  const [showCookiePreferences, setShowCookiePreferences] = useState(false);

  const productLinks = [
    { name: 'How it works', path: '/how-it-works' },
    { name: 'Pricing', path: '/select-package' },
    { name: 'Gallery', path: '/discover' },
    { name: 'Style Quiz', path: '/style-quiz' },
  ];

  const companyLinks = [
    { name: 'About', path: '/about' },
    { name: 'Reviews', path: '/reviews' },
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
    { icon: Instagram, href: 'https://instagram.com/houspire', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/houspire', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/houspire', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com/@houspire', label: 'YouTube' },
  ];

  return (
    <footer className="bg-muted/50 text-foreground border-t border-border">
      <div className="container mx-auto px-6">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6">
          {/* Brand - Takes 4 columns */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block">
              <img src={LOGO_SRC} alt="Houspire" className="h-7 w-auto object-contain" />
            </Link>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed max-w-xs">
              Professional design intelligence for Indian homeowners. Photorealistic room designs, itemized budgets, and verified contractors — delivered in 72 hours.
            </p>

            {/* Social Links */}
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
                    className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA / Newsletter */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Get Started
            </h4>
            <Link
              href="/style-quiz"
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20 transition-all duration-300"
            >
              Take Style Quiz
            </Link>
            <p className="mt-4 text-xs text-muted-foreground">
              Free • 2 minutes • No signup required
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-5 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Houspire. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
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
    </footer>
  );
}
