import { motion } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from '@/components/ui/collapsible';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Paintbrush, Shirt, TreeDeciduous, Lightbulb, } from 'lucide-react';
import { useState } from 'react';
const materialSections = [
    { key: 'paint', label: 'Paint & Finishes', icon: Paintbrush },
    { key: 'fabric', label: 'Fabric & Textiles', icon: Shirt },
    { key: 'wood', label: 'Wood & Furniture', icon: TreeDeciduous },
    { key: 'lighting', label: 'Lighting', icon: Lightbulb },
];
export function MaterialSpecs({ materials }) {
    const [openSections, setOpenSections] = useState(new Set(['paint']));
    const toggleSection = (key) => {
        setOpenSections(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            }
            else {
                next.add(key);
            }
            return next;
        });
    };
    // Check if we have any materials
    const hasContent = Object.values(materials).some(arr => arr && arr.length > 0);
    if (!hasContent) {
        return null;
    }
    return (<div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Materials & Specifications</h3>

      <div className="space-y-3">
        {materialSections.map(({ key, label, icon: Icon }, index) => {
            const items = materials[key];
            if (!items || items.length === 0)
                return null;
            const isOpen = openSections.has(key);
            return (<motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Collapsible open={isOpen} onOpenChange={() => toggleSection(key)}>
                <Card className="overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full p-4 h-auto justify-between hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary"/>
                        </div>
                        <div className="text-left">
                          <span className="font-medium text-foreground">{label}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {items.length} items
                          </span>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}/>
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-0">
                      <div className="border-t pt-4">
                        <ul className="space-y-2">
                          {items.map((item, itemIndex) => (<li key={itemIndex} className="flex items-start gap-2 text-sm text-foreground">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>))}
                        </ul>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </motion.div>);
        })}
      </div>
    </div>);
}
