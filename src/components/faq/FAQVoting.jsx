import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function FAQVoting({ faqId, className }) {
  const [vote, setVote] = useState(null)
  const [showThanks, setShowThanks] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`faq-vote-${faqId}`)
    if (stored) {
      setVote(stored)
    }
  }, [faqId])

  const handleVote = (newVote) => {
    if (vote === newVote) {
      setVote(null)
      localStorage.removeItem(`faq-vote-${faqId}`)
      setShowThanks(false)
    } else {
      setVote(newVote)
      localStorage.setItem(`faq-vote-${faqId}`, newVote)
      setShowThanks(true)
      setTimeout(() => setShowThanks(false), 2000)
    }
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="text-sm text-muted-foreground">Was this helpful?</span>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote('helpful')}
          className={cn(
            'h-8 w-8 p-0 transition-colors',
            vote === 'helpful' && 'text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700'
          )}
          aria-label="Mark as helpful"
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote('not-helpful')}
          className={cn(
            'h-8 w-8 p-0 transition-colors',
            vote === 'not-helpful' && 'text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600'
          )}
          aria-label="Mark as not helpful"
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
      </div>

      {showThanks && (
        <span className="text-sm text-green-600 animate-in fade-in slide-in-from-left-2">
          Thanks for your feedback!
        </span>
      )}
    </div>
  )
}
