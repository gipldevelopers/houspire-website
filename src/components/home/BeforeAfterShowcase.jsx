'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BeforeAfterSlider } from '@/components/shared/BeforeAfterSlider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Sample transformation examples with real before/after images
const transformations = [
  {
    id: 1,
    title: 'Modern Living Room',
    style: 'Contemporary',
    roomType: 'Living Room',
    beforeImage: '/before-room.jpg',
    afterImage: '/after-room.jpg',
    investment: '₹1.2L',
    turnaround: '72 hours'
  },
  {
    id: 2,
    title: 'Elegant Master Bedroom',
    style: 'Scandinavian',
    roomType: 'Bedroom',
    beforeImage: '/styles/japanese-zen/portfolio-5-bathroom.png',
    afterImage: '/styles/japanese-zen/portfolio-6-home-office.png',
    investment: '₹85K',
    turnaround: '48 hours'
  },
  {
    id: 3,
    title: 'Contemporary Kitchen',
    style: 'Modern Minimalist',
    roomType: 'Kitchen',
    beforeImage: '/styles/japanese-zen/portfolio-5-bathroom.png',
    afterImage: '/styles/japanese-zen/portfolio-4-dining-room.png',
    investment: '₹2.5L',
    turnaround: '72 hours'
  }
];

export function BeforeAfterShowcase() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTransform = transformations[activeIndex];
  
  // Ensure image paths are strings
  const beforeImage = typeof activeTransform?.beforeImage === 'string' 
    ? activeTransform.beforeImage 
    : String(activeTransform?.beforeImage || '')
  const afterImage = typeof activeTransform?.afterImage === 'string'
    ? activeTransform.afterImage
    : String(activeTransform?.afterImage || '')

  return (
    <section className="py-20 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Real Transformations
          </Badge>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Before meets after.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Drag the slider to compare before & after. Real projects from real customers.
          </p>
        </motion.div>

        {/* Main Showcase */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Slider */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <BeforeAfterSlider
              beforeImage={beforeImage}
              afterImage={afterImage}
              beforeLabel="Before"
              afterLabel="After"
              className="rounded-xl overflow-hidden shadow-xl"
            />
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col"
          >
            <Card className="card-premium p-6 flex-1">
              <Badge className="mb-3">{activeTransform.style}</Badge>
              <h3 className="text-2xl font-bold mb-2">{activeTransform.title}</h3>
              <p className="text-muted-foreground mb-6">{activeTransform.roomType}</p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Investment</span>
                  <span className="font-semibold text-lg">{activeTransform.investment}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Turnaround</span>
                  <span className="font-semibold">{activeTransform.turnaround}</span>
                </div>
              </div>

              <Button 
                onClick={() => router.push('/select-package')} 
                className="w-full rounded-full h-12 px-8"
                size="lg"
              >
                Get Your Design
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Card>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4">
              {transformations.map((transform, index) => (
                <button
                  key={transform.id}
                  onClick={() => setActiveIndex(index)}
                  className={`flex-1 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    index === activeIndex 
                      ? 'border-accent ring-2 ring-accent/20' 
                      : 'border-transparent hover:border-muted-foreground/30'
                  }`}
                >
                  <img 
                    src={transform.afterImage} 
                    alt={transform.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Ready to transform your space?
          </p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => router.push('/discover')}
          >
            Explore More Designs
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
