'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import CookiePreferencesDialog from '@/components/CookiePreferencesDialog';
import { getCookieConsent } from '@/lib/cookie-consent-service';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/SEOHead';

export default function CookiePolicy() {
  const [showPreferences, setShowPreferences] = useState(false);
  const consent = getCookieConsent();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Cookie Policy" />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-IN')}
          </p>
        </div>

        <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
          <h2 className="text-xl font-semibold mb-3">Manage Your Cookie Preferences</h2>
          <p className="text-muted-foreground mb-4">
            You can change your cookie preferences at any time by clicking the button below.
          </p>
          <Button
            onClick={() => setShowPreferences(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Settings className="h-4 w-4 mr-2" />
            Cookie Settings
          </Button>
          
          {consent && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-2">
                Current settings:
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary">Essential: Enabled</Badge>
                <Badge variant={consent.consent.analytics ? 'default' : 'outline'}>
                  Analytics: {consent.consent.analytics ? 'Enabled' : 'Disabled'}
                </Badge>
                <Badge variant={consent.consent.marketing ? 'default' : 'outline'}>
                  Marketing: {consent.consent.marketing ? 'Enabled' : 'Disabled'}
                </Badge>
                <Badge variant={consent.consent.functional ? 'default' : 'outline'}>
                  Functional: {consent.consent.functional ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(consent.consent.timestamp).toLocaleString('en-IN')}
              </p>
            </div>
          )}
        </Card>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device when you visit our website. 
            They help us provide you with a better experience by remembering your preferences and 
            understanding how you use our site.
          </p>

          <h2>How We Use Cookies</h2>
          <p>We use cookies for the following purposes:</p>

          <h3>1. Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable core 
            functionality such as security, network management, and accessibility. You cannot 
            opt-out of these cookies.
          </p>
          <ul>
            <li><strong>Authentication:</strong> To keep you logged in to your account</li>
            <li><strong>Security:</strong> To protect your account and prevent fraud</li>
            <li><strong>Preferences:</strong> To remember your settings and choices</li>
          </ul>

          <h3>2. Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting 
            and reporting information anonymously. This helps us improve our service.
          </p>
          <ul>
            <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
            <li><strong>Performance Monitoring:</strong> To track website performance and errors</li>
          </ul>

          <h3>3. Marketing Cookies</h3>
          <p>
            These cookies are used to track visitors across websites to display relevant 
            advertisements and measure the effectiveness of marketing campaigns.
          </p>
          <ul>
            <li><strong>Google Ads:</strong> To show relevant advertisements</li>
            <li><strong>Facebook Pixel:</strong> To measure ad performance and retarget visitors</li>
            <li><strong>Retargeting:</strong> To show you relevant ads on other websites</li>
          </ul>

          <h3>4. Functional Cookies</h3>
          <p>
            These cookies enable enhanced functionality and personalization, such as remembering 
            your preferences and settings.
          </p>
          <ul>
            <li><strong>Language preferences:</strong> To remember your language settings</li>
            <li><strong>Theme settings:</strong> To remember your dark/light mode preference</li>
            <li><strong>Personalized content:</strong> To show content relevant to your interests</li>
          </ul>

          <h2>Managing Cookies</h2>
          <p>You can control and manage cookies in several ways:</p>

          <h3>Cookie Preferences</h3>
          <p>
            You can manage your cookie preferences at any time using our Cookie Settings tool above.
          </p>

          <h3>Browser Settings</h3>
          <p>
            Most web browsers allow you to control cookies through their settings. However, 
            limiting cookies may impact your experience on our website.
          </p>

          <h3>Do Not Track</h3>
          <p>
            We honor Do Not Track (DNT) signals. If you enable DNT in your browser, we will not 
            use analytics or marketing cookies.
          </p>

          <h2>Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third-party services that appear on our pages. We do not 
            control these cookies. Please review the privacy policies of these services:
          </p>
          <ul>
            <li>
              <a 
                href="https://policies.google.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Privacy Policy
              </a>
            </li>
            <li>
              <a 
                href="https://www.facebook.com/policy.php" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Facebook Privacy Policy
              </a>
            </li>
          </ul>

          <h2>Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. If we make significant changes, 
            we will notify you and may ask for your consent again.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us at:
          </p>
          <ul>
            <li><strong>Email:</strong> privacy@houspire.ai</li>
            <li><strong>Address:</strong> India</li>
          </ul>
        </div>
      </div>

      <CookiePreferencesDialog
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        onSave={() => {
          setShowPreferences(false);
        }}
      />

      <Footer />
    </div>
  );
}
