'use client';

import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ArrowRight, MapPin, Home, Palette, Expand } from 'lucide-react';
import { useRouter } from 'next/navigation';
import beforeRoom from '@/assets/before-room.jpg';
import afterRoom from '@/assets/after-room.jpg';
import { BeforeAfterSlider } from '@/components/shared/BeforeAfterSlider';

export function SampleProjectSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <section ref={ref} className="py-24 md:py-32 bg-accent/[0.02]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12"
        >
          <p className="text-accent font-medium tracking-[0.1em] uppercase text-xs mb-4">
            Sample Project
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
            See a Real Houspire Transformation
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Sample project showing what a Houspire Home Design Report looks like.
          </p>
        </motion.div>

        {/* Project details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 mb-10"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-accent" />
            Bangalore
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Home className="h-4 w-4 text-accent" />
            3BHK Apartment
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Palette className="h-4 w-4 text-accent" />
            Warm Scandinavian
          </div>
        </motion.div>

        {/* Before/After */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)]">
            <BeforeAfterSlider
              beforeImage={beforeRoom}
              afterImage={afterRoom}
              beforeLabel="Before"
              afterLabel="Designed"
            />
          </div>
          {/* Expand button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm border border-border shadow-md"
            onClick={() => setShowModal(true)}
          >
            <Expand className="h-4 w-4 mr-1.5" />
            Expand
          </Button>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-10"
        >
          <Button
            onClick={() => router.push('/select-package')}
            className="group"
          >
            Start with One Room
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>

      {/* Fullscreen Expand Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden">
          <div className="p-4 md:p-6">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                Bangalore
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="h-4 w-4 text-accent" />
                3BHK Apartment
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Palette className="h-4 w-4 text-accent" />
                Warm Scandinavian
              </div>
            </div>
            <div className="rounded-xl overflow-hidden">
              <BeforeAfterSlider
                beforeImage={beforeRoom}
                afterImage={afterRoom}
                beforeLabel="Before"
                afterLabel="Designed"
              />
            </div>
            <div className="mt-4 text-center">
              <Button onClick={() => { setShowModal(false); router.push('/select-package'); }} className="group">
                Start with One Room
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
