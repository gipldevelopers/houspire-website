import { format, differenceInDays, isToday, isTomorrow, parseISO } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
export function DesignerAvailability({ nextAvailableDate, isAvailable, responseTime, compact = false }) {
    const getAvailabilityInfo = () => {
        if (!nextAvailableDate) {
            if (isAvailable) {
                return {
                    label: 'Available Now',
                    sublabel: 'Ready to start your project',
                    color: 'text-green-600',
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/20',
                    icon: CheckCircle
                };
            }
            return {
                label: 'Contact for availability',
                sublabel: 'Schedule may vary',
                color: 'text-muted-foreground',
                bgColor: 'bg-muted',
                borderColor: 'border-muted',
                icon: Calendar
            };
        }
        const date = parseISO(nextAvailableDate);
        const daysUntil = differenceInDays(date, new Date());
        if (isToday(date)) {
            return {
                label: 'Available Today',
                sublabel: 'Ready to start immediately',
                color: 'text-green-600',
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/20',
                icon: CheckCircle
            };
        }
        if (isTomorrow(date)) {
            return {
                label: 'Available Tomorrow',
                sublabel: format(date, 'EEEE, MMMM d'),
                color: 'text-green-600',
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/20',
                icon: CheckCircle
            };
        }
        if (daysUntil <= 7) {
            return {
                label: `Available in ${daysUntil} days`,
                sublabel: format(date, 'EEEE, MMMM d'),
                color: 'text-amber-600',
                bgColor: 'bg-amber-500/10',
                borderColor: 'border-amber-500/20',
                icon: Calendar
            };
        }
        if (daysUntil <= 14) {
            return {
                label: `Available ${format(date, 'MMM d')}`,
                sublabel: `In ${daysUntil} days`,
                color: 'text-amber-600',
                bgColor: 'bg-amber-500/10',
                borderColor: 'border-amber-500/20',
                icon: Calendar
            };
        }
        return {
            label: `Next slot: ${format(date, 'MMM d')}`,
            sublabel: `${daysUntil} days wait`,
            color: 'text-orange-600',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/20',
            icon: AlertCircle
        };
    };
    const info = getAvailabilityInfo();
    const Icon = info.icon;
    if (compact) {
        return (<Badge variant="outline" className={`${info.bgColor} ${info.color} ${info.borderColor}`}>
        <Icon className="h-3 w-3 mr-1"/>
        {info.label}
      </Badge>);
    }
    return (<Card className={`p-4 ${info.bgColor} ${info.borderColor} border`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${info.bgColor}`}>
          <Icon className={`h-5 w-5 ${info.color}`}/>
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${info.color}`}>
            {info.label}
          </h4>
          <p className="text-sm text-muted-foreground">
            {info.sublabel}
          </p>
        </div>
      </div>
      
      {/* Response Time */}
      <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4"/>
        <span>Typically responds {responseTime}</span>
      </div>
    </Card>);
}
// Simplified availability badge for cards
export function AvailabilityBadge({ nextAvailableDate, isAvailable }) {
    if (!nextAvailableDate && isAvailable) {
        return (<Badge className="bg-green-500/10 text-green-600 border-green-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"/>
        Available
      </Badge>);
    }
    if (!nextAvailableDate) {
        return (<Badge variant="secondary">
        Contact for availability
      </Badge>);
    }
    const date = parseISO(nextAvailableDate);
    const daysUntil = differenceInDays(date, new Date());
    if (daysUntil <= 0) {
        return (<Badge className="bg-green-500/10 text-green-600 border-green-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"/>
        Available Now
      </Badge>);
    }
    if (daysUntil === 1) {
        return (<Badge className="bg-green-500/10 text-green-600 border-green-500/20">
        Tomorrow
      </Badge>);
    }
    if (daysUntil <= 7) {
        return (<Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
        In {daysUntil} days
      </Badge>);
    }
    return (<Badge variant="outline" className="bg-muted/50">
      {format(date, 'MMM d')}
    </Badge>);
}
