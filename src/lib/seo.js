// SEO Schema.org structured data helpers

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Houspire',
  description: 'Professional interior design intelligence service. Photorealistic room designs, itemized budgets, and verified contractor connections — starting at ₹499.',
  url: 'https://houspire.com',
  logo: 'https://houspire.com/logo.png',
  image: 'https://houspire.com/og-image.png',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'support@houspire.com',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://facebook.com/houspire',
    'https://instagram.com/houspire',
    'https://twitter.com/houspire',
    'https://linkedin.com/company/houspire',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    addressCountry: 'IN',
  },
};

export function generateOrganizationSchema() {
  return organizationSchema;
}

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Interior Design',
  provider: {
    '@type': 'Organization',
    name: 'Houspire',
  },
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Interior Design Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '3D Interior Design Package',
          description: 'Complete interior design with 3D renders, materials, budget, and vendor recommendations',
        },
        price: '999',
        priceCurrency: 'INR',
      },
    ],
  },
};

export function generateServiceSchema() {
  return serviceSchema;
}

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const reviewSchema = (reviews) => {
  if (reviews.length === 0) return null;
  
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Houspire Interior Design Service',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.slice(0, 10).map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.user_name || review.reviewer_name || 'Anonymous',
      },
      datePublished: review.created_at,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.review_text,
    })),
  };
};

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://houspire.com',
  name: 'Houspire',
  image: 'https://houspire.com/og-image.png',
  email: 'support@houspire.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 17.385044,
    longitude: 78.486671,
  },
  url: 'https://houspire.com',
  priceRange: '₹₹',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '09:00',
    closes: '21:00',
  },
};
