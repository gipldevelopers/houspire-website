import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWhatsAppMessage, generateWhatsAppUrl, isWithinChatHours } from '@/hooks/useWhatsAppMessage';
export function WhatsAppButton({ phoneNumber = '918700258625', position = 'bottom-right' }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const message = useWhatsAppMessage();
    const withinHours = isWithinChatHours();
    // Show tooltip after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!dismissed) {
                setShowTooltip(true);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [dismissed]);
    // Auto-hide tooltip after 10 seconds
    useEffect(() => {
        if (showTooltip) {
            const timer = setTimeout(() => {
                setShowTooltip(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [showTooltip]);
    function handleClick() {
        const whatsappUrl = generateWhatsAppUrl(phoneNumber, message);
        window.open(whatsappUrl, '_blank');
    }
    function handleDismissTooltip() {
        setShowTooltip(false);
        setDismissed(true);
    }
    const positionClasses = position === 'bottom-right'
        ? 'bottom-28 right-4 md:bottom-6 md:right-6'
        : 'bottom-28 left-4 md:bottom-6 md:left-6';
    return (<div className={`fixed ${positionClasses} z-50 flex flex-col items-end gap-3`}>
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !dismissed && (<motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }} className="bg-card border rounded-xl shadow-lg p-4 max-w-[280px] relative">
            {/* Close button */}
            <button onClick={handleDismissTooltip} className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full transition-colors">
              <X className="h-3 w-3 text-muted-foreground"/>
            </button>

            <p className="font-semibold text-foreground mb-1">Need help? 👋</p>
            <p className="text-sm text-muted-foreground mb-3">
              {withinHours
                ? "We're online! Chat with us now for instant support."
                : "We'll respond within 2 hours. Leave us a message!"}
            </p>
            
            <Button size="sm" onClick={handleClick} className="w-full bg-[#25D366] hover:bg-[#20BD5C] text-white">
              <MessageCircle className="h-4 w-4 mr-2"/>
              Start Chat
            </Button>

            {/* Online indicator */}
            {withinHours && (<div className="flex items-center gap-1.5 mt-2 justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                <span className="text-xs text-muted-foreground">Online now</span>
              </div>)}
          </motion.div>)}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button onClick={handleClick} size="lg" className="h-14 w-14 rounded-full shadow-lg bg-[#25D366] hover:bg-[#20BD5C] text-white p-0">
          <MessageCircle className="h-7 w-7"/>
        </Button>
      </motion.div>
    </div>);
}
