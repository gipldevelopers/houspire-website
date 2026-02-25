import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Star, Play, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FAQVoting } from './FAQVoting'
import { highlightText } from './FAQSearch'
import { Button } from '@/components/ui/button'

export function FAQItem({
  item,
  isOpen,
  onToggle,
  searchQuery = '',
  relatedItems = [],
  onRelatedClick,
}) {
  const Icon = item.categoryIcon

  return (
    <div
      id={`faq-${item.id}`}
      className={cn(
        'rounded-xl border bg-card overflow-hidden transition-all duration-200',
        isOpen ? 'border-primary/30 shadow-sm' : 'border-border hover:border-primary/20'
      )}
    >
      {/* Question Header */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-start gap-4 p-5 text-left transition-colors',
          'hover:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/20',
          'min-h-[64px]'
        )}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
      >
        {/* Icon */}
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
          isOpen ? 'bg-primary/10' : 'bg-muted'
        )}>
          <Icon className={cn(
            'h-5 w-5 transition-colors',
            isOpen ? 'text-primary' : 'text-muted-foreground'
          )} />
        </div>

        {/* Question */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {item.isPopular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                <Star className="h-3 w-3 fill-amber-500" />
                Popular
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {item.category}
            </span>
          </div>
          <h3 className="text-base font-medium text-foreground pr-8">
            {searchQuery ? highlightText(item.question, searchQuery) : item.question}
          </h3>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Answer Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 pt-0">
              {/* Divider */}
              <div className="border-t border-border mb-4" />

              {/* Answer text */}
              <p className="text-muted-foreground leading-relaxed pl-14">
                {searchQuery ? highlightText(item.answer, searchQuery) : item.answer}
              </p>

              {/* Video link if available */}
              {item.videoUrl && (
                <div className="mt-4 pl-14">
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-accent transition-colors text-sm font-medium"
                  >
                    <Play className="h-4 w-4" />
                    Watch Video Explainer
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Related Questions */}
              {relatedItems.length > 0 && (
                <div className="mt-4 pl-14">
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Related Questions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {relatedItems.map((related) => (
                      <Button
                        key={related.id}
                        variant="outline"
                        size="sm"
                        onClick={() => onRelatedClick?.(related.id)}
                        className="text-xs"
                      >
                        {related.question.length > 40
                          ? related.question.slice(0, 40) + '...'
                          : related.question
                        }
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Voting */}
              <div className="mt-4 pl-14 pt-4 border-t border-border">
                <FAQVoting faqId={item.id} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
