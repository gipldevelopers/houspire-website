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
            ? 'bg-white/[0.72] backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-black/[0.08]'
            : 'bg-white border-b border-black/[0.05]'
        }`}
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
                className="text-[13px] text-[#1D1D1F]/80 hover:text-[#1D1D1F] transition-colors"
              >
                {l.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button onClick={() => router.push('/dashboard')} className="text-[13px] text-[#1D1D1F]/80 hover:text-[#1D1D1F] transition-colors">
                  Dashboard
                </button>
                {isAdmin && (
                  <button onClick={() => router.push('/admin')} className="text-[13px] text-[#1D1D1F]/80 hover:text-[#1D1D1F] transition-colors">
                    Admin
                  </button>
                )}
                <button onClick={() => signOut()} className="text-[13px] text-[#1D1D1F]/80 hover:text-[#1D1D1F] transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={redirectToHouspireHome}
                className="px-[22px] py-2 text-[14px] font-medium text-white bg-[#E8662E] hover:bg-[#D45A1F] rounded-[980px] transition-all duration-300"
              >
                Get Started
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-[#1D1D1F]"
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
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl pt-16 md:hidden"
          >
            <div className="px-6 py-8 space-y-1">
              {navLinks.map((l) => (
                <Link
                  key={l.path}
                  href={l.path}
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-2xl font-semibold text-[#1D1D1F] py-4 border-b border-[#D2D2D7]"
                >
                  {l.name}
                </Link>
              ))}
              <div className="pt-6 space-y-3">
                {user ? (
                  <>
                    <button
                      onClick={() => { router.push('/dashboard'); setIsMobileOpen(false); }}
                      className="w-full py-4 text-lg font-medium text-white bg-[#E8662E] rounded-full"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => { signOut(); setIsMobileOpen(false); }}
                      className="w-full py-4 text-lg font-medium text-[#1D1D1F] border border-[#D2D2D7] rounded-full"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { redirectToHouspireHome(); setIsMobileOpen(false); }}
                    className="w-full py-4 text-lg font-medium text-white bg-[#E8662E] rounded-[980px]"
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
