import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { StarRating } from '@/components/StarRating';
import { Star, TrendingUp } from 'lucide-react';
export function ReviewStatsCard({ stats, onFilterChange, activeFilter }) {
    const starCounts = [
        { rating: 5, count: stats.five_star },
        { rating: 4, count: stats.four_star },
        { rating: 3, count: stats.three_star },
        { rating: 2, count: stats.two_star },
        { rating: 1, count: stats.one_star },
    ];
    const positivePercentage = stats.total_published > 0
        ? Math.round(((stats.five_star + stats.four_star) / stats.total_published) * 100)
        : 0;
    return (<Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Overall Rating */}
        <div className="text-center lg:text-left lg:border-r border-border/50 lg:pr-8">
          <div className="inline-flex items-baseline gap-2 mb-3">
            <span className="text-6xl font-bold tracking-tight text-foreground">
              {stats.avg_rating.toFixed(1)}
            </span>
            <span className="text-2xl text-muted-foreground">/5</span>
          </div>
          
          <StarRating rating={stats.avg_rating} size="lg" className="justify-center lg:justify-start mb-4"/>
          
          <p className="text-muted-foreground">
            Based on <span className="font-semibold text-foreground">{stats.total_published}</span> reviews
          </p>
          
          <div className="flex items-center gap-2 mt-4 justify-center lg:justify-start">
            <TrendingUp className="h-4 w-4 text-green-500"/>
            <span className="text-sm">
              <span className="font-semibold text-green-600">{positivePercentage}%</span>
              <span className="text-muted-foreground"> positive reviews</span>
            </span>
          </div>
        </div>

        {/* Right: Rating Breakdown */}
        <div className="space-y-3">
          {starCounts.map(({ rating, count }) => {
            const percentage = stats.total_published > 0
                ? Math.round((count / stats.total_published) * 100)
                : 0;
            return (<button key={rating} onClick={() => onFilterChange(activeFilter === rating ? null : rating)} className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${activeFilter === rating
                    ? 'bg-primary/10 ring-1 ring-primary/30'
                    : 'hover:bg-accent/50'}`}>
                <span className="flex items-center gap-1 w-12 text-sm font-medium text-foreground">
                  {rating}
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500"/>
                </span>

                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.5, delay: (5 - rating) * 0.1 }} className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"/>
                </div>

                <span className="text-sm text-muted-foreground w-16 text-right">
                  {count} <span className="text-xs">({percentage}%)</span>
                </span>
              </button>);
        })}
        </div>
      </div>
    </Card>);
}
