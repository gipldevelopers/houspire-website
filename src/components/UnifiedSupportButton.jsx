import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Bot, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWhatsAppMessage, generateWhatsAppUrl } from '@/hooks/useWhatsAppMessage';
const WHATSAPP_NUMBER = '917075827625';
export function UnifiedSupportButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasPulsed, setHasPulsed] = useState(false);
    const message = useWhatsAppMessage();
    useEffect(() => {
        const pulsed = sessionStorage.getItem('support-pulsed');
        if (pulsed)
            setHasPulsed(true);
        else {
            const timer = setTimeout(() => {
                setHasPulsed(true);
                sessionStorage.setItem('support-pulsed', '1');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, []);
    function handleWhatsApp() {
        const url = generateWhatsAppUrl(WHATSAPP_NUMBER, message);
        window.open(url, '_blank');
        setIsOpen(false);
    }
    return (<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (<motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }} transition={{ duration: 0.2 }} className="bg-card border border-border rounded-2xl shadow-xl p-5 w-[280px]">
            <p className="font-semibold text-foreground mb-1">Need help? 👋</p>
            <p className="text-xs text-muted-foreground mb-4">
              We respond within 2 hours
            </p>

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3" onClick={() => {
                setIsOpen(false);
                // Dispatch a custom event that FAQChatbot-inline can listen to
                window.dispatchEvent(new CustomEvent('open-ai-chat'));
            }}>
                <Bot className="h-4 w-4 text-accent"/>
                Chat with AI
              </Button>

              <Button variant="outline" className="w-full justify-start gap-3" onClick={handleWhatsApp}>
                <Phone className="h-4 w-4 text-success"/>
                WhatsApp Support
              </Button>
            </div>
          </motion.div>)}
      </AnimatePresence>

      <motion.button onClick={() => setIsOpen(!isOpen)} className={cn('h-14 w-14 rounded-full shadow-lg flex items-center justify-center', 'bg-primary text-primary-foreground', 'hover:opacity-90 transition-opacity', !hasPulsed && 'animate-pulse')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label={isOpen ? 'Close support menu' : 'Open support menu'}>
        {isOpen ? (<X className="h-6 w-6"/>) : (<MessageCircle className="h-6 w-6"/>)}
      </motion.button>
    </div>);
}
