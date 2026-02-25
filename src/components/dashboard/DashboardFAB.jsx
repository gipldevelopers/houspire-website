'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MessageCircle, 
  HelpCircle, 
  Ticket,
  X
} from 'lucide-react';

export function DashboardFAB({ onNewProject, onContactSupport, onQuickChat }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Plus,
      label: 'New Project',
      color: 'bg-accent',
      onClick: () => {
        onNewProject?.();
        router.push('/style-quiz');
        setIsOpen(false);
      },
    },
    {
      icon: Ticket,
      label: 'Support Tickets',
      color: 'bg-orange-500',
      onClick: () => {
        router.push('/dashboard/support');
        setIsOpen(false);
      },
    },
    {
      icon: HelpCircle,
      label: 'Help Center',
      color: 'bg-blue-500',
      onClick: () => {
        onContactSupport?.();
        router.push('/help');
        setIsOpen(false);
      },
    },
    {
      icon: MessageCircle,
      label: 'Quick Chat',
      color: 'bg-green-500',
      onClick: () => {
        onQuickChat?.();
        router.push('/dashboard/chat');
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-50 md:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 space-y-2"
          >
            {actions.map((action, idx) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-end gap-2"
              >
                <span className="px-3 py-1.5 rounded-lg bg-background shadow-lg text-sm font-medium text-foreground whitespace-nowrap">
                  {action.label}
                </span>
                <Button
                  onClick={action.onClick}
                  className={`h-12 w-12 rounded-full ${action.color} hover:opacity-90 shadow-lg`}
                >
                  <action.icon className="h-5 w-5 text-white" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isOpen ? 'bg-muted text-foreground' : 'bg-foreground text-background'
        }`}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
