import { motion } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
const categoryColors = {
    flooring: [
        { name: 'Natural Oak', hex: '#D4A574', popular: true },
        { name: 'Walnut', hex: '#5D4037' },
        { name: 'Grey Ash', hex: '#9E9E9E' },
        { name: 'White Marble', hex: '#F5F5F5', popular: true },
        { name: 'Beige Travertine', hex: '#E8DCC4' },
        { name: 'Dark Granite', hex: '#424242' },
        { name: 'Terracotta', hex: '#E2725B' },
        { name: 'Sandy Beige', hex: '#D4C4A8' },
    ],
    cabinets: [
        { name: 'Gloss White', hex: '#FFFFFF', popular: true },
        { name: 'Matte Grey', hex: '#78909C' },
        { name: 'Wood Grain', hex: '#8D6E63' },
        { name: 'Navy Blue', hex: '#283593' },
        { name: 'Forest Green', hex: '#2E7D32' },
        { name: 'Champagne', hex: '#F7E7CE', popular: true },
        { name: 'Charcoal', hex: '#37474F' },
        { name: 'Cream', hex: '#FFFDD0' },
    ],
    paint: [
        { name: 'Pure White', hex: '#FFFFFF', popular: true },
        { name: 'Ivory', hex: '#FFFFF0' },
        { name: 'Warm Grey', hex: '#B0A99F' },
        { name: 'Sage Green', hex: '#9DC183', popular: true },
        { name: 'Dusty Rose', hex: '#DCAE96' },
        { name: 'Sky Blue', hex: '#87CEEB' },
        { name: 'Terracotta', hex: '#E2725B' },
        { name: 'Charcoal', hex: '#36454F' },
        { name: 'Mustard', hex: '#FFDB58' },
        { name: 'Lavender', hex: '#E6E6FA' },
    ],
    furniture: [
        { name: 'Teak', hex: '#B8860B', popular: true },
        { name: 'Sheesham', hex: '#654321' },
        { name: 'White Oak', hex: '#D4A574' },
        { name: 'Ebony', hex: '#3D3635' },
        { name: 'Mahogany', hex: '#C04000' },
        { name: 'Cream Leather', hex: '#FFFDD0', popular: true },
        { name: 'Grey Fabric', hex: '#9E9E9E' },
        { name: 'Navy Velvet', hex: '#1A237E' },
    ],
    countertops: [
        { name: 'Carrara White', hex: '#F8F8F8', popular: true },
        { name: 'Black Galaxy', hex: '#1C1C1C' },
        { name: 'Kashmir White', hex: '#E8E4E1' },
        { name: 'Tan Brown', hex: '#8B7355' },
        { name: 'Absolute Black', hex: '#0D0D0D', popular: true },
        { name: 'Colonial Gold', hex: '#DAA520' },
    ],
    lighting: [
        { name: 'Warm White', hex: '#FFF5E1', popular: true },
        { name: 'Cool White', hex: '#F5F5FF' },
        { name: 'Daylight', hex: '#FFFAFA' },
        { name: 'Amber', hex: '#FFBF00', popular: true },
        { name: 'Soft Pink', hex: '#FFB6C1' },
    ],
    'window-treatments': [
        { name: 'Sheer White', hex: '#FAFAFA', popular: true },
        { name: 'Linen Beige', hex: '#E9DCC9' },
        { name: 'Slate Grey', hex: '#708090' },
        { name: 'Navy', hex: '#001F3F' },
        { name: 'Blush', hex: '#FFB6C1', popular: true },
        { name: 'Olive', hex: '#808000' },
    ],
    hardware: [
        { name: 'Brushed Brass', hex: '#B5A642', popular: true },
        { name: 'Matte Black', hex: '#1C1C1C', popular: true },
        { name: 'Chrome', hex: '#C0C0C0' },
        { name: 'Antique Bronze', hex: '#CD7F32' },
        { name: 'Rose Gold', hex: '#B76E79' },
        { name: 'Nickel', hex: '#727472' },
    ],
};
export function MaterialColorSwatches({ categoryId }) {
    const [selectedColor, setSelectedColor] = useState(null);
    const colors = categoryColors[categoryId] || categoryColors['paint'];
    return (<Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Palette className="h-5 w-5 text-primary"/>
          Popular Colors & Finishes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {colors.map((color, idx) => (<motion.button key={color.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} onClick={() => setSelectedColor(selectedColor === color.name ? null : color.name)} className="group relative">
              <div className={`aspect-square rounded-lg border-2 transition-all ${selectedColor === color.name
                ? 'border-primary ring-2 ring-primary ring-offset-2'
                : 'border-transparent hover:border-muted-foreground/20'}`} style={{ backgroundColor: color.hex }}>
                {color.popular && (<div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white"/>
                  </div>)}
                {selectedColor === color.name && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center">
                    <Check className={`h-6 w-6 ${color.hex === '#FFFFFF' || color.hex.startsWith('#F')
                    ? 'text-gray-800'
                    : 'text-white'}`}/>
                  </motion.div>)}
              </div>
              <p className="text-xs text-center mt-1.5 text-muted-foreground group-hover:text-foreground truncate">
                {color.name}
              </p>
            </motion.button>))}
        </div>

        {selectedColor && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-muted rounded-lg text-center">
            <p className="text-sm">
              Selected: <span className="font-medium">{selectedColor}</span>
            </p>
          </motion.div>)}
      </CardContent>
    </Card>);
}
