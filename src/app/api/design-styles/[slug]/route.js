import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_DESIGN_STYLES } from '@/lib/fallback-design-styles';

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

// GET /api/design-styles/[slug] - Get one design style by slug
export async function GET(request, { params }) {
  const resolved = await Promise.resolve(params);
  const slug = resolved?.slug;
  if (!slug) {
    return NextResponse.json({ error: 'Slug required' }, { status: 400 });
  }

  try {
    const row = await prisma.designStyle.findFirst({
      where: { slug: String(slug) },
    });

    if (row) {
      return NextResponse.json(mapStyleToFrontend(row));
    }

    const fallback = FALLBACK_DESIGN_STYLES.find((s) => s.slug === slug);
    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ error: 'Style not found' }, { status: 404 });
  } catch (error) {
    console.error('Get design style by slug error:', error);
    const fallback = FALLBACK_DESIGN_STYLES.find((s) => s.slug === slug);
    if (fallback) {
      return NextResponse.json(fallback);
    }
    return NextResponse.json({ error: 'Style not found' }, { status: 404 });
  }
}
