import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Keyboard } from 'lucide-react';
import { getShortcutString } from '@/hooks/useKeyboardShortcuts';
export function KeyboardShortcutsModal({ isOpen, onClose, shortcuts, }) {
    return (<AnimatePresence>
      {isOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()}>
            <Card className="w-full max-w-md p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Keyboard className="h-5 w-5 text-primary"/>
                  </div>
                  <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5"/>
                </Button>
              </div>

              {/* Shortcuts List */}
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (<div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">
                      {getShortcutString(shortcut)}
                    </kbd>
                  </div>))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Press{' '}
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">?</kbd>{' '}
                  anytime to see this menu
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>)}
    </AnimatePresence>);
}
