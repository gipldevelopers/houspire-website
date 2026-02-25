import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { logAdminAction } from '@/lib/activity-logger'

export function useDuplicateAnalysis() {
  const { toast } = useToast()
  const [groups, setGroups] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [stats, setStats] = useState({
    totalImages: 0,
    groupCount: 0,
    extraCopies: 0,
    potentialReduction: 0
  })

  const scan = useCallback(async () => {
    setIsScanning(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase.functions.invoke('analyze-duplicates', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze duplicates')
      }

      const transformedGroups = data.groups.map((g) => ({
        originalFilename: g.original_filename,
        duplicateCount: g.duplicate_count,
        images: g.ids.map((id, idx) => ({
          id,
          url: g.image_urls[idx],
          title: g.titles[idx] || 'Untitled',
          isPublished: g.published_statuses[idx],
          createdAt: g.created_dates[idx],
          keepAction: 'undecided'
        }))
      }))

      setGroups(transformedGroups)
      setStats(data.stats)

      toast({
        title: 'Scan Complete',
        description: `Found ${data.stats.groupCount} duplicate groups with ${data.stats.extraCopies} extra copies`
      })

    } catch (err) {
      console.error('Duplicate scan error:', err)
      toast({
        title: 'Scan Failed',
        description: err instanceof Error ? err.message : 'Failed to analyze duplicates',
        variant: 'destructive'
      })
    } finally {
      setIsScanning(false)
    }
  }, [toast])

  const applyBulkAction = useCallback((action) => {
    setGroups(prevGroups => 
      prevGroups.map(group => {
        const newImages = group.images.map((img, idx) => {
          let shouldKeep = false
          
          if (action === 'oldest') {
            shouldKeep = idx === 0
          } else if (action === 'newest') {
            shouldKeep = idx === group.images.length - 1
          } else if (action === 'published') {
            const firstPublishedIdx = group.images.findIndex(i => i.isPublished)
            shouldKeep = firstPublishedIdx >= 0 ? idx === firstPublishedIdx : idx === 0
          }
          
          return {
            ...img,
            keepAction: shouldKeep ? 'keep' : 'delete'
          }
        })
        
        return { ...group, images: newImages }
      })
    )

    toast({
      title: 'Bulk Action Applied',
      description: `Marked images to ${action === 'oldest' ? 'keep oldest' : action === 'newest' ? 'keep newest' : 'keep published'}`
    })
  }, [toast])

  const toggleKeep = useCallback((groupIndex, imageIndex) => {
    setGroups(prevGroups => {
      const newGroups = [...prevGroups]
      const group = { ...newGroups[groupIndex] }
      const images = [...group.images]
      
      const currentAction = images[imageIndex].keepAction
      const newAction = currentAction === 'keep' ? 'undecided' : 'keep'
      
      if (newAction === 'keep') {
        images.forEach((img, idx) => {
          images[idx] = { ...img, keepAction: idx === imageIndex ? 'keep' : 'delete' }
        })
      } else {
        images[imageIndex] = { ...images[imageIndex], keepAction: newAction }
      }
      
      group.images = images
      newGroups[groupIndex] = group
      return newGroups
    })
  }, [])

  const previewDeletions = useCallback(() => {
    const idsToDelete = []
    
    for (const group of groups) {
      for (const img of group.images) {
        if (img.keepAction === 'delete') {
          idsToDelete.push(img.id)
        }
      }
    }
    
    return { count: idsToDelete.length, ids: idsToDelete }
  }, [groups])

  const executeDeletions = useCallback(async () => {
    const { count, ids } = previewDeletions()
    
    if (count === 0) {
      toast({
        title: 'Nothing to Delete',
        description: 'No images marked for deletion',
        variant: 'destructive'
      })
      return { success: false, deletedCount: 0 }
    }

    setIsDeleting(true)
    let deletedCount = 0

    try {
      const batchSize = 50
      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize)
        
        const { error } = await supabase
          .from('gallery_designs')
          .delete()
          .in('id', batch)

        if (error) {
          console.error('Batch delete error:', error)
          throw error
        }

        deletedCount += batch.length
      }

      await logAdminAction({
        action: 'bulk_delete_duplicates',
        details: {
          deletedCount,
          groupsAffected: groups.filter(g => 
            g.images.some(img => ids.includes(img.id))
          ).length
        }
      })

      setGroups(prevGroups => 
        prevGroups
          .map(group => ({
            ...group,
            images: group.images.filter(img => !ids.includes(img.id)),
            duplicateCount: group.images.filter(img => !ids.includes(img.id)).length
          }))
          .filter(group => group.images.length > 1)
      )

      setStats(prev => ({
        ...prev,
        totalImages: prev.totalImages - deletedCount,
        extraCopies: Math.max(0, prev.extraCopies - deletedCount),
        groupCount: groups.filter(g => 
          g.images.filter(img => !ids.includes(img.id)).length > 1
        ).length
      }))

      toast({
        title: 'Duplicates Removed',
        description: `Successfully deleted ${deletedCount} duplicate images`
      })

      return { success: true, deletedCount }

    } catch (err) {
      console.error('Delete error:', err)
      toast({
        title: 'Delete Failed',
        description: err instanceof Error ? err.message : 'Failed to delete duplicates',
        variant: 'destructive'
      })
      return { success: false, deletedCount }
    } finally {
      setIsDeleting(false)
    }
  }, [groups, previewDeletions, toast])

  const reset = useCallback(() => {
    setGroups([])
    setStats({
      totalImages: 0,
      groupCount: 0,
      extraCopies: 0,
      potentialReduction: 0
    })
  }, [])

  return {
    groups,
    isScanning,
    isDeleting,
    stats,
    scan,
    applyBulkAction,
    toggleKeep,
    previewDeletions,
    executeDeletions,
    reset
  }
}
