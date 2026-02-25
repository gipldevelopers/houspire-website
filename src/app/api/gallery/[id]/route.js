import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_GALLERY_DESIGNS } from '@/lib/fallback-gallery';

function mapDesignToFrontend(d) {
  if (!d) return null;
  return {
    id: d.id,
    design_title: d.designTitle,
    design_description: d.designDescription ?? undefined,
    room_type: d.roomType,
    style_primary: d.stylePrimary,
    budget_range: d.budgetRange,
    cover_image_url: d.coverImageUrl,
    cloudinary_url: d.coverImageUrl,
    is_featured: d.isFeatured,
    render_urls: d.renderUrls ?? [],
    view_count: d.viewCount,
    created_at: d.createdAt,
  };
}

// GET /api/gallery/[id] - Get one gallery design by id
export async function GET(request, { params }) {
  const resolved = await Promise.resolve(params);
  const id = resolved?.id;
  if (!id) {
    return NextResponse.json({ error: 'Id required' }, { status: 400 });
  }

  try {
    const row = await prisma.galleryDesign.findFirst({
      where: { id: String(id), isPublished: true },
    });
    if (row) {
      return NextResponse.json(mapDesignToFrontend(row));
    }

    const fallback = FALLBACK_GALLERY_DESIGNS.find((d) => d.id === id);
    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ error: 'Design not found' }, { status: 404 });
  } catch (error) {
    console.error('Get gallery design by id error:', error);
    const fallback = FALLBACK_GALLERY_DESIGNS.find((d) => d.id === id);
    if (fallback) {
      return NextResponse.json(fallback);
    }
    return NextResponse.json({ error: 'Design not found' }, { status: 404 });
  }
}
