import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { getCookieConsent, saveCookieConsent } from '@/lib/cookie-consent-service';
import { COOKIE_CATEGORIES } from '@/types/cookie-consent';
export default function CookiePreferencesDialog({ isOpen, onClose, onSave }) {
    const [analytics, setAnalytics] = useState(false);
    const [marketing, setMarketing] = useState(false);
    const [functional, setFunctional] = useState(false);
    useEffect(() => {
        if (isOpen) {
            // Load current preferences
            const consent = getCookieConsent();
            if (consent) {
                setAnalytics(consent.consent.analytics);
                setMarketing(consent.consent.marketing);
                setFunctional(consent.consent.functional);
            }
        }
    }, [isOpen]);
    function handleSave() {
        saveCookieConsent({
            analytics,
            marketing,
            functional
        });
        onSave();
    }
    function handleAcceptAll() {
        setAnalytics(true);
        setMarketing(true);
        setFunctional(true);
        saveCookieConsent({
            analytics: true,
            marketing: true,
            functional: true
        });
        onSave();
    }
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cookie Preferences</DialogTitle>
          <DialogDescription>
            Manage your cookie preferences. You can enable or disable different categories below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Essential Cookies */}
          <Card className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">
                    {COOKIE_CATEGORIES.essential.name}
                  </Label>
                  <Badge variant="secondary" className="text-xs">
                    Always Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {COOKIE_CATEGORIES.essential.description}
                </p>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Examples:</span>
                  <ul className="list-disc list-inside mt-1">
                    {COOKIE_CATEGORIES.essential.cookies.map(cookie => (<li key={cookie}>{cookie}</li>))}
                  </ul>
                </div>
              </div>
              <div className="pt-1">
                <CheckCircle2 className="h-5 w-5 text-primary"/>
              </div>
            </div>
          </Card>

          <Separator />

          {/* Analytics Cookies */}
          <Card className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="analytics" className="text-base font-semibold">
                    {COOKIE_CATEGORIES.analytics.name}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {COOKIE_CATEGORIES.analytics.description}
                </p>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Examples:</span>
                  <ul className="list-disc list-inside mt-1">
                    {COOKIE_CATEGORIES.analytics.cookies.map(cookie => (<li key={cookie}>{cookie}</li>))}
                  </ul>
                </div>
              </div>
              <div className="pt-1">
                <Switch id="analytics" checked={analytics} onCheckedChange={setAnalytics}/>
              </div>
            </div>
          </Card>

          <Separator />

          {/* Marketing Cookies */}
          <Card className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="marketing" className="text-base font-semibold">
                    {COOKIE_CATEGORIES.marketing.name}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {COOKIE_CATEGORIES.marketing.description}
                </p>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Examples:</span>
                  <ul className="list-disc list-inside mt-1">
                    {COOKIE_CATEGORIES.marketing.cookies.map(cookie => (<li key={cookie}>{cookie}</li>))}
                  </ul>
                </div>
              </div>
              <div className="pt-1">
                <Switch id="marketing" checked={marketing} onCheckedChange={setMarketing}/>
              </div>
            </div>
          </Card>

          <Separator />

          {/* Functional Cookies */}
          <Card className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="functional" className="text-base font-semibold">
                    {COOKIE_CATEGORIES.functional.name}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {COOKIE_CATEGORIES.functional.description}
                </p>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Examples:</span>
                  <ul className="list-disc list-inside mt-1">
                    {COOKIE_CATEGORIES.functional.cookies.map(cookie => (<li key={cookie}>{cookie}</li>))}
                  </ul>
                </div>
              </div>
              <div className="pt-1">
                <Switch id="functional" checked={functional} onCheckedChange={setFunctional}/>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleAcceptAll}>
            Accept All
          </Button>
          <Button onClick={handleSave}>
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}
