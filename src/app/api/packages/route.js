import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Fallback packages when DB is empty or unavailable (matches how-it-works page shape)
const FALLBACK_PACKAGES = [
  { id: 'fb-trial', slug: 'trial', name: 'Trial', tagline: '1 room • See the quality', price: 999, roomCountDisplay: '1 room', revisionsIncluded: 1, revisionsDisplay: '1 revision', supportDays: 7, isPopular: true, isTrial: true },
  { id: 'fb-single', slug: 'single-room', name: 'Single Room', tagline: 'Perfect for one space', price: 4999, roomCountDisplay: '1 room', revisionsIncluded: 2, revisionsDisplay: '2 revisions', supportDays: 14, isPopular: false, isTrial: false },
  { id: 'fb-multi', slug: 'multi-room', name: 'Multi Room', tagline: '2–3 rooms', price: 9999, roomCountDisplay: '2–3 rooms', revisionsIncluded: 3, revisionsDisplay: '3 revisions', supportDays: 21, isPopular: false, isTrial: false },
  { id: 'fb-full', slug: 'full-home', name: 'Full Home', tagline: 'Whole home design', price: 14999, roomCountDisplay: 'Full home', revisionsIncluded: 5, revisionsDisplay: '5 revisions', supportDays: 30, isPopular: false, badgeText: 'BEST VALUE', isTrial: false },
];

// GET /api/packages - Get all packages
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100');
  const featured = searchParams.get('featured') === 'true';

  try {
    const where = { isActive: true };
    const rows = await prisma.subscriptionPlan.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      take: limit,
    });

    // Map Prisma shape to frontend shape if needed
    const packages = rows.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      tagline: p.description || `${p.designCreditsMonthly} room(s)`,
      price: p.priceMonthly,
      roomCountDisplay: `${p.designCreditsMonthly} room(s)`,
      revisionsIncluded: p.revisionLimit ?? 1,
      supportDays: 14,
      isPopular: p.isActive,
      isTrial: p.priceMonthly < 2000,
    }));

    if (packages.length > 0) {
      return NextResponse.json({ packages });
    }

    const list = featured ? FALLBACK_PACKAGES.filter((p) => p.isPopular) : FALLBACK_PACKAGES.slice(0, limit);
    return NextResponse.json({ packages: list });
  } catch (error) {
    console.error('Get packages error:', error);
    const list = featured ? FALLBACK_PACKAGES.filter((p) => p.isPopular) : FALLBACK_PACKAGES.slice(0, limit);
    return NextResponse.json({ packages: list });
  }
}
