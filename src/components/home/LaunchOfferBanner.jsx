'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function LaunchOfferBanner() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Set end date to 7 days from now (or use a fixed date)
  const getEndDate = () => {
    const stored = localStorage.getItem('houspire_offer_end');
    if (stored) {
      return new Date(stored);
    }
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    localStorage.setItem('houspire_offer_end', endDate.toISOString());
    return endDate;
  };

  useEffect(() => {
    const dismissed = sessionStorage.getItem('houspire_banner_dismissed');
    if (dismissed) {
      setIsVisible(false);
      return;
    }

    const endDate = getEndDate();

    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('houspire_banner_dismissed', 'true');
    setIsVisible(false);
    // Let the app layout know the banner height is now gone.
    window.dispatchEvent(new Event('houspire:banner-dismissed'));
  };

  const formatNumber = (num) => num.toString().padStart(2, '0');

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-foreground via-foreground to-foreground/90 text-background overflow-hidden"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center sm:text-left">
            {/* Offer text */}
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span className="font-semibold text-sm sm:text-base">
                Launch Offer: Get 50% OFF your first design!
              </span>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-1.5 text-sm font-mono">
              <Clock className="h-4 w-4 mr-1" />
              <div className="flex items-center gap-1">
                <span className="bg-background/15 px-2 py-0.5 rounded">{formatNumber(timeLeft.days)}d</span>
                <span>:</span>
                <span className="bg-background/15 px-2 py-0.5 rounded">{formatNumber(timeLeft.hours)}h</span>
                <span>:</span>
                <span className="bg-background/15 px-2 py-0.5 rounded">{formatNumber(timeLeft.minutes)}m</span>
                <span>:</span>
                <span className="bg-background/15 px-2 py-0.5 rounded">{formatNumber(timeLeft.seconds)}s</span>
              </div>
            </div>

            {/* CTA */}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => router.push('/style-quiz')}
              className="bg-background text-foreground hover:bg-background/90 font-semibold h-8 px-4 rounded-full shadow-sm"
            >
              Claim Now
            </Button>

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-1/2 -translate-y-1/2 sm:relative sm:right-auto sm:top-auto sm:translate-y-0 p-1 hover:bg-background/10 rounded-full transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
