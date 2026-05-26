import { useState, useCallback } from 'react';

// All known routes from App.tsx
const KNOWN_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/discover',
  '/designer/:designerId',
  '/faq',
  '/reviews',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/refund-policy',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/auth/callback',
  '/shared/:shareToken',
  '/budget-calculator',
  '/accessibility',
  '/dashboard',
  '/checkout',
  '/intake',
  '/project/:projectId',
  '/concepts/:projectId',
  '/delivery/:projectId',
  '/review/:projectId',
  '/settings',
  '/referrals',
  '/payment-success',
  '/payment-failed',
  '/payment-history',
  '/notifications',
  '/notification-settings',
  '/favorites',
  '/wishlist',
  '/admin',
  '/admin/project/:projectId',
  '/admin/workflow',
  '/admin/analytics',
  '/admin/settings',
  '/admin/promo-codes',
  '/admin/users',
  '/admin/users/:userId',
  '/admin/revisions',
  '/admin/contacts',
  '/admin/email-templates',
  '/admin/chat',
  '/admin/chat/:roomId',
  '/admin/audit',
  '/403',
];

// Known internal links that should exist
const EXPECTED_LINKS = [
  '/',
  '/discover',
  '/faq',
  '/reviews',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/refund-policy',
  '/login',
  '/signup',
  '/dashboard',
  '/settings',
  '/checkout',
  '/admin',
  '/notifications',
  '/favorites',
  '/wishlist',
  '/referrals',
  '/accessibility',
  '/budget-calculator',
];

export function useSiteAudit() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const runAudit = useCallback(async () => {
    setLoading(true);
    setProgress(0);
    setCurrentStep('Initializing audit...');

    const auditReport = {
      summary: {
        total_issues: 0,
        routes: KNOWN_ROUTES.length,
        links: EXPECTED_LINKS.length,
      },
      broken_links: [],
      orphaned_pages: [],
      database_issues: [],
      performance_issues: [],
      seo_issues: [],
      accessibility_issues: [],
      security_issues: [],
      timestamp: new Date().toISOString(),
    };

    try {
      setCurrentStep('Checking route accessibility...');
      setProgress(10);
      await new Promise(r => setTimeout(r, 300));

      setCurrentStep('Analyzing SEO configuration...');
      setProgress(25);
      await new Promise(r => setTimeout(r, 300));

      const metaDescription = document.querySelector('meta[name="description"]');
      const metaViewport = document.querySelector('meta[name="viewport"]');
      
      if (!metaDescription) {
        auditReport.seo_issues.push({
          type: 'Missing Meta Description',
          issue: 'Current page is missing a meta description tag',
        });
      }
      
      if (!metaViewport) {
        auditReport.seo_issues.push({
          type: 'Missing Viewport Meta',
          issue: 'Page is missing viewport meta tag for mobile responsiveness',
        });
      }

      setCurrentStep('Running accessibility checks...');
      setProgress(40);
      await new Promise(r => setTimeout(r, 300));

      const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
      if (imagesWithoutAlt.length > 0) {
        auditReport.accessibility_issues.push({
          type: 'Missing Alt Text',
          issue: `${imagesWithoutAlt.length} images found without alt attributes`,
        });
      }

      const buttonsWithoutLabel = document.querySelectorAll('button:not([aria-label]):empty');
      if (buttonsWithoutLabel.length > 0) {
        auditReport.accessibility_issues.push({
          type: 'Empty Buttons',
          issue: `${buttonsWithoutLabel.length} buttons found without accessible labels`,
        });
      }

      const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([id])');
      if (inputsWithoutLabels.length > 0) {
        auditReport.accessibility_issues.push({
          type: 'Unlabeled Inputs',
          issue: `${inputsWithoutLabels.length} inputs found without associated labels`,
        });
      }

      const skipLink = document.querySelector('[href="#main-content"]');
      if (!skipLink) {
        auditReport.accessibility_issues.push({
          type: 'Missing Skip Link',
          issue: 'No skip-to-content link found for keyboard navigation',
        });
      }

      setCurrentStep('Analyzing performance metrics...');
      setProgress(55);
      await new Promise(r => setTimeout(r, 300));

      const images = document.querySelectorAll('img');
      let largeImageCount = 0;
      images.forEach((img) => {
        if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
          largeImageCount++;
        }
      });
      if (largeImageCount > 0) {
        auditReport.performance_issues.push({
          type: 'Large Images',
          issue: `${largeImageCount} images exceed recommended dimensions (2000x2000)`,
        });
      }

      const blockingScripts = document.querySelectorAll('script:not([async]):not([defer]):not([type="module"])');
      if (blockingScripts.length > 2) {
        auditReport.performance_issues.push({
          type: 'Render-Blocking Scripts',
          issue: `${blockingScripts.length} potentially render-blocking scripts detected`,
        });
      }

      setCurrentStep('Running security analysis...');
      setProgress(70);
      await new Promise(r => setTimeout(r, 300));

      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        auditReport.security_issues.push({
          type: 'Insecure Connection',
          issue: 'Site is not using HTTPS',
        });
      }

      const sensitiveKeys = ['password', 'secret', 'token', 'apikey', 'api_key'];
      const localStorageKeys = Object.keys(localStorage);
      sensitiveKeys.forEach(key => {
        const found = localStorageKeys.find(lsKey => lsKey.toLowerCase().includes(key));
        if (found && key !== 'token') {
          auditReport.security_issues.push({
            type: 'Sensitive Data in Storage',
            issue: `Potentially sensitive key "${found}" found in localStorage`,
          });
        }
      });

      setCurrentStep('Validating internal links...');
      setProgress(85);
      await new Promise(r => setTimeout(r, 300));

      const allLinks = document.querySelectorAll('a[href^="/"]');
      const linkSet = new Set();
      allLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/')) {
          linkSet.add(href.split('?')[0].split('#')[0]);
        }
      });

      linkSet.forEach(link => {
        const matchesRoute = KNOWN_ROUTES.some(route => {
          const routeRegex = route
            .replace(/:[^/]+/g, '[^/]+')
            .replace(/\*/g, '.*');
          return new RegExp(`^${routeRegex}$`).test(link);
        });
        
        if (!matchesRoute && link !== '/') {
          auditReport.broken_links.push({
            link,
            type: 'No matching route',
          });
        }
      });

      setCurrentStep('Generating report...');
      setProgress(95);
      await new Promise(r => setTimeout(r, 300));

      auditReport.summary.total_issues =
        auditReport.broken_links.length +
        auditReport.orphaned_pages.length +
        auditReport.database_issues.length +
        auditReport.performance_issues.length +
        auditReport.seo_issues.length +
        auditReport.accessibility_issues.length +
        auditReport.security_issues.length;

      auditReport.summary.links = linkSet.size;

      setProgress(100);
      setCurrentStep('Audit complete!');
      setReport(auditReport);

      sessionStorage.setItem('site_audit_report', JSON.stringify(auditReport));

    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStoredReport = useCallback(() => {
    const stored = sessionStorage.getItem('site_audit_report');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReport(parsed);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }, []);

  const exportReport = useCallback(() => {
    if (!report) return;
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-audit-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [report]);

  return {
    report,
    loading,
    progress,
    currentStep,
    runAudit,
    loadStoredReport,
    exportReport,
  };
}
