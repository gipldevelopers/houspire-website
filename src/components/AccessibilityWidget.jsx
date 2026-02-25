import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings, Type, Contrast, MousePointer, Eye, X, RotateCcw, } from 'lucide-react';
const DEFAULT_SETTINGS = {
    fontSize: 100,
    highContrast: false,
    reducedMotion: false,
    largerCursor: false,
    focusHighlight: false,
};
export function AccessibilityWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    useEffect(() => {
        // Load settings from localStorage
        const saved = localStorage.getItem('accessibility-settings');
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            }
            catch (e) {
                console.error('Failed to parse accessibility settings:', e);
            }
        }
        // Check system preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setSettings((prev) => ({ ...prev, reducedMotion: true }));
        }
    }, []);
    useEffect(() => {
        // Apply settings
        applySettings(settings);
        // Save to localStorage
        localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    }, [settings]);
    const applySettings = (settings) => {
        const root = document.documentElement;
        // Font size
        root.style.fontSize = `${settings.fontSize}%`;
        // High contrast
        if (settings.highContrast) {
            root.classList.add('high-contrast');
        }
        else {
            root.classList.remove('high-contrast');
        }
        // Reduced motion
        if (settings.reducedMotion) {
            root.classList.add('reduce-motion');
        }
        else {
            root.classList.remove('reduce-motion');
        }
        // Large cursor
        if (settings.largerCursor) {
            root.classList.add('large-cursor');
        }
        else {
            root.classList.remove('large-cursor');
        }
        // Focus highlight
        if (settings.focusHighlight) {
            root.classList.add('enhanced-focus');
        }
        else {
            root.classList.remove('enhanced-focus');
        }
    };
    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
    };
    return (<>
      {/* Floating Button */}
      <Button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 text-primary-foreground" aria-label="Open accessibility settings">
        <Settings className="h-6 w-6"/>
      </Button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (<>
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setIsOpen(false)}/>

            {/* Panel */}
            <motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background shadow-2xl z-50 overflow-y-auto">
              <Card className="h-full border-0 rounded-none">
                {/* Header */}
                <div className="sticky top-0 bg-background z-10 p-6 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Accessibility
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Customize your experience
                    </p>
                  </div>

                  <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0" aria-label="Close accessibility settings">
                    <X className="h-5 w-5"/>
                  </Button>
                </div>

                {/* Settings */}
                <div className="p-6 space-y-8">
                  {/* Font Size */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Type className="h-5 w-5 text-primary"/>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            Text Size
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {settings.fontSize}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <Slider value={[settings.fontSize]} onValueChange={(value) => setSettings({ ...settings, fontSize: value[0] })} min={75} max={150} step={5} className="mb-2"/>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Small</span>
                      <span>Normal</span>
                      <span>Large</span>
                    </div>
                  </div>

                  {/* High Contrast */}
                  <div className="flex items-center justify-between py-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Contrast className="h-5 w-5 text-primary"/>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          High Contrast
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Increase visual contrast
                        </p>
                      </div>
                    </div>

                    <Switch checked={settings.highContrast} onCheckedChange={(checked) => setSettings({ ...settings, highContrast: checked })} aria-label="Toggle high contrast mode"/>
                  </div>

                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between py-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Eye className="h-5 w-5 text-primary"/>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Reduce Motion
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Minimize animations
                        </p>
                      </div>
                    </div>

                    <Switch checked={settings.reducedMotion} onCheckedChange={(checked) => setSettings({ ...settings, reducedMotion: checked })} aria-label="Toggle reduced motion"/>
                  </div>

                  {/* Large Cursor */}
                  <div className="flex items-center justify-between py-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MousePointer className="h-5 w-5 text-primary"/>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Large Cursor
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Easier to see and track
                        </p>
                      </div>
                    </div>

                    <Switch checked={settings.largerCursor} onCheckedChange={(checked) => setSettings({ ...settings, largerCursor: checked })} aria-label="Toggle large cursor"/>
                  </div>

                  {/* Enhanced Focus */}
                  <div className="flex items-center justify-between py-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Eye className="h-5 w-5 text-primary"/>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Focus Highlight
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Enhanced keyboard navigation
                        </p>
                      </div>
                    </div>

                    <Switch checked={settings.focusHighlight} onCheckedChange={(checked) => setSettings({ ...settings, focusHighlight: checked })} aria-label="Toggle focus highlight"/>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="p-6 border-t border-border">
                  <Button onClick={handleReset} variant="outline" className="w-full h-12">
                    <RotateCcw className="h-4 w-4 mr-2"/>
                    Reset to Defaults
                  </Button>

                  {/* Info */}
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Tip: Your preferences are saved automatically and will persist across sessions.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>)}
      </AnimatePresence>
    </>);
}
