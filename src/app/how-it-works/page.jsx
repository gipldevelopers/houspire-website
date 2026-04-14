'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SEOHead } from '@/components/SEOHead';
import { useEffect, useState } from 'react';
import { dataGet } from '@/lib/frontend-data';
import { 
  Wand2, 
  CreditCard, 
  Home,
  Eye,
  Download,
  ArrowRight,
  Clock,
  Package,
  CheckCircle,
  Image,
  ShoppingBag,
  FileText,
  Sparkles
} from 'lucide-react';

export default function HowItWorks() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { packages: packagesData } = await dataGet('/packages?limit=4');
      setPackages(packagesData || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const steps = [
    {
      icon: Wand2,
      number: '01',
      title: 'Take the Style Quiz',
      description: 'Answer fun visual questions to discover your design personality and get matched with the perfect designer for your taste.',
      time: '2 minutes',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: CreditCard,
      number: '02',
      title: 'Choose Your Package',
      description: 'Select from our plans starting at ₹499 or full home packages up to ₹14,999. Pay once—no subscriptions or hidden fees.',
      time: '2 minutes',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Home,
      number: '03',
      title: 'Share Your Space',
      description: 'Upload photos of your room, share dimensions, and tell us your preferences. Let us know what you love and what to avoid.',
      time: '10 minutes',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Eye,
      number: '04',
      title: 'Review Your Design',
      description: 'Receive photorealistic room designs, a detailed budget breakdown, and a complete shopping list within 72 hours. Share feedback and request changes.',
      time: '72 hours',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Download,
      number: '05',
      title: 'Download & Execute',
      description: 'Get your complete design package, shop for products using our curated links, and transform your space with our step-by-step guides.',
      time: 'Your pace',
      color: 'from-indigo-500 to-purple-500'
    },
  ];

  const deliverables = [
    {
      icon: Image,
      title: 'Photorealistic Room Designs',
      description: 'Multiple photorealistic views of your redesigned space from different angles'
    },
    {
      icon: ShoppingBag,
      title: 'Shopping List',
      description: 'Curated product links with prices from trusted Indian retailers'
    },
    {
      icon: FileText,
      title: 'Budget Breakdown',
      description: 'Detailed cost analysis by category so you know exactly where your money goes'
    },
    {
      icon: Package,
      title: 'Execution Guide',
      description: 'Step-by-step instructions to bring your design to life'
    },
  ];

  return (
    <>
      <SEOHead 
        title="How It Works | Houspire"
        description="From style quiz to dream room in 72 hours. Learn how Houspire delivers professional room designs, budgets, and contractor connections."
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
                Simple 5-Step Process
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-6">
                From Quiz to Dream Room
                <span className="block text-accent">in 72 Hours</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Professional interior design made simple. Answer a few questions, share your space, 
                and get stunning designs delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-14 px-8 text-lg bg-foreground text-background hover:bg-foreground/90 rounded-full">
                  <Link href="/style-quiz">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Take the Style Quiz
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
                  <Link href="/discover">
                    View Gallery
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 border-y border-border/50 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-foreground">~15</p>
                <p className="text-sm text-muted-foreground mt-1">Minutes to Start</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-accent">72</p>
                <p className="text-sm text-muted-foreground mt-1">Hours to Delivery</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-foreground">₹499</p>
                <p className="text-sm text-muted-foreground mt-1">Starting Price</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground mt-1">Money-Back Guarantee</p>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
                The Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Five simple steps from inspiration to transformation
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-7 top-20 bottom-0 w-0.5 bg-gradient-to-b from-border to-transparent hidden md:block" />
                  )}

                  <Card className="p-6 border-2 border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start gap-6">
                      {/* Icon & Number */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                          <step.icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                          {step.number}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {step.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {step.time}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      {index < steps.length - 1 && (
                        <div className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-secondary">
                          <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
                What You'll Receive
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to transform your space, delivered digitally
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {deliverables.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full text-center border-2 border-border/50 hover:border-accent/30 transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
                  72-Hour Delivery Guarantee
                </h2>
                <p className="text-lg text-muted-foreground">
                  Here's exactly what happens after you submit your project
                </p>
              </div>

              <Card className="p-8 border-2 border-accent/30 bg-accent/5">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-accent">0-24h</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Designer Assignment</h4>
                    <p className="text-sm text-muted-foreground">
                      Your project is matched with the perfect designer based on your style preferences
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-accent">24-48h</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Design Creation</h4>
                    <p className="text-sm text-muted-foreground">
                      Your designer creates concepts, sources products, and prepares photorealistic room designs
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-accent">48-72h</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Quality Review</h4>
                    <p className="text-sm text-muted-foreground">
                      Final review, packaging, and delivery of your complete design package
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-muted-foreground">
                Professional interior design starting at ₹499. No hidden fees, no subscriptions.
              </p>
            </motion.div>

            {/* Package Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <Card key={idx} className="p-6 animate-pulse">
                    <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2 mb-6" />
                    <div className="h-8 bg-muted rounded w-1/2 mb-4" />
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-3 bg-muted rounded w-full" />
                      ))}
                    </div>
                  </Card>
                ))
              ) : (
                packages.map((pkg, idx) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card 
                      className={`relative p-6 h-full flex flex-col border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                        pkg.isPopular ? 'border-accent' : 'border-border/50 hover:border-accent/30'
                      }`}
                      onClick={() => router.push(`/select-package?package=${pkg.slug}`)}
                    >
                      {/* Badge */}
                      {(pkg.isPopular || pkg.badgeText) && (
                        <Badge 
                          className={`absolute -top-3 left-1/2 -translate-x-1/2 ${
                            pkg.isPopular 
                              ? 'bg-accent text-accent-foreground' 
                              : 'bg-foreground text-background'
                          }`}
                        >
                          {pkg.isPopular ? 'MOST POPULAR' : pkg.badgeText}
                        </Badge>
                      )}

                      <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{pkg.tagline}</p>

                      <div className="mb-3">
                        <span className="text-3xl font-bold text-foreground">₹{formatPrice(pkg.price)}</span>
                        <p className="text-sm text-muted-foreground">{pkg.roomCountDisplay}</p>
                      </div>

                      <ul className="space-y-1.5 flex-1 mb-4">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {pkg.revisionsDisplay || `${pkg.revisionsIncluded} revision${pkg.revisionsIncluded > 1 ? 's' : ''}`}
                          </span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">72-hour delivery</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{pkg.supportDays}-day support</span>
                        </li>
                      </ul>

                      <Button 
                        variant={pkg.isPopular ? 'default' : 'outline'}
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/select-package?package=${pkg.slug}`);
                        }}
                      >
                        {pkg.isTrial ? 'Try Now' : 'Select'}
                      </Button>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Button variant="ghost" asChild>
                <Link href="/select-package" className="text-muted-foreground hover:text-foreground">
                  View all packages & add-ons →
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
                Ready to Transform Your Space?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Take our 2-minute style quiz and discover your design personality
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-14 px-8 text-lg bg-foreground text-background hover:bg-foreground/90 rounded-full">
                  <Link href="/style-quiz">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start the Style Quiz
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
                  <Link href="/faq">
                    Have Questions? View FAQ
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}


