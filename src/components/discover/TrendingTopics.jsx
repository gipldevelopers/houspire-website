import { motion } from 'framer-motion'
import { Sparkles, Sofa, Bed, Zap, Crown, Shrink } from 'lucide-react'
import { cn } from '@/lib/utils'

const TRENDING_TOPICS = [
  { 
    label: 'Trending Now', 
    icon: Sparkles, 
    filter: { sort: 'popular' },
    activeClass: 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105'
  },
  { label: 'Living Room', icon: Sofa, filter: { room: 'living_room' } },
  { label: 'Bedroom', icon: Bed, filter: { room: 'bedroom' } },
  { label: 'Modern Style', icon: Zap, filter: { style: 'modern' } },
  { label: 'Luxury Designs', icon: Crown, filter: { style: 'luxury' } },
  { label: 'Small Spaces', icon: Shrink, filter: { style: 'small_space' } },
]

export function TrendingTopics({ onTopicClick, activeFilters }) {
  const isTopicActive = (topic) => {
    return Object.entries(topic.filter).every(([key, value]) => {
      if (key === 'sort') return activeFilters.sort === value
      if (key === 'room') return activeFilters.room === value
      if (key === 'style') return activeFilters.style === value
      if (key === 'budget') return activeFilters.budget === value
      if (key === 'search') return activeFilters.search === value
      return false
    })
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-4 px-1 -mx-1 justify-center">
        {TRENDING_TOPICS.map((topic, index) => {
          const isActive = isTopicActive(topic);
          const Icon = topic.icon;

          return (
            <motion.button
              key={topic.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onTopicClick(topic.filter)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300',
                'border-2',
                isActive
                  ? (topic.activeClass || 'bg-foreground text-background border-foreground shadow-md')
                  : 'bg-white hover:bg-secondary border-border text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", isActive ? "animate-pulse" : "")} />
              {topic.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  )
}

