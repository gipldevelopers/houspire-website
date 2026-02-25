import { useEffect, useCallback, useState } from 'react'

export function useGalleryKeyboard({
  designs,
  onDesignSelect,
  onSave,
  isModalOpen,
  onCloseModal,
}) {
  const [focusedIndex, setFocusedIndex] = useState(null)

  const handleKeyDown = useCallback((e) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return
    }

    if (isModalOpen) {
      if (e.key === 'Escape') {
        onCloseModal()
      }
      return
    }

    switch (e.key) {
      case 'j':
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex((prev) => {
          const next = prev === null ? 0 : Math.min(prev + 1, designs.length - 1)
          return next
        })
        break

      case 'k':
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((prev) => {
          const next = prev === null ? 0 : Math.max(prev - 1, 0)
          return next
        })
        break

      case 'Enter':
        e.preventDefault()
        if (focusedIndex !== null && focusedIndex < designs.length) {
          onDesignSelect(focusedIndex)
        }
        break

      case 's':
      case 'S':
        e.preventDefault()
        if (focusedIndex !== null && focusedIndex < designs.length) {
          onSave(designs[focusedIndex].id)
        }
        break

      case 'Escape':
        setFocusedIndex(null)
        break
    }
  }, [designs, focusedIndex, isModalOpen, onCloseModal, onDesignSelect, onSave])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    setFocusedIndex(null)
  }, [designs.length])

  return {
    focusedIndex,
    setFocusedIndex,
    clearFocus: () => setFocusedIndex(null),
  }
}
