'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Wand2, 
  CreditCard, 
  Home,
  Eye,
  Download,
  ArrowRight
} from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: Wand2,
      number: '01',
      title: 'Take Style Quiz',
      description: 'Answer fun visual questions to discover your design personality and get matched with the perfect designer',
      time: '2 minutes',
      color: 'from-[#2C5A52] to-[#3D6E70]'   /* Forest Teal → Urban Mist */
    },
    {
      icon: CreditCard,
      number: '02',
      title: 'Choose Your Package',
      description: 'Select a package starting at ₹499 or add optional services. Pay once, no subscriptions or hidden fees',
      time: '2 minutes',
      color: 'from-[#385183] to-[#90AAAB]'   /* Royal Slate → Sage Blue-Green */
    },
    {
      icon: Home,
      number: '03',
      title: 'Share Room Details',
      description: 'Upload photos, dimensions, and preferences. Tell us what you love and what you want to avoid',
      time: '10 minutes',
      color: 'from-[#8CBC9D] to-[#2C5A52]'   /* Mint Verdure → Forest Teal */
    },
    {
      icon: Eye,
      number: '04',
      title: 'Review Your Design',
      description: 'Get 3D renders, budget breakdown, and shopping list in 72 hours. Provide feedback and request changes',
      time: '72 hours',
      color: 'from-[#EC7446] to-[#734443]'   /* Terracotta Flame → Mahogany Plum */
    },
    {
      icon: Download,
      number: '05',
      title: 'Download & Execute',
      description: 'Get your complete design package, shop for products, and transform your space with our guides',
      time: 'Your pace',
      color: 'from-[#385183] to-[#2C5A52]'   /* Royal Slate → Forest Teal */
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Simple Process
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From style quiz to stunning design in just 5 simple steps
          </p>
        </motion.div>

        {/* Steps */}
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
                <div className="absolute left-7 top-20 bottom-0 w-0.5 bg-gradient-to-b from-secondary/50 to-transparent hidden md:block" />
              )}

              <Card className="p-6 card-premium hover-lift">
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
                      <h3 className="text-xl font-heading font-bold text-foreground">
                        {step.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {step.time}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <ArrowRight className="h-5 w-5 text-primary rotate-90" />
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Total Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="inline-block p-6 card-premium gradient-soft">
            <div className="flex items-center gap-8 flex-wrap justify-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Time to Get Started</p>
                <p className="text-2xl font-bold text-foreground">~15 Minutes</p>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Design Delivery</p>
                <p className="text-2xl font-bold text-secondary">72 Hours</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
