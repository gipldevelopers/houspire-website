import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check } from 'lucide-react';
// Calculate if text should be light or dark based on background color
function getContrastColor(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
}
export function ColorPalette({ colors }) {
    const { toast } = useToast();
    const [copiedIndex, setCopiedIndex] = useState(null);
    const handleCopy = async (hex, index) => {
        try {
            await navigator.clipboard.writeText(hex);
            setCopiedIndex(index);
            toast({
                title: 'Copied!',
                description: `${hex} copied to clipboard`,
                duration: 2000,
            });
            setTimeout(() => setCopiedIndex(null), 2000);
        }
        catch (error) {
            toast({
                title: 'Copy failed',
                description: 'Please copy manually',
                variant: 'destructive',
            });
        }
    };
    if (colors.length === 0) {
        return null;
    }
    return (<div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {colors.map((color, index) => {
            const textColor = getContrastColor(color.hex);
            const isCopied = copiedIndex === index;
            return (<motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="flex flex-col items-center">
              {/* Color swatch */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg cursor-pointer relative group" style={{ backgroundColor: color.hex }} onClick={() => handleCopy(color.hex, index)}>
                {/* Copy icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: textColor }}>
                  <AnimatePresence mode="wait">
                    {isCopied ? (<motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check className="h-5 w-5"/>
                      </motion.div>) : (<motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Copy className="h-5 w-5"/>
                      </motion.div>)}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Color info */}
              <div className="mt-3 text-center">
                <p className="font-medium text-sm text-foreground truncate max-w-24">
                  {color.name}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {color.hex.toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {color.brand}
                </p>
                <p className="text-xs font-medium text-primary">
                  {color.paint_code}
                </p>
              </div>
            </motion.div>);
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Click on any color to copy the hex code
      </p>
    </div>);
}
