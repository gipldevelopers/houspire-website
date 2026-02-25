import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Star, Camera, Share2, PartyPopper } from 'lucide-react';
export function CompletionChecklist({ projectId, onComplete }) {
    const { toast } = useToast();
    const [checklist, setChecklist] = useState([
        {
            id: '1',
            category: 'Setup',
            task: 'All furniture assembled and placed',
            completed: false,
        },
        {
            id: '2',
            category: 'Setup',
            task: 'Lighting fixtures installed and working',
            completed: false,
        },
        {
            id: '3',
            category: 'Setup',
            task: 'Window treatments hung',
            completed: false,
        },
        {
            id: '4',
            category: 'Setup',
            task: 'Wall art and mirrors mounted',
            completed: false,
        },
        {
            id: '5',
            category: 'Setup',
            task: 'Decorative items styled',
            completed: false,
        },
        {
            id: '6',
            category: 'Quality',
            task: 'All items checked for damage',
            completed: false,
        },
        {
            id: '7',
            category: 'Quality',
            task: 'Paint touch-ups completed',
            completed: false,
        },
        {
            id: '8',
            category: 'Quality',
            task: 'Furniture aligned and leveled',
            completed: false,
        },
        {
            id: '9',
            category: 'Quality',
            task: 'All electrical working properly',
            completed: false,
        },
        {
            id: '10',
            category: 'Finishing',
            task: 'Room thoroughly cleaned',
            completed: false,
        },
        {
            id: '11',
            category: 'Finishing',
            task: 'Packaging and debris removed',
            completed: false,
        },
        {
            id: '12',
            category: 'Finishing',
            task: 'Final photos taken',
            completed: false,
            optional: true,
        },
        {
            id: '13',
            category: 'Documentation',
            task: 'Warranties and manuals organized',
            completed: false,
        },
        {
            id: '14',
            category: 'Documentation',
            task: 'Vendor receipts filed',
            completed: false,
        },
        {
            id: '15',
            category: 'Documentation',
            task: 'Maintenance schedule created',
            completed: false,
            optional: true,
        },
    ]);
    const [feedback, setFeedback] = useState({
        rating: 0,
        review: '',
        wouldRecommend: true,
    });
    const [showCelebration, setShowCelebration] = useState(false);
    const toggleItem = (id) => {
        setChecklist(prev => prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item)));
    };
    const completedCount = checklist.filter(item => item.completed).length;
    const requiredItems = checklist.filter(item => !item.optional);
    const completedRequired = requiredItems.filter(item => item.completed).length;
    const progress = (completedCount / checklist.length) * 100;
    const allRequiredComplete = completedRequired === requiredItems.length;
    const categories = Array.from(new Set(checklist.map(item => item.category)));
    const handleComplete = async () => {
        if (!allRequiredComplete) {
            toast({
                title: 'Complete required items',
                description: 'Please complete all required checklist items',
                variant: 'destructive',
            });
            return;
        }
        try {
            await supabase
                .from('projects')
                .update({
                current_phase: 6,
                phase_status: 'completed',
            })
                .eq('id', projectId);
            setShowCelebration(true);
            setTimeout(() => {
                onComplete();
            }, 3000);
        }
        catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    if (showCelebration) {
        return (<Card className="p-12 text-center">
        <PartyPopper className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce"/>
        <h2 className="text-3xl font-heading font-bold mb-4">
          Congratulations! 🎉
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          Your interior design project is complete!
        </p>
        <p className="text-muted-foreground mb-8">
          We hope you love your new space. Don't forget to share photos with us!
        </p>
        <div className="flex justify-center gap-4">
          <Button>
            <Camera className="h-4 w-4 mr-2"/>
            Upload Final Photos
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2"/>
            Share on Instagram
          </Button>
        </div>
      </Card>);
    }
    return (<div className="space-y-6">
      {/* Progress Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-heading font-bold">
              Project Completion Checklist
            </h2>
            <p className="text-sm text-muted-foreground">
              {completedRequired}/{requiredItems.length} required items completed
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary">
              {Math.round(progress)}%
            </span>
            <p className="text-sm text-muted-foreground">Complete</p>
          </div>
        </div>
        <Progress value={progress}/>
      </Card>

      {/* Checklist by Category */}
      {categories.map(category => {
            const categoryItems = checklist.filter(item => item.category === category);
            const categoryCompleted = categoryItems.filter(item => item.completed).length;
            return (<Card key={category} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{category}</h3>
              <Badge variant="outline">
                {categoryCompleted}/{categoryItems.length}
              </Badge>
            </div>

            <div className="space-y-3">
              {categoryItems.map(item => (<div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Checkbox checked={item.completed} onCheckedChange={() => toggleItem(item.id)} className="mt-0.5"/>
                  <div className="flex-1 flex items-center justify-between">
                    <span className={item.completed
                        ? 'line-through text-muted-foreground'
                        : ''}>
                      {item.task}
                    </span>
                    {item.optional && (<Badge variant="outline" className="text-xs">
                        Optional
                      </Badge>)}
                  </div>
                  {item.completed && (<CheckCircle className="h-4 w-4 text-green-600"/>)}
                </div>))}
            </div>
          </Card>);
        })}

      {/* Feedback Section */}
      {allRequiredComplete && (<Card className="p-6">
          <h3 className="font-semibold mb-4">
            How was your experience?
          </h3>
          
          {/* Rating */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Rate your experience</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (<button key={rating} onClick={() => setFeedback({ ...feedback, rating })} className="group">
                  <Star className={`h-8 w-8 transition-colors ${rating <= feedback.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground group-hover:text-yellow-400'}`}/>
                </button>))}
            </div>
          </div>

          {/* Review */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              Share your experience (optional)
            </label>
            <Textarea placeholder="Tell us about your experience..." value={feedback.review} onChange={e => setFeedback({ ...feedback, review: e.target.value })} rows={4}/>
          </div>

          {/* Would Recommend */}
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox checked={feedback.wouldRecommend} onCheckedChange={checked => setFeedback({ ...feedback, wouldRecommend: !!checked })}/>
            <span className="text-sm">I would recommend Houspire to others</span>
          </label>
        </Card>)}

      {/* Complete Button */}
      <Button size="lg" className="w-full" onClick={handleComplete} disabled={!allRequiredComplete}>
        <CheckCircle className="h-5 w-5 mr-2"/>
        {allRequiredComplete
            ? 'Complete Project & Submit Feedback'
            : `Complete ${requiredItems.length - completedRequired} more required items`}
      </Button>
    </div>);
}
