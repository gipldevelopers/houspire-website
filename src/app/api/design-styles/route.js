import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_DESIGN_STYLES } from '@/lib/fallback-design-styles';

// Map Prisma camelCase to frontend shape (snake_case where expected)
function mapStyleToFrontend(s) {
  if (!s) return null;
  return {
    ...s,
    room_types: s.roomTypes ?? s.room_types ?? [],
    is_featured: s.isFeatured ?? s.is_featured ?? false,
    trial_price: s.trialPrice ?? s.trial_price,
    max_package_price: s.maxPackagePrice ?? s.max_package_price,
  };
}

// GET /api/design-styles - Get all design styles
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured') === 'true';

  try {
    const where = {};
    if (featured) {
      where.isFeatured = true;
    }

    const rows = await prisma.designStyle.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    const styles = rows.map(mapStyleToFrontend).filter(Boolean);

    // If DB returned no rows, serve fallback demo styles so /styles page shows content
    if (styles.length === 0) {
      const list = featured ? FALLBACK_DESIGN_STYLES.filter((s) => s.is_featured) : FALLBACK_DESIGN_STYLES;
      return NextResponse.json({ styles: list });
    }

    return NextResponse.json({ styles });
  } catch (error) {
    console.error('Get design styles error:', error);
    const list = featured ? FALLBACK_DESIGN_STYLES.filter((s) => s.is_featured) : FALLBACK_DESIGN_STYLES;
    return NextResponse.json({ styles: list });
  }
}
