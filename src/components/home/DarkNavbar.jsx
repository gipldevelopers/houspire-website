'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { redirectToHouspireHome } from '@/lib/external-links';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import logoImg from '@/assets/logo.png';

const navLinks = [
  { name: 'Gallery', path: '/discover' },
  { name: 'How it works', path: '/how-it-works' },
  { name: 'Pricing', path: '/select-package' },
  { name: 'Styles', path: '/styles' },
  { name: 'Tools', path: '/tools' },
];

export function DarkNavbar() {
  const { user, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-12 transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-border/50'
            : 'border-b border-border/30'
        }`}
        style={{ backgroundColor: isScrolled ? 'color-mix(in srgb, var(--color-primary-1) 72%, transparent)' : 'var(--color-primary-1)' }}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-full">
          <Link href="/" className="flex items-center">
            <img src={logoImg} alt="Houspire" className="h-6" />
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                href={l.path}
                className="text-[13px] text-foreground/80 hover:text-foreground transition-colors"
              >
                {l.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button onClick={() => router.push('/dashboard')} className="text-[13px] text-foreground/80 hover:text-foreground transition-colors">
                  Dashboard
                </button>
                {isAdmin && (
                  <button onClick={() => router.push('/admin')} className="text-[13px] text-foreground/80 hover:text-foreground transition-colors">
                    Admin
                  </button>
                )}
                <button onClick={() => signOut()} className="text-[13px] text-foreground/80 hover:text-foreground transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={redirectToHouspireHome}
                className="btn-primary btn-sm"
              >
                Get Started
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 backdrop-blur-2xl pt-16 md:hidden"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-1) 95%, transparent)' }}
          >
            <div className="px-6 py-8 space-y-1">
              {navLinks.map((l) => (
                <Link
                  key={l.path}
                  href={l.path}
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-2xl font-semibold text-foreground py-4 border-b border-border"
                >
                  {l.name}
                </Link>
              ))}
              <div className="pt-6 space-y-3">
                {user ? (
                  <>
                    <button
                      onClick={() => { router.push('/dashboard'); setIsMobileOpen(false); }}
                      className="btn-primary btn-lg w-full"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => { signOut(); setIsMobileOpen(false); }}
                      className="btn-secondary btn-lg w-full"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { redirectToHouspireHome(); setIsMobileOpen(false); }}
                    className="btn-primary btn-lg w-full"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
