'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Package, MessageCircle, Bell, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/dashboard/orders', icon: Package, label: 'Orders' },
    { path: '/dashboard/chat', icon: MessageCircle, label: 'Messages' },
    { path: '/notifications', icon: Bell, label: 'Alerts' },
    { path: '/settings', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => pathname === path;

  // Only show on mobile
  if (!isMobile) return null;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="relative flex flex-col items-center justify-center flex-1 h-full min-w-[64px] min-h-[44px] transition-colors"
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              {/* Active Indicator */}
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <Icon
                className={`w-5 h-5 transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              />

              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
