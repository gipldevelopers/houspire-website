'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead';
import {
  ArrowLeft,
  Star,
  Users,
  Briefcase,
  Check,
  X,
  Scale,
  Sparkles,
} from 'lucide-react';
import { getStaticStyleBySlug } from '@/lib/frontend-data';

import { Suspense } from 'react';

function StyleCompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);

  const styleSlugs = (searchParams.get('styles') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  useEffect(() => {
    if (styleSlugs.length === 0) {
      router.replace('/styles');
      return;
    }
    fetchStyles();
  }, [styleSlugs.join(',')]);

  const fetchStyles = async () => {
    if (styleSlugs.length === 0) return;
    try {
      setLoading(true);
      const results = styleSlugs.map((slug) => getStaticStyleBySlug(slug));
      setStyles(results.filter(Boolean));
    } catch (err) {
      console.error('Error fetching styles for compare:', err);
      setStyles([]);
    } finally {
      setLoading(false);
    }
  };

  const allFeatures = Array.from(
    new Set(styles.flatMap((s) => s.key_features || []))
  );
  const allIdealFor = Array.from(
    new Set(styles.flatMap((s) => s.ideal_for || []))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-muted rounded w-1/3" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-video bg-muted rounded-xl" />
                  <div className="h-6 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (styles.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground mb-4">
            No styles found to compare. Select styles from the gallery.
          </p>
          <Button asChild>
            <Link href="/styles">Browse Styles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Compare Design Styles | Houspire"
        description="Compare different interior design styles side by side to find your perfect match."
      />

      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href="/styles">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <Scale className="w-7 h-7 text-primary" />
                Compare Design Styles
              </h1>
              <p className="text-muted-foreground">
                Comparing {styles.length} style{styles.length !== 1 ? 's' : ''}{' '}
                side by side
              </p>
            </div>
          </div>

          {/* Comparison Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Style Headers */}
              <div
                className="grid gap-4 mb-6"
                style={{ gridTemplateColumns: `repeat(${styles.length}, 1fr)` }}
              >
                {styles.map((style) => (
                  <Card key={style.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      {style.cover_image_url ? (
                        <img
                          src={style.cover_image_url}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                      )}
                      {style.is_featured && (
                        <Badge className="absolute top-3 left-3 bg-primary">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{style.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {style.tagline}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Stats Comparison */}
              <Card className="mb-4 overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="font-semibold">Key Stats</h3>
                </div>
                <div className="divide-y">
                  <div
                    className="grid items-center"
                    style={{
                      gridTemplateColumns: `150px repeat(${styles.length}, 1fr)`,
                    }}
                  >
                    <div className="p-4 flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      Designers
                    </div>
                    {styles.map((style) => (
                      <div
                        key={style.id}
                        className="p-4 text-center font-semibold"
                      >
                        {style.designer_count ?? 0}
                      </div>
                    ))}
                  </div>
                  <div
                    className="grid items-center"
                    style={{
                      gridTemplateColumns: `150px repeat(${styles.length}, 1fr)`,
                    }}
                  >
                    <div className="p-4 flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      Projects
                    </div>
                    {styles.map((style) => (
                      <div
                        key={style.id}
                        className="p-4 text-center font-semibold"
                      >
                        {(style.total_projects ?? 0).toLocaleString()}
                      </div>
                    ))}
                  </div>
                  <div
                    className="grid items-center"
                    style={{
                      gridTemplateColumns: `150px repeat(${styles.length}, 1fr)`,
                    }}
                  >
                    <div className="p-4 flex items-center gap-2 text-muted-foreground">
                      <Star className="w-4 h-4" />
                      Rating
                    </div>
                    {styles.map((style) => (
                      <div key={style.id} className="p-4 text-center">
                        <span className="font-semibold">
                          {style.avg_rating != null
                            ? Number(style.avg_rating).toFixed(1)
                            : '—'}
                        </span>
                        {style.avg_rating != null && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 inline ml-1" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div
                    className="grid items-center"
                    style={{
                      gridTemplateColumns: `150px repeat(${styles.length}, 1fr)`,
                    }}
                  >
                    <div className="p-4 flex items-center gap-2 text-muted-foreground">
                      <span className="font-bold">₹</span>
                      Starting
                    </div>
                    {styles.map((style) => (
                      <div
                        key={style.id}
                        className="p-4 text-center font-semibold text-primary"
                      >
                        ₹{(style.trial_price ?? 499).toLocaleString()}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Features Comparison */}
              {allFeatures.length > 0 && (
                <Card className="mb-4 overflow-hidden">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-semibold">Key Features</h3>
                  </div>
                  <div className="divide-y">
                    {allFeatures.map((feature) => (
                      <div
                        key={feature}
                        className="grid items-center"
                        style={{
                          gridTemplateColumns: `200px repeat(${styles.length}, 1fr)`,
                        }}
                      >
                        <div className="p-4 text-sm text-muted-foreground">
                          {feature}
                        </div>
                        {styles.map((style) => (
                          <div
                            key={style.id}
                            className="p-4 text-center flex justify-center"
                          >
                            {style.key_features?.includes(feature) ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : (
                              <X className="w-5 h-5 text-muted-foreground/30" />
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Ideal For Comparison */}
              {allIdealFor.length > 0 && (
                <Card className="mb-8 overflow-hidden">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-semibold">Ideal For</h3>
                  </div>
                  <div className="divide-y">
                    {allIdealFor.map((item) => (
                      <div
                        key={item}
                        className="grid items-center"
                        style={{
                          gridTemplateColumns: `200px repeat(${styles.length}, 1fr)`,
                        }}
                      >
                        <div className="p-4 text-sm text-muted-foreground">
                          {item}
                        </div>
                        {styles.map((style) => (
                          <div
                            key={style.id}
                            className="p-4 text-center flex justify-center"
                          >
                            {style.ideal_for?.includes(item) ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : (
                              <X className="w-5 h-5 text-muted-foreground/30" />
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Action Buttons */}
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${styles.length}, 1fr)` }}
              >
                {styles.map((style) => (
                  <Button key={style.id} asChild className="w-full h-12">
                    <Link href={`/styles/${style.slug}`}>
                      Explore {style.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function StyleComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <StyleCompareContent />
    </Suspense>
  );
}
