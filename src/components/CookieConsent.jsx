import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie, Settings, X } from 'lucide-react';
import { hasUserConsented, acceptAllCookies, acceptEssentialOnly, initializeAnalytics, initializeMarketing } from '@/lib/cookie-consent-service';
import CookiePreferencesDialog from './CookiePreferencesDialog';
export function CookieConsent() {
    const [show, setShow] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    useEffect(() => {
        // Check if user has already consented
        const hasConsented = hasUserConsented();
        if (!hasConsented) {
            setTimeout(() => setShow(true), 2000);
        }
        else {
            // Initialize tracking if already consented
            initializeAnalytics();
            initializeMarketing();
        }
    }, []);
    function handleAcceptAll() {
        acceptAllCookies();
        setShow(false);
        // Initialize tracking
        initializeAnalytics();
        initializeMarketing();
    }
    function handleRejectAll() {
        acceptEssentialOnly();
        setShow(false);
    }
    function handlePreferencesSaved() {
        setShowSettings(false);
        setShow(false);
        // Initialize tracking based on saved preferences
        initializeAnalytics();
        initializeMarketing();
    }
    if (!show)
        return null;
    return (<AnimatePresence>
      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
        <Card className="max-w-4xl mx-auto bg-card border-border shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="h-6 w-6 text-accent"/>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  We Value Your Privacy
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We use cookies to enhance your experience, analyze site traffic, and
                  personalize content. By clicking "Accept All", you consent to our use
                  of cookies.{' '}
                  <a href="/cookie-policy" className="text-primary hover:underline">
                    Learn more
                  </a>
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleAcceptAll} className="h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90">
                    Accept All
                  </Button>

                  <Button onClick={handleRejectAll} variant="outline" className="h-10 px-6">
                    Reject All
                  </Button>

                  <Button onClick={() => setShowSettings(true)} variant="ghost" className="h-10 px-6">
                    <Settings className="h-4 w-4 mr-2"/>
                    Customize
                  </Button>
                </div>
              </div>

              <button onClick={() => setShow(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5"/>
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Preferences Dialog */}
      <CookiePreferencesDialog isOpen={showSettings} onClose={() => setShowSettings(false)} onSave={handlePreferencesSaved}/>
    </AnimatePresence>);
}
