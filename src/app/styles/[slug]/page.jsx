'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEOHead } from '@/components/SEOHead';
import {
  Star,
  Users,
  Briefcase,
  ArrowLeft,
  Check,
  Home,
  Share2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getStaticStyleBySlug } from '@/lib/frontend-data';

export default function StyleSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [style, setStyle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    try {
      const data = getStaticStyleBySlug(slug);
      setStyle(data);
    } catch {
      setStyle(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (style && style.portfolio_images?.length) {
      setCurrentImageIndex(0);
    }
  }, [style?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="h-96 bg-muted rounded-3xl" />
            <div className="h-8 w-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!style) {
    notFound();
  }

  const nextImage = () => {
    if (style.portfolio_images?.length) {
      setCurrentImageIndex((prev) =>
        prev === style.portfolio_images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (style.portfolio_images?.length) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? style.portfolio_images.length - 1 : prev - 1
      );
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `${style.name} | Houspire`,
        url: window.location.href,
        text: style.tagline,
      });
    }
  };

  return (
    <>
      <SEOHead
        title={`${style.name} Interior Design | Houspire`}
        description={style.description?.slice(0, 160) || style.tagline}
      />

      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/styles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Styles
            </Link>
          </Button>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[500px]">
              <img
                src={style.cover_image_url || '/placeholder.svg'}
                alt={style.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-end">
                <div className="p-8 md:p-12 w-full">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      {style.is_featured && (
                        <Badge className="mb-4 bg-amber-500/90 text-white border-0">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Featured Style
                        </Badge>
                      )}
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
                        {style.name}
                      </h1>
                      <p className="text-xl md:text-2xl text-white/90 mb-4">
                        {style.tagline}
                      </p>
                      <div className="flex flex-wrap gap-4 text-white/80">
                        {(style.avg_rating != null) && (
                          <div className="flex items-center gap-1">
                            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                            {Number(style.avg_rating).toFixed(1)}
                            <span className="text-white/60">
                              ({style.total_reviews ?? 0} reviews)
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-5 w-5" />
                          {style.designer_count} Expert Designers
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-5 w-5" />
                          {(style.total_projects ?? 0).toLocaleString()} Projects
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={handleShare}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Bar */}
          <Card className="mb-8 p-6 border-2 border-primary/20 bg-primary/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Ready to Transform Your Space?
                </h3>
                <p className="text-muted-foreground">
                  Get AI-powered {style.name} designs delivered in 24–72 hours
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="text-2xl font-bold text-foreground">₹499</p>
                  <p className="text-sm text-muted-foreground">per room</p>
                </div>
                <Button asChild size="lg" className="rounded-xl px-8 h-14">
                  <Link href="/select-package">Get Your Design</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      About This Style
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {style.description}
                    </p>
                  </Card>

                  {style.key_features?.length > 0 && (
                    <Card className="p-8">
                      <h2 className="text-2xl font-bold text-foreground mb-6">
                        Key Features
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {style.key_features.map((feature, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-4 rounded-xl bg-muted/50"
                          >
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {style.ideal_for?.length > 0 && (
                    <Card className="p-8">
                      <h2 className="text-2xl font-bold text-foreground mb-6">
                        Perfect For
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {style.ideal_for.map((item, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="px-4 py-2 text-sm"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  )}

                  <Card className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      Popular Room Types
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {(style.room_types || []).map((room, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                        >
                          <Home className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{room}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      What to Expect
                    </h3>
                    <div className="space-y-4">
                      {(style.avg_rating != null) && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Average Rating
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-semibold">
                              {Number(style.avg_rating).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Total Projects
                        </span>
                        <span className="font-semibold">
                          {(style.total_projects ?? 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Expert Designers
                        </span>
                        <span className="font-semibold">
                          {style.designer_count}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Price Range
                        </span>
                        <span className="font-semibold text-sm">
                          ₹{(style.trial_price ?? 0).toLocaleString()}–
                          {(style.max_package_price ?? 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Portfolio Gallery
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Explore {style.name} project examples
                  </p>
                </div>

                {style.portfolio_images?.length > 0 ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden">
                      <img
                        src={
                          style.portfolio_images[currentImageIndex] ||
                          '/placeholder.svg'
                        }
                        alt={`${style.name} portfolio ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {style.portfolio_images.length}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                      {style.portfolio_images.map((img, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex
                              ? 'border-primary scale-105'
                              : 'border-border opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img || '/placeholder.svg'}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card className="p-12 text-center max-w-2xl mx-auto">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">
                      Portfolio Coming Soon
                    </h3>
                    <p className="text-muted-foreground">
                      We&apos;re curating the best {style.name} examples. Check
                      back soon!
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pricing">
              <div className="max-w-2xl mx-auto">
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Design Packages
                  </h2>
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-primary/5 border-2 border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          Trial
                        </h3>
                        <Badge className="bg-success text-white">
                          100% Money-Back
                        </Badge>
                      </div>
                      <p className="text-3xl font-bold text-foreground mb-2">
                        ₹499
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        1 room • 4K renders • 48hr delivery
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          Professional 4K design renders
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          Complete shopping list
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          Detailed budget breakdown
                        </li>
                      </ul>
                    </div>
                    <Button asChild size="lg" className="w-full">
                      <Link href="/select-package">Get Your Design</Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
