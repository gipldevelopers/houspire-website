import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Share2, Download, Calendar, Sparkles } from 'lucide-react';
import { HeroRender } from './HeroRender';
import { RenderGallery } from './RenderGallery';
import { ColorPalette } from './ColorPalette';
import { BudgetBreakdownCards } from './BudgetBreakdownCards';
import { VendorRecommendations } from './VendorRecommendations';
import { ExecutionTimeline } from './ExecutionTimeline';
import { MaterialSpecs } from './MaterialSpecs';
import { RenderZoomViewer } from './RenderZoomViewer';
import { ShareDesignImage } from '@/components/sharing/ShareDesignImage';
import { DesignUpgradePrompt } from '@/components/upsell/DesignUpgradePrompt';
export function DesignDeliveryTab({ deliverable, orderId, orderNumber, roomType, styleName, city, packageName, packagePrice, customerName, beforeImage, }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showZoomViewer, setShowZoomViewer] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const selectedRender = deliverable.renders[selectedIndex] || null;
    const generatedAt = deliverable.generated_at || new Date().toISOString();
    const generatedDate = new Date(generatedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* AI Badge */}
      <div className="flex items-center justify-between">
        <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 gap-1.5 px-3 py-1">
          <Sparkles className="h-3.5 w-3.5"/>
          AI-Generated Design
        </Badge>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4"/>
          Generated on {generatedDate}
        </div>
      </div>

      {/* Hero Render */}
      <HeroRender render={selectedRender} roomType={roomType} styleName={styleName} generatedAt={generatedAt} onZoomClick={() => setShowZoomViewer(true)} onShareClick={() => setShowShareModal(true)}/>

      {/* Render Gallery */}
      {deliverable.renders.length > 1 && (<RenderGallery renders={deliverable.renders} selectedIndex={selectedIndex} onSelect={setSelectedIndex}/>)}

      {/* Share Button (Mobile) */}
      <div className="flex gap-3 md:hidden">
        <Button onClick={() => setShowShareModal(true)} className="flex-1">
          <Share2 className="h-4 w-4 mr-2"/>
          Share Transformation
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2"/>
          Download All
        </Button>
      </div>

      <Separator />

      {/* Design Concept */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">{deliverable.concept.title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {deliverable.concept.description}
        </p>
        {deliverable.concept.style_summary && (<Badge variant="secondary" className="mt-3">
            {deliverable.concept.style_summary}
          </Badge>)}
      </Card>

      {/* Color Palette */}
      <ColorPalette colors={deliverable.color_palette}/>

      {/* Budget Breakdown */}
      <BudgetBreakdownCards breakdown={deliverable.budget_breakdown} totalBudget={deliverable.total_budget}/>

      {/* Vendor Recommendations */}
      <VendorRecommendations vendors={deliverable.vendors} city={city}/>

      {/* Execution Timeline */}
      <ExecutionTimeline timeline={deliverable.timeline} orderId={orderId}/>

      {/* Materials & Specs */}
      <MaterialSpecs materials={deliverable.materials}/>

      {/* Upsell Prompt */}
      <DesignUpgradePrompt orderId={orderId} currentPackageName={packageName} currentPrice={packagePrice} customerName={customerName}/>

      {/* Zoom Viewer Modal */}
      <RenderZoomViewer isOpen={showZoomViewer} onClose={() => setShowZoomViewer(false)} renders={deliverable.renders} initialIndex={selectedIndex}/>

      {/* Share Modal */}
      <ShareDesignImage open={showShareModal} onOpenChange={setShowShareModal} beforeImage={beforeImage} afterImage={selectedRender?.url || ''} roomType={roomType} styleName={styleName} orderNumber={orderNumber}/>
    </motion.div>);
}
