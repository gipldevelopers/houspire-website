import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Wand2, Loader2 } from 'lucide-react';
import { useIntakeStore } from '@/stores/intakeStore';
import { DESIGN_STYLES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { useQuizResults } from '@/hooks/useQuizResults';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { appDataClient } from '@/lib/static-client';
// Mapping from quiz IDs (underscores) to database slugs (hyphens)
const STYLE_SLUG_MAP = {
    modern_minimalist: 'modern-minimalist',
    contemporary_indian: 'contemporary-fusion',
    traditional_indian: 'traditional-indian',
    scandinavian: 'scandinavian-hygge',
    bohemian: 'bohemian-eclectic',
    industrial: 'industrial-urban',
    mid_century: 'mid-century-modern',
    coastal: 'coastal-tropical',
    rustic: 'farmhouse-modern',
    art_deco: 'art-deco-glamour',
    japanese_zen: 'japanese-zen',
    maximalist: 'maximalist-eclectic',
    transitional: 'transitional-classic',
    eclectic: 'bohemian-eclectic',
    luxury_traditional: 'luxury-contemporary',
    contemporary: 'contemporary-fusion',
    natural_organic: 'smart-home-modern',
};
const colorOptions = [
    { value: 'warm', label: 'Warm Tones', color: 'bg-orange-200' },
    { value: 'cool', label: 'Cool Tones', color: 'bg-blue-200' },
    { value: 'neutral', label: 'Neutral', color: 'bg-stone-200' },
    { value: 'bold', label: 'Bold Colors', color: 'bg-red-500' },
    { value: 'earth', label: 'Earth Tones', color: 'bg-amber-600' },
    { value: 'monochrome', label: 'Monochrome', color: 'bg-gray-400' },
];
export function Step2StyleQuiz({ onNext, onBack }) {
    const { selectedStyles, colorPreferences, setStylePreferences } = useIntakeStore();
    const { toast } = useToast();
    const { user } = useAuth();
    const { quizResults, loading: quizLoading } = useQuizResults();
    const [localStyles, setLocalStyles] = useState(selectedStyles);
    const [localColors, setLocalColors] = useState(colorPreferences);
    const [hasExistingQuiz, setHasExistingQuiz] = useState(false);
    const [initialized, setInitialized] = useState(false);
    // Fetch cover images from database
    const { data: styleCovers } = useQuery({
        queryKey: ['design-style-covers'],
        queryFn: async () => {
            const { data } = await appDataClient
                .from('design_styles')
                .select('slug, cover_image_url');
            return data || [];
        },
        staleTime: 1000 * 60 * 30 // 30 minutes cache
    });
    // Get image URL for a style value
    const getStyleImage = (styleValue) => {
        const slug = STYLE_SLUG_MAP[styleValue];
        if (!slug || !styleCovers)
            return null;
        const match = styleCovers.find(s => s.slug === slug);
        return match?.cover_image_url || null;
    };
    // Pre-populate from existing quiz results
    useEffect(() => {
        if (!quizLoading && quizResults && !initialized) {
            const existingStyles = quizResults.styles || [];
            const existingColors = quizResults.colors || [];
            if (existingStyles.length > 0 || existingColors.length > 0) {
                setHasExistingQuiz(true);
                // Only pre-populate if current selections are empty
                if (localStyles.length === 0 && existingStyles.length > 0) {
                    setLocalStyles(existingStyles);
                }
                if (localColors.length === 0 && existingColors.length > 0) {
                    setLocalColors(existingColors);
                }
            }
            setInitialized(true);
        }
    }, [quizLoading, quizResults, initialized, localStyles.length, localColors.length]);
    const toggleStyle = (styleValue) => {
        setLocalStyles(prev => prev.includes(styleValue)
            ? prev.filter(s => s !== styleValue)
            : [...prev, styleValue]);
    };
    const toggleColor = (colorValue) => {
        setLocalColors(prev => prev.includes(colorValue)
            ? prev.filter(c => c !== colorValue)
            : [...prev, colorValue]);
    };
    const handleNext = () => {
        if (localStyles.length === 0) {
            toast({
                title: 'Style Selection Required',
                description: 'Please select at least one design style',
                variant: 'destructive',
            });
            return;
        }
        if (localColors.length === 0) {
            toast({
                title: 'Color Preference Required',
                description: 'Please select at least one color preference',
                variant: 'destructive',
            });
            return;
        }
        setStylePreferences({
            selectedStyles: localStyles,
            colorPreferences: localColors,
        });
        onNext();
    };
    const handleUseExistingAndContinue = () => {
        if (quizResults) {
            const styles = quizResults.styles || [];
            const colors = quizResults.colors || [];
            setStylePreferences({
                selectedStyles: styles,
                colorPreferences: colors,
            });
            onNext();
        }
    };
    if (quizLoading) {
        return (<div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
      </div>);
    }
    return (<div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold mb-2">What's Your Style?</h2>
        <p className="text-muted-foreground">Select all styles that resonate with you</p>
      </div>

      {/* Existing Quiz Alert */}
      {hasExistingQuiz && quizResults && (<Alert className="bg-secondary/10 border-secondary">
          <Wand2 className="h-4 w-4 text-secondary"/>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>
              We found your style preferences from the quiz! Your selections have been pre-filled.
            </span>
            <Button size="sm" variant="secondary" onClick={handleUseExistingAndContinue} className="whitespace-nowrap">
              Use & Continue
            </Button>
          </AlertDescription>
        </Alert>)}

      {/* Style Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Design Styles (Select multiple)</h3>
          <Badge variant="secondary">{localStyles.length} selected</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {DESIGN_STYLES.map((style) => {
            const imageUrl = getStyleImage(style.value);
            return (<Card key={style.value} className={`relative cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-primary ${localStyles.includes(style.value) ? 'ring-2 ring-secondary' : ''}`} onClick={() => toggleStyle(style.value)}>
                {imageUrl ? (<img src={imageUrl} alt={style.label} className="w-full h-32 object-cover" onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-muted', 'to-muted-foreground/20', 'h-32');
                    }}/>) : (<div className="w-full h-32 bg-gradient-to-br from-muted to-muted-foreground/20"/>)}
                <div className="p-3">
                  <p className="font-medium text-sm text-foreground">{style.label}</p>
                </div>
                {localStyles.includes(style.value) && (<div className="absolute top-2 right-2 bg-secondary text-secondary-foreground rounded-full p-1">
                    <Check className="h-4 w-4"/>
                  </div>)}
              </Card>);
        })}
        </div>
      </div>

      {/* Color Preferences */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Color Preferences</h3>
          <Badge variant="secondary">{localColors.length} selected</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {colorOptions.map((color) => (<Card key={color.value} className={`p-4 cursor-pointer transition-all hover:ring-2 hover:ring-primary ${localColors.includes(color.value) ? 'ring-2 ring-secondary' : ''}`} onClick={() => toggleColor(color.value)}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full ${color.color}`}/>
                <span className="text-sm text-foreground">{color.label}</span>
              </div>
              {localColors.includes(color.value) && (<Check className="h-4 w-4 text-secondary mx-auto mt-2"/>)}
            </Card>))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button size="lg" onClick={handleNext} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          Continue to Requirements
        </Button>
      </div>
    </div>);
}

