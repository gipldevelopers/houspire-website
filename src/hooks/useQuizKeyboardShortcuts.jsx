import { useEffect, useCallback } from 'react'

export function useQuizKeyboardShortcuts({
  onNext,
  onBack,
  onSelectOption,
  canContinue,
  isEnabled = true,
}) {
  const handleKeyDown = useCallback((event) => {
    if (!isEnabled) return

    const target = event.target
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

    switch (event.key) {
      case 'Enter':
        if (canContinue) {
          event.preventDefault()
          onNext()
        }
        break

      case 'Escape':
        event.preventDefault()
        onBack()
        break

      case 'ArrowRight':
        if (canContinue) {
          event.preventDefault()
          onNext()
        }
        break

      case 'ArrowLeft':
        event.preventDefault()
        onBack()
        break

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if (onSelectOption) {
          event.preventDefault()
          const index = parseInt(event.key) - 1
          onSelectOption(index)
        }
        break
    }
  }, [onNext, onBack, onSelectOption, canContinue, isEnabled])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// Visual keyboard shortcut hints
export function KeyboardShortcutHint({ 
  shortcut, 
  label,
  className = ''
}) {
  return (
    <div className={`hidden md:flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}>
      <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono border border-border">
        {shortcut}
      </kbd>
      <span>{label}</span>
    </div>
  )
}
