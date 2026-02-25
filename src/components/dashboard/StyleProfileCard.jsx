'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { DESIGNER_PERSONAS } from '@/lib/constants';
import { 
  Palette, 
  Heart, 
  Home,
  Wand2,
  Edit,
  User,
  Star,
  Info
} from 'lucide-react';

export function StyleProfileCard({ quizData, compact = false }) {
  const router = useRouter();
  
  const primaryDesigner = quizData?.primary_designer 
    ? DESIGNER_PERSONAS.find(d => d.id === quizData.primary_designer)
    : null;

  const formatStyleName = (style) => 
    style.replace(/_/g, ' ').split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const getBudgetLabel = (budget) => {
    switch (budget) {
      case 'budget': return '₹50k - ₹1.5L';
      case 'mid_range': return '₹1.5L - ₹3.5L';
      case 'premium': return '₹3.5L - ₹8L+';
      default: return budget;
    }
  };

  const getVibeLabel = (vibe) => {
    const vibeMap = {
      calm: '🧘 Calm & Peaceful',
      energetic: '⚡ Energetic & Vibrant',
      cozy: '☕ Cozy & Warm',
      sophisticated: '✨ Sophisticated',
      playful: '🎨 Playful & Fun',
      serene: '🌿 Serene & Minimal',
    };
    return vibeMap[vibe] || vibe;
  };

  if (compact) {
    return (
      <Card className="p-4 card-premium">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-secondary" />
            Style Profile
          </h3>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 text-xs"
            onClick={() => router.push('/style-quiz?retake=true')}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </div>

        {primaryDesigner && (
          <div className="bg-secondary/10 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3 w-3 text-secondary" />
              <span className="text-xs font-medium text-secondary">Recommended Match</span>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-secondary/20">
                <AvatarImage src={primaryDesigner.avatar} alt={primaryDesigner.name} />
                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{primaryDesigner.name}</p>
                <p className="text-xs text-muted-foreground">{primaryDesigner.specialty}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {quizData.styles.slice(0, 3).map(style => (
            <Badge key={style} variant="secondary" className="text-xs">
              {formatStyleName(style)}
            </Badge>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 card-premium">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-secondary" />
          Your Style Profile
        </h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push('/style-quiz?retake=true')}
        >
          <Edit className="h-4 w-4 mr-1" />
          Retake Quiz
        </Button>
      </div>

      {/* Primary Designer - Clearly labeled as RECOMMENDATION */}
      {primaryDesigner && (
        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-4 mb-4 border border-secondary/20">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Recommended Designer Match</span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 ring-2 ring-secondary/30">
              <AvatarImage src={primaryDesigner.avatar} alt={primaryDesigner.name} />
              <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{primaryDesigner.name}</p>
              <p className="text-sm text-muted-foreground">{primaryDesigner.specialty}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/designer/${primaryDesigner.id}`)}
            >
              View
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            Based on your quiz results. You can choose any designer for each project.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Style Preferences */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium">Style Preferences</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quizData.styles.map(style => (
              <Badge key={style} variant="secondary">
                {formatStyleName(style)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Color Palettes */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium">Color Palettes</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quizData.colors.map(color => (
              <Badge key={color} variant="outline">
                {formatStyleName(color)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Room Vibe */}
        {quizData.vibe && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Room Vibe</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {getVibeLabel(quizData.vibe)}
            </Badge>
          </div>
        )}

        <Separator />

        {/* Budget & Lifestyle */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Budget Range</p>
            <p className="font-medium">{getBudgetLabel(quizData.budget)}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Lifestyle</p>
            <div className="flex flex-wrap gap-1">
              {quizData.lifestyle?.has_kids && (
                <Badge variant="outline" className="text-xs">👶 Kids</Badge>
              )}
              {quizData.lifestyle?.has_pets && (
                <Badge variant="outline" className="text-xs">🐾 Pets</Badge>
              )}
              {quizData.lifestyle?.work_from_home && (
                <Badge variant="outline" className="text-xs">💼 WFH</Badge>
              )}
              {!quizData.lifestyle?.has_kids && !quizData.lifestyle?.has_pets && !quizData.lifestyle?.work_from_home && (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function StyleProfileEmpty() {
  const router = useRouter();
  
  return (
    <Card className="p-6 text-center card-premium">
      <Wand2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
      <h3 className="font-heading font-semibold mb-1">Create Your Style Profile</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Take our 2-minute quiz to get personalized designer matches
      </p>
      <Button 
        onClick={() => router.push('/style-quiz')}
        className="btn-luxury"
      >
        Take Style Quiz
      </Button>
    </Card>
  );
}
