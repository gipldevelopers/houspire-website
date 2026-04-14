'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/layout/Container';
import { SEOHead } from '@/components/SEOHead';
import { ArrowLeft, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getStaticDesignById } from '@/lib/frontend-data';

function formatLabel(text) {
  return (text || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DiscoverDesignPage() {
  const params = useParams();
  const id = params?.id;

  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    try {
      const data = getStaticDesignById(id);
      setDesign(data);
    } catch {
      setDesign(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (design) setImageIndex(0);
  }, [design?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <Container>
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="aspect-[4/3] bg-muted rounded-xl" />
            <div className="h-8 w-3/4 bg-muted rounded" />
          </div>
        </Container>
      </div>
    );
  }

  if (!design) {
    notFound();
  }

  const allImages = [
    design.cover_image_url || design.cloudinary_url,
    ...(design.render_urls || []),
  ].filter(Boolean);

  const currentImage = allImages[imageIndex] || allImages[0];

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: design.design_title,
        text: design.design_description || 'Check out this design from Houspire',
        url: typeof window !== 'undefined' ? window.location.href : '',
      });
    } else if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
    }
  };

  return (
    <>
      <SEOHead
        title={`${design.design_title} | Design Gallery | Houspire`}
        description={design.design_description || design.design_title}
      />

      <div className="min-h-screen bg-background pt-24">
        <Container>
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/discover">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Images */}
            <div className="lg:col-span-3">
              <Card className="overflow-hidden">
                <div className="relative aspect-[4/3] bg-muted">
                  <img
                    src={currentImage || '/placeholder.svg'}
                    alt={design.design_title}
                    className="w-full h-full object-cover"
                  />
                  {allImages.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                        onClick={() =>
                          setImageIndex((i) =>
                            i === 0 ? allImages.length - 1 : i - 1
                          )
                        }
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                        onClick={() =>
                          setImageIndex((i) =>
                            i === allImages.length - 1 ? 0 : i + 1
                          )
                        }
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                      <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                        {imageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </div>
                <div className="p-3 flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    Designed by Houspire
                  </span>
                </div>
              </Card>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                {design.is_featured && (
                  <Badge className="mb-3">Featured</Badge>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {design.design_title}
                </h1>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary">
                    {formatLabel(design.room_type)}
                  </Badge>
                  <Badge variant="secondary">
                    {formatLabel(design.style_primary)}
                  </Badge>
                  {design.budget_range && (
                    <Badge variant="outline">
                      {formatLabel(design.budget_range)}
                    </Badge>
                  )}
                </div>
              </div>

              {design.design_description && (
                <p className="text-muted-foreground leading-relaxed">
                  {design.design_description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="flex-1">
                  <Link href={`/select-package?reference=${design.id}`}>
                    Get This Design
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                  className="flex-1 sm:flex-none"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              <Card className="p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Get professional 4K renders, a detailed shopping list, and
                  budget breakdown. Starting at ₹499 per room.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
