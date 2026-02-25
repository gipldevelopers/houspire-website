import { useState, useCallback } from 'react'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState({
    title: '',
    description: '',
  })
  const [resolver, setResolver] = useState(null)

  const confirm = useCallback((opts) => {
    setOptions(opts)
    setIsOpen(true)

    return new Promise((resolve) => {
      setResolver({ resolve })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    setLoading(true)
    resolver?.resolve(true)
    setIsOpen(false)
    setLoading(false)
  }, [resolver])

  const handleCancel = useCallback(() => {
    resolver?.resolve(false)
    setIsOpen(false)
  }, [resolver])

  const ConfirmDialogComponent = useCallback(() => (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      loading={loading}
      {...options}
    />
  ), [isOpen, handleCancel, handleConfirm, loading, options])

  return { confirm, ConfirmDialog: ConfirmDialogComponent }
}
