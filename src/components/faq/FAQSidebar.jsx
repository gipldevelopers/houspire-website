import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { FAQ_CATEGORIES } from '@/lib/faqData'
import { ChevronRight } from 'lucide-react'

export function FAQSidebar({
  activeCategory,
  onCategoryClick,
  className,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const checkWidth = () => {
      setIsCollapsed(window.innerWidth < 1024)
    }
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  return (
    <nav
      className={cn(
        'sticky top-24 space-y-1 transition-all duration-200',
        className
      )}
      aria-label="FAQ categories"
    >
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 px-3">
        Categories
      </h3>

      {FAQ_CATEGORIES.map((category) => {
        const Icon = category.icon
        const isActive = activeCategory === category.name

        return (
          <button
            key={category.name}
            onClick={() => onCategoryClick(category.name)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200',
              'hover:bg-accent/50 focus:outline-none focus:ring-2'
            )}
            style={isActive ? { 
              backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
              color: 'var(--color-primary)'
            } : {}}
            aria-current={isActive ? 'true' : undefined}
          >
            <Icon className={cn(
              'h-5 w-5 flex-shrink-0 transition-colors'
            )} style={isActive ? { color: 'var(--color-primary)' } : { color: 'hsl(var(--muted-foreground))' }} />

            <div className="flex-1 min-w-0">
              <span className="block truncate">{category.name}</span>
              {!isCollapsed && (
                <span className="block text-xs text-muted-foreground truncate mt-0.5">
                  {category.description}
                </span>
              )}
            </div>

            {isActive && (
              <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}

export function FAQCategoryPills({
  activeCategory,
  onCategoryClick,
  className,
}) {
  return (
    <div
      className={cn(
        'flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4',
        className
      )}
      role="tablist"
      aria-label="FAQ categories"
    >
      {FAQ_CATEGORIES.map((category) => {
        const Icon = category.icon
        const isActive = activeCategory === category.name

        return (
          <button
            key={category.name}
            onClick={() => onCategoryClick(category.name)}
            role="tab"
            aria-selected={isActive}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-200',
              'min-h-[44px] focus:outline-none focus:ring-2'
            )}
            style={isActive ? {
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff'
            } : {}}
          >
            <Icon className="h-4 w-4" />
            <span>{category.name}</span>
          </button>
        )
      })}
    </div>
  )
}
