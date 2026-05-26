'use client';

import Link from 'next/link';

const LOGO_SRC = '/icons/logo%20(1).webp';

const columns = [
  {
    title: 'Product',
    links: [
      { name: 'How it works', path: '/how-it-works' },
      { name: 'Pricing', path: '/select-package' },
      { name: 'Gallery', path: '/discover' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', path: '/about' },
      { name: 'Reviews', path: '/reviews' },
      { name: 'Help Center', path: '/help' },
      { name: 'Contact', path: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms', path: '/terms' },
      { name: 'Privacy', path: '/privacy' },
      { name: 'Refund', path: '/refund-policy' },
      { name: 'Cookies', path: '/cookie-policy' },
    ],
  },
];

const socials = ['Instagram', 'Twitter', 'LinkedIn', 'YouTube'];

export function DarkFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <img src={LOGO_SRC} alt="Houspire" className="h-7 w-auto object-contain" />
            <p className="text-xs text-muted-foreground mt-2 max-w-xs leading-relaxed">
              Professional design intelligence for Indian homeowners. Photorealistic room designs, itemized budgets, and verified contractors — delivered in 72 hours.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-foreground mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 Houspire. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Made with ♥ in India</span>
            <span className="text-xs text-border">·</span>
            {socials.map((s) => (
              <span key={s} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
