import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, IndianRupee, Calendar, Package, ChevronDown, ChevronUp, Image } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
export function ConceptComparison({ concepts, onSelectConcept }) {
    const [expandedSections, setExpandedSections] = useState({
        renders: true,
        budget: true,
        products: false,
    });
    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };
    if (concepts.length < 2) {
        return (<Card className="p-8 text-center">
        <p className="text-muted-foreground">
          You need at least 2 concepts to compare
        </p>
      </Card>);
    }
    return (<div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Compare Your Concepts
        </h2>
        <p className="text-muted-foreground">
          See them side-by-side to make the perfect choice
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {concepts.slice(0, 2).map((concept, index) => (<Card key={concept.id} className="overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-accent/50 border-b">
              <h3 className="text-lg font-semibold text-foreground">
                {concept.concept_name}
              </h3>
              <Badge variant="secondary" className="mt-1">
                {concept.style_direction?.replace(/_/g, ' ') || 'Custom Style'}
              </Badge>
            </div>

            <div className="p-4 space-y-4">
              {/* Primary Render */}
              <Collapsible open={expandedSections.renders}>
                <CollapsibleTrigger onClick={() => toggleSection('renders')} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4 text-muted-foreground"/>
                    <span className="font-medium text-foreground">Preview</span>
                  </div>
                  {expandedSections.renders ? (<ChevronUp className="h-4 w-4 text-muted-foreground"/>) : (<ChevronDown className="h-4 w-4 text-muted-foreground"/>)}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <img src={concept.render_urls?.[0] || '/placeholder.svg'} alt={concept.concept_name} className="w-full aspect-[4/3] object-cover rounded-lg"/>
                  <p className="text-sm text-muted-foreground mt-2">
                    {concept.render_urls?.length || 0} total renders
                  </p>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Budget */}
              <Collapsible open={expandedSections.budget}>
                <CollapsibleTrigger onClick={() => toggleSection('budget')} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground"/>
                    <span className="font-medium text-foreground">Budget</span>
                  </div>
                  {expandedSections.budget ? (<ChevronUp className="h-4 w-4 text-muted-foreground"/>) : (<ChevronDown className="h-4 w-4 text-muted-foreground"/>)}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="text-center p-4 bg-accent/30 rounded-lg">
                    <p className="text-2xl font-bold text-foreground">
                      ₹{(concept.estimated_budget / 1000).toFixed(0)}k
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total estimated cost
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Product Count */}
              <Collapsible open={expandedSections.products}>
                <CollapsibleTrigger onClick={() => toggleSection('products')} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground"/>
                    <span className="font-medium text-foreground">Products</span>
                  </div>
                  {expandedSections.products ? (<ChevronUp className="h-4 w-4 text-muted-foreground"/>) : (<ChevronDown className="h-4 w-4 text-muted-foreground"/>)}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="text-center p-4 bg-accent/30 rounded-lg">
                    <p className="text-2xl font-bold text-foreground">
                      {concept.concept_products?.length || 0} items
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Furniture, lighting, decor
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Timeline */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground"/>
                  <span className="font-medium text-foreground">Timeline</span>
                </div>
                <span className="text-muted-foreground">4-6 weeks</span>
              </div>

              {/* Select Button */}
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" onClick={() => onSelectConcept(concept.id)}>
                <Check className="h-4 w-4 mr-2"/>
                Choose This Design
              </Button>
            </div>
          </Card>))}
      </div>

      {/* Feature Comparison Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Feature Comparison</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              {concepts.slice(0, 2).map((concept) => (<TableHead key={concept.id}>{concept.concept_name}</TableHead>))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Budget Range</TableCell>
              {concepts.slice(0, 2).map((concept) => (<TableCell key={concept.id}>
                  <Badge variant="outline">
                    ₹{(concept.estimated_budget / 1000).toFixed(0)}k
                  </Badge>
                </TableCell>))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Number of Products</TableCell>
              {concepts.slice(0, 2).map((concept) => (<TableCell key={concept.id}>
                  {concept.concept_products?.length || 0}
                </TableCell>))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Render Views</TableCell>
              {concepts.slice(0, 2).map((concept) => (<TableCell key={concept.id}>
                  {concept.render_urls?.length || 0}
                </TableCell>))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Style</TableCell>
              {concepts.slice(0, 2).map((concept) => (<TableCell key={concept.id}>
                  <Badge variant="secondary">
                    {concept.style_direction?.replace(/_/g, ' ') || 'Custom'}
                  </Badge>
                </TableCell>))}
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>);
}
