import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';
import { promptInstall, canInstall, showInstallBanner, dismissInstallBanner, } from '@/lib/pwa';
export function InstallPWABanner() {
    const [show, setShow] = useState(false);
    useEffect(() => {
        // Show banner if conditions are met
        const timer = setTimeout(() => {
            if (showInstallBanner()) {
                setShow(true);
            }
        }, 5000); // Show after 5 seconds
        return () => clearTimeout(timer);
    }, []);
    const handleInstall = async () => {
        if (canInstall()) {
            const accepted = await promptInstall();
            if (accepted) {
                setShow(false);
                dismissInstallBanner();
            }
        }
    };
    const handleDismiss = () => {
        setShow(false);
        dismissInstallBanner();
    };
    return (<AnimatePresence>
      {show && (<motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-0 left-0 right-0 z-50 p-4 safe-area-inset-bottom">
          <Card className="max-w-md mx-auto bg-card border-border rounded-2xl p-4 shadow-xl">
            <button onClick={handleDismiss} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5"/>
            </button>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                <Smartphone className="h-6 w-6 text-primary"/>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">
                  Install Houspire App
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  Install our app for a better experience with offline access and quick
                  launch.
                </p>

                <div className="flex gap-3 mt-4">
                  <Button onClick={handleInstall} className="flex-1 h-10">
                    <Download className="h-4 w-4 mr-2"/>
                    Install
                  </Button>

                  <Button onClick={handleDismiss} variant="outline" className="h-10">
                    Not Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>)}
    </AnimatePresence>);
}
