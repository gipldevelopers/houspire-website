import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
export function StarRating({ rating, maxRating = 5, size = 'md', interactive = false, onChange, className, }) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };
    const handleClick = (value) => {
        if (interactive && onChange) {
            onChange(value);
        }
    };
    return (<div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, i) => {
            const starValue = i + 1;
            const isFilled = starValue <= rating;
            return (<button key={i} type="button" onClick={() => handleClick(starValue)} disabled={!interactive} className={cn('transition-transform focus:outline-none', interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default')}>
            <Star className={cn(sizeClasses[size], isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-transparent text-muted-foreground/30')}/>
          </button>);
        })}
    </div>);
}
