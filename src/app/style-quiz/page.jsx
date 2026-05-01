'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/Container';
import { dataGet } from '@/lib/frontend-data';
import { FALLBACK_DESIGN_STYLES } from '@/lib/fallback-design-styles';
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Clock,
  Eye,
  Palette,
  Sparkles,
  Users,
  Loader2,
  CheckCircle,
  ChevronRight,
  Shield,
  Mail,
  Zap,
} from 'lucide-react';

const STEPS = [
  { id: 'intro', title: 'Welcome' },
  { id: 'style', title: 'Your Style' },
  { id: 'colors', title: 'Colors' },
  { id: 'room', title: 'Room' },
  { id: 'results', title: 'Results' },
];

const COLOR_OPTIONS = [
  { id: 'neutrals', label: 'Neutrals & whites', desc: 'Calm, clean, timeless' },
  { id: 'warm', label: 'Warm tones', desc: 'Beige, terracotta, wood' },
  { id: 'bold', label: 'Bold & vibrant', desc: 'Pops of color, statement walls' },
  { id: 'mixed', label: 'Mixed & eclectic', desc: 'A bit of everything' },
];

const ROOM_OPTIONS = [
  'Living Room',
  'Bedroom',
  'Dining Room',
  'Home Office',
  'Kids Room',
  'Kitchen',
  'Balcony',
];

