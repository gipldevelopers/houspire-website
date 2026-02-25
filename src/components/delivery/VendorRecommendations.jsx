import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Store, Sofa, Palette, Lightbulb, Shirt, } from 'lucide-react';
const categoryIcons = {
    'Furniture': Sofa,
    'Decor': Palette,
    'Paint': Palette,
    'Lighting': Lightbulb,
    'Textiles': Shirt,
};
export function VendorRecommendations({ vendors, city }) {
    const getGoogleMapsLink = (storeName, cityName) => {
        const query = encodeURIComponent(`${storeName} ${cityName}`);
        return `https://www.google.com/maps/search/${query}`;
    };
    if (vendors.length === 0) {
        return null;
    }
    return (<div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recommended Vendors</h3>
        <Badge variant="secondary" className="gap-1">
          <MapPin className="h-3 w-3"/>
          {city}
        </Badge>
      </div>

      <div className="space-y-6">
        {vendors.map((category, categoryIndex) => {
            const Icon = categoryIcons[category.category] || Store;
            return (<motion.div key={category.category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: categoryIndex * 0.1 }}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="h-4 w-4 text-muted-foreground"/>
                <h4 className="font-medium text-foreground">{category.category}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.stores.map((store, storeIndex) => (<Card key={storeIndex} className="p-4 hover:shadow-md transition-all hover:border-primary/30 group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {store.name}
                        </h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          {store.price_range}
                        </p>
                        {store.address_hint && (<p className="text-xs text-muted-foreground mt-1 truncate">
                            {store.address_hint}
                          </p>)}
                      </div>
                      
                      <Button size="sm" variant="ghost" className="flex-shrink-0 ml-2" asChild>
                        <a href={getGoogleMapsLink(store.name, city)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <ExternalLink className="h-4 w-4"/>
                        </a>
                      </Button>
                    </div>
                  </Card>))}
              </div>
            </motion.div>);
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Click the link icon to view store locations on Google Maps
      </p>
    </div>);
}
