'use client';

import { useEffect } from 'react';

const DEFAULT_TITLE = 'Houspire — Professional Interior Design Starting at ₹499';
const DEFAULT_DESCRIPTION = 'We use advanced design technology and expert curation to give you everything you need to execute your dream home — photorealistic room designs, itemized budgets, shopping lists, and verified contractor connections — all delivered in 72 hours at a fraction of what traditional designers charge.';
const DEFAULT_IMAGE = 'https://houspire.com/og-image.jpg';
const SITE_NAME = 'Houspire';

export function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  keywords = ['interior design', 'home decor', 'room design', 'photorealistic design', 'affordable design', 'India'],
  author = 'Houspire',
  noIndex = false,
  canonical,
  schema,
}) {
  const fullTitle = title
    ? title.endsWith(`| ${SITE_NAME}`) ? title : `${title} | ${SITE_NAME}`
    : DEFAULT_TITLE;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000');
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    // Set document title
    document.title = fullTitle;

    // Set or update meta tags
    const setMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Primary meta tags
    setMetaTag('title', fullTitle);
    setMetaTag('description', description);
    setMetaTag('keywords', keywords.join(', '));
    setMetaTag('author', author);
    setMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMetaTag('googlebot', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMetaTag('theme-color', '#E8662E');
    setMetaTag('apple-mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    setMetaTag('apple-mobile-web-app-title', SITE_NAME);
    setMetaTag('language', 'English');

    // Open Graph
    setMetaTag('og:type', type, true);
    setMetaTag('og:url', currentUrl, true);
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:site_name', SITE_NAME, true);

    // Twitter
    setMetaTag('twitter:card', 'summary_large_image', true);
    setMetaTag('twitter:url', currentUrl, true);
    setMetaTag('twitter:title', fullTitle, true);
    setMetaTag('twitter:description', description, true);
    setMetaTag('twitter:image', image, true);
    setMetaTag('twitter:site', '@houspire');

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalUrl) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);
    } else if (canonicalLink) {
      canonicalLink.remove();
    }
  }, [fullTitle, description, image, url, type, keywords, author, noIndex, canonicalUrl, currentUrl]);

  return (
    <>
      {/* Structured Data / Schema.org */}
      {schema && (
        Array.isArray(schema) ? (
          schema.map((s, index) => (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
            />
          ))
        ) : (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )
      )}
    </>
  );
}

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: undefined,
    description: 'Photorealistic room designs, itemized budgets, and verified contractor connections — delivered in 72 hours. Professional interior design intelligence for Indian homeowners.',
    keywords: ['interior design', 'home decor', 'affordable design', 'photorealistic room designs', 'India', 'room makeover'],
  },
  discover: {
    title: 'Discover Designs',
    description: 'Browse professional interior designs. Filter by room type, style, and budget. Get inspired and find your dream design today.',
    keywords: ['interior design gallery', 'design inspiration', 'room ideas', 'modern design', 'traditional Indian'],
  },
  pricing: {
    title: 'Pricing',
    description: 'Professional interior design packages from ₹499. Choose from Starter, Home Design, Complete Home, or Premium plans. 72-hour delivery with money-back guarantee.',
    keywords: ['interior design pricing', 'affordable design', 'design packages', 'room design cost'],
  },
  dashboard: {
    title: 'My Dashboard',
    description: 'Track your interior design project progress. View concepts, provide feedback, and download your design package.',
    noIndex: true,
  },
  checkout: {
    title: 'Checkout',
    description: 'Complete your order and start your interior design journey. Secure payment with Razorpay.',
    noIndex: true,
  },
  intake: {
    title: 'Design Brief',
    description: 'Tell us about your space. Upload photos, share your style preferences, and get matched with your design team.',
    noIndex: true,
  },
  login: {
    title: 'Login',
    description: 'Sign in to your Houspire account to access your projects and design packages.',
    noIndex: true,
  },
};
