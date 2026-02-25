import { useEffect, useState, useCallback } from 'react'

export function useExitIntent({
  enabled = true,
  threshold = 0,
  delay = 100
} = {}) {
  const [shouldShow, setShouldShow] = useState(false)

  const dismiss = useCallback(() => {
    setShouldShow(false)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const showCount = parseInt(sessionStorage.getItem('exit-intent-count') || '0', 10)
    if (showCount >= 2) return

    let timeoutId = null

    function handleMouseLeave(e) {
      if (e.clientY <= threshold) {
        timeoutId = setTimeout(() => {
          const currentCount = parseInt(sessionStorage.getItem('exit-intent-count') || '0', 10)
          if (currentCount < 2) {
            setShouldShow(true)
            sessionStorage.setItem('exit-intent-count', String(currentCount + 1))
          }
        }, delay)
      }
    }

    function handleMouseEnter() {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [enabled, threshold, delay])

  return { shouldShow, dismiss }
}
