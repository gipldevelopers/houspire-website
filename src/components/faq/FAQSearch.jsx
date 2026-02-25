import { useState, useEffect, useCallback, Fragment } from 'react'
import { Search, X, Command } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function FAQSearch({
  value,
  onChange,
  className,
  onOpenChat,
  resultsCount,
}) {
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const input = document.getElementById('faq-search-input')
        input?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleClear = useCallback(() => {
    onChange('')
  }, [onChange])

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'relative flex items-center rounded-xl border bg-card transition-all duration-200',
          isFocused
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-border hover:border-primary/50'
        )}
      >
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />

        <Input
          id="faq-search-input"
          type="text"
          placeholder="Search FAQs..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-12 pr-24 h-14 border-0 focus-visible:ring-0 text-base bg-transparent"
          aria-label="Search frequently asked questions"
        />

        <div className="absolute right-3 flex items-center gap-2">
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 text-xs text-muted-foreground">
            <Command className="h-3 w-3" />
            <span>K</span>
          </kbd>
        </div>
      </div>

      {value && (
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {resultsCount === 0 ? (
              <span>No results found for "{value}"</span>
            ) : (
              <span>
                Found <strong className="text-foreground">{resultsCount}</strong> result{resultsCount !== 1 ? 's' : ''}
              </span>
            )}
          </p>

          {resultsCount === 0 && onOpenChat && (
            <Button
              variant="link"
              size="sm"
              onClick={onOpenChat}
              className="text-primary"
            >
              Ask our AI assistant instead →
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export function highlightText(text, query) {
  if (!query.trim()) return text

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-primary/20 text-primary-foreground rounded px-0.5"
      >
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}
