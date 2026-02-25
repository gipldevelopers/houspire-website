'use client';

import { motion } from 'framer-motion';
import { Star, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DESIGNER_PERSONAS, DESIGN_STYLES } from '@/lib/constants';
const getStyleLabel = (styleId) => {
    const style = DESIGN_STYLES.find(s => s.value === styleId);
    return style?.label || styleId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
export function DesignerCompareModal({ isOpen, onClose, selectedIds }) {
    const selectedDesigners = selectedIds
        .map(id => DESIGNER_PERSONAS.find(d => d.id === id))
        .filter(Boolean);
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Compare Designers</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {selectedDesigners.map((designer, index) => (<motion.div key={designer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-secondary/30 rounded-2xl p-6">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <img src={designer.avatar} alt={designer.name} className="w-16 h-16 rounded-2xl object-cover"/>
                <div>
                  <h3 className="font-semibold text-lg">{designer.name}</h3>
                  <p className="text-sm text-muted-foreground">{designer.specialty}</p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-background rounded-xl">
                  <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                    <Star className="w-4 h-4 fill-current"/>
                    <span className="font-bold">{designer.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="text-center p-3 bg-background rounded-xl">
                  <div className="font-bold mb-1">{designer.experience_years}</div>
                  <p className="text-xs text-muted-foreground">Years Exp.</p>
                </div>
                <div className="text-center p-3 bg-background rounded-xl">
                  <div className="font-bold mb-1">{designer.projects_completed}</div>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
              </div>
              
              {/* Signature Styles */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Signature Styles</h4>
                <div className="flex flex-wrap gap-2">
                  {designer.signature_style.map(style => (<Badge key={style} variant="outline" className="text-xs">
                      {getStyleLabel(style)}
                    </Badge>))}
                </div>
              </div>
              
              {/* Bio */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">About</h4>
                <p className="text-sm text-muted-foreground">{designer.bio}</p>
              </div>
              
              {/* Portfolio Highlights */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Highlights</h4>
                <ul className="space-y-2">
                  {designer.portfolio_highlights.map((highlight, i) => (<li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>))}
                </ul>
              </div>
              
              {/* CTA */}
              <Button asChild className="w-full rounded-full">
                <Link href={`/designer/${designer.id}`}>
                  View Full Portfolio
                  <ArrowRight className="w-4 h-4 ml-2"/>
                </Link>
              </Button>
            </motion.div>))}
        </div>
      </DialogContent>
    </Dialog>);
}
