'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { analytics } from '@/lib/analytics'

/**
 * Hook to track page views automatically
 */
export function usePageTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const search = searchParams?.toString() ? `?${searchParams.toString()}` : ''
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const pageName = getPageName(pathname)
    analytics.page(pageName, {
      path: pathname,
      search,
      hash,
    })
  }, [pathname, searchParams])
}

function getPageName(pathname) {
  const routes = {
    '/': 'Home',
    '/style-quiz': 'Style Quiz',
    '/checkout': 'Checkout',
    '/payment-success': 'Payment Success',
    '/payment-failed': 'Payment Failed',
    '/intake': 'Intake Form',
    '/dashboard': 'Dashboard',
    '/login': 'Login',
    '/signup': 'Signup',
    '/forgot-password': 'Forgot Password',
    '/reset-password': 'Reset Password',
    '/verify-email': 'Verify Email',
    '/admin': 'Admin Dashboard',
    '/discover': 'Discover Gallery',
    '/about': 'About',
    '/contact': 'Contact',
    '/faq': 'FAQ',
    '/terms': 'Terms',
    '/privacy': 'Privacy',
    '/settings': 'Settings',
    '/referrals': 'Referrals',
  }

  if (routes[pathname]) return routes[pathname]

  if (pathname.startsWith('/project/')) return 'Project Detail'
  if (pathname.startsWith('/admin/projects/')) return 'Admin Project Detail'
  if (pathname.startsWith('/admin/')) return 'Admin Page'
  if (pathname.startsWith('/designer/')) return 'Designer Profile'
  if (pathname.startsWith('/concept/')) return 'Concept Viewer'

  return 'Unknown Page'
}
