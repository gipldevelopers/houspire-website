import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
export function PageLoader() {
    return (<div className="flex min-h-[60vh] items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin"/>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
          <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} className="h-full w-1/2 rounded-full bg-primary"/>
        </motion.div>

        <p className="text-sm text-muted-foreground">Loading...</p>
      </motion.div>
    </div>);
}
