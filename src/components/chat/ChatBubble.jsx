import { useState } from 'react';
import { useChatUnreadCount } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MessageCircle } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { motion, AnimatePresence } from 'framer-motion';
export function ChatBubble({ projectId, className }) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const unreadCount = useChatUnreadCount(false);
    if (!user)
        return null;
    return (<Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={className}>
          <Button size="lg" className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow relative">
            <MessageCircle className="h-6 w-6"/>
            <AnimatePresence>
              {unreadCount > 0 && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-1 -right-1">
                  <Badge variant="destructive" className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                </motion.div>)}
            </AnimatePresence>
          </Button>
        </motion.div>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary"/>
            Chat with Support
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {projectId ? (<ChatWindow projectId={projectId} isAdmin={false} className="h-full border-0 rounded-none"/>) : (<div className="flex items-center justify-center h-full text-muted-foreground p-4 text-center">
              <div>
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50"/>
                <p>Select a project to start chatting</p>
              </div>
            </div>)}
        </div>
      </SheetContent>
    </Sheet>);
}
