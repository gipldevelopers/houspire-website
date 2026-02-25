import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Award, Star, Filter } from 'lucide-react';
import { useIntakeStore } from '@/stores/intakeStore';
import { DESIGNER_PERSONAS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
// Style-based portfolio images for designers
const stylePortfolioImages = {
    modern_minimalist: [
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=200&h=150&fit=crop',
    ],
    traditional_indian: [
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=200&h=150&fit=crop',
    ],
    contemporary: [
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&h=150&fit=crop',
    ],
    bohemian: [
        'https://images.unsplash.com/photo-1617104678098-de229db51175?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=200&h=150&fit=crop',
    ],
    scandinavian: [
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1598928506311-c55eca9a5eb8?w=200&h=150&fit=crop',
    ],
    coastal: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=200&h=150&fit=crop',
    ],
    industrial: [
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=200&h=150&fit=crop',
    ],
    art_deco: [
        'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=200&h=150&fit=crop',
    ],
    maximalist: [
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=200&h=150&fit=crop',
    ],
    japanese_zen: [
        'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1598928506311-c55eca9a5eb8?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=200&h=150&fit=crop',
    ],
    rustic: [
        'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=200&h=150&fit=crop',
    ],
    mid_century: [
        'https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&h=150&fit=crop',
    ],
    natural_organic: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200&h=150&fit=crop',
    ],
};
const defaultImages = [
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=150&fit=crop',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&h=150&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop',
];
function getDesignerPortfolioImages(designerId) {
    const designer = DESIGNER_PERSONAS.find(d => d.id === designerId);
    if (!designer)
        return defaultImages;
    const primaryStyle = designer.signature_style[0];
    return stylePortfolioImages[primaryStyle] || defaultImages;
}
// Get unique specialties for filter
const uniqueSpecialties = [...new Set(DESIGNER_PERSONAS.map(d => d.specialty))];
export function Step4DesignerSelect({ onSubmit, onBack, isSubmitting }) {
    const { designerPersona, setDesigner } = useIntakeStore();
    const { toast } = useToast();
    const [selected, setSelected] = useState(designerPersona);
    const [filter, setFilter] = useState('all');
    const handleSelect = (personaId) => {
        setSelected(personaId);
        setDesigner(personaId);
    };
    const handleSubmit = () => {
        if (!selected) {
            toast({
                title: 'Designer Required',
                description: 'Please select a designer to continue',
                variant: 'destructive',
            });
            return;
        }
        onSubmit();
    };
    const filteredDesigners = filter === 'all'
        ? DESIGNER_PERSONAS
        : DESIGNER_PERSONAS.filter(d => d.specialty === filter);
    return (<div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold mb-2">Meet Your Designer</h2>
        <p className="text-muted-foreground">Choose from our 14 expert designers who match your style</p>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-end gap-2">
        <Filter className="h-4 w-4 text-muted-foreground"/>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter by specialty"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Designers ({DESIGNER_PERSONAS.length})</SelectItem>
            {uniqueSpecialties.map(specialty => (<SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDesigners.map((persona) => {
            const portfolioImages = getDesignerPortfolioImages(persona.id);
            return (<Card key={persona.id} className={`p-4 cursor-pointer transition-all hover:shadow-lg ${selected === persona.id ? 'ring-2 ring-secondary shadow-lg' : ''}`} onClick={() => handleSelect(persona.id)}>
              <div className="space-y-3">
                {/* Avatar */}
                <div className="relative mx-auto w-16 h-16">
                  <img src={persona.avatar} alt={persona.name} className="w-16 h-16 rounded-full bg-card border-2 border-border"/>
                  {selected === persona.id && (<div className="absolute -bottom-1 -right-1 bg-secondary text-secondary-foreground rounded-full p-1">
                      <Check className="h-3 w-3"/>
                    </div>)}
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-foreground">{persona.name}</h3>
                  <div className="flex items-center justify-center gap-1 text-amber-500 text-xs">
                    <Star className="h-3 w-3 fill-current"/>
                    <span>{persona.rating}</span>
                    <span className="text-muted-foreground">• {persona.projects_completed}+ projects</span>
                  </div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    <Award className="h-2.5 w-2.5 mr-1"/>
                    {persona.specialty}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground text-center line-clamp-2">{persona.description}</p>

                {/* Portfolio Preview */}
                <div className="grid grid-cols-3 gap-0.5 rounded-md overflow-hidden">
                  {portfolioImages.map((img, i) => (<img key={i} src={img} alt={`${persona.name} portfolio ${i + 1}`} className="w-full h-12 object-cover"/>))}
                </div>
              </div>
            </Card>);
        })}
      </div>

      {selected && (<div className="text-center p-4 bg-accent rounded-lg">
          <p className="font-medium text-foreground">
            ✨ {DESIGNER_PERSONAS.find(p => p.id === selected)?.name} will be your designer!
          </p>
        </div>)}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" size="lg" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button size="lg" onClick={handleSubmit} disabled={!selected || isSubmitting} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          {isSubmitting ? 'Submitting...' : 'Submit & Start Design Process'}
        </Button>
      </div>
    </div>);
}