export default function StyleQuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [styles, setStyles] = useState([]);
  const [loadingStyles, setLoadingStyles] = useState(true);
  const [answers, setAnswers] = useState({
    styleSlug: null,
    styleName: null,
    colors: null,
    room: null,
  });

  useEffect(() => {
    async function load() {
      try {
        const { styles: data } = await dataGet('/design-styles');
        setStyles(Array.isArray(data) && data.length > 0 ? data : FALLBACK_DESIGN_STYLES);
      } catch {
        setStyles(FALLBACK_DESIGN_STYLES);
      } finally {
        setLoadingStyles(false);
      }
    }
    load();
  }, []);

  const handleNext = (payload = {}) => {
    setAnswers((prev) => ({ ...prev, ...payload }));
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const selectedStyle = styles.find((s) => s.slug === answers.styleSlug) || styles[0];
  const isQuizStep = step > 0 && step < STEPS.length - 1;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-primary-1)" }}>
      {isQuizStep && (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur">
          <Container className="py-3">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex gap-1">
                {STEPS.slice(1, -1).map((s, i) => (
                  <div
                    key={s.id}
                    className="h-1.5 w-8 rounded-full transition-colors"
                    style={{ backgroundColor: i + 1 <= step ? 'var(--color-primary)' : 'var(--color-border)' }}
                  />
                ))}
              </div>
              <span className="text-xs w-16 text-right opacity-60" style={{ color: 'var(--color-description)' }}>
                {step}/{STEPS.length - 2}
              </span>
            </div>
          </Container>
        </header>
      )}

      <Container className={`py-10 ${isQuizStep ? 'pt-8' : ''}`}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto text-center"
            >
              {/* Badge */}
              <div className="flex items-center justify-center gap-2 mt-16 mb-6">
                <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_12px_rgba(236,116,70,0.5)]" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--color-primary)' }}>
                  Takes only 2 minutes
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold tracking-tight mb-4 leading-tight" style={{ color: 'var(--color-heading-main)' }}>
                Discover Your Perfect Design Style
              </h1>
              <p className="text-base md:text-lg mb-8 max-w-xl mx-auto opacity-60" style={{ color: 'var(--color-description)' }}>
                Take our visual style quiz and unlock personalized design recommendations tailored to your taste, lifestyle, and budget.
              </p>

              {/* Key metrics */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-10">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">7</p>
                  <p className="text-sm text-muted-foreground">Quiz Steps</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">15</p>
                  <p className="text-sm text-muted-foreground">Design Styles</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">2 min</p>
                  <p className="text-sm text-muted-foreground">To Complete</p>
                </div>
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-10">
                {[
                  { icon: Eye, title: 'Visual, Not Technical', desc: 'Choose from beautiful images - no design jargon needed' },
                  { icon: Sparkles, title: 'AI-Powered Matching', desc: 'Our algorithm finds your perfect design style in seconds' },
                  { icon: Users, title: 'Expert Team Match', desc: 'Get connected with specialists in your matched style' },
                ].map(({ icon: Icon, title, desc }) => (
                  <Card key={title} className="p-5 border-border bg-card rounded-xl">
                    <div className="items-start gap-4">
                      <div className="rounded-xl bg-muted p-3 shrink-0">
                        <div className="rounded-lg p-2 flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}>
                          <Icon className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">{title}</p>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* What You'll Discover */}
              <Card className="p-6 md:p-8 border-border bg-card rounded-xl mb-8 text-left">
                <h3 className="text-lg font-semibold text-foreground text-center mb-6">What You&apos;ll Discover</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    'Your primary design style match',
                    'Personalized color palette recommendations',
                    'Team of style specialists ready to help',
                    'Alternative styles that suit you',
                    'Budget-aligned design approach',
                    'Saved profile for future projects',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="rounded-full border border-border bg-muted/50 p-1 shrink-0">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-foreground/70" />
                  <span className="text-sm font-medium text-foreground/90">100% Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-foreground/70" />
                  <span className="text-sm font-medium text-foreground/90">No Spam Ever</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-foreground/70" />
                  <span className="text-sm font-medium text-foreground/90">Instant Results</span>
                </div>
              </div>

              {/* CTA */}
              <button
                className="btn-primary gap-2 text-base px-8 h-12 rounded-lg font-medium flex items-center justify-center mx-auto"
                onClick={() => handleNext()}
              >
                <Plus className="h-5 w-5 mr-1" />
                Find My Style
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>

              <p className="text-xs text-muted-foreground mt-5">
                Free • No signup required • Instant results
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="style"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-2xl font-semibold mb-2">Which style speaks to you?</h2>
              <p className="text-muted-foreground mb-6">Choose one (or we&apos;ll use the first).</p>
              {loadingStyles ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {styles.slice(0, 6).map((s) => (
                    <Card
                      key={s.id || s.slug}
                      className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                        answers.styleSlug === s.slug
                          ? 'ring-2 ring-primary border-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleNext({ styleSlug: s.slug, styleName: s.name })}
                    >
                      <div className="aspect-[4/3] bg-muted relative">
                        <img
                          src={s.cover_image_url || s.coverImageUrl || '/hero-bg.jpg'}
                          alt={s.name}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <p className="font-semibold">{s.name}</p>
                          <p className="text-sm text-white/90">{s.tagline || ''}</p>
                        </div>
                        {answers.styleSlug === s.slug && (
                          <div className="absolute top-3 right-3 rounded-full bg-primary p-1">
                            <CheckCircle className="h-5 w-5 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              {!loadingStyles && (
                <div className="mt-6 flex justify-end">
                  <button onClick={() => handleNext()} className="btn-primary gap-2 flex items-center px-4 py-2 rounded-md">
                    Continue
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="colors"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-semibold mb-2">Color preference</h2>
              <p className="text-muted-foreground mb-6">What feels right for your space?</p>
              <div className="space-y-3">
                {COLOR_OPTIONS.map((opt) => (
                  <Card
                    key={opt.id}
                    className={`p-4 cursor-pointer transition-all ${
                      answers.colors === opt.id
                        ? 'ring-2 ring-primary border-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleNext({ colors: opt.id })}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-sm text-muted-foreground">{opt.desc}</p>
                      </div>
                      {answers.colors === opt.id ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => handleNext()} className="btn-primary gap-2 flex items-center px-4 py-2 rounded-md">
                  Continue
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="room"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-semibold mb-2">Which room?</h2>
              <p className="text-muted-foreground mb-6">We&apos;ll focus your design on this room first.</p>
              <div className="flex flex-wrap gap-2">
                {ROOM_OPTIONS.map((room) => (
                  <Button
                    key={room}
                    variant={answers.room === room ? 'default' : 'outline'}
                    onClick={() => handleNext({ room })}
                  >
                    {room}
                  </Button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => handleNext()} className="btn-primary gap-2 flex items-center px-4 py-2 rounded-md">
                  See my result
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center space-y-8"
            >
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mt-12">
                <CheckCircle className="h-3.5 w-3 mr-1.5 inline" />
                Your style
              </span>
              <h1 className="text-3xl md:text-4xl font-bold">
                {selectedStyle?.name || answers.styleName || 'Your style'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {selectedStyle?.tagline || selectedStyle?.description || 'A look that fits you.'}
              </p>
              {selectedStyle?.cover_image_url && (
                <div className="rounded-xl overflow-hidden border border-border aspect-video max-w-md mx-auto">
                  <img
                    src={selectedStyle.cover_image_url}
                    alt={selectedStyle.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Room: {answers.room || 'Any'} · Colors: {answers.colors || 'Your choice'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="btn-primary gap-2 flex items-center justify-center px-6 h-12 rounded-xl font-medium"
                  onClick={() => router.push('/select-package')}
                >
                  Get my design
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
                <Link href="/styles" className="btn-secondary flex items-center justify-center px-6 h-12 rounded-xl font-medium">
                  Browse all styles
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}


