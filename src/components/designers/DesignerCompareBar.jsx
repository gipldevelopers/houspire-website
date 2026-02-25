import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DESIGNER_PERSONAS } from '@/lib/constants';
export function DesignerCompareBar({ selectedIds, onRemove, onCompare, onClear }) {
    const selectedDesigners = selectedIds
        .map(id => DESIGNER_PERSONAS.find(d => d.id === id))
        .filter(Boolean);
    return (<AnimatePresence>
      {selectedIds.length >= 2 && (<motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-4 px-6 py-4 bg-foreground text-background rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2">
              {selectedDesigners.map((designer) => (<div key={designer.id} className="relative group">
                  <img src={designer.avatar} alt={designer.name} className="w-10 h-10 rounded-full border-2 border-background/20"/>
                  <button onClick={() => onRemove(designer.id)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3"/>
                  </button>
                </div>))}
            </div>
            
            <div className="h-8 w-px bg-background/20"/>
            
            <span className="text-sm font-medium">
              {selectedIds.length} selected
            </span>
            
            <Button size="sm" variant="secondary" className="rounded-full" onClick={onCompare}>
              <GitCompare className="w-4 h-4 mr-2"/>
              Compare
            </Button>
            
            <Button size="sm" variant="ghost" className="text-background/70 hover:text-background hover:bg-background/10" onClick={onClear}>
              Clear
            </Button>
          </div>
        </motion.div>)}
    </AnimatePresence>);
}
