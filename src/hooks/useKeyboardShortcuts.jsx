import { useEffect, useCallback } from 'react'

export const shortcuts = [
  {
    key: 'k',
    ctrlKey: true,
    metaKey: true,
    action: 'search',
    description: 'Open search',
  },
  {
    key: 'd',
    ctrlKey: true,
    metaKey: true,
    action: 'dashboard',
    description: 'Go to dashboard',
  },
  {
    key: 'n',
    ctrlKey: true,
    metaKey: true,
    action: 'notifications',
    description: 'Open notifications',
  },
  {
    key: 'p',
    ctrlKey: true,
    metaKey: true,
    action: 'profile',
    description: 'Go to profile',
  },
  {
    key: '?',
    shiftKey: true,
    action: 'help',
    description: 'Show keyboard shortcuts',
  },
  {
    key: 'Escape',
    action: 'escape',
    description: 'Close modals',
  },
]

export function useKeyboardShortcuts(onAction) {
  const handleKeyDown = useCallback(
    (event) => {
      const target = event.target
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        if (event.key !== 'Escape') return
      }

      for (const shortcut of shortcuts) {
        const metaOrCtrl = shortcut.metaKey || shortcut.ctrlKey
        const metaOrCtrlPressed = event.metaKey || event.ctrlKey

        const matches =
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (!metaOrCtrl || metaOrCtrlPressed) &&
          (!shortcut.shiftKey || event.shiftKey) &&
          (!shortcut.altKey || event.altKey)

        if (matches) {
          event.preventDefault()
          onAction(shortcut.action)
          break
        }
      }
    },
    [onAction]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return { shortcuts }
}

export function getShortcutString(shortcut) {
  const parts = []
  const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac')

  if (shortcut.ctrlKey || shortcut.metaKey) {
    parts.push(isMac ? '⌘' : 'Ctrl')
  }
  if (shortcut.shiftKey) parts.push('Shift')
  if (shortcut.altKey) parts.push('Alt')

  parts.push(shortcut.key.toUpperCase())

  return parts.join(' + ')
}
