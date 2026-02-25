import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Zap, CheckCircle, AlertCircle } from 'lucide-react';
const urgencyLevels = [
    {
        id: 'asap',
        label: 'ASAP',
        description: 'Need it as soon as possible',
        icon: '🔥',
        color: 'red',
    },
    {
        id: 'weeks',
        label: '2-4 weeks',
        description: 'Planning to start soon',
        icon: '⚡',
        color: 'orange',
    },
    {
        id: 'months',
        label: '1-3 months',
        description: 'Planning ahead',
        icon: '📅',
        color: 'blue',
    },
    {
        id: 'flexible',
        label: 'Flexible',
        description: 'No rush, taking my time',
        icon: '☕',
        color: 'green',
    },
];
const flexibilityOptions = [
    {
        id: 'fixed',
        label: 'Fixed deadline',
        description: 'Must be done by a specific date',
        icon: '⏰',
    },
    {
        id: 'somewhat',
        label: 'Somewhat flexible',
        description: 'Prefer target date but can adjust',
        icon: '🔄',
    },
    {
        id: 'very',
        label: 'Very flexible',
        description: 'No strict deadline',
        icon: '🌊',
    },
];
const getColorClass = (color, isSelected) => {
    if (!isSelected)
        return 'border-border hover:border-muted-foreground/50';
    const colors = {
        red: 'border-red-500 bg-red-50 dark:bg-red-950/20',
        orange: 'border-orange-500 bg-orange-50 dark:bg-orange-950/20',
        blue: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
        green: 'border-green-500 bg-green-50 dark:bg-green-950/20',
    };
    return colors[color] || colors.blue;
};
export function IntakeStep5Timeline({ value, onChange, }) {
    const updateField = (field, val) => {
        onChange({ ...value, [field]: val });
    };
    const isComplete = value.urgency !== '';
    return (<div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Project Timeline</h1>
        <p className="text-muted-foreground">
          When do you need this completed?
        </p>
        {isComplete && (<Badge variant="default" className="mt-3 gap-1">
            <CheckCircle className="h-3 w-3"/>
            Timeline set
          </Badge>)}
      </div>

      {/* Urgency Level */}
      <Card className="p-6">
        <Label className="font-semibold mb-4 block">
          How urgent is this project? <span className="text-destructive">*</span>
        </Label>

        <div className="grid grid-cols-2 gap-3">
          {urgencyLevels.map((level) => (<button key={level.id} onClick={() => updateField('urgency', level.id)} className={`p-4 rounded-xl border-2 text-left transition-all ${getColorClass(level.color, value.urgency === level.id)}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{level.icon}</span>
                <div>
                  <p className="font-semibold">{level.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {level.description}
                  </p>
                </div>
              </div>
              {value.urgency === level.id && (<div className="mt-2 flex items-center gap-1 text-xs font-medium text-primary">
                  <CheckCircle className="h-3 w-3"/>
                  Selected
                </div>)}
            </button>))}
        </div>
      </Card>

      {/* Move-in Date */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-primary"/>
          </div>
          <div>
            <h3 className="font-semibold">Target Date (Optional)</h3>
            <p className="text-sm text-muted-foreground">
              When do you plan to move in or start?
            </p>
          </div>
        </div>

        <Input type="date" value={value.moveInDate} onChange={(e) => updateField('moveInDate', e.target.value)} min={new Date().toISOString().split('T')[0]} className="max-w-xs"/>

        {value.moveInDate && (<p className="mt-2 text-sm text-muted-foreground">
            Target date:{' '}
            {new Date(value.moveInDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })}
          </p>)}
      </Card>

      {/* Flexibility */}
      <Card className="p-6">
        <Label className="font-semibold mb-4 block">
          How flexible is your timeline?
        </Label>

        <div className="space-y-3">
          {flexibilityOptions.map((option) => (<button key={option.id} onClick={() => updateField('flexibility', option.id)} className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${value.flexibility === option.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{option.icon}</span>
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
                {value.flexibility === option.id && (<CheckCircle className="h-5 w-5 text-primary"/>)}
              </div>
            </button>))}
        </div>
      </Card>

      {/* Info Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* 72-hour Guarantee */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-primary"/>
            </div>
            <div>
              <p className="font-semibold text-primary">72-Hour Delivery</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your design package will be ready within 72 hours, regardless of your timeline
              </p>
            </div>
          </div>
        </Card>

        {/* Flexible Implementation */}
        <Card className="p-4 bg-muted/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-muted-foreground"/>
            </div>
            <div>
              <p className="font-semibold">Implement Anytime</p>
              <p className="text-sm text-muted-foreground mt-1">
                Once you receive the design, implement it whenever you're ready
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Warning for ASAP */}
      {value.urgency === 'asap' && (<Card className="p-4 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5"/>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200">
                Priority Support
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                We'll prioritize your project and ensure quick delivery. Our team will reach out
                within 24 hours to confirm details.
              </p>
            </div>
          </div>
        </Card>)}
    </div>);
}
