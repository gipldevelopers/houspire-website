import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { appDataClient } from '@/lib/static-client';
import { DESIGNER_PERSONAS } from '@/lib/constants';
import { Loader2, User, AlertCircle } from 'lucide-react';
export function QuizDataPanel({ userId }) {
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchQuizData();
    }, [userId]);
    const fetchQuizData = async () => {
        setLoading(true);
        const { data, error } = await appDataClient
            .from('quiz_results')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        if (!error && data) {
            setQuizData(data);
        }
        setLoading(false);
    };
    const formatStyleName = (style) => style.replace(/_/g, ' ').split(' ')
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
    if (loading) {
        return (<div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
        <span className="ml-2 text-muted-foreground">Loading style profile...</span>
      </div>);
    }
    if (!quizData) {
        return (<div className="flex items-center justify-center py-8 text-muted-foreground">
        <AlertCircle className="h-5 w-5 mr-2"/>
        User has not completed the style quiz yet
      </div>);
    }
    const primaryDesigner = DESIGNER_PERSONAS.find(d => d.id === quizData.primary_designer);
    return (<div className="space-y-6">
      {/* Designer Match */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Designer Match</h4>
        {primaryDesigner ? (<div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={primaryDesigner.avatar} alt={primaryDesigner.name}/>
              <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{primaryDesigner.name}</p>
              <p className="text-sm text-muted-foreground">{primaryDesigner.specialty}</p>
            </div>
          </div>) : (<p className="text-muted-foreground">No designer match found</p>)}
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Style Preferences */}
        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Style Preferences</h4>
          <div className="flex flex-wrap gap-2">
            {quizData.styles.map(style => (<Badge key={style} variant="secondary">
                {formatStyleName(style)}
              </Badge>))}
          </div>
        </Card>

        {/* Color Preferences */}
        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Color Preferences</h4>
          <div className="flex flex-wrap gap-2">
            {quizData.colors.map(color => (<Badge key={color} variant="outline">
                {formatStyleName(color)}
              </Badge>))}
          </div>
        </Card>
      </div>

      {/* Room Vibe & Budget */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Room Vibe</h4>
          <Badge variant="secondary" className="text-sm">
            {formatStyleName(quizData.vibe)}
          </Badge>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Budget Range</h4>
          <p className="font-semibold">{getBudgetLabel(quizData.budget)}</p>
          <Badge variant="outline" className="mt-1 text-xs">
            {formatStyleName(quizData.budget)}
          </Badge>
        </Card>
      </div>

      {/* Personality Scores */}
      {quizData.personality && Object.keys(quizData.personality).length > 0 && (<Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Personality Profile</h4>
          <div className="space-y-4">
            {Object.entries(quizData.personality).map(([key, value]) => {
                const numValue = typeof value === 'number' ? value :
                    value === 'high' ? 80 :
                        value === 'medium' ? 50 : 30;
                return (<div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-muted-foreground">{numValue}%</span>
                  </div>
                  <Progress value={numValue} className="h-2"/>
                </div>);
            })}
          </div>
        </Card>)}

      {/* Lifestyle Factors */}
      {quizData.lifestyle && Object.keys(quizData.lifestyle).length > 0 && (<Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Lifestyle Factors</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {quizData.lifestyle.has_kids !== undefined && (<div>
                <p className="text-muted-foreground">Has Kids</p>
                <p className="font-medium">{quizData.lifestyle.has_kids ? '✅ Yes' : '❌ No'}</p>
              </div>)}
            {quizData.lifestyle.has_pets !== undefined && (<div>
                <p className="text-muted-foreground">Has Pets</p>
                <p className="font-medium">{quizData.lifestyle.has_pets ? '✅ Yes' : '❌ No'}</p>
              </div>)}
            {quizData.lifestyle.work_from_home !== undefined && (<div>
                <p className="text-muted-foreground">Work From Home</p>
                <p className="font-medium">{quizData.lifestyle.work_from_home ? '✅ Yes' : '❌ No'}</p>
              </div>)}
            {quizData.lifestyle.entertaining_frequency && (<div>
                <p className="text-muted-foreground">Entertaining</p>
                <p className="font-medium capitalize">{quizData.lifestyle.entertaining_frequency}</p>
              </div>)}
            {quizData.lifestyle.concerns && Array.isArray(quizData.lifestyle.concerns) && (<div className="col-span-2">
                <p className="text-muted-foreground mb-1">Concerns</p>
                <div className="flex flex-wrap gap-1">
                  {quizData.lifestyle.concerns.map((concern) => (<Badge key={concern} variant="outline" className="text-xs">
                      {formatStyleName(concern)}
                    </Badge>))}
                </div>
              </div>)}
          </div>
        </Card>)}

      {/* Quiz Timestamp */}
      {quizData.created_at && (<p className="text-xs text-muted-foreground text-center">
          Quiz completed: {new Date(quizData.created_at).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
            })}
        </p>)}
    </div>);
}

