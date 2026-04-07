'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { appDataClient } from '@/lib/static-client'
import { useToast } from '@/hooks/use-toast'

export function useProjectArchive() {
  const router = useRouter()
  const { toast } = useToast()
  const [archiving, setArchiving] = useState(false)

  const archiveProject = async (projectId, redirectToDashboard = true) => {
    if (!confirm('Archive this project? You can restore it later.')) return false

    setArchiving(true)

    try {
      const { data, error } = await appDataClient.rpc('archive_project', {
        p_project_id: projectId,
      })

      if (error) throw error

      toast({
        title: 'Project archived',
        description: 'You can find it in your archived projects.',
      })

      if (redirectToDashboard) {
        router.push('/dashboard')
      }

      return true
    } catch (error) {
      toast({
        title: 'Failed to archive',
        description: error.message,
        variant: 'destructive',
      })
      return false
    } finally {
      setArchiving(false)
    }
  }

  const unarchiveProject = async (projectId) => {
    setArchiving(true)

    try {
      const { data, error } = await appDataClient.rpc('unarchive_project', {
        p_project_id: projectId,
      })

      if (error) throw error

      toast({
        title: 'Project restored',
        description: 'The project has been moved back to active projects.',
      })

      return true
    } catch (error) {
      toast({
        title: 'Failed to restore',
        description: error.message,
        variant: 'destructive',
      })
      return false
    } finally {
      setArchiving(false)
    }
  }

  return {
    archiveProject,
    unarchiveProject,
    archiving,
  }
}

