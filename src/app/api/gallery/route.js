import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_GALLERY_DESIGNS } from '@/lib/fallback-gallery';

// Map Prisma camelCase to frontend snake_case and add cloudinary_url alias
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

// GET /api/gallery - Get gallery designs with filters
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const roomType = searchParams.get('roomType');
  const style = searchParams.get('style');
  const budgetRange = searchParams.get('budgetRange');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const emptyResponse = () =>
    NextResponse.json({
      designs: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    });

  try {
    const where = {
      isPublished: true,
      ...(roomType && { roomType }),
      ...(style && { stylePrimary: style }),
      ...(budgetRange && { budgetRange }),
    };

    const [rows, total] = await Promise.all([
      prisma.galleryDesign.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isFeatured: 'desc' },
          { viewCount: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      prisma.galleryDesign.count({ where }),
    ]);

    const designs = rows.map(mapDesignToFrontend).filter(Boolean);

    // If DB returned no rows, serve fallback demo designs so gallery shows images
    if (designs.length === 0 && page === 1) {
      let list = FALLBACK_GALLERY_DESIGNS;
      if (roomType) list = list.filter((d) => d.room_type === roomType);
      if (style) list = list.filter((d) => d.style_primary === style);
      if (budgetRange) list = list.filter((d) => d.budget_range === budgetRange);
      const totalFallback = list.length;
      const paginated = list.slice(skip, skip + limit);
      return NextResponse.json({
        designs: paginated,
        pagination: {
          page,
          limit,
          total: totalFallback,
          totalPages: Math.ceil(totalFallback / limit) || 1,
        },
      });
    }

    return NextResponse.json({
      designs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    let list = FALLBACK_GALLERY_DESIGNS;
    if (roomType) list = list.filter((d) => d.room_type === roomType);
    if (style) list = list.filter((d) => d.style_primary === style);
    if (budgetRange) list = list.filter((d) => d.budget_range === budgetRange);
    const totalFallback = list.length;
    const paginated = list.slice(skip, skip + limit);
    return NextResponse.json({
      designs: paginated,
      pagination: {
        page,
        limit,
        total: totalFallback,
        totalPages: Math.ceil(totalFallback / limit) || 1,
      },
    });
  }
}
