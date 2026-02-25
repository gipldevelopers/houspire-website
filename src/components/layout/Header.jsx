'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Shield, Settings, MessageCircle, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '@/assets/logo.png';
import Image from 'next/image';
// Temporarily commented - will implement after converting these components
// import { NotificationBell } from '@/components/NotificationBell';
// import { useUnreadCount } from '@/hooks/useUnreadCount';

// Pages that have dark backgrounds and need light header text
const DARK_BACKGROUND_ROUTES = ['/login', '/signup', '/register', '/auth'];

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // const { unreadCount } = useUnreadCount();
  const unreadCount = 0; // Temporary placeholder
  
  // Check if current route has a dark background
  const isDarkBackground = DARK_BACKGROUND_ROUTES.some(route => 
    pathname?.startsWith(route)
  );

  // Set mounted state and banner visibility on client only
  useEffect(() => {
    setIsMounted(true);
    setIsBannerVisible(!sessionStorage.getItem('houspire_banner_dismissed'));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const navLinks = [
    { name: 'Gallery', path: '/discover' },
    { name: 'Styles', path: '/styles' },
    { name: 'How it works', path: '/how-it-works' },
    { name: 'Tools', path: '/tools' },
    { name: 'Refer & Earn', path: '/referrals' },
  ];

  // Check if banner is visible (not dismissed this session)
  return (
    <>
      <motion.header
        initial={isMounted ? { y: -100 } : { y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        suppressHydrationWarning
        className={`fixed left-0 right-0 z-50 px-3 md:px-6 transition-all duration-500 ${
          isMounted && isBannerVisible ? 'top-[10px]' : 'top-0'
        }`}
      >
        <div
          className={`mx-auto max-w-[1400px] px-6 transition-all duration-500 ${
            isScrolled
              ? 'rounded-[20px] border bg-background/70 backdrop-blur-2xl backdrop-saturate-150 border-b border-border/50 shadow-sm right-[20px] left-[20px]'
              : isDarkBackground
                ? 'rounded-none border border-transparent bg-background/90 backdrop-blur-xl'
                : 'rounded-none border border-transparent bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="transition-opacity group-hover:opacity-70"
              >
                <Image 
                  src={logoImg} 
                  alt="Houspire" 
                  height={28} 
                  width={120}
                  className="h-7 w-auto"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.path || pathname?.startsWith(link.path + '/');
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-sm transition-all duration-300 relative group whitespace-nowrap ${
                      isActive ? 'text-foreground font-medium' : 'text-foreground/80 hover:text-foreground'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-foreground transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      onClick={() => router.push('/admin')}
                      className="text-sm font-medium text-accent hover:text-accent/80 hover:bg-accent/10 transition-all duration-300"
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/dashboard')}
                    className="text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-transparent transition-all duration-300"
                  >
                    Dashboard
                  </Button>
                  {/* <NotificationBell /> */}
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/dashboard/inspiration')}
                    className="text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-transparent transition-all duration-300"
                    title="My Boards"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/dashboard/chat')}
                    className="relative text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-transparent transition-all duration-300"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-medium flex items-center justify-center text-accent-foreground">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/settings')}
                    className="text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-transparent transition-all duration-300"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-transparent transition-all duration-300"
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/login')}
                    className="text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-transparent transition-all duration-300"
                  >
                    Sign in
                  </Button>
                  <Button
                    onClick={() => router.push('/style-quiz')}
                    className="h-9 px-5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-foreground/10 active:scale-[0.98]"
                  >
                    Get started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl md:hidden ${
              isBannerVisible ? 'pt-16' : 'pt-14'
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="container mx-auto px-6 py-12"
            >
              <nav className="space-y-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    <Link
                      href={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-4 text-2xl font-semibold text-foreground hover:text-accent transition-colors border-b border-border/30"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mt-12 space-y-4"
              >
                {user ? (
                  <>
                    {isAdmin && (
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => {
                          router.push('/admin');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full h-14 text-lg rounded-full border-2 border-accent text-accent transition-all duration-300"
                      >
                        <Shield className="h-5 w-5 mr-2" />
                        Admin Panel
                      </Button>
                    )}
                    <Button
                      size="lg"
                      onClick={() => {
                        router.push('/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full h-14 text-lg bg-foreground hover:bg-foreground/90 text-background rounded-full transition-all duration-300"
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        router.push('/dashboard/inspiration');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full h-14 text-lg rounded-full border-2 transition-all duration-300"
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      My Boards
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        router.push('/settings');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full h-14 text-lg rounded-full border-2 transition-all duration-300"
                    >
                      <Settings className="h-5 w-5 mr-2" />
                      Settings
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full h-14 text-lg rounded-full border-2 transition-all duration-300"
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={() => {
                        router.push('/style-quiz');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full h-14 text-lg bg-foreground hover:bg-foreground/90 text-background rounded-full transition-all duration-300"
                    >
                      Get started
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        router.push('/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full h-14 text-lg rounded-full border-2 transition-all duration-300"
                    >
                      Sign in
                    </Button>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
